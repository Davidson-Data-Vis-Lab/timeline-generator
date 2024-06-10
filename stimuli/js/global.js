/** This file contains global JS objects and functionality that are used by both timeline environments. */

// Parsing date strings into JavaScript Date objects
const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");

// Setting up dimensions and margins for all horizontal SVGs
const width = 1500;
const height = 200;
const margin = { top: 20, right: 90, bottom: 60, left: 120 };

// Setting up dimensions and margins for all vertical SVGs
const widthV = 300;
const heightV = 650; // compressed so that its not too long 
const marginV = { top: 20, right: 90, bottom: 60, left: 120 };

/**
 * Function that renders the vis (timeline) for both language environments.
 *
 * @param {d3.Selection} svg
 * @param {d3.ScaleTime<number, number>} xScale - xScale to use according to language
 * @param {d3.Axis<number>} xAxis - xAxis to use according to language
 * @param {string} lang - the language of the timeline (needed for lineHeight)
 * @param {Object} data - English or Urdu data
 */
function renderVis(svg, xScale, xAxis, data, lang) {
  // Add the x-axis to the SVG
  svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .attr("class", "urdu-content") // also applies to English. Can be changed.
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
    .attr("y2", (d, i) => (i % 2 === 0 ? height / 2 : height / 2 + 30)) // Adjust y2 based on index
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
    .attr("cy", (d, i) => (i % 2 === 0 ? height / 2 : height / 2 + 30)) // Adjust cy based on index
    .attr("r", 3);

  // Add labels for each event
  eventGroup
    .selectAll(".event-label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "event-label")
    .attr("x", (d) => xScale(d.date))
    .attr("y", (d, i) =>
      lang === "en"
        ? i % 2 === 0
          ? height / 2 - 20
          : height / 2 + 10
        : i % 2 === 0
        ? height / 2 - 30
        : height / 2
    ) // Adjust y based on index
    .attr("text-anchor", "middle")
    .each(function (d) {
      const el = d3.select(this);
      const words = d.event.split(" ");
      let line = [];
      let lineNumber = 0;

      const lineHeight = lang === "en" ? 1 : 1.6; //em
      const maxWidth = 100; // Adjust max width as needed
      let tspan = el
        .append("tspan")
        .attr("x", xScale(d.date))
        .attr("dy", "0em");
      words.forEach((word) => {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > maxWidth) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = el
            .append("tspan")
            .attr("x", xScale(d.date))
            .attr("dy", ++lineNumber * lineHeight + "em")
            .text(word);
        }
      });
    });
}

/**
 * Function that renders the vis (timeline) for both language environments.
 *
 * @param {d3.Selection} svg
 * @param {d3.ScaleTime<number, number>} yScale - yScale to use according to language
 * @param {d3.Axis<number>} yAxis - yAxis to use according to language
 * @param {Object} data - English or Urdu data
 */
/**
 * Function that renders the vis (timeline) for both language environments.
 *
 * @param {d3.Selection} svg
 * @param {d3.ScaleTime<number, number>} yScale - yScale to use according to language
 * @param {d3.Axis<number>} yAxis - yAxis to use according to language
 * @param {Object} data - English or Urdu data
 */
function renderVisTB(svg, yScale, yAxis, data, lang) {
  // Add the y-axis to the SVG
  svg
    .append("g")
    .attr("transform", `translate(${marginV.left}, 0)`)
    .attr("class", "urdu-content") // also applies to English. Can be changed.
    .call(yAxis)
    .selectAll(".tick text")
    .each(function () {
      const el = d3.select(this);
      const lines = el.text().split("\n");
      el.text("");
      for (let i = 0; i < lines.length; i++) {
        el.append("tspan").attr("x", -10).attr("dy", "0.3em").text(lines[i]);
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
    .attr("x1", marginV.left - 4) // Adjust x1 to ensure space
    .attr("x2", widthV / 2 + 45) // Adjust x2 based on index and language
    .attr("y1", (d) => yScale(d.date))
    .attr("y2", (d) => yScale(d.date))
    .attr("stroke", "black")
    .attr("stroke-width", 1);

  // Add the events to the timeline
  eventGroup
    .selectAll(".event")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "event")
    .attr("cx", widthV / 2 + 45) // Adjust cx based on index and language
    .attr("cy", (d) => yScale(d.date))
    .attr("r", 3);

  // Add labels for each event
  eventGroup
    .selectAll(".event-label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "event-label")
    .attr("x", widthV / 2 +  70) // Adjust x based on index and language
    .attr("y", (d) => yScale(d.date))
    .attr("text-anchor", "middle") // Use "start" for LTR and "end" for RTL
    .attr("dir", lang === "ur" ? "rtl" : "ltr")
    .each(function (d, i) {
      const el = d3.select(this);
      const words = d.event.split(" ");
      let line = [];
      let lineNumber = 0;

      const lineHeight = lang === "en" ? 1 : 1.6; //em
      const maxwidthV = 100; // Adjust max width as needed
      let tspan = el
        .append("tspan")
        .attr("x", widthV / 2 + 100) // Adjust x based on index and language
        .attr("dy", "0em");
      words.forEach((word) => {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > maxwidthV) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = el
            .append("tspan")
            .attr("x", widthV / 2 + 100) // Adjust x based on index and language
            .attr("dy", ++lineNumber * lineHeight + "em")
            .text(word);
        }
      });
    });
}
