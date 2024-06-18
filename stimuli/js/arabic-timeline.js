/** This file contains the JS environment for creating Arabic timelines.
 *
 * Creates timelines in Left-Right, Right-Left and Top-Bottom directions.
 *
 * Contains a customised Arabic date & time Locale for date translations to Arabic.
 *
 * Uses variables defined in global.js.
 */

// Defining Arabic locale for date and time formatting
const arabicLocale = {
    dateTime: "%A, %e %B %Y, %X",
    date: "%d/%m/%Y",
    time: "%H:%M:%S", 
  
    periods: ["صباحاً", "مساءاً"], //time periods
    days: ["أحد", "اثنين", "ثلاثاء", "اربعاء", "خميس", "جمعة", "سبت"], //days of the week
  
    shortDays: ["أحد", "اثنين", "ثلاثاء", "اربعاء", "خميس", "جمعة", "سبت"], //abbreviations of days of the week
  
    months: [
      "كانون الثاني",
      "شباط",
      "آذار",
      "نيسان",
      "أيار",
      "حزيران",
      "تموز",
      "آب",
      "أيلول",
      "تشرين الأول",
      "تشرين الثاني",
      "كانون الأول",
    ],
  //abbreviations of months
    shortMonths: [
       "كانون الثاني",
      "شباط",
      "آذار",
      "نيسان",
      "أيار",
      "حزيران",
      "تموز",
      "آب",
      "أيلول",
      "تشرين الأول",
      "تشرين الثاني",
      "كانون الأول",
  
    ],
  };
  
  
  /**
   * Function to create the SVG element with the provided title
   *
   * @param {String} containerId the HTML element where the timeline should render
   * @param {String} title the title for the timeline, ex. "English Left- Right"
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
  
  function createSVGTB(containerId, title) {
    const svg = d3
      .select(containerId)
      .append("svg")
      .attr("width", widthV + marginV.left + marginV.right)
      .attr("height", heightV)
      .append("g")
      .attr("transform", `translate(${marginV.left}, 0)`);
  
    svg
      .append("text")
      .attr("x", widthV / 2)
      .attr("y", marginV.top / 2)
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
    // using the arabic locale
    d3.timeFormatDefaultLocale(arabicLocale);
  
    // Custom arabic time format function for AM/PM display
    //const arabicTimeFormat = d3.timeFormat("%I %p"); // e.g., "9am" or "2pm"
  
    return d3
      .axisBottom(xScale)
      .tickFormat((d) => {
        const dateFormat = d3.timeFormat("%e %B \n %Y");
        const formattedDate = dateFormat(d);
        //const formattedTime = arabicTimeFormat(d);
        return `${formattedDate}\n`; //${formattedTime}`
      })
  
      .tickValues(data.map((d) => d.date));
  }
  
  function createYScale(domain, range) {
    return d3.scaleTime().domain(domain).range(range);
  }
  
  /**
   * Function to set up the y axis (vertical axis)
   *
   * @param {d3.ScaleTime<number, number>} yScale - A D3 time scale object
   * @returns {d3.Axis<number>} the y-axis to be used in the vis
   */
  function createYAxis(yScale, data) {
    // using the arabic locale
    d3.timeFormatDefaultLocale(arabicLocale);
  
    // Custom arabic time format function for AM/PM display
    //const arabicTimeFormat = d3.timeFormat("%I %p"); // e.g., "9am" or "2pm"
  
    return d3
      .axisLeft(yScale)
      .tickFormat((d) => {
        const dateFormat = d3.timeFormat("%Y ،%e %B");
        const formattedDate = dateFormat(d);
        //const formattedTime = arabicTimeFormat(d);
        return `${formattedDate}\n`; //${formattedTime}`
      })
  
      .tickValues(data.map((d) => d.date));
  }
  
  /**
   * This function calls the renderVis() function in global.js to render the timeline,
   * according to the language environment scales, orientation and axis.
   *
   * @param {String} filename the filepath for the input data csv
   * @param {String} dom_element the HTML element where the timeline should render
   * @param {String} title the title of the timeline
   * @param {String} orient the orientation of the timeline: "RL", "LR" or "TB"
   */
  function callRenderArb(filename, dom_element, title, orient) {
    d3.csv(filename).then((_data) => {
      data = _data; //local copy of data
  
      //data handling
      data.forEach((d) => {
        d.date = parseDate(d.date);
      });
  
      data.sort((a, b) => a.date - b.date);
  
      if (orient === "RL" || orient === "LR") {
        //if a horizontal timeline
        const svgU = createSVG(dom_element, title);
        const xScaleU = createXScale(
          d3.extent(data, (d) => d.date),
          orient === "RL"
            ? [width - margin.right, margin.left]
            : [margin.left, width - margin.right]
        );
        const xAxisU = createXAxis(xScaleU, data);
        renderVis(svgU, xScaleU, xAxisU, data, "ar");
      } else {
        //if a vertical timeline orient==="TB"
        const svgUTB = createSVGTB(dom_element, title);
        const yScaleU = createYScale(
          d3.extent(data, (d) => d.date),
          [ marginV.top, heightV - marginV.bottom]
        );
        const yAxisU = createYAxis(yScaleU, data);
        renderVisTB(svgUTB, yScaleU, yAxisU, data, "ar");
      }
    });
  }
  