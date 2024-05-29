/** This file contains the JS environment for creating Urdu timelines.
 *
 * Creates timelines in both Left-Right and Right-Left directions.
 *
 * Contains a customised Urdu date & time Locale for date translations to Urdu.
 *
 * Uses variables defined in global.js.
 */

// input data for timeline(s)
const data_urdu = [
  {
    date: "2024-04-03 09:00:00",
    event: "محلہ پارٹی",
  },
  {
    date: "2024-05-15 14:00:00",
    event: "کمیونٹی میٹنگ",
  },
  {
    date: "2024-05-30 10:00:00",
    event: "بازار",
  },
  {
    date: "2024-04-17 16:00:00",
    event: "ضلعی مرکز کا افتتاح",
  },
];

// parsing dates
data_urdu.forEach((d) => {
  d.date = parseDate(d.date);
});

// Defining Urdu locale for date and time formatting
const urduLocale = {
  dateTime: "%A, %e %B %Y, %X",
  date: "%d/%m/%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: ["اتوار", "پیر", "منگل", "بدھ", "جمعرات", "جمعہ", "ہفتہ"],
  shortDays: ["اتوار", "پیر", "منگل", "بدھ", "جمعرات", "جمعہ", "ہفتہ"],
  months: [
    "جنوری",
    "فروری",
    "مارچ",
    "اپریل",
    "مئی",
    "جون",
    "جولائی",
    "اگست",
    "ستمبر",
    "اکتوبر",
    "نومبر",
    "دسمبر",
  ],
  shortMonths: [
    "جنوری",
    "فروری",
    "مارچ",
    "اپریل",
    "مئی",
    "جون",
    "جولائی",
    "اگست",
    "ستمبر",
    "اکتوبر",
    "نومبر",
    "دسمبر",
  ],
};

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
  // using the Urdu locale
  d3.timeFormatDefaultLocale(urduLocale);

  // Custom URDU time format function for AM/PM display
  const urduTimeFormat = d3.timeFormat("%I %p"); // e.g., "9am" or "2pm"

  return d3
    .axisBottom(xScale)
    .tickFormat((d) => {
      const dateFormat = d3.timeFormat("%e %B");
      const formattedDate = dateFormat(d);
      const formattedTime = urduTimeFormat(d);
      return `${formattedDate}\n ${formattedTime}`;
    })

    .tickValues(data_urdu.map((d) => d.date));
}

// function call to create the timeline (Urdu L-R)
const svgUrduLR = createSVG("#timelineULR", "Urdu L-R");
const xScaleUrduLR = createXScale(
  d3.extent(data_urdu, (d) => d.date),
  [margin.left, width - margin.right]
);
const xAxisUrduLR = createXAxis(xScaleUrduLR);
renderVis(svgUrduLR, xScaleUrduLR, xAxisUrduLR, data_urdu);

// function call to create the timeline (Urdu R-L)
const svgUrduRL = createSVG("#timelineURL", "Urdu R-L");
const xScaleUrduRL = createXScale(
  d3.extent(data_urdu, (d) => d.date),
  [width - margin.right, margin.left]
);
const xAxisUrduRL = createXAxis(xScaleUrduRL);
renderVis(svgUrduRL, xScaleUrduRL, xAxisUrduRL, data_urdu);
