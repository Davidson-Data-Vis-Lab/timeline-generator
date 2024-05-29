/** This file contains global JS objects and functionality that are used by both timeline environments. */

// Parsing date strings into JavaScript Date objects
const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");

// Setting up dimensions and margins for all SVGs
const width = 1000;
const height = 200;
const margin = { top: 20, right: 50, bottom: 40, left: 100 };

/**
 * Function that renders the vis (timeline) for both language environments. 
 * 
 * @param {d3.Selection} svg 
 * @param {d3.ScaleTime<number, number>} xScale - xScale to use according to language
 * @param {d3.Axis<number>} xAxis - xAxis to use according to language
 * @param {Object} data - English or Urdu data
 */
function renderVis(svg, xScale, xAxis, data) {
  // Add the x-axis to the SVG
  svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis)
    .selectAll(".tick text")
    .each(function () {
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
    .attr("x1", (d) => xScale(d.date))
    .attr("x2", (d) => xScale(d.date))
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
    .attr("cx", (d) => xScale(d.date))
    .attr("cy", height / 2)
    .attr("r", 5);

  // Add labels for each event
  eventGroup
    .selectAll(".event-label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "event-label")
    .attr("x", (d) => xScale(d.date))
    .attr("y", height / 2 - 20)
    .attr("text-anchor", "middle")
    .text((d) => d.event);
}
