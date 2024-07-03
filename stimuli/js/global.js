/** This file contains global JS objects and functionality that are used by both timeline environments.
 *
 * Contains two functions to create horizontal and vertical timelines respectively.
 *
 * Functions defined here are called from language timeline environments, NOT from the webpage scripts.
 */

// Parsing date strings into JavaScript Date objects
const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");

// Setting up dimensions and margins for all HORIZONTAL SVGs
const width = 1500;
const height = 220;
const margin = { top: 20, right: 90, bottom: 60, left: 120 };

// Setting up dimensions and margins for all VERTICAL SVGs
const widthV = 300;
const heightV = 650; // compressed so that its not too long
const marginV = { top: 20, right: 90, bottom: 60, left: 120 };

/**
 * Function that renders the horizontal vis (timelines) for both language environments.
 *
 * @param {d3.Selection} svg
 * @param {d3.ScaleTime<number, number>} xScale - xScale to use according to language
 * @param {d3.Axis<number>} xAxis - xAxis to use according to language
 * @param {String} lang - the language of the timeline (needed for lineHeight)
 * @param {Object} data - English or Urdu data
 */
function renderVis(svg, xScale, xAxis, data, lang) {
  // Add the x-axis to the SVG
  svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .attr(
      "class",
      lang === "ur" ? "urdu-content" : lang === "ar" ? "arb-content" : "eng"
    )
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
    .attr("r", 2.25);

  // Add labels for each event
  eventGroup
    .selectAll(".event-label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "event-label")
    .attr("x", (d) => xScale(d.date))
    .attr("y", (d, i) =>
      lang === "en" || lang === "ar"
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

      const lineHeight = lang === "en" || lang === "ar" ? 1 : 1.6; //em
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
 * Function that renders the vertical vis (timelines) for both language environments.
 *
 * @param {d3.Selection} svg
 * @param {d3.ScaleTime<number, number>} yScale - yScale to use according to language
 * @param {d3.Axis<number>} yAxis - yAxis to use according to language
 * @param {Object} data - English or Urdu data
 * @param {String} lang - the language of the timeline
 */
function renderVisTB(svg, yScale, yAxis, data, lang) {
  const padding = 30; //for spacing purposes; used for top padding in this case

  // Add the y-axis to the SVG
  svg
    .append("g")
    .attr("transform", `translate(${marginV.left}, ${padding})`)
    .attr("class", lang === "ur" ? "urdu-content" : "arb")
    .call(yAxis)
    .selectAll(".tick text")
    .each(function () {
      const el = d3.select(this);
      const lines = el.text().split("\n");
      el.text("");
      for (let i = 0; i < lines.length; i++) {
        el.append("tspan").attr("x", (lang==="en" ? -10:15)).attr("dy", "0.3em").text(lines[i]);
      }
    });
  30;
  const eventGroup = svg
    .append("g")
    .attr("class", "events")
    .attr("transform", `translate(0, ${padding})`);

  // Add lines connecting the timeline to the event dots
  eventGroup
    .selectAll(".event-line")
    .data(data)
    .enter()
    .append("line")
    .attr("class", "event-line")
    .attr("x1", (lang==="en" ? marginV.left - 4 : marginV.left))
    .attr("x2", (lang==="en" ? widthV/2+45 : 50))
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
    .attr("cx", (lang==="en" ? widthV/2+45 : 50))
    .attr("cy", (d) => yScale(d.date))
    .attr("r", 2.25);

  // Add labels for each event
  eventGroup
    .selectAll(".event-label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "event-label")
    .attr("x", widthV / 2 + 70)
    .attr("y", (d) => yScale(d.date))
    .attr("text-anchor", "middle")
    .attr("dir", lang === "ur" || lang === "ar" ? "rtl" : "ltr")
    .each(function (d, i) {
      const el = d3.select(this);
      const words = d.event.split(" ");
      let line = [];
      let lineNumber = 0;

      const lineHeight = lang === "en" ? 1 : 1.6; //em
      const maxwidthV = lang === "ar" ? 150 : 100; // Adjust max width as needed
      let tspan = el
        .append("tspan")
        .attr("x", (lang==="en" ? widthV/2 + 100 : 0))
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
            .attr("x", (lang==="en" ? widthV/2 + 100 : 0))
            .attr("dy", ++lineNumber * lineHeight + "em")
            .text(word);
        }
      });
    });
}
