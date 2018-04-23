// Dimension of Visualization
var width = 1200;
var height = 800;

var color = d3.scale.category10();

// Set up force graph
var force = d3.layout.force()
.charge(-180)
.linkDistance(150)
.size([width, height]);


// select html/svg element
var svg = d3.select("#cloud");





// Initialize json object with nodes and links
var json_obj = {};
var nodes_array = [];
var links_array = [];

// List of coins to be displayed - to be configurable
var show_coins = ["bitcoin","ethereum","litecoin","dash"];

json_obj.nodes = nodes_array;
json_obj.links = links_array;

                  



// Initialize varible to store parse json object from .csv
var dataset = {};


var parse_complete = function(results)
{
    console.log(results.data);
    dataset = results.data;
    for(var i=0; i<4; i++)
    {
        
         var percent_variable;
        
         for (var key in results.data) {
            if (dataset.hasOwnProperty(key)) {
                if((dataset[key].date.toString() == '2016-01-04') && (dataset[key].slug.toString() == (show_coins[i])) )
                {
                   console.log(dataset[key].name);
                   console.log(dataset[key].date);
                    
                   percent_variable = (parseFloat(dataset[key].close) / parseFloat(dataset[key].open) - 1) * 100;
                   console.log(percent_variable);
                    
                   var group_num=i+1;
                   json_obj.nodes.push({name: dataset[key].name, group: group_num, percentage: percent_variable});
                }
            }
        } 
    }

    console.log(json_obj);
    
    // Draw Force Graph
    init_force();
    
}

// PapaParse framework to parse data form local.csv 
Papa.parse('crypto-markets.csv', {
  header: true,
  download: true,
  // Adjust amount of data to read here
  preview: 10000,
  dynamicTyping: true,
  complete: parse_complete
});






json_obj.links.push({"source":0, "target":1, "value":100});
json_obj.links.push({"source":1, "target":2, "value":100});
json_obj.links.push({"source":1, "target":0, "value":100});




console.log(json_obj.nodes);
console.log(json_obj.links);


var init_force = function()
{

force
    .nodes(json_obj.nodes)
    .links(json_obj.links)
    .start();  

    
var links = svg.append("g").selectAll("line.link")
.data(force.links())
.enter().append("line")
.attr("class", "link");


var nodes = svg.append("g").selectAll("circle.node")
.data(force.nodes())
.enter().append("circle")
.attr("class", "node")
.attr("r", 20)
.style("fill", function(d) { return color(d.group); })
//drag
.call(force.drag);

    
    
// each node with coin/token's name
var texts = svg.append("g").selectAll("circle.node")
.data(force.nodes())
.enter().append("text")
.attr("class", "label")                         
.text(function(d) { return d.name; })
.call(force.drag);
    
    
    
// each node with coin/token's percentage
var percentages = svg.append("g").selectAll("circle.node")
.data(force.nodes())
.enter().append("text")
.attr("class", "label")                         
.text(function(d) { 
    var n = parseFloat(d.percentage).toFixed(2);
    return n.toString() + "%" })
.call(force.drag);
    

    
    

    
force.on("tick", function() {
    links.attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

    nodes.attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });

    texts.attr("x", function(d) { return d.x + 22; })
    .attr("y", function(d) { return d.y - 3; });
    
    percentages.attr("x", function(d) { return d.x - 13; })
    .attr("y", function(d) { return d.y + 5; });
    
    });
    
}
    
