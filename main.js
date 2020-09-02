function viz() {
    var width = 600, height = 120;

    var svg = d3.select(".viz")

    var parseYear = d3.timeParse("%Y");

    d3.queue()
      .defer(d3.csv,"data/cleanData.csv",parseData)
      .await(ready);

    
    function ready(error, data) {
        if (error) throw error;
        

        var nest = d3.nest()
                     .key(d=>d.Country)
                     .entries(data)

        var x = d3.scaleBand()
                  .domain(data.map(d=>d.Year))
                  .range([0,width-35])
                  .paddingInner([0.1])

        var x1 = d3.scaleBand()
                   .domain(data.map(d=>d["Beverage Types"]))
                   .range([0, x.bandwidth()])
            
        var y = d3.scaleLinear()
                  .domain([0,20])
                  .range([height,25]);

        var color = d3.scaleOrdinal()
                      .domain(data.map(d=>d["Beverage Types"]))
                      .range(["#8da0cb","#ffd92f","#66c2a5","#fc8d62","#e5c494"])

                
        var multiple = svg.selectAll("multiples")
                          .data(nest)
                          .enter()
                          .append("svg")
                          .attr("transform","translate(0,0)")
                          .attr("width", width)
                          .attr("height", height)
                          .append("g")
                          .attr("transform","translate(25,-20)")

            multiple.append("g")
               .attr("transform","translate(0,"+(height)+")")
               .attr("class","axis-x")
               .call(d3.axisBottom(x)
                       .ticks(3)
                       .tickFormat(d3.timeFormat("%Y")));

            multiple.append("g")
                    .attr("class","axis-y")
               .call(d3.axisLeft(y)
                       .ticks(5));

            multiple.append("g")
                    .append("text")
                    .attr("class", "country")
                    .attr("x", width/2)
                    .attr("y","34px")
                    .attr("text-anchor","middle")
                    .attr("font-size","15px")
                    .text(d=>d.key)

            var bars = multiple.selectAll("bar")
                    .data(d=>d.values)
                    .enter()
                    .append("g")
                    .attr("transform",d=> "translate("+x(d.Year)+",0)")
                    .append("rect")
                    .attr("class", "bar")
                    .attr("x",d=>x1(d["Beverage Types"]))
                    .attr("y",d=>y(d.value))
                    .attr("width",x1.bandwidth())
                    .attr("height",d=>height-y(d.value))
                    .attr("fill",d=>color(d["Beverage Types"]))

            console.log(bars)

            var legend = d3.select(".legend");

            var legendScale = d3.scaleOrdinal()
                                        .domain(["All", "Beer", "Wine", "Spirits", "Other"])
                                        .range(["#8da0cb","#ffd92f","#66c2a5","#fc8d62","#e5c494"])

                              legend.append("svg")
                                    .attr("width", "95px")
                                    .attr("height","185px")
                                    .append("g")
                                    .attr("class", "legendOrdinal")
                                    .attr("transform", "translate(5,15)");

            var legendOrdinal = d3.legendColor()
                                          .title("Per capita pure alcohol consumption in litres")
                                          .titleWidth(85)
                                          .shapeWidth(10)
                                          .shapeHeight(10)
                                          .shapePadding(5)
                                          .scale(legendScale);

                        legend.select(".legendOrdinal")
                              .call(legendOrdinal);
                    
    }

    function parseData(d) {
        d.Country = d.Country;
        d["Beverage Types"] = d["Beverage Types"];
        d.Year = parseYear(d.Year);
        d.value = parseFloat(d.value);
        return d
    }

    

}