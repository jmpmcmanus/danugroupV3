var margin = {top: 200, right: 240, bottom: 210, left: 220},
    radius = Math.min(margin.top, margin.right, margin.bottom, margin.left) - 0; 

var colorcat = d3.scale.category20c();
var colorsbrw = colorbrewer.RdYlGn[3].reverse()

var sunburst = d3.select("#sunburst").append("svg")
    .attr("width", margin.left + margin.right)
    .attr("height", margin.top + margin.bottom)
    .append("g")
    .attr("id", "container")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var partition = d3.layout.partition()
    .sort(function(a, b) { return d3.ascending(a.name, b.name); })
    .size([2 * Math.PI, radius]);

var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx - .01 / (d.depth + .5); })
    .innerRadius(function(d) { return radius / 3 * d.depth; }) 
    .outerRadius(function(d) { return radius / 3 * (d.depth + 1) - 1; }); //3

d3.json("/emissions/ghgsectorsindustrygasSB.json", function(error, root) {
  // Compute the initial layout on the entire tree to sum sizes.
  // Also compute the full name and fill color for each node,
  // and stash the children so they can be restored as we descend.
  partition
      .value(function(d) { return d.size; })
      .nodes(root)
      .forEach(function(d) {
        d._children = d.children;
        d.sum = d.value;
        d.key = key(d);
      });

  // Now redefine the value function to use the previously-computed sum.
  partition
      .children(function(d, depth) { return depth < 2 ? d._children : null; })
      .value(function(d) { return d.sum; });
 
  var center = sunburst.append("circle")
      .attr("r", radius / 3)
      .on("click", zoomOut);

  center.append("title")
      .text("zoom out");
 
  var path = sunburst.selectAll("path")
      .data(partition.nodes(root).slice(1))
      .enter().append("path")
      .attr("d", arc)
      .attr("fill-rule", "evenodd")
      .style("fill", function(d) { return colorcat((d.children ? d : d.parent).name); })
      .style("opacity", 1)
      .each(function(d) { this._current = updateArc(d); })
      .on("mouseover", showdetails)
      .on("click", zoomIn);

  d3.select("#container")
      .on("mouseout", resetopacity)
      .on("mouseleave", hidedetails);

  function zoomIn(p) {
    if (!p.children) return;
    zoom(p, p);
  }

  function zoomOut(p) {
    if (!p.parent) return;
    zoom(p.parent, p);
  }

  // Zoom to the specified new root.
  function zoom(root, p) {
    if (document.documentElement.__transition__) return;

    // Rescale outside angles to match the new layout.
    var enterArc,
        exitArc,
        outsideAngle = d3.scale.linear().domain([0, 2 * Math.PI]);

    function insideArc(d) {
      return p.key > d.key
          ? {depth: d.depth - 1, x: 0, dx: 0} : p.key < d.key
          ? {depth: d.depth - 1, x: 2 * Math.PI, dx: 0}
          : {depth: 0, x: 0, dx: 2 * Math.PI};
    }

    function outsideArc(d) {
      return {depth: d.depth + 1, x: outsideAngle(d.x), dx: outsideAngle(d.x + d.dx) - outsideAngle(d.x)};
    }

    center.datum(root);

    // When zooming in, arcs enter from the outside and exit to the inside.
    // Entering outside arcs start from the old layout.
    if (root === p) enterArc = outsideArc, exitArc = insideArc, outsideAngle.range([p.x, p.x + p.dx]);

    path = path.data(partition.nodes(root).slice(1), function(d) { return d.key; });
 
    // When zooming out, arcs enter from the inside and exit to the outside.
    // Exiting outside arcs transition to the new layout.
    if (root !== p) enterArc = insideArc, exitArc = outsideArc, outsideAngle.range([p.x, p.x + p.dx]);
 
    d3.transition().duration(750).each(function() {
      path.exit().transition()
          .style("fill-opacity", function(d) { return d.depth === 1 + (root === p) ? 1 : 0; })
          .attrTween("d", function(d) { return arcTween.call(this, exitArc(d)); })
          .remove();

      path.enter().append("path")
          .style("fill-opacity", function(d) { return d.depth === 2 - (root === p) ? 1 : 0; })
          .style("fill", function(d) { return colorcat((d.children ? d : d.parent).name); })
          .on("mouseover", showdetails)
          .on("click", zoomIn)
          .each(function(d) { this._current = enterArc(d); });

      d3.select("#container")
          .on("mouseout", resetopacity)
          .on("mouseleave", hidedetails);

      path.transition()
          .style("fill-opacity", 1)
          .attrTween("d", function(d) { return arcTween.call(this, updateArc(d)); });
    });
  }

  if (location.hash == "#2013") {
    root = root.children[3];
    zoomIn(root);
  } else if (location.hash == "#2010") {
    root = root.children[0];
    zoomIn(root);
  }
 
});

function key(d) {
  var k = [], p = d;
  while (p.depth) k.push(p.name), p = p.parent;
  return k.reverse().join(".");
}

function arcTween(b) {
  var i = d3.interpolate(this._current, b);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}

function updateArc(d) {
  return {depth: d.depth, x: d.x, dx: d.dx};
}

function showdetails(d) {
  var ghgcontent;
  try {
    ghgcontent = "<span class=\"name\">Variable:</span><span class=\"value\"> " + d.name + "</span><br/>";
    ghgcontent += "<span class=\"name\">MtCO2eq:</span><span class=\"value\"> " + addCommas(d.value) + "</span><br/>";
    ghgcontent += "<span class=\"name\"># of Sites:</span><span class=\"value\"> " + addCommas(d.number_of_facilities) + "</span><br/>";
  }
  catch (err) {
    ghgcontent = "<span class=\"name\">Variable:</span><span class=\"value\"> " + d.name + "</span><br/>";
    ghgcontent += "<span class=\"name\">MtCO2eq:</span><span class=\"value\"> " + addCommas(d.value) + "</span><br/>";
    ghgcontent += "<span class=\"name\"># of Sites:</span><span class=\"value\"> " + addCommas(d.number_of_facilities) + "</span><br/>";
  }
  d3.select("#ghgcontent")
    .html(ghgcontent);

  d3.select("#details")
    .style("visibility", "");

  var nodesArray = getNodes(d);
  d3.selectAll("path")
     .filter(function(node) {
        return (nodesArray.indexOf(node) >= 0);
     })
     .style("opacity", 0.3);
};

function resetopacity(d) {
  sunburst.selectAll("path")
      .style("opacity", 1);
};

function hidedetails(d) {
  d3.select("#details")
    .transition()
    .style("visibility", "hidden");
};

function getNodes(node) {
  var path = [];
  var current = node;
  while (current.parent) {
    path.unshift(current);
    current = current.parent;
  }
  return path;
}
