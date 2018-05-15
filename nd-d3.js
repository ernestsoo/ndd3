// Dimension of Visualization
var width = 0;
var height = 680;
var radius = 55;




$( document ).ready(function() {
    $(".img-bg").css("width",$('.main').width());
    $(".img-bg").css("height","2000px");
    // 200px worth of side paddings total
    width = $(window).width();

    $("#cloud").attr("width",width);
    $("#cloud1").attr("width",width);
    $(".loading-animation").css("width",width.toString() + "px");
    $(".loading-animation").css("height","460px");

    var margin_center = ($(window).width() - width) / 2;

    $(".tutorial-shade").css("width",$(window).width().toString()+"px");
    $(".tutorial-shade").css("height",$(window).height().toString()+"px");

    var animation_center =  ($(window).width() - $(".animation-date-con").width()) / 2;
    $(".animation-date-con").css("margin-left", animation_center.toString()+"px");




    var title_margin_center = ($(window).width() - $('.app-title').width()) / 2;

    $('.app-title').css("margin-left",title_margin_center.toString()+"px");



    var tools_margin_left = title_margin_center - $('.app-title').width() + 150;

    $('.app-tools').css("margin-left",tools_margin_left.toString()+"px");

    $('#histogram').css("left",title_margin_center.toString()+"px");
    title_margin_center = title_margin_center + 450;
    
    $('#histogram').css("top","15px");

    $('#tutorial-0').css("top","20px");
    $('#tutorial-1').css("top","20px");
    $('#tutorial-2').css("top","20px");
    $('#tutorial-3').css("top","20px");
    $('#tutorial-4').css("top","20px");

    $('#tutorial-0').css("left",title_margin_center.toString()+"px");

    $('#tutorial-1').css("left",title_margin_center.toString()+"px");

    $('#tutorial-2').css("left",title_margin_center.toString()+"px");

    $('#tutorial-3').css("left",title_margin_center.toString()+"px");



    $('#tutorial-4').css("left",title_margin_center.toString()+"px");
    
    
    $(".icons-play").on("click",function(){
        
        $(".icons-pause").css("display","initial");
        $(".icons-play").css("display","none");
    });
    
    $(".icons-pause").on("click",function(){
        
        $(".icons-pause").css("display","none");
        $(".icons-play").css("display","initial");
    });
    
    $(".icons-stop").on("click",function(){
        
        $(".icons-pause").css("display","none");
        $(".icons-play").css("display","initial");
    });

});


// global variable to be used by init and update function
var force = d3.layout.force();
var force1 = d3.layout.force();

var color = d3.scale.category10();


// select html/svg element
var svg = d3.select("#cloud");

// select html/svg element
var svg1 = d3.select("#cloud1");



// Initialize json object with nodes and links
var json_obj = [];
var nodes_array = [];
var links_array = [];

var json_obj_array = [];


// Array of datasets to be imported
var show_new_coins = ["bitcoin_price","iota_price","ripple_price","ethereum_price","litecoin_price","neo_price","omisego_price","waves_price", "stratis_price", "qtum_price", "bitconnect_price", "dash_price"];

// Explicitly define SYMBOL for each dataset entry
var show_new_coins_names = ["BTC","IOTA","XRP","ETH","LTC","NEO","OMG","WAVES","STRAT","QTUM","BCC","DASH"];

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


// Get the Max for Scales
var max_link = [];
var max_radius = [];


var is_update = false;



var histogram_array = [];

for(var i=0; i<show_new_coins.length; i++)
{
    histogram_array[i] = {};
    histogram_array[i].value = 0;
}

var year_array = ["2017","2017","2017","2018","2018"];

var month_array = ["Oct","Nov","Dec","Jan","Feb"];

var date_array_counter = 3;

var year = year_array[date_array_counter];
var month = month_array[date_array_counter];

var parse_temp = 0;

var open_settings = function()
{
  $(".tutorial-shade").css("display","initial");
  $("#settings").css("display","initial");
}

var close_settings = function()
{
  $(".tutorial-shade").css("display","none");
  $("#settings").css("display","none");
}


var up_date = function()
{

  date_array_counter = date_array_counter + 1;
  if(date_array_counter < 5)
  {

    year = year_array[date_array_counter];
    month = month_array[date_array_counter];

    change_date();
  }else {
    date_array_counter = date_array_counter - 1;
  }
}


var down_date = function()
{
    date_array_counter = date_array_counter - 1;
    if(date_array_counter > -1)
    {

      year = year_array[date_array_counter];
      month = month_array[date_array_counter];

      change_date();
    }else {
      date_array_counter = date_array_counter + 1;
    }
}

var change_date = function()
{
   force = d3.layout.force();

   is_update = true;

    d3.selectAll('#cloud > g').remove();

    $(".loading-animation").css("display","initial");
    $("#cloud").css("display","none");

    $(".animation-date").text("1 "+month+" "+year);

    json_obj = [];

    iteration_counter = 0;

    date_counter = 1;

    for (var i=0; i<30; i++)
    {
        json_obj[i] = {};
        json_obj[i].nodes = [];
        json_obj[i].links = [];
    }

    parseData(0);
}

var parse_new_complete = function(results)
{

     // Reverse dataset from descending to ascending order.
     dataset = results.data.reverse();



     var percent_variable;
     //  console.log(dataset);

     var parse_date_zero = "0";

     for (var key in results.data) {
            if (dataset.hasOwnProperty(key)) {

                if (date_counter > 9)
                {
                    parse_date_zero = "";
                }

                if(dataset[key].Date.toString() == month.toString()+" "+parse_date_zero.toString()+date_counter.toString()+", "+year.toString())
                {

                   var date_temp = date_counter - 1;

                  //  console.log(date_counter);
                   // Comparing Open and Close
                   percent_variable = (parseFloat(dataset[key].Close) / parseFloat(dataset[key].Open) - 1) * 100;
                  //  console.log(percent_variable);


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

                  //   console.log("Date_temp",date_temp);



                   // Push Node Object
                   json_obj[date_temp].nodes.push({name: show_new_coins_names[iteration_counter], group: iteration_counter, percentage: percent_variable, cap: dataset[key]['Market Cap'], volume: dataset[key]['Volume'], price: dataset[key]['Close']});


                   // Push Link Object+
                   if(iteration_counter != 0 )
                   {
                     json_obj[date_temp].links.push({"source":iteration_counter ,"target":0, "value":relativity_value, "weight": 1});
                   }

                   max_link.push(relativity_value);


                     // Increment to the next day
                     if(date_counter < 29)
                     {

                       date_counter = date_counter + 1;

                       console.log("FINAL",json_obj)
                     }


                     if(date_counter == 29)
                     {
                        date_counter = 1;

                     }

                     // Negate
                     if (percent_variable < 0)
                     {
                         percent_variable = 0 - percent_variable;
                     }

                     max_radius.push(percent_variable);

                }

            }
     }

     // Rest of iteration is not Bitcoin
     isBitcoin=false;

     iteration_counter = iteration_counter + 1;




     // Init Force Graph after all coins are parsed.
     if(iteration_counter == show_new_coins.length)
     {
            $(".loading-animation").css("display","none");
            $("#cloud").css("display","initial");

            init_force(json_obj);
     }else {
            // Recursive Call to parse Data.
            console.log(iteration_counter,"AASDASDASD")
            parseData(iteration_counter);

            date_counter = 1;
     }



}


  // PapaParse framework to parse data form local.csv
  parseData(0);




  function parseData(index){

    console.log(show_new_coins[index]);

                                                    Papa.parse('dataset/'+show_new_coins[index]+'.csv', {
                                                      header: true,
                                                      download: true,
                                                      dynamicTyping: true,
                                                      complete: parse_new_complete
                                                    });



  }










  var tutorial1_int = false;
  var tutorial2_int = false;
  var tutorial3_int = false;

  var tutorial_counter=0;



        // TUTORIAL 0
        function tutorial0()
        {
          $('#tutorial-0').css("display","unset");
          $('.help-icon').css("z-indez","10000")
          $(".tutorial-shade").css("display","initial")

          tutorial_counter = 0;
        }



        var tutorial1 = function()
        {
          tutorial1_int = true;

          $("#cloud1").css("display","initial");
          $("#tutorial-0").css("display","none");
          $("#tutorial-1").css("display","initial");

          tutorial_counter = 1



        }


        var tutorial2 = function()
        {

          tutorial1_int = false;
          tutorial2_int = true;

          tutorial_counter = 2;


          $("#tutorial-1").css("display","none");
          $("#tutorial-2").css("display","initial");
        }

        var tutorial3 = function()
        {
          tutorial2_int = false;
          tutorial3_int = true;

          tutorial_counter = 3;

          $("#tutorial-2").css("display","none");
          $("#tutorial-3").css("display","initial");
        }

        var tutorial4 = function()
        {

          tutorial3_int = false;

          tutorial_counter = 4;

          $("#tutorial-3").css("display","none");
          $("#tutorial-4").css("display","initial");
        }

        var close_tutorial = function()
        {
            $(".tutorial-shade").css("display","none");
            $("#tutorial-"+tutorial_counter.toString()).css("display","none");
            $("#cloud1").css("display","none");
            $("#cloud").css("z-index","1000001");
            $(".svg-con").css("z-index","1000001");

            force1.stop();
        }



        var animation_bool = false;
        var animation_stop_bool = false;

        var animation_counter = 1;


        function histogram_close()
        {
          $('#histogram').css("display","none");
          $(".tutorial-shade").css("display","none");

          $(".svg-con").css("z-index", 1000001);
        }




// Encapsulated Function to start force graph
var init_force = function(dataset)
{

 if(!is_update)
 {
    setTimeout(function(){
          tutorial0();
    },1000);
  }

  console.log(max_link);
  console.log("MAX MAX", d3.max(max_link));


  var linkScale = d3.scale.linear()
                      .domain([0, 25])
                      .range([100, 550]);

  var radiusScale = d3.scale.linear()
                        .domain([0, Math.log(d3.max(max_radius)+1)])
                        .range([20,100]);


  console.log("Answ", linkScale(Math.log("40")) );

  // Derive the link distance based on the derived variable
  function link_distance(d)
  {
      console.log("QUICK MATHS");
      console.log(d.value);
      console.log(Math.log(1+d.value) * 100);
      // Value of relativity mutiplied by scale (150)
    //  alert(d.value)
    //  alert(linkScale(10));
      console.log("SCALE", linkScale(Math.log(1+d.value)));

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
            return linkScale(d.value);
      }else{
            return 200 + linkScale(d.value);
      }
  }


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

    var tutorial_obj = [];

    tutorial_obj.nodes = [];
    tutorial_obj.links = [];

    tutorial_obj.nodes.push(json_obj[0].nodes[0]);
    tutorial_obj.nodes.push(json_obj[0].nodes[1]);

    tutorial_obj.links.push(json_obj[0].links[0]);




    force1
            .charge(-1000)
            .gravity(0)
            .friction(0.5)
            .linkDistance(200)
            .size([400,400])
            .nodes(tutorial_obj.nodes)
            .links(tutorial_obj.links)
            .start();






    var links = svg.append("g").selectAll("line.link")
    .data(force.links())
    .enter().append("line")
    .attr("id", function(d,i){
          return "link-" + i.toString();
    })
    .attr("class", function(d,i){
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
               histogram_array[i].value = histogram_array[i].value + 1;
               return "link";

           }else{
               return null;
           }
    });

    var links1 = svg1.append("g").selectAll("line.link")
    .data(force1.links())
    .enter().append("line")
    .attr("id", function(d,i){
          return "link1-" + i.toString();
    })
    .attr("class", function(d){
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


    var nodes1 = svg1.append("g").selectAll("circle.node")
    .data(force1.nodes())
    .enter().append("circle")
    .attr("class", "node")
    .attr("id", function(d,i){
        return "circle1-"+i.toString();
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
        return radiusScale(Math.log(p_temp+1));
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
        return radiusScale(Math.log(p_temp+1));
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
    .on("mouseover",function(d,i){
        d3.selectAll("#hover-"+i.toString()).attr("visibility","visible");
    })
    .on("mouseout",function(d,i){
        d3.selectAll("#hover-"+i.toString()).attr("visibility","hidden");
    })
    //drag
    .call(force.drag);




    // each node with coin/token's name
    var texts = svg.append("g").selectAll("circle.node")
    .data(force.nodes())
    .enter().append("text")
    .attr("class", "label")
    .attr("fill","white")
    .on("mouseover",function(d,i){
        d3.selectAll("#hover-"+i.toString()).attr("visibility","visible");
    })
    .on("mouseout",function(d,i){
        d3.selectAll("#hover-"+i.toString()).attr("visibility","hidden");
    })
    .text(function(d) { return d.name; })
    .call(force.drag);

    // each node with coin/token's name
    var texts1 = svg1.append("g").selectAll("circle.node")
    .data(force1.nodes())
    .enter().append("text")
    .attr("class", "label")
    .attr("fill","white")
    .text(function(d) { return d.name; })
    .call(force.drag);


    var hover_rect = svg.append("g").selectAll("circle.node")
    .data(force.nodes());



    hover_rect.enter().append("rect")
    .attr("width",280)
    .attr("height",140)
    .classed("hover-details", true)
    .attr("visibility","hidden")
    .attr("id",function(d,i){
      return "hover-"+i.toString();
    })
    .on("mouseover",function(d,i){
        d3.selectAll("#hover-"+i.toString()).attr("visibility","visible");
    })
    .on("mouseout",function(d,i){
        d3.selectAll("#hover-"+i.toString()).attr("visibility","hidden");
    });



    var hover_text = svg.append("g").selectAll("circle.node")
    .data(force.nodes());



    hover_text.enter().append("text")
          .attr("fill", "white")
          .attr("visibility","hidden")
          .attr("id",function(d,i){
            return "hover-"+i.toString();
          })
          .on("mouseover",function(d,i){
              d3.selectAll("#hover-"+i.toString()).attr("visibility","visible");
          })
          .on("mouseout",function(d,i){
              d3.selectAll("#hover-"+i.toString()).attr("visibility","hidden");
          })
          .text(function(d){
              return d.name;
          });


    var hover_price = svg.append("g").selectAll("circle.node")
    .data(force.nodes());

    hover_price.enter().append("text")
          .attr("fill", "white")
          .attr("visibility","hidden")
          .attr("id",function(d,i){
            return "hover-"+i.toString();
          })
          .on("mouseover",function(d,i){
              d3.selectAll("#hover-"+i.toString()).attr("visibility","visible");
          })
          .on("mouseout",function(d,i){
              d3.selectAll("#hover-"+i.toString()).attr("visibility","hidden");
          })
          .text(function(d){
            return "$"+d.price;
          });

    var hover_cap = svg.append("g").selectAll("circle.node")
    .data(force.nodes());

          hover_cap.enter().append("text")
                .attr("fill", "white")
                .attr("visibility","hidden")
                .attr("id",function(d,i){
                  return "hover-"+i.toString();
                })
                .on("mouseover",function(d,i){
                    d3.selectAll("#hover-"+i.toString()).attr("visibility","visible");
                })
                .on("mouseout",function(d,i){
                    d3.selectAll("#hover-"+i.toString()).attr("visibility","hidden");
                })
                .text(function(d){
                  return "Market Cap:  $"+d.cap;
                });


    var hover_volume= svg.append("g").selectAll("circle.node")
    .data(force.nodes());

                      hover_volume.enter().append("text")
                            .attr("fill", "white")
                            .attr("visibility","hidden")
                            .attr("id",function(d,i){
                              return "hover-"+i.toString();
                            })
                            .on("mouseover",function(d,i){
                                d3.selectAll("#hover-"+i.toString()).attr("visibility","visible");
                            })
                            .on("mouseout",function(d,i){
                                d3.selectAll("#hover-"+i.toString()).attr("visibility","hidden");
                            })
                            .text(function(d){
                              return "Volume 24H:  $"+d.volume;
                            });





    // each node with coin/token's percentage
    var percentages1 = svg1.append("g").selectAll("circle.node")
    .data(force1.nodes())
    .enter().append("text")
    .attr("class", "label")
    .attr("id",function(d,i){
        return "label-" + i.toString();
    })
    .attr("fill","white")
    .text(function(d) {
        var n = parseFloat(d.percentage).toFixed(2);
        return n.toString() + "%" })
            .call(force.drag);

            force1.on("tick", function() {
                links1.attr("x1", function(d) { return d.source.x; })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });

             /*   nodes.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; }); */

                nodes1.attr("cx", function(d) {
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

                texts1.attr("x", function(d) { return d.x - 11; })
                .attr("y", function(d) { return d.y - 4; });


                percentages1.attr("x", function(d) { return d.x - 13; })
                .attr("y", function(d) { return d.y + 7; });

                });


                // each node with coin/token's percentage
                var percentages = svg.append("g").selectAll("circle.node")
                .data(force.nodes())
                .enter().append("text")
                .attr("class", "label")
                .attr("id",function(d,i){
                    return "label-" + i.toString();
                })
                .on("mouseover",function(d,i){
                    d3.selectAll("#hover-"+i.toString()).attr("visibility","visible");
                })
                .on("mouseout",function(d,i){
                    d3.selectAll("#hover-"+i.toString()).attr("visibility","hidden");
                })
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


                            hover_rect.attr("x", function(d) { return d.x - 11; })
                                .attr("y", function(d) { return d.y - 4; });

                            hover_text.attr("x", function(d) { return d.x +20; })
                                .attr("y", function(d) { return d.y + 25; });

                            hover_price.attr("x", function(d) { return d.x +20; })
                                    .attr("y", function(d) { return d.y + 45; });

                            hover_cap.attr("x", function(d) { return d.x + 20; })
                                    .attr("y", function(d) { return d.y +80; });

                            hover_volume.attr("x", function(d) { return d.x + 20; })
                                        .attr("y", function(d) { return d.y +100; });


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

        var link_tut = 300;


        setInterval(function(){
        //  alert("done");


          if(tutorial1_int==true)
          {

            force1.linkDistance(link_tut).start();

            if(link_tut == 300)
            {
              link_tut = 150;
            }else {

                link_tut = 300;


            }
          }
        }, 1500);


        var node_tut = 'rgb(220, 53, 69)';


                setInterval(function(){
                //  alert("done");
                //  alert(tutorial2_int)

                  if(tutorial2_int)
                  {
                  //  alert("Im here")

                    $("#circle1-1").css("fill",node_tut);

                    if(node_tut == 'rgb(220, 53, 69)')
                    {
                      node_tut = 'rgb(40, 167, 69)';
                    }else {

                      node_tut = 'rgb(220, 53, 69)';
                    }
                  }
                }, 1500);

                var link_bool = true;

                function tutorial3_run(){


                  if(tutorial3_int)
                  {  link_bool = !link_bool;
                      if(link_bool)
                      {

                        d3.select("#link1-0").classed("link",true);
                      }else {
                        d3.select("#link1-0").classed("link",false);
                      }

                  }

                }


                setInterval(tutorial3_run , 1500);








                function histogram_run()
                {
                  $('#histogram').css("display","unset");
                  $('.help-icon').css("z-indez","10000")
                  $(".tutorial-shade").css("display","initial");

                  $(".svg-con").css("z-index", -1);
                  console.log("HHH",histogram_array);
                  runHistogram();

                }



              var play_animation = function()
              {

                if(animation_counter < 28 && animation_bool && !animation_stop_bool)
                {
                    update_force(animation_counter.toString());
                    var temp = animation_counter + 1;

                    $('.animation-date').text(temp.toString()+" "+month+" 2018");

                     animation_counter = animation_counter + 1;

                     if(animation_counter == 27)
                     {
                        histogram_run();
                     }
                }

                if(animation_stop_bool)
                {
                    change_date();
                    animation_counter = 1;
                    animation_stop_bool = false;

                    $('.animation-date').text("1 "+month+" "+year);

                    histogram_run();
                }

              }

              if(!is_update)
              {
                  setInterval(play_animation,2000);
              }





       function update_force(index){

         d3.select("#cloud1").remove();

         console.log("JSON OBJ!", json_obj);
         console.log(json_obj[index].links);

         for(var i=0; i< json_obj[index].links.length; i++)
         {
            d3.select("#link-" + i.toString()).classed("link",false);

            var bool_btc = false;
            var bool_source = false;

            console.log(json_obj[index].links);

            if(json_obj[index].nodes[0].percentage > 0)
            {
                  bool_btc = true;
            }


            console.log("number", json_obj[index].links[i].source.group);

            var source_temp = [];

            if (typeof json_obj[index].links[i].source == "number")
            {
                  source_temp = json_obj[index].links[i].source;
            }else{
                  source_temp = json_obj[index].links[i].source.group;
            }

            console.log("Source_Temp", source_temp);

            if(json_obj[index].nodes[source_temp].percentage > 0)
            {
                  bool_source = true;
            }

            if(bool_btc == bool_source)
            {
                  console.log('true'+i,json_obj[index].links[i].source.percentage);
                  histogram_array[i+1].value = histogram_array[i+1].value + 1;
                  d3.select("#link-" + i.toString()).classed("link",true);

                  console.log("Histrogram ARR", histogram_array );
            }else{
                  d3.select("#link-" + i.toString()).classed("link",false);
            }
         }


          force
            .linkDistance(function(d,i){

              var bool_btc = false;
              var bool_source = false;

              if(json_obj[index].links[i].target.percentage > 0)
              {
                  bool_btc = true;
              }

              if(json_obj[index].links[i].source.percentage > 0)
              {
                  bool_source = true;
              }

              if(bool_btc == bool_source)
              {
                  return linkScale(json_obj[index].links[i].value);
              }else{
                  return 200 + linkScale(json_obj[index].links[i].value);
              }

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

            // Change radius of node
            d3.select("#circle-" + i.toString()).attr("r",radiusScale(Math.log(p_temp+1)));

            // Update First Nodes

            $("#label-" + i.toString()).text(json_obj[index].nodes[i].percentage.toFixed(2) + "%");

            // Change text of node
            //d3.select("#label-" + i.toString()).text(json_obj[index].nodes[i].percentage.toFixed(2) + "%");
          }

          // Update and Transition Links
          for (var i=0; i< json_obj[index].nodes.length; i++)
          {

            console.log("name", json_obj[index].links[i] )
            if(json_obj[index].nodes[i].name == "BTC")
            {


                d3.select("#circle-"+i.toString()).attr("class","class-blue");

                //$("#circle-"+i.toString()).css("fill","#0069d9");
            }else
            {
                if(json_obj[index].nodes[i].percentage > 0)
                {
                     d3.select("#circle-"+i.toString()).attr("class","class-green");
                    //  $("#circle-"+i.toString()).css("fill","#0069d9");
                }
                else{;
                     d3.select("#circle-"+i.toString()).attr("class","class-red");
                    //  $("#circle-"+i.toString()).css("fill","#0069d9");
                }
            }
          }
        };





        function runHistogram()
        {

          histogram_array.shift();
          console.log("inserted", histogram_array)
          var margin = {top: 20, right: 30, bottom: 30, left: 40},
          h_width = 450 - margin.left - margin.right,
          h_height = 500 - margin.top - margin.bottom;

          var x = d3.scale.ordinal()
              .rangeRoundBands([0, h_width], .1);

          var y = d3.scale.linear()
              .range([h_height, 0]);

          var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom");

          var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left");

          var chart = d3.select(".chart")
              .attr("width", h_width + margin.left + margin.right)
              .attr("height", h_height + margin.top + margin.bottom)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


          x.domain(["IOTA","XRP","ETH","LTC","NEO","OMG","WAVES","STRAT","QTUM","BCC","DASH"]);
          y.domain([0, d3.max(histogram_array, function(d) { return d.value; })]);

          chart.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + h_height + ")")
              .call(xAxis);

          chart.append("g")
              .attr("class", "y axis")
              .call(yAxis);

          chart.selectAll(".bar")
              .data(histogram_array)
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d,i) { return x(["IOTA","XRP","ETH","LTC","NEO","OMG","WAVES","STRAT","QTUM","BCC","DASH"][i]); })
              .attr("y", function(d) { return y(d.value); })
              .attr("height", function(d) {return h_height - y(d.value); })
              .attr("width", x.rangeBand());



          function type(d) {
            d.value = +d.value; // coerce to number
            return d;
          }

        }




}
