const attainmentRates = [3, 12, 21, 30, 39, 48, 57, 66];

var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

var educationalAttainment = d3.map();

var path = d3.geoPath();

var x = d3
  .scaleLinear()
  .domain([1, 10])
  .rangeRound([600, 860]);

var color = d3
  .scaleThreshold()
  .domain(d3.range(2, 10))
  .range(d3.schemeGreens[8]);

var g = svg
  .append("g")
  .attr("class", "key")
  .attr("transform", "translate(0,40)");

// legend color pallette
g.selectAll("rect")
  .data(
    color.range().map(function(d) {
      d = color.invertExtent(d);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      return d;
    })
  )
  .enter()
  .append("rect")
  .attr("height", 8)
  .attr("x", function(d) {
    return x(d[0]);
  })
  .attr("width", function(d) {
    return x(d[1]) - x(d[0]);
  })
  .attr("fill", function(d) {
    return color(d[0]);
  });

// legend title
g.append("text")
  .attr("class", "caption")
  .attr("x", x.range()[0])
  .attr("y", -6)
  .attr("fill", "#000")
  .attr("text-anchor", "start")
  .attr("font-weight", "bold")
  .text("Education rate");

// add legend lines under color box
g.selectAll("legendLine")
  .data(d3.schemeGreens)
  .enter()
  .append("line")
  .attr("x1", (d, i) => i * 29 + 570)
  .attr("x2", (d, i) => i * 29 + 570)
  .attr("y1", 0)
  .attr("y2", 15)
  .style("stroke", (d, i) =>
    i === 0 || i === d3.schemeGreens.length - 1 ? "white" : "black"
  );

// add legend lines under color box
g.selectAll("legendValues")
  .data(attainmentRates)
  .enter()
  .append("text")
  .attr("x", (d, i) => i * 29 + 595)
  .attr("y", 30)
  .attr("fill", "black")
  .text(d => `${d}%`)
  .style("font-size", 12);

d3.queue()
  .defer(
    d3.json,
    "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json"
  )
  .defer(
    d3.json,
    "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json",
    function(d) {
      console.log(d);
      unemployment.set(d.id, +d.rate);
    }
  )
  .await(ready);
