/** 
 * File in /stimuli/js has recent updates and was used for the purposes of the study.
 * Results of this file may differ. 
 * 
 * This file contains the JS environment for creating English timelines.
 *
 * Creates timelines in both Left-Right and Right-Left directions.
 *
 * Uses variables defined in global.js.
 */

/**
 * Function to create the SVG element with the provided title
 *
 * @param {string} containerId the HTML element where the timeline should render
 * @param {string} title the title for the timeline, ex. "English Left- Right"
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
 * @param {Array} domain the domain for the time scale; extent of dates
 * @param {Array} range the range for the time scale; available width of the timeline
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
function createXAxis(xScale, data) {
  const engTimeFormat = d3.timeFormat("\n%b %e \n%-I%p");
  return d3
    .axisBottom(xScale)
    .tickFormat(engTimeFormat)
    .tickValues(data.map((d) => d.date));
}

/**
 * This function calls the renderVis() function in global.js to render the timeline,
 * according to the language environment scales and axis.
 *
 * @param {string} filename the filepath for the input data csv
 * @param {string} dom_element the HTML element where the timeline should render
 * @param {string} title the title of the timeline
 */
function callRenderEng(filename, dom_element, title, flag = false) {
  d3.csv(filename).then((_data) => {
    data = _data; //local copy of data

    //data handling
    data.forEach((d) => {
      d.date = parseDate(d.date);
    });

    data.sort((a, b) => a.date - b.date);

    const svgE = createSVG(dom_element, title);
    const xScaleE = createXScale(
      d3.extent(data, (d) => d.date), 
      (flag ? [width - margin.right, margin.left] : [margin.left, width - margin.right])
    );
    const xAxisE = createXAxis(xScaleE, data);
    renderVis(svgE, xScaleE, xAxisE, data, "en");
  });
}

// english timelines rendered by calls below:
callRenderEng(
  "/timeline-creation/data/economics.csv",
  "#timelineELR",
  "English L-R"
);

callRenderEng(
  "/timeline-creation/data/economics.csv",
  "#timelineERL",
  "English R-L", 
  true
);
