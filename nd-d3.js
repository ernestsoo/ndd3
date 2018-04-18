var width = 1200;
var height = 800;

var color = d3.scale.category10();

var force = d3.layout.force()
    .charge(-180)
    .size([width, height]);

var svg = d3.select("#cloud");

function linkDistance(d) {
            console.log(d);
            return 130;  //d.distance; 
   }   


d3.json("nd-d3.json", function(json) {
    force
        .nodes(json.nodes)
        .links(json.links)
        .linkDistance(linkDistance)
        .start();




    var links = svg.append("g").selectAll("line.link")
        .data(force.links())
        .enter().append("line")
        .attr("class", "link")
        .attr("marker-end", "url(#arrow)");

    var nodes = svg.selectAll("circle.node")
        .data(force.nodes())
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 8)
        .style("fill", function(d) { return color(d.group); })
        .call(force.drag);

    nodes.append("title")
        .text(function(d) { return d.name; });

    force.on("tick", function() {
        links.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        nodes.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    });
});