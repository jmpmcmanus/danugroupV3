var ghginvbar = dimple.newSvg("#chartContainer", 1250, 400);
d3.csv("/emissions/USA_INVENTORY_GROUPS.csv", function (data) {
  var groups = dimple.getUniqueValues(data, "group");

  // Set the bounds for the charts
  var row = 0,
      col = 0,
      top = 35,
      left = 60,
      inMarg = 240,
      width = 350, //250, 350,
      height = 280, //160, 280,
      totalWidth = parseFloat(ghginvbar.attr("width"));

  // Draw a chart for each of the 2 groups
  groups.forEach(function (group) {
    // Wrap to the row above
    if (left + ((col + 1) * (width + inMarg)) > totalWidth) {
      row += 1;
      col = 0;
    }
      
    // Filter for the group in the iteration
    var chartData = dimple.filterData(data, "group", group);
      
    // Use d3 to draw a text label for the group
    ghginvbar.append("text")
      .attr("x", left + (col * (width + inMarg)) + (width / 2))
      .attr("y", top + (row * (height + inMarg)) + (height / 2) - 150)
      .style("font-family", "sans-serif")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("opacity", 1.0)
      .text(chartData[0].group.substring(0, 60));
      
    // Create a chart at the correct point in the trellis
    var GHGChart = new dimple.chart(ghginvbar, chartData);
    GHGChart.setBounds(
      left + (col * (width + inMarg)),
      top + (row * (height + inMarg)),
      width,height);
      
    // Add x and fix ordering so that all charts are the same
    var x = GHGChart.addCategoryAxis("x", "year");
    x.addOrderRule("Date");
      
    // Add y and fix scale so that all charts are the same
    var y = GHGChart.addMeasureAxis("y", "MtCO2eq");

    if (group==="US GHG Inventory Emissions Sources and Sinks by Gas") {
      var variables = ["CO2 Source","CO2 Sink","CH4 Source","CH4 Sink","N2O Source","N2O Sink","HFCs Source","SF6 Source","PFCs Source","Total Sources excluding Sinks"];
      var lMarg = inMarg;
      var lTop = 65;
      var xlegt =  left + (col * (width + lMarg)) + (width+20);
      var cmesg = ["Click legend to","show/hide gas:"];
    } else if (group==="US GHG Inventory Sources and Sink by Process") {
      var variables = ["Energy","Industrial Process","Solvent and Other Product Use","Agriculture","LULUCF","Waste","Total Sources minus Sink"];
      var lMarg = inMarg;
      var lTop = 65;
      var xlegt =  left + (col * (width + lMarg)) + (width+15);
      var cmesg = ["Click legend to","show/hide sector:"]
    } else {
      alert('Shit');
    }
      
    GHGChart.addSeries("name", dimple.plot.bar).addOrderRule(variables);
    GHGChart.ease = "bounce"
    GHGChart.staggerDraw = true;
    //Set Legend posession
    var GHGLegend = GHGChart.addLegend(left + (col * (width + lMarg)) + (width+120), lTop, 80, 180, "right");
    GHGChart.draw();
    GHGChart.legends = [];

    ghginvbar.selectAll("title_text")
      .data(cmesg)
      .enter()
      .append("text")
      .attr("x", xlegt)
      .attr("y", function (d, i) { return (55) + i * 10; })
      .style("font-family", "sans-serif")
      .style("font-size", "10px")
      .style("color", "Black")
      .text(function (d) { return d; });

    var filterValues = dimple.getUniqueValues(chartData, "name");
    GHGLegend.shapes.selectAll("rect")
    var newFilters = [];

    if (location.hash.substr(1).split("/") == "totals") {
      var i = 0;
      filterValues.forEach(function (f) {
        if (f.substring(0, 5) === 'Total') {
          newFilters.push(f);
          GHGLegend.shapes.selectAll("rect")[variables.length-1][0].style["opacity"]="0.8"
        } else {
          GHGLegend.shapes.selectAll("rect")[i][0].style["opacity"]="0.2"
          i = i + 1;
        }
      });
    } else if (location.hash.substr(1).split("/") == "industry") {
      var i = 0;
      filterValues.forEach(function (f) {
        if (f.substring(0, 10) === 'CO2 Source' || f.substring(0, 18) === 'Industrial Process') {
          newFilters.push(f);
          GHGLegend.shapes.selectAll("rect")[i][0].style["opacity"]="0.8"
          i = i + 1;
        } else {
          GHGLegend.shapes.selectAll("rect")[i][0].style["opacity"]="0.2"
          i = i + 1;
        }
      });
    } else if (location.hash.substr(1).split("/") == "energy") {
      var i = 0;
      filterValues.forEach(function (f) {
        if (f.substring(0, 10) === 'CO2 Source' || f.substring(0, 6) === 'Energy') {
           newFilters.push(f);
           GHGLegend.shapes.selectAll("rect")[i][0].style["opacity"]="0.8"
           i = i + 1;
        } else {
           GHGLegend.shapes.selectAll("rect")[i][0].style["opacity"]="0.2"
           i = i + 1;
        }
      });
    } else {
      filterValues.forEach(function (f) {
        if (f.substring(0, 5) === 'Total') {
           GHGLegend.shapes.selectAll("rect")[variables.length-1][0].style["opacity"]="0.2"
        } else {
           newFilters.push(f);
        }
      });
    } 

    filterValues = newFilters;
    GHGChart.data = dimple.filterData(chartData, "name", filterValues);
    GHGChart.draw();

    GHGLegend.shapes.selectAll("rect").on("click", function (e) {
      var hide = false;
      var newFilters = [];
      if (filterValues.indexOf("Total Sources minus Sink") !== -1) {
        if (e.aggField.slice(-1)[0] === 'Total Sources minus Sink') {
          hide = true;
          newFilters = variables.slice(0,variables.length-1); 
          var i = 0;
          newFilters.forEach(function (f) {
            GHGLegend.shapes.selectAll("rect")[i][0].style["opacity"]="0.8"
            i = i + 1;
          });
        } else {
          hide = true;
          newFilters = ['Total Sources minus Sink'];
        }
      } else if (filterValues.indexOf("Total Sources excluding Sinks") !== -1) {
        if (e.aggField.slice(-1)[0] === 'Total Sources excluding Sinks') {
          hide = true;
          newFilters = variables.slice(0,variables.length-1);
          var i = 0;
          newFilters.forEach(function (f) {
            GHGLegend.shapes.selectAll("rect")[i][0].style["opacity"]="0.8"
            i = i + 1;
          });
        } else {
          hide = true;
          newFilters = ['Total Sources excluding Sinks'];
        }
      } else {
        if (e.aggField.slice(-1)[0] === 'Total Sources minus Sink') {
          hide = false;
          newFilters = ['Total Sources minus Sink'];
          tmpFilters = variables.slice(0,variables.length-1); 
          var i = 0;
          tmpFilters.forEach(function (f) {
            GHGLegend.shapes.selectAll("rect")[i][0].style["opacity"]="0.2"
            i = i + 1;
          });
        } else if (e.aggField.slice(-1)[0] === 'Total Sources excluding Sinks') {
          hide = false;
          newFilters = ['Total Sources excluding Sinks'];
          tmpFilters = variables.slice(0,variables.length-1);
          var i = 0;
          tmpFilters.forEach(function (f) {
            GHGLegend.shapes.selectAll("rect")[i][0].style["opacity"]="0.2"
            i = i + 1;
          });
        } else {
          filterValues.forEach(function (f) {
            if (f === e.aggField.slice(-1)[0]) {
                hide = true;
              } else {
              newFilters.push(f);
              }
          });
        }
      };
      if (hide) {
        d3.select(this).style("opacity", 0.2);
      } else {
        newFilters.push(e.aggField.slice(-1)[0]);
        d3.select(this).style("opacity", 0.8);
      }
      filterValues = newFilters;
      GHGChart.data = dimple.filterData(chartData, "name", filterValues);
      GHGChart.draw(800);
    });

    col += 1;
  }, this);
});
