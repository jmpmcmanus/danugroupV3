CreateBubbleChart = (function() {
  function BubbleChart(data, statebubbles, center, range, stroke) {
    var min_amount, max_amount, med_amount;
    this.stroke = stroke;
    this.data = data;
    this.width = 440;
    this.height = 300;
    this.tooltip = CustomTooltip("bubble_tooltip", 240);
    this.center = center;
    this.layout_gravity = 0.0;
    this.damper = 0.15;
    this.statebubbles = null;
    this.nodes = [];
    this.force = null;
    this.circles = null;
    min_amount = d3.min(this.data, function(d) {return parseInt(d.emission_amount);});
    max_amount = d3.max(this.data, function(d) {return parseInt(d.emission_amount);});
    med_amount = d3.median(this.data, function(d) {return parseInt(d.emission_amount);});
    this.fill_color = d3.scale.linear().range(colorsbrw)
      .domain(min_amount < 0
         ? [min_amount, 0, max_amount]
         : [min_amount, med_amount, max_amount]);
    this.radius_scale = d3.scale.pow().exponent(1.0).domain([0, max_amount]).range(range);
    this.hide_details(); 
    this.show_details();
    this.create_nodes();
    this.create_statebubbles();
  }
  BubbleChart.prototype.create_nodes = function() {
    var _this = this;
    this.data.forEach(function(d) {
      var node;
      if (d.emission_type != 'None') {
        node = {
          key: d.key,
          radius: _this.radius_scale(parseInt(d.emission_amount)),
          name: d.emission_type,
          value: d.emission_amount,
          number: d.number_of_locations,
          year: d.year,
          //Use map coordinate values
          x: Math.random() * this.center.x,
          y: Math.random() * this.center.y
        };
        return _this.nodes.push(node);
      }
    });
    return this.nodes.sort(function(a, b) {
      return b.value - a.value;
    });
  };
  BubbleChart.prototype.create_statebubbles = function() {
    var that,
      _this = this;
    this.statebubbles = statebubbles;
    this.circles = this.statebubbles.selectAll("circle").data(this.nodes, function(d) {
      return d.key;
    });
    that = this;
    this.circles.enter().append("circle").attr("r", 0).attr("fill", function(d) {
      return _this.fill_color(parseInt(d.value));
    }).attr("stroke-width", this.stroke).attr("stroke", function(d) {
      return d3.rgb(_this.fill_color(parseInt(d.value))).darker();
    }).attr("key", function(d) {
      return "bubble_" + d.key;
    }).on("mouseover", function(d) {
      return that.show_details(d, this);
    }).on("mouseout", function(d) {
      return that.hide_details(d, this);
    });
    return this.circles.transition().duration(2000).attr("r", function(d) {
      return d.radius;
    });
  };
  BubbleChart.prototype.charge = function(d) {
    return -Math.pow(d.radius, 2.0) / 8;
  };
  BubbleChart.prototype.start = function() {
    return this.force = d3.layout.force().nodes(this.nodes).size([this.width, this.height]);
  };
  BubbleChart.prototype.display_group_all = function() {
    var _this = this;
    this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", function(e) {
      return _this.circles.each(_this.move_towards_center(e.alpha)).attr("cx", function(d) {
        return d.x;
      }).attr("cy", function(d) {
        return d.y;
      });
    });
    this.force.start();
  };
  BubbleChart.prototype.move_towards_center = function(alpha) {
    var _this = this;
    return function(d) {
      d.x = d.x + (_this.center.x - d.x) * (_this.damper + 0.02) * alpha;
      return d.y = d.y + (_this.center.y - d.y) * (_this.damper + 0.02) * alpha;
    };
  };
  BubbleChart.prototype.show_details = function(data, element) {
    var mill = 1000000.00
    var content;

    if (d3.event == '[object MouseEvent]') {
       d3.select(element).attr("stroke", "black");
       content = "<span class=\"name\">Emission Type:</span><span class=\"value\"> " + data.name + "</span><br/>";
       content += "<span class=\"name\">Amount:</span><span class=\"value\"> "+(addCommas(data.value))+
                  "</span> &#40;MtCO<span class=\"sub\">2</span>eq&#41;<br/>";
       content += "<span class=\"name\">Number of Sites:</span><span class=\"value\"> " + data.number + "</span><br/>";
       content += "<span class=\"name\">Year:</span><span class=\"value\"> " + data.year + "</span>";
       return this.tooltip.showTooltip(content, d3.event);
    } 
  };
  BubbleChart.prototype.hide_details = function(d, element) {
    var _this = this;
    d3.select(element).attr("stroke", function(d) {
      return d3.rgb(_this.fill_color(parseInt(d.value))).darker();
    });
    return this.tooltip.hideTooltip();
  };
  return BubbleChart;
})();
