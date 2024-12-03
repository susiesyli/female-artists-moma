const width = 1000;
const height = 500;

const svg = d3.select(".map")
  .append("svg")
  .attr("viewBox", `0 0 ${width} ${height}`);

// Better projection for world map
const projection = d3.geoNaturalEarth1()
  .scale(170)
  .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

Promise.all([
  d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"),
  d3.csv("female_artists_with_work_counts.csv")
]).then(([worldData, momaData]) => {
  const data = momaData
    .filter(d => coordinatesMap[d.Nationality])
    .map(d => ({
      artist: d.DisplayName,
      nationality: d.Nationality,
      year: +d.BeginDate,
      coordinates: projection([
        coordinatesMap[d.Nationality][1], 
        coordinatesMap[d.Nationality][0]
      ])
    }));

  // Background
  svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "#111");

  // Map
  // After SVG creation, add background
svg.append("rect")
.attr("width", width)
.attr("height", height)
.attr("fill", "#000");

// Update map colors
svg.append("g")
.selectAll("path")
.data(topojson.feature(worldData, worldData.objects.countries).features)
.join("path")
.attr("d", path)
.attr("fill", "#1a1a1a")
.attr("stroke", "#333")
.attr("stroke-width", 0.5);

// Make points brighter and larger
const points = svg.append("g")
.selectAll("circle")
.data(data)
.join("circle")
.attr("class", "point")
.attr("cx", d => d.coordinates[0] + (Math.random() - 0.5) * 10)
.attr("cy", d => d.coordinates[1] + (Math.random() - 0.5) * 10)
.attr("r", 3)
.attr("fill", "#ff1493")
.style("opacity", 0)
.attr("stroke", "#ff69b4")
.attr("stroke-width", 1)
.style("mix-blend-mode", "screen");
  
 

  // Faster animation
  function updatePoints(year) {
    points.style("opacity", d => d.year <= year ? 0.8 : 0);
    d3.select("#yearDisplay").text(year);
  }

  d3.select("#yearSlider").on("input", function() {
    updatePoints(+this.value);
  });

  let isPlaying = false;
  let interval;

  d3.select("#playButton").on("click", function() {
    isPlaying = !isPlaying;
    d3.select(this).text(isPlaying ? "Pause" : "Play");

    if (isPlaying) {
      interval = setInterval(() => {
        const slider = d3.select("#yearSlider");
        let year = +slider.property("value");
        
        if (year >= 2024) {
          year = 1930;
          isPlaying = false;
          clearInterval(interval);
          d3.select("#playButton").text("Play");
        } else {
          year++;
        }
        
        slider.property("value", year);
        updatePoints(year);
      }, 200); // Faster interval
    } else {
      clearInterval(interval);
    }
  });
});

// const width = 1000;
// const height = 500;

// const svg = d3.select(".map")
//   .append("svg")
//   .attr("viewBox", `0 0 ${width} ${height}`);

// const projection = d3.geoEquirectangular()
//   .scale(width/6)
//   .translate([width/2, height/2]);

// const path = d3.geoPath().projection(projection);

// // Load data and create visualization
// Promise.all([
//   d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"),
//   d3.csv("female_artists_with_work_counts.csv") // or d3.json("your-data.json")
// ]).then(([worldData, momaData]) => {
//   // Process MOMA data
//   const data = momaData
//     .filter(d => coordinatesMap[d.Nationality]) // Only keep entries with matching coordinates
//     .map(d => ({
//       artist: d.DisplayName,
//       nationality: d.Nationality,
//       year: +d.BeginDate,
//       lat: coordinatesMap[d.Nationality][0],
//       lon: coordinatesMap[d.Nationality][1]
//     }));

//   // Draw map
//   svg.append("g")
//     .selectAll("path")
//     .data(topojson.feature(worldData, worldData.objects.countries).features)
//     .enter()
//     .append("path")
//     .attr("d", path)
//     .attr("fill", "#2a2a2a")
//     .attr("stroke", "#444");
// //   svg.append("g")
// //     .selectAll("path")
// //     .data(topojson.feature(worldData, worldData.objects.countries).features)
// //     .enter()
// //     .append("path")
// //     .attr("d", path)
// //     .attr("fill", "#eee")
// //     .attr("stroke", "#999");


// // Update the force simulation section
// const simulation = d3.forceSimulation(data)
//   .force("x", d3.forceX(d => projection([d.lon, d.lat])[0]))
//   .force("y", d3.forceY(d => projection([d.lon, d.lat])[1]))
//   .force("charge", d3.forceManyBody().strength(-1))
//   .force("collide", d3.forceCollide().radius(3))
//   .on("tick", () => {
//     points
//       .attr("cx", d => d.x)
//       .attr("cy", d => d.y);
//   });

// // Replace the points section
// const points = svg.append("g")
//   .selectAll("circle")
//   .data(data)
//   .join("circle")
//   .attr("class", "point")
//   .attr("r", 2)
//   .attr("fill", "#ff69b4")
//   .style("opacity", 0)
//   .attr("stroke", "#ff69b4")
//   .attr("stroke-width", 0.5)
//   .style("filter", "url(#glow)");



//     // Update points to create clusters
// //   const simulation = d3.forceSimulation(data)
// //     .force("x", d => d3.forceX(projection([d.lon, d.lat])[0]))
// //     .force("y", d => d3.forceY(projection([d.lon, d.lat])[1]))
// //     .force("collide", d3.forceCollide().radius(4))
// //     .stop();

// // // Run the simulation
// // for (let i = 0; i < 100; i++) simulation.tick();

// // const points = svg.append("g")
// //   .selectAll("circle")
// //   .data(data)
// //   .enter()
// //   .append("circle")
// //   .attr("class", "point")
// //   .attr("cx", d => d.x)
// //   .attr("cy", d => d.y)
// //   .attr("r", 3)
// //   .attr("fill", "#ff69b4")
// //   .style("opacity", 0)
// //   .style("filter", "blur(1px)")
// //   .attr("stroke", "#ff69b4")
// //   .attr("stroke-width", 1);

// // Add glow effect
// const defs = svg.append("defs");
// const filter = defs.append("filter")
//   .attr("id", "glow");

// filter.append("feGaussianBlur")
//   .attr("stdDeviation", "2")
//   .attr("result", "coloredBlur");

// //   // Add points
// //   const points = svg.append("g")
// //     .selectAll("circle")
// //     .data(data)
// //     .enter()
// //     .append("circle")
// //     .attr("class", "point")
// //     .attr("cx", d => projection([d.lon, d.lat])[0])
// //     .attr("cy", d => projection([d.lon, d.lat])[1])
// //     .attr("r", 5)
// //     .attr("fill", "#ff4081")
// //     .style("opacity", 0);

//   points.append("title")
//     .text(d => `${d.artist}\n${d.work} (${d.year})\n${d.nationality}`);

//   let isPlaying = false;
//   let interval;

//   function updatePoints(year) {
//     points.style("opacity", d => d.year <= year ? 1 : 0);
//     d3.select("#yearDisplay").text(year);
//   }

//   d3.select("#yearSlider").on("input", function() {
//     updatePoints(this.value);
//   });

//   d3.select("#playButton").on("click", function() {
//     isPlaying = !isPlaying;
//     d3.select(this).text(isPlaying ? "Pause" : "Play");

//     if (isPlaying) {
//       interval = setInterval(() => {
//         const slider = d3.select("#yearSlider");
//         let year = +slider.property("value");
        
//         if (year >= 2024) {
//           year = 1930;
//           isPlaying = false;
//           clearInterval(interval);
//           d3.select("#playButton").text("Play");
//         } else {
//           year++;
//         }
        
//         slider.property("value", year);
//         updatePoints(year);
//       }, 100);
//     } else {
//       clearInterval(interval);
//     }
//   });
// });