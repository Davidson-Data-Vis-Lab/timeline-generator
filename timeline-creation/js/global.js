  /** This file contains global JS objects that are used by both timeline environments. */

  // Parsing date strings into JavaScript Date objects
  const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
  
  // Setting up dimensions and margins for all SVGs
  const width = 1000;
  const height = 200;
  const margin = { top: 20, right: 50, bottom: 40, left: 100 };