var width = 800,
  height = 450,
  statefeat = null,
  newfeatures = null,
  ci = {},
  chart,
  colorsbrw = colorbrewer.RdYlGn[3].reverse(),
  statebubblestip = CustomTooltip("statebubbles_tooltip", 240);

var fields = [
    {name: "(no scale)", id: "none"},
    {name: "All Emissions", id: "emissions", key: "Em%d"},
    {name: "All Per Person Emissions", id: "perpersonem", key: "PopEm%d"},
    {name: "Power Emissions", id: "pemissions", key: "PowEm%d"},
    {name: "Per Person Power Emissions", id: "pperpersonem", key: "PopPowEm%d"}
  ], 
  years = [2013, 2012, 2011, 2010],
  fieldsById = d3.nest().key(function(d) { return d.id; })
    .rollup(function(d) { return d[0]; })
    .map(fields), 
  field = fields[0], 
  year = years[0];

var fieldSelect = d3.select("#field")
  .on("change", function(e) {
     field = fields[this.selectedIndex];
     location.hash = "#" + [field.id, year].join("/");
  });

var yearSelect = d3.select("#year")
  .on("change", function(e) {
     year = years[this.selectedIndex];
     location.hash = "#" + [field.id, year].join("/");
  });

var projection = d3.geo.albersUsa().scale(width).translate([width / 2.2, height / 2.2]),
  topology,
  geometries,
  dataById = {},
  centroidById = {},
  areaById = {},
  statenameByPC = {},
  carto = d3.cartogram().projection(projection)
    .properties(function(d) {
      return dataById[d.id];
    })
    .value(function(d) {
      return +d.properties[field];
    });

var ghgmap = d3.select("#ghgmap"),
  layer = ghgmap.append("g")
    .attr("id", "layer"),
  states = layer.append("g")
    .attr("id", "states")
    .selectAll("path"),
  statebubbles = layer.append("g")
    .attr("id", "statebubbles")
    .on("click", click);

d3.json('/geo/us-states.topojson', function(error, topo) {
  topology = topo;
  geometries = topology.objects.states.geometries;
  d3.csv('/emissions/emissions.csv', function(error, data) {
    dataById = d3.nest()
      .key(function(d) { return d.NAME; })
      .rollup(function(d) { return d[0]; })
      .map(data);
    init();
  });
});

d3.csv('/geo/us-states-centroid.csv', function(error, data) {
  centroidById = d3.nest()
    .key(function(d) { return d.NAME; })
    .rollup(function(d) { return d[0]; })
    .map(data);
});
d3.csv('/geo/statearea.csv', function(error, data) {
  areaById = d3.nest()
    .key(function(d) { return d.NAME; })
    .rollup(function(d) { return d[0]; })
    .map(data);
});
d3.csv('/geo/us-states.csv', function(error, data) {
  statenameByPC = d3.nest()
    .key(function(d) { return d.PC; })
    .rollup(function(d) { return d[0]; })
    .map(data);
});

ci.k = 1;

fieldSelect.selectAll("option").data(fields).enter().append("option")
  .attr("value", function(d) { return d.id; })
  .html(function(d) { return d.name; });

yearSelect.selectAll("option").data(years).enter().append("option")
  .attr("value", function(y) { return y; })
  .text(function(y) { return y; });

window.onhashchange = function() {
  parseHash();
};

function init() {
  features = carto.features(topology, geometries),
  path = d3.geo.path().projection(projection);

  states = states.data(features)
    .enter()
    .append("path")
      .attr("class", "stateborders")
      .attr("fill", "#fafafa")
    .on("mouseover", show_details)
    .on("mouseout", hide_details)
    .on("click", click);
  parseHash();
};

function reset() {
  features = carto.features(topology, geometries),
    path = d3.geo.path().projection(projection);
  states.data(features)
    .transition()
      .duration(750)
      .ease("linear")
      .attr("fill", "#fafafa")
      .attr("stroke-width", 0.5)
      .attr("d", path);
};

function update() {
  var key = field.key.replace("%d", year),
      fmt = (typeof field.format === "function")
        ? field.format
        : d3.format(field.format || ","),
      value = function(d) {
        return +d.properties[key];
      },
  values = states.data().map(value)
    .filter(function(n) {
      return !isNaN(n);
    })
    .sort(d3.ascending),
      lo = values[0], 
      hi = values[values.length - 1];

  colorbrw = d3.scale.linear().range(colorsbrw)
    .domain(lo < 0
      ? [lo, 0, hi]
      : [lo, d3.median(values), hi]);

  // normalize the scale to positive numbers
  var scalecart = d3.scale.linear().domain([lo, hi]).range([1, 1000]);

  // tell the cartogram to use the scaled values
  carto.value(function(d) {
    return scalecart(value(d));
  });

  // generate the new features, pre-projected
  newfeatures = carto(topology, geometries).features;

  if (ci.k == 1) {
    states.data(newfeatures).transition().duration(750).ease("linear")
       .attr("fill", function(d) {
         return colorbrw(value(d));
       })
       .attr("d", carto.path);
  } else {
    try {
      chart.circles.remove();
      getChartData(ci.statepost, year, ci.x, ci.y, ci.centroid, ci.range, ci.stroke);
    } catch (err) {
      getChartData(ci.statepost, year, ci.x, ci.y, ci.centroid, ci.range, ci.stroke);
    }

    var hashes = location.hash.substr(1).split("/"),
        currentField = hashes[0],
        currentYear = +hashes[1],
        sthash = "#" + [currentField, currentYear].join("/")  + "/" + ci.statepost;
    history.pushState(null, null, sthash);
    if(history.pushState) {
       history.pushState(null, null, sthash);
    } else {
       location.hash = sthash;
    }
  } 
};

function show_details(d) {
  var content;
  try {
    var variable = field.key.replace("%d","")
    if (variable == "Em" || variable == "PopEm") {
       var NumSites = d.properties["NumEm"+year]
    } else if (variable == "PowEm" || variable == "PopPowEm") {
       var NumSites = d.properties["NumPowEm"+year]
    }

    if (variable == "Em" || variable == "PowEm") {
      var Units = " &#40;MtCO<span class=\"sub\">2</span>eq&#41;"
    } else if (variable == "PopEm" || variable == "PopPowEm") {
      var Units = " &#40;MtCO<span class=\"sub\">2</span>eq&#47;Pop&#41;"
    } 

    content = "<span class=\"name\">State: </span><span class=\"value\"> " + d.properties.NAME + "</span><br/>";
    content += "<span class=\"name\">Amount: </span><span class=\"value\"> " + 
                addCommas(d.properties[field.key.replace("%d", year)]) + "</span>" + Units + "<br/>";
    content += "<span class=\"name\">Number of Sites: </span><span class=\"value\"> " + NumSites + "</span><br/>";
    content += "<span class=\"name\">Year: </span><span class=\"value\"> " + year + "</span><br/>"; 
  } catch (err) {
    content = "<span class=\"name\">State: </span><span class=\"value\"> " + d.properties.NAME + "</span><br/>";
    content += "<span class=\"name\">Year: </span><span class=\"value\"> " + year + "</span><br/>";
  }
  return statebubblestip.showTooltip(content, d3.event);
};

function hide_details(d) {
  return statebubblestip.hideTooltip();
};

function click(d) {
  ci = getChartInfo(d, statefeat);
  statefeat = ci.statefeat;
 
  if (ci.k == ci.kv) {
    var hashes = location.hash.substr(1).split("/");

    if (hashes.length == 1) {
      var sthash = "#" + ci.statepost;
    } else {
      var currentField = hashes[0],
          currentYear = +hashes[1];
          sthash = "#" + [currentField, currentYear].join("/")  + "/" + ci.statepost;
    }

    //history.pushState(null, null, sthash);

    //if (history.pushState) {
    //  history.pushState(null, null, sthash);
    //} else {
    location.hash = sthash;
    //}

    states.data(features).transition().duration(800).ease("linear")
      .attr("transform","translate("+width/2+","+height/2+")scale("+ci.k+")translate("+-ci.x+","+-ci.y+")")
      .attr("fill", "#fafafa").attr("d", path).style("stroke-width", 0.5 / ci.k + "px");
 
    if (field.name == "(no scale)") {
      yearSelect
        .property("selectedIndex", years.indexOf(year))
        .attr("disabled", "disabled");
    } else {
      yearSelect
        .property("selectedIndex", years.indexOf(year))
        .attr("disabled", null);
    }

    fieldSelect
      .property("selectedIndex", fields.indexOf(field))
      .attr("disabled", "disabled");

    getChartData(ci.statepost, year, ci.x, ci.y, ci.centroid, ci.range, ci.stroke);

    if (typeof chart == 'object') {
      try {
        chart.circles.remove();
        chart.hide_details(d);
      } catch (err) {
        alert(err);
      }
    }

    statebubbles.transition().duration(800)
      .attr("transform","translate("+width/2+","+height/2+")scale("+ci.k+")translate("+-ci.x+","+-ci.y+")")
      .style("stroke-width", 0.5 / ci.k + "px")

  } else if (ci.k == 1) {
    fieldSelect
      .property("selectedIndex", fields.indexOf(field))
      .attr("disabled", null);

    var hashes = location.hash.substr(1).split("/");

    if (hashes.length == 1 ) {
      nosthash = "#";
    } else {
      var currentField = hashes[0],
          currentYear = +hashes[1];
          nosthash = "#" + [currentField, currentYear].join("/");
    }

    history.pushState(null, null, nosthash);

    if(history.pushState) {
       history.pushState(null, null, nosthash);
    } else {
       location.hash = nosthash;
    }

    if (field.name == "(no scale)") {
      yearSelect
        .property("selectedIndex", years.indexOf(year))
        .attr("disabled", "disabled");
      states.data(features).transition().duration(800).ease("linear")
        .attr("transform","translate("+width/2+","+height/2+")scale("+ci.k+")translate("+-ci.x+","+-ci.y+")")
        .attr("fill", "#fafafa").attr("d", path).style("stroke-width", 0.5 / ci.k + "px");
      try {
        chart.circles.remove();
        chart.hide_details(d);
      } catch (err) {
        alert(err);
      }

    } else {
      yearSelect
        .property("selectedIndex", years.indexOf(year))
        .attr("disabled", null);

      var value = function(d) {
         return +d.properties[field.key.replace("%d", year)];
      }
      states.data(newfeatures).transition().duration(800).ease("linear") 
        .attr("d", carto.path)
        .attr("transform","translate("+width/2+","+height/2+")scale("+ci.k+")translate("+-ci.x+","+-ci.y+")")
        .attr("fill", function(d) {return colorbrw(value(d));})
        .style("stroke-width", 0.5 / ci.k + "px")
      try {
        chart.circles.remove();
        chart.hide_details(d);
      } catch (err) {
        alert(err);
      }
    }
  }
};

var deferredUpdate = (function() {
  var timeout;
  return function() {
    clearTimeout(timeout);
    return timeout = setTimeout(function() {
      update.apply(null, arguments);
    }, 10);
  };
})();

function parseHash() {
  var parts = location.hash.substr(1).split("/");
  if (parts.length == 2) {
      var currentFieldId = parts[0],
          currentYear = +parts[1];
      field = fieldsById[currentFieldId] || fields[0],
      year = (years.indexOf(currentYear) > -1) ? currentYear : years[0];
  } else if (parts.length == 3) {
      var currentFieldId = parts[0],
          currentYear = +parts[1],
          statepost = parts[2];
      field = fieldsById[currentFieldId] || fields[0],
      year = (years.indexOf(currentYear) > -1) ? currentYear : years[0];
  } 
 
  fieldSelect.property("selectedIndex", fields.indexOf(field));

  if (field.id === "none") {
    yearSelect.attr("disabled", "disabled");
    reset();
  } else {
    if (field.years) {
      if (field.years.indexOf(year) === -1) {
        year = field.years[0];
      }
      yearSelect.selectAll("option")
        .attr("disabled", function(y) {
          return (field.years.indexOf(y) === -1) ? "disabled" : null;
         });
    } else {
      yearSelect.selectAll("option")
        .attr("disabled", null);
    }
    yearSelect
      .property("selectedIndex", years.indexOf(year))
      .attr("disabled", null);

    if (parts.length == 3) {
      try {
        deferredUpdate();
        statename = statenameByPC[statepost].NAME;
        centroid = projection([centroidById[statename].Lon,centroidById[statename].Lat]);
        statearea = parseInt(areaById[statename].AREA); 
        ci = zoomStateBubble(statepost, statearea, centroid, currentYear);
      } catch (err) {
        alert(err);
      }
    } else {
      deferredUpdate();
    }
  }
};

function zoomStateBubble (statepost, statearea, centroid, year) {
  var x, y, k, kv, range, stroke;
  try {
    if (statearea <= 2000.0 && statearea >= 10.0) {
      range = [0.2, 2];
      stroke = 0.1;
      kv = 20;
    } else if (statearea <= 12500.0 && statearea >= 2000.0) {
      range = [0.5, 4];
      stroke = 0.2;
      kv = 15;
    } else if (statearea <= 50000.0 && statearea >= 12501.0) {
      range = [0.8, 8];
      stroke = 0.3;
      kv = 10;
    } else if (statearea <= 100000.0 && statearea >= 50001.0) {
      range = [1, 12];
      stroke = 0.4;
      kv = 6;
    } else {
      range = [2, 18];
      stroke = 0.5;
      kv = 3;
    }
  } catch (err) {
    alert(err);
  }

  x = centroid[0];
  y = centroid[1];
  k = kv;

  states.data(features).transition().duration(800).ease("linear")
        .attr("transform","translate("+width/2+","+height/2+")scale("+k+")translate("+-x+","+-y+")")
        .attr("fill", "#fafafa").attr("d", path).style("stroke-width", 0.5 / k + "px");

  fieldSelect
        .property("selectedIndex", fields.indexOf(field))
        .attr("disabled", "disabled");

  getChartData(statepost, year, x, y, centroid, range, stroke);
                           
  statebubbles.transition().duration(800)
        .attr("transform","translate("+width/2+","+height/2+")scale("+k+")translate("+-x+","+-y+")")
        .style("stroke-width", 0.5 / k + "px")

  return {x: x,
          y: y,
          k: k,
          kv: kv,
          centroid: centroid,
          statepost: statepost,
          range: range,
          stroke: stroke
  };
}

function getChartInfo(d, statefeat) {
  var x, y, k, kv, centroid, statepost, statearea, range, stroke;
  if (d && statefeat !== d) {
    if (statefeat && d.id == statefeat.id) {
      x = width / 2;
      y = height / 2;
      k = 1;
      statefeat = null;
    } else {
      statepost = centroidById[d.id].PC;
      statearea = parseInt(areaById[d.id].AREA);
      if (statearea <= 2000.0 && statearea >= 10.0) {
         range = [0.2, 2];
         stroke = 0.1;
         kv = 20;
      } else if (statearea <= 12500.0 && statearea >= 2000.0) {
         range = [0.5, 4];
         stroke = 0.2;
         kv = 15;
      } else if (statearea <= 50000.0 && statearea >= 12501.0) {
         range = [0.8, 8];
         stroke = 0.3;
         kv = 10;
      } else if (statearea <= 100000.0 && statearea >= 50001.0) {
         range = [1, 12];
         stroke = 0.4;
         kv = 6;
      } else {
         range = [2, 18];
         stroke = 0.5;
         kv = 3;
      }
      try {
         centroid = projection([centroidById[d.id].Lon,centroidById[d.id].Lat]);
      } catch (err) {
         centroid = [0,0];
      }
      x = centroid[0];
      y = centroid[1];
      k = kv;
      statefeat = d;
    }
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    statefeat = null;
  }
  return {x: x, 
          y: y, 
          k: k,
          kv: kv,
          centroid: centroid, 
          statepost: statepost,
          range: range,
          stroke: stroke,
          statefeat: statefeat
  };
};

function getChartData(statepost, year, x, y, centroid, range, stroke) {
  if (year == '2013') {
    yindex = 3;
  } else if (year == '2012') {
    yindex = 2;
  } else if (year == '2011') {
    yindex = 1;
  } else if (year == '2010') {
    yindex = 0;
  } else {
    alert('Wrong Year');
  }
  d3.json("/emissions/ghg-states/emissions_"+statepost+".json", function(error, json) {
    stateData = json;
    statebubbles.selectAll("path")
     .data(stateData.children[yindex].children)
     .enter().append("path")
       .attr("transform", "translate(" + x + "," + y + ")");

     center = {x: centroid[0],y: centroid[1]}; 

     chart = new CreateBubbleChart(stateData.children[yindex].children, statebubbles, center, range, stroke);
     chart.start();
     chart.display_group_all();
  });
};
