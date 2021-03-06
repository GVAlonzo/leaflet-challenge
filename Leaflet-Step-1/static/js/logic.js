// ****************************************************************************
// ** 
// **   Leaflet Homework - Visualizing Data with Leaflet
// **
// **        Author: George Alonzo
// **      Due Date: January 8, 2022
// **
// **         LEAFLET STEP 1
// **
// ****************************************************************************


// ***************************
// FUNCTION TO CREATE MAP
// ***************************

function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
    });
  
    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      "Light Map": lightmap
    };
  
    // Create an overlayMaps object to hold the bikeStations layer
    var overlayMaps = {
      "Earthquakes": earthquakes
    };
  
    // Create the map object with options
    var map = L.map("map", {
      center: [0,0],
      zoom: 2,
      layers: [lightmap, earthquakes]
    });
  
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);

    // Create a legend to display information about our map
    var info = L.control({
    position: "bottomright"
    });

    // When the layer control is added, insert a div with the class of "legend"
    info.onAdd = function() {
      var div = L.DomUtil.create("div", "legend");
      return div;
    };
    // Add the info legend to the map
    info.addTo(map);
}

// ***************************
// FUNCTION TO CREATE MARKERS
// ***************************
function createMarkers(response) {

  // Pull the "features" property off of response
  var eqFeatures = response.features; 

  // Initialize an array to hold earthquake markers
  var eqMarkers = [];

  // Loop through the eqFeatures array
  for (var index = 0; index < eqFeatures.length; index++) {
    var eq = eqFeatures[index];

    depth = eq.geometry.coordinates[2];

    // SET FILL COLORS BASED ON EARTHQUAKE DEPTH, THE 3RD COORDINATE PROVIDED
    var depthColor = "";
    if (eq.geometry.coordinates[2] >= 90) {
      color = "#b60a1c";
    }
    else if (eq.geometry.coordinates[2] <= 89 && eq.geometry.coordinates[2] >= 70) {
      color = "#ff684c";
    }
    else if (eq.geometry.coordinates[2] <= 70 && eq.geometry.coordinates[2] >= 50) {
      color = "#e39802";
    }
    else if (eq.geometry.coordinates[2] <= 50 && eq.geometry.coordinates[2] >= 30) {
      color = "#ffda66";
    }
    else if (eq.geometry.coordinates[2] <= 30 && eq.geometry.coordinates[2] >= 10) {
      color = "#8ace7e";
    }
    else if (eq.geometry.coordinates[2] < 10) {
      color = "#309143";
    }            
    else {
      color = "black";
    }

    // For each eq, create a marker and bind a popup with the earthquake info
    var eqMarker = L.circleMarker([eq.geometry.coordinates[1], eq.geometry.coordinates[0]], {
      fillOpacity: 0.50,
      color: "white",
      fillColor: color,
      radius: eq.properties.mag ** 2 // SQUARING MAGNITUDE FOR GREATER DIFFERENTIATION
    }).bindPopup("<h2>" + eq.properties.type.toUpperCase() + "</h2>"
                        + "</h3> <hr> Magnitude: " + eq.properties.mag + "</h3>"
                        + "</h3> <br> Depth: " + eq.geometry.coordinates[2] + "</h3>"
                        + "</h3> <br> Place: " + eq.properties.place + "<br></h3>"
                        + "<br>USGS Info: <a href=" + eq.properties.url + " target='_blank'>Click Here</a>");


    // Add the marker to the eqMarkers array
    eqMarkers.push(eqMarker);
  }

  // Create a layer group made from the earthquake markers array, pass it into the createMap function
  createMap(L.layerGroup(eqMarkers));
  updateLegend();
}

// Update the legend's innerHTML
function updateLegend(dtGenerated) {
  console.log(dtGenerated);
  document.querySelector(".legend").innerHTML = [
    "<p> DEPTH </p>",
    "<p class='maglt10'> < 10 </p>",
    "<p class='mag1030'> 10-30  </p>",
    "<p class='mag3050'> 30-50 </p>",
    "<p class='mag5070'> 50-70 </p>",
    "<p class='mag7090'> 70-90 </p>",
    "<p class='maggt90'> 90+ </p>"
  ].join("");
}

// Perform an API call to the USGS API to get eqrthquake information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);