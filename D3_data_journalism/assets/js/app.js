// @TODO: YOUR CODE HERE!
// Function for resize of window
function makeResponsive() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // svg params
  var svgWidth = 1100;
  var svgHeight = 600;
  
    // Margin 
    const margin = {
      top: 50,
      bottom: 100,
      right: 30,
      left: 50
    };

    // chart area minus margins
    var chartHeight = svgHeight - margin.top - margin.bottom;
    var chartWidth = svgWidth - margin.left - margin.right;

    // create svg container
    var svg = d3.select("#scatter").append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);
  
    // Append chart group element
    const chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
    // Read CSV 
        d3.csv("./assets/data/data.csv").then(function(data) {
                
        // parse data
        data.forEach(function(data) {
          data.poverty = +data.poverty;
          data.healthcare = +data.healthcare;
          data.age = +data.age;
          data.income = +data.income;
          data.obesity = +data.obesity;
          data.smokes = +data.smokes;
        });

        // data variables of the scatter plot

        const xScale = d3.scaleLinear()
            .domain([8,d3.max(data, d => d.poverty)+2])
            .range([0, chartWidth]);
  
        const yScale = d3.scaleLinear()
            .domain([2,d3.max(data, d => d.healthcare)+2])
            .range([chartHeight, 0]);
  
        // create Axes
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);
       
  
        // scatter plot with circles
  
        // append Circles
        const circlesGroup = chartGroup.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.poverty))
            .attr("cy", d => yScale(d.healthcare))
            .attr("r", "15")
            .attr("opacity", ".5")
            .attr('class', 'stateCircle');
            
        
        // show state abbreviations
          const circleText = chartGroup.selectAll("text")
          .data(data)
          .enter()
          .append("text")
          .text( d => (d.abbr))
          .attr("x", d => xScale(d.poverty))
          .attr("y", d => yScale(d.healthcare))
          .attr('class', 'stateText');
          
          
 
        // Tooltip
        const toolTip = d3.tip()
                          .offset([70, -80])
                          .html(d =>`<strong>${d.state}</strong><br><hr>Poverty: ${d.poverty}%<br> Healthcare: ${d.healthcare}%`)
                          .attr('class', 'd3-tip'); 

        

        // append Axes
        chartGroup.append("g")
          .attr("transform", `translate(0, ${chartHeight})`)
          .call(xAxis);
  
        chartGroup.append("g")
          .call(yAxis);

        // Create x and y axes labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left )
            .attr("x", 0 - (chartHeight / 2))
            .attr("dy", "1em")
            .attr("class", "aText")
            .text("Lacks Healthcare (%)");

        chartGroup.append("text")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 30})`)
            .attr("class", "aText")
            .text("In Poverty (%)");

        // Create the tooltip
        chartGroup.call(toolTip);
        // Create event listeners to display and hide the tooltip
        circlesGroup.on('mouseover', function(d){
            toolTip.show(d, this)
        });
        
        circlesGroup.on('mouseout', function(d){
            toolTip.hide(d)
        });

      })
        .catch(function(error) {
            console.log(error);
      });
    }
    // Initial browser load, makeResponsive() is called.
    makeResponsive();
    
    // Browser window is resized, makeResponsive() is called.
    d3.select(window).on("resize", makeResponsive);
  