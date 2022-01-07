// ****************************************************************************
// ** 
// **   Leaflet Homework - Visualizing Data with Leaflet
// **
// **        Author: George Alonzo
// **      Due Date: January 8, 2022
// **
// **         LEAFLET STEP 2
// **
// ****************************************************************************


// ***************************
// FUNCTION TO CREATE MAP
// ***************************

// Initial placeholder for the tecPlates layer
//   which will be added to the map later.
var tecPlates = new L.LayerGroup();

function createMap(earthquakes) {

    // Create the tile layers that will be the background of our map
    
    // ** Streetmap Layer
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      maxZoom: 18,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });
    // ** Lightmap layer
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
    });
    // ** Darkmap layer
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY
    });    
    // ** Satellite layer
    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "satellite-v9",
      accessToken: API_KEY
    });       
 


    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      "Street Map": streetmap,
      "Light Map": lightmap,
      "Dark Map": darkmap,
      "Satellite Map": satellitemap
    };
  
    // Create an overlayMaps object to hold the bikeStations layer
    var overlayMaps = {
      "Earthquakes": earthquakes,
      // "Tectonic Plates": earthquakes,
      "Tectonic Plates": tecPlates
    };
  
    // Create the map object with options
    var map = L.map("map", {
      center: [0,0],
      zoom: 2,
      layers: [satellitemap, earthquakes, tecPlates]
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


  var tecLink = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

  // Grabbing our GeoJSON data..
  d3.json(tecLink).then(function(boundaries) {
  //   // Creating a GeoJSON layer with the retrieved data
    L.geoJson(boundaries, {
        color: "blue",
        weight: 2
    })
    .addTo(tecPlates)
  });

  // Create a layer group made from the earthquake markers array, pass it into the createMap function
  createMap(L.layerGroup(eqMarkers));

  // Call function to update the legend
  updateLegend();
}


// Update the legend's innerHTML
function updateLegend() {
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

// Perform an API call to the USGS API to get earthquake information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);