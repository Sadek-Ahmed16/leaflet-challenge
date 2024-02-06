let myMap = L.map("map", {
    center: [20, -150],
    zoom: 3,
  });
  
  // Adding the tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Loading the earthquake data using D3
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson").then(function (data) {
  
    // Function to determine marker size based on earthquake magnitude
    function markerSize(magnitude) {
      return magnitude * 5;
    }
  
    // Function to determine marker color based on earthquake depth
    function markerColor(depth) {
      if (depth > 90) return "#FF0000";
      else if (depth > 70) return "#FF4500";
      else if (depth > 50) return "#FFA500";
      else if (depth > 30) return "#FFD700";
      else if (depth > 10) return "#FFFF99";
      else return "#00FF45";
    }
  
    // Looping through the earthquake data to create markers and binding a popup to each marker
    data.features.forEach(function (earthquake) {
      L.circleMarker([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
        radius: markerSize(earthquake.properties.mag),
        color: markerColor(earthquake.geometry.coordinates[2]),
        fillOpacity: 0.7,
      }).bindPopup(`<strong>Location:</strong> ${earthquake.properties.place}<br><strong>Magnitude:</strong> ${earthquake.properties.mag}<br><strong>Depth:</strong> ${earthquake.geometry.coordinates[2]} `).addTo(myMap);
    });
  
    // Setting up the legend
    let legend = L.control({ position: "bottomright" });
  
    legend.onAdd = function () {
      let div = L.DomUtil.create("div", "info legend");
      let depthLevels = [-10, 10, 30, 50, 70, 90];
      let labels = [];
  
      for (let i = 0; i < depthLevels.length; i++) {
        div.innerHTML +=
          '<i style="background:' +
          markerColor(depthLevels[i] + 1) +
          '"></i> ' +
          depthLevels[i] +
          (depthLevels[i + 1] ? "&ndash;" + depthLevels[i + 1] + "<br>" : "+");
      }
  
      return div;
    };
  
    legend.addTo(myMap);
  
  });
  