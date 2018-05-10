// Dimension of Visualization
var width = 0;
var height = 900;
var radius = 55;


$( document ).ready(function() {

    // 200px worth of side paddings total
    width = $(window).width() - 200;

    $("#cloud").attr("width",width);

    $(".loading-animation").css("width",width.toString() + "px");
    $(".loading-animation").css("height","460px");

    var margin_center = ($(window).width() - width) / 2;

    $('.svg-con').css("margin-left","100px");


    var btn_margin_center = ($(window).width() - $('.play-btn-group').width()) / 2;

    $('.play-btn-group').css("margin-left",btn_margin_center.toString()+"px");
});


var color = d3.scale.category10();


// select html/svg element
var svg = d3.select("#cloud");




// Initialize json object with nodes and links
var json_obj = [];
var nodes_array = [];
var links_array = [];

var json_obj_array = [];


var show_new_coins =["bitcoin_price","iota_price","ripple_price","ethereum_price","litecoin_price","neo_price","omisego_price"];

var show_new_coins_names = ["BTC","IOTA","XRP","ETH","LTC","NEO","OMG"];

for (var i=0; i<30; i++)
{
    json_obj[i] = {};
    json_obj[i].nodes = [];
    json_obj[i].links = [];
}


// Initialize varible to store parse json object from .csv
var dataset = {};

// To store temp percentage of Bitcoin (Float) for comparison
var bitcoin_temp = [];

var isBitcoin=true;
var iteration_counter=0;

var date_counter = 1;

var parse_new_complete = function(results)
{

     // Reverse dataset from descending to ascending order.
     dataset = results.data.reverse();

     var percent_variable;

     for (var key in results.data) {
            if (dataset.hasOwnProperty(key)) {

                if(dataset[key].Date.toString() == "Jan 0"+date_counter.toString()+", 2018")
                {

                   var date_temp = date_counter - 1;

                   console.log(date_counter);
                   // Comparing Open and Close
                   percent_variable = (parseFloat(dataset[key].Close) / parseFloat(dataset[key].Open) - 1) * 100;
                   console.log(percent_variable);


                   if(iteration_counter == 0)
                   {
                     bitcoin_temp[date_temp] = percent_variable;
                   }

                   // Derived Variable (Relativity)
                   var relativity_value = bitcoin_temp[date_temp] - percent_variable;

                   // Negate
                   if (relativity_value < 0)
                   {
                       relativity_value = 0 - relativity_value;
                   }

                    console.log("Date_temp",date_temp);



                   // Push Node Object
                   json_obj[date_temp].nodes.push({name: show_new_coins_names[iteration_counter], group: iteration_counter, percentage: percent_variable});


                   // Push Link Object+
                   if(iteration_counter != 0 )
                   {
                     json_obj[date_temp].links.push({"source":iteration_counter ,"target":0, "value":relativity_value, "weight": 1});
                   }


                     // Increment to the next day
                     if(date_counter < 8)
                     {

                       date_counter = date_counter + 1;

                     }


                     if(date_counter == 8)
                     {
                        date_counter = 1;
                     }

                }

                console.log(date_counter);
            }
     }

     // Rest of iteration is not Bitcoin
     isBitcoin=false;

     iteration_counter = iteration_counter + 1;


    console.log(json_obj);



     // Init Force Graph after all coins are parsed.
     if(iteration_counter == show_new_coins.length)
     {
            $(".loading-animation").css("display","none");
            $("#cloud").css("display","initial");

            init_force(json_obj);
     }
    console.log("LENGTH",show_new_coins.length);
    console.log("ITERATION",iteration_counter.toString());



}




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
                //console.log(dataset[key].date.toString());
                if((dataset[key].date.toString() == '1/6/2016') && (dataset[key].slug.toString() == (show_coins[temp])))
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


    $(".loading-animation").css("display","none");
    $("#cloud").css("display","initial");

    // Draw Force Graph
    init_force();

}

for (var i=0; i<show_new_coins.length; i++)
{
    // PapaParse framework to parse data form local.csv
    Papa.parse('dataset/'+show_new_coins[i]+'.csv', {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: parse_new_complete
    });
}







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
var force1 = d3.layout.force();


// Encapsulated Function to start force graph
var init_force = function(dataset)
{
    // Set up force graph
    force
        .charge(-1000)
        .gravity(0)
        .friction(0.5)
        .linkDistance(link_distance)
        .size([width, height])
        .nodes(dataset[0].nodes)
        .links(dataset[0].links)
        .start();

    force1
        .charge(-100)
        .gravity(0)
        .linkDistance(link_distance)
        .size([width, height])
        .nodes(dataset[1].nodes)
        .links(dataset[1].links)
        .start();


/*
    setTimeout(function(){
        force.nodes(dataset[1].nodes).links(dataset[1].links);

        nodes.data(force.nodes())
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
        .style("fill", function(d)
        {
            if(d.name == "BTC")
            {
                return '#0069d9';
            }else
            {

                if(d.percentage > 0)
                {
                    return '#28a745';
                }
                else{
                    return '#dc3545';
                }

            }
        })
        //drag
        .call(force.drag);
        links.data(force.links())
              .enter().append("line")
              .attr("class", function(d)
                    {console.log("lineeee");
                     console.log(d.source.percentage);

                     var bool_btc = false;
                     var bool_source = false;

                     if(d.target.percentage > 0)
                     {
                         bool_btc = true;
                     }


                     if(d.source.percentage > 0)
                     {
                         bool_source = true;
                     }

                     if(bool_btc == bool_source)
                     {
                         return "link";
                     }else{
                         return null;
                     }
              });


              force.on("tick", function() {
                  links.attr("x1", function(d) { return d.source.x; })
                  .attr("y1", function(d) { return d.source.y; })
                  .attr("x2", function(d) { return d.target.x; })
                  .attr("y2", function(d) { return d.target.y; });


                  nodes.attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
                  .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });

                  texts.attr("x", function(d) { return d.x - 11; })
                  .attr("y", function(d) { return d.y - 4; });

                  percentages.attr("x", function(d) { return d.x - 13; })
                  .attr("y", function(d) { return d.y + 7; });

                  });





    },2000);*/

    var links = svg.append("g").selectAll("line.link")
    .data(force.links())
    .enter().append("line")
    .attr("class", function(d)
          {console.log("lineeee");
           console.log(d.source.percentage);

           var bool_btc = false;
           var bool_source = false;

           if(d.target.percentage > 0)
           {
               bool_btc = true;
           }


           if(d.source.percentage > 0)
           {
               bool_source = true;
           }

           if(bool_btc == bool_source)
           {
               return "link";
           }else{
               return null;
           }
    });


    var nodes = svg.append("g").selectAll("circle.node")
    .data(force.nodes())
    .enter().append("circle")
    .attr("class", "node")
    .attr("id", function(d,i){
        return "circle-"+i.toString();
    })
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
    .style("fill", function(d,i)
    {
        console.log("index",i);

        if(d.name == "BTC")
        {
            return '#0069d9';
        }else
        {

            if(d.percentage > 0)
            {
                return '#28a745';
            }
            else{
                return '#dc3545';
            }

        }
    })
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

                nodes.attr("cx", function(d) {
                  if(d.name=="BTC")
                  {
                    return d.x = width / 2;
                  }else{
                    return d.x = Math.max(radius, Math.min(width - radius, d.x));
                  }
                })
                .attr("cy", function(d) {

                  if(d.name=="BTC")
                  {
                    return d.y = height / 2;
                  }else{
                    return d.y = Math.max(radius, Math.min(height - radius, d.y));
                  }

                });

                texts.attr("x", function(d) { return d.x - 11; })
                .attr("y", function(d) { return d.y - 4; });

                percentages.attr("x", function(d) { return d.x - 13; })
                .attr("y", function(d) { return d.y + 7; });

                });
        /*

        setTimeout(function(){
          update_force(1);

        nodes.transition().delay(1000).attr("cx", function(d) {
              return 500;
          })
          .attr("cy", function(d) {
              return 500;

          });


        },1100);*/


         setTimeout(function(){
           update_force(1);
         },1100);

         setTimeout(function(){
           update_force(2);
         },2200);

         setTimeout(function(){
           update_force(3);
         },3300);

         setTimeout(function(){
           update_force(4);
         },4400);

         setTimeout(function(){
           update_force(5);
         },5500);





       function update_force(index){
          force
            .linkDistance(function(d,i){
              return 100 + (Math.log(1+json_obj[index].links[i].value) * 100);
            }).start();

          // Update and Transition Nodes
          for (var i=0; i< json_obj[index].nodes.length; i++)
          {

            var p_temp = json_obj[index].nodes[i].percentage;
            var pi = 3.14159;
            var scale = 5000;

            if (p_temp < 0)
            {
                p_temp = 0 - p_temp;
            }


            d3.select("#circle-"+i.toString()).attr("r",Math.sqrt(p_temp * scale / pi));
          }

          // Update and Transition Links
          for (var i=0; i< json_obj[index].links.length; i++)
          {
                  alert(called)
            if(json_obj[index].links[i].name == "BTC")
            {


                d3.select("#circle-"+i.toString()).attr("class","class-blue");
            }else
            {

                if(json_obj[index].links[i].percentage > 0)
                {
                      d3.select("#circle-"+i.toString()).attr("class","class-blue");
                }
                else{
                      d3.select("#circle-"+i.toString()).attr("class","class-red");
                }

            }
          }


        };

}
