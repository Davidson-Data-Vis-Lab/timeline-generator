/** This file contains the JS environment for creating English timelines.
 *
 * Creates timelines in both Left-Right and Right-Left directions.
 *
 * Uses variables defined in global.js.
 */

// Input data for timeline(s)
const data_eng = [
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
data_eng.forEach((d) => {
  d.date = parseDate(d.date);
});

/**
 * Function to create the SVG element with the provided title
 * 
 * @param {string} containerId 
 * @param {string} title 
 * @returns {d3.Selection}  an SVG element
 */
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
 
/**
 * Function to set up the x scale (time scale)
 * 
 * @param {Array} domain 
 * @param {Array} range 
 * @returns {d3.ScaleTime<number, number>} A D3 time scale object (the x-scale to be used for the vis)
 */
function createXScale(domain, range) {
  return d3.scaleTime().domain(domain).range(range);
}

/**
 * Function to set up the x axis (horizontal axis)
 * 
 * @param {d3.ScaleTime<number, number>} xScale - A D3 time scale object
 * @returns {d3.Axis<number>} the x-axis to be used in the vis
 */
function createXAxis(xScale) {
  const engTimeFormat = d3.timeFormat("%A, %B %e \n%-I%p");
  return d3
    .axisBottom(xScale)
    .tickFormat(engTimeFormat)
    .tickValues(data_eng.map((d) => d.date));
}

// funcation call to create the timeline (English L-R)
const svgEngLR = createSVG("#timelineELR", "English L-R");
const xScaleEngLR = createXScale(
  d3.extent(data_eng, (d) => d.date),
  [margin.left, width - margin.right]
);
const xAxisEngLR = createXAxis(xScaleEngLR);
renderVis(svgEngLR, xScaleEngLR, xAxisEngLR, data_eng);

// function call to create the timeline (English R-L)
const svgEngRL = createSVG("#timelineERL", "English R-L");
const xScaleEngRL = createXScale(
  d3.extent(data_eng, (d) => d.date),
  [width - margin.right, margin.left]
);
const xAxisEngRL = createXAxis(xScaleEngRL);
renderVis(svgEngRL, xScaleEngRL, xAxisEngRL, data_eng);
