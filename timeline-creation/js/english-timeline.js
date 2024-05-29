/** This file contains the JS environment for creating English timelines. 
 *  
 * Creates timelines in both Left-Right and Right-Left directions.
 * 
 * Uses variables defined in global.js.
 */

// Input data for timeline(s)
const data = [
  {
    date: "2024-04-03 09:00:00",
    event: "Block party",
  },
  {
    date: "2024-05-15 14:00:00",
    event: "Community meeting",
  },
  {
    date: "2024-04-17 16:00:00",
    event: "Town Hall opening",
  },
  {
    date: "2024-05-30 10:00:00",
    event: "Farmers Market",
  },
];

//parsing dates 
data.forEach(d => {
  d.date = parseDate(d.date);
});

// Function to create the SVG element with a title
function createSVG(containerId, title) {
  const svg = d3
    .select(containerId)
    .append("svg")
    .attr("width", width)
    .attr("height", height + margin.top)
    .append("g")
    .attr("transform", `translate(0, ${margin.top})`);

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", margin.top)
    .attr("text-anchor", "middle")
    .text(title);

  return svg;
}

// Function to set up the x scale (time scale)
function createXScale(domain, range) {
  return d3.scaleTime().domain(domain).range(range);
}

// Function to set up the x-axis with a custom date format
function createXAxis(xScale) {
  const engTimeFormat = d3.timeFormat("%A, %B %e \n%-I%p");
  return d3.axisBottom(xScale).tickFormat(engTimeFormat).tickValues(data.map(d => d.date));
}

// Function to render the visualization
function renderVis(svg, xScale) {
  const xAxis = createXAxis(xScale);
  
  // Add the x-axis to the SVG
  svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis)
    .selectAll(".tick text")
    .each(function() {
      const el = d3.select(this);
      const lines = el.text().split("\n");
      el.text("");
      for (let i = 0; i < lines.length; i++) {
        el.append("tspan")
          .attr("x", 0)
          .attr("dy", i === 0 ? "1em" : "1.3em")
          .text(lines[i]);
      }
    });

  const eventGroup = svg.append("g").attr("class", "events");

  // Add lines connecting the timeline to the event dots
  eventGroup
    .selectAll(".event-line")
    .data(data)
    .enter()
    .append("line")
    .attr("class", "event-line")
    .attr("x1", d => xScale(d.date))
    .attr("x2", d => xScale(d.date))
    .attr("y1", height - margin.bottom)
    .attr("y2", height / 2)
    .attr("stroke", "black")
    .attr("stroke-width", 1);

  // Add the events to the timeline
  eventGroup
    .selectAll(".event")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "event")
    .attr("cx", d => xScale(d.date))
    .attr("cy", height / 2)
    .attr("r", 5);

  // Add labels for each event
  eventGroup
    .selectAll(".event-label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "event-label")
    .attr("x", d => xScale(d.date))
    .attr("y", height / 2 - 20)
    .attr("text-anchor", "middle")
    .text(d => d.event);
}

// funcation call to create the timeline (English L-R)
const svgEngLR = createSVG("#timelineELR", "English L-R");
const xScaleEngLR = createXScale(d3.extent(data, d => d.date), [margin.left, width - margin.right]);
renderVis(svgEngLR, xScaleEngLR);

// function call to create the timeline (English R-L)
const svgEngRL = createSVG("#timelineERL", "English R-L");
const xScaleEngRL = createXScale(d3.extent(data, d => d.date), [width - margin.right, margin.left]);
renderVis(svgEngRL, xScaleEngRL);