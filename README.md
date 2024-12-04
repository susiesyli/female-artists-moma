# female-artists-moma
3d visualization of female artists in MoMA's permanent collection, 1929-2024 

## process 
[Click me](https://susiesyli.medium.com/2f51ed0de230) for a detailed write-up on the design and creation process; or see below for the tldr workflow: 
1. Ideation (research: topic; past projects; Visual Cinnamon + Data Sketches)
2. Data
   * Sourcing data -> CC0 databases by MoMA, the Met, the Louvre, the Whitney etc
   * Data wrangling -> Jupyter Notebook + Pandas for preprocessing
   * EDA -> Jupyter Notebook, Matplotlib + Seaborn for 2d static visualization; Observable (Vega Lite) for secondary visualization
   * Feature engineering -> took the raw databases (artists, artworks, and exhibitions), and produces 2 databases with features used by d3 etc visualization. See [Medium](https://medium.com/@susiesyli/process-documentation-poetic-data-final-230) for more details on this part
3. Code for sketch
  * Use d3.js/three.js/other light JS libs to sketch 2.5D(? technically 3D but available top view only) designs for mapping and encoding 
![Example: iteration 1, raw data with coordinate encoding + d3 map projectins](https://github.com/susiesyli/female-artists-moma/blob/4e8126ab19dde0965554fed38415835c1e15e6aa/images/map-iteration.gif)


## 2D static visuals 
Acquisition pattern during artists' career 
![fig 1](https://github.com/susiesyli/female-artists-moma/blob/69a685af8824da8b580fd68ad1f786860b8de4cd/images/acquisition-vs-career)
