// Dimension of Visualization
var width = 0;
var height = 600;
var radius = 55;


$( document ).ready(function() {
    
    // 200px worth of side paddings total
    width = $(window).width() - 200;
    
    $("#cloud").attr("width",width);
    
    
    
    var margin_center = ($(window).width() - width) / 2;
    
    $('.svg-con').css("margin-left","100px");
    
    
    var btn_margin_center = ($(window).width() - $('.play-btn-group').width()) / 2;
    
    $('.play-btn-group').css("margin-left",btn_margin_center.toString()+"px");
});


var color = d3.scale.category10();


// select html/svg element
var svg = d3.select("#cloud");



// Initialize json object with nodes and links
var json_obj = {};
var nodes_array = [];
var links_array = [];

// List of coins to be displayed - to be configurable
// ### add or remove here for the visualization ###
var show_coins = ["bitcoin","ethereum","ripple","litecoin","stellar","dash","monero","nem"];

json_obj.nodes = nodes_array;
json_obj.links = links_array;

                  

// Initialize varible to store parse json object from .csv
var dataset = {};

// To store temp percentage of Bitcoin (Float) for comparison
var bitcoin_temp = 0.00;

// Search for Data for a specific date
var parse_complete = function(results)
{
    console.log(results.data);
    dataset = results.data;

       
        
         var percent_variable;
        
         //static counters used to avoid using a for loop
         var temp = 0;
         var coin_temp = 0;
    
         for (var key in results.data) {
            if (dataset.hasOwnProperty(key)) {
                console.log(dataset[key].slug);
                if((dataset[key].date.toString() == '2016-06-01') && (dataset[key].slug.toString() == (show_coins[temp])))
                {
          
                    
                   console.log(dataset[key].name);
                   console.log(dataset[key].date);
                    
                   percent_variable = (parseFloat(dataset[key].close) / parseFloat(dataset[key].open) - 1) * 100;
                   console.log(percent_variable);
                    
                   var group_num=temp+1;
                
                  
                    
                   if(dataset[key].slug.toString() == "bitcoin" )
                   {
                     bitcoin_temp = percent_variable;  
                   }
                      
                      
                   // Derived Variable (Relativity)
                   var relativity_value = bitcoin_temp - percent_variable;
                   
                   // Negate
                   if (relativity_value < 0)
                   {
                       relativity_value = 0 - relativity_value;
                   }
                
                   // Push Node Object
                   json_obj.nodes.push({name: dataset[key].symbol, group: temp, percentage: percent_variable});
                    
                   // Push Link Object
                  /* json_obj.links.push({"source":temp, "target":0, "value":relativity_value, "weight": 1}); */
                    
                    if(temp != 0)
                    {
                      json_obj.links.push({"source":temp ,"target":0, "value":relativity_value, "weight": 1});
                        
                       console.log("TEMPPPPP:",temp);
                    }
                    
                   
                    
                    console.log({"source":{name: dataset[key].symbol, group: temp, percentage: percent_variable}, "target":1, "value":relativity_value, "weight": 1})
                    
                    //increment temp
                    temp = temp + 1;
                }
            }
             
            //increment coin_temp
            coin_temp = coin_temp + 1;
        } 
    

    console.log(json_obj);
    

     // For debugging purposes
     json_obj.links.forEach(function(link, index, list) {
        if (typeof json_obj.nodes[link.source] === 'undefined') {
            console.log('undefined source', link);
        }
        if (typeof json_obj.nodes[link.target] === 'undefined') {
            console.log('undefined target', link);
        }
     });
    
    // Draw Force Graph
    init_force();
    
}

// PapaParse framework to parse data form local.csv 
Papa.parse('crypto-markets.csv', {
  header: true,
  download: true,
  // Adjust amount of data to read here
  preview: 15000,
  dynamicTyping: true,
  complete: parse_complete
});








// Derive the link distance based on the derived variable
var link_distance = function(d)
{
    console.log("QUICK MATHS");
    console.log(d.value);
    console.log(Math.log(1+d.value) * 100);
    // Value of relativity mutiplied by scale (150)
    return 100 + (Math.log(1+d.value) * 100);
}


// global variable to be used by init and update function
var force = d3.layout.force();



// Encapsulated Function to start force graph
var init_force = function()
{
    
    // Set up force graph
    force
        .charge(-300)
        .gravity(.05)
        .linkDistance(link_distance)
        .size([width, height])
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
    .attr("r", function(d){
        console.log("NODE:");
        console.log(d.percentage);
        
        var p_temp = d.percentage;
        var pi = 3.14159;
        var scale = 5000;
        
        if (p_temp < 0)
        {
            p_temp = 0 - p_temp;
        }
        
        // Multiply percentage with a scale
        return + Math.sqrt(p_temp * scale / pi);
    })
    .style("fill", function(d) { return color(d.group); })
    //drag
    .call(force.drag);



    // each node with coin/token's name
    var texts = svg.append("g").selectAll("circle.node")
    .data(force.nodes())
    .enter().append("text")
    .attr("class", "label")   
    .attr("fill","white")
    .text(function(d) { return d.name; })
    .call(force.drag);



    // each node with coin/token's percentage
    var percentages = svg.append("g").selectAll("circle.node")
    .data(force.nodes())
    .enter().append("text")
    .attr("class", "label")  
    .attr("fill","white")
    .text(function(d) { 
        var n = parseFloat(d.percentage).toFixed(2);
        return n.toString() + "%" })
    .call(force.drag);



    force.on("tick", function() {
        links.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

     /*   nodes.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; }); */
        
        nodes.attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
        .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });

        texts.attr("x", function(d) { return d.x - 11; })
        .attr("y", function(d) { return d.y - 4; });

        percentages.attr("x", function(d) { return d.x - 13; })
        .attr("y", function(d) { return d.y + 7; });

        });
    
}
    
