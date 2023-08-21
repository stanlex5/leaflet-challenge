
 // Store our API endpoint as queryUrl.
 let queryUrl ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

 // Perform a GET request to the query URL/
 d3.json(queryUrl).then(function (data) {
   // When we get a response, we send the data.features object to the createFeatures function.
   createFeatures(data.features);
 });
 
 function createFeatures(earthquakeData) {
 
   // Define a function that we want to run once for each feature in the features array.
   
   // Give each feature a popup that shows the eartquake's time and place.
   function onEachFeature(feature, layer) {
     layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
   }
   function CircleMarker(feature,latlng){
     let options = {
       radius:feature.properties.mag*5,
       fillColor: selectColor(feature.geometry.coordinates[2]),
       color:"grey",
       weight: 1,
       opacity: 0.8,
       fillOpacity: 0.35
      } 
      return L.circleMarker(latlng,options);
   }
 
   // Create a GeoJSON layer that contains the features array on the earthquakeData object.
   // Run the onEachFeature function once for each piece of data in the array.
   let earthquakes = L.geoJSON(earthquakeData, {
     onEachFeature: onEachFeature,
     pointToLayer: CircleMarker
 
   });
 
   // Send our earthquakes layer to the createMap function/
   createMap(earthquakes);
 }
 
 function selectColor(depth){
   if (depth < 10) return "lime";
   else if (depth < 30) return "greenyellow";
   else if (depth < 50) return "yellow";
   else if (depth < 70) return "orange";
   else if (depth < 90) return "orangered";
   else return "red";  
 }
 
 var legend = L.control({position: "bottomright"});
 
 legend.onAdd = function() {
   var div = L.DomUtil.create("div", "info legend");
   magdepth = [-10, 10, 30, 50, 70, 90];
   
   //div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
   
   for (var i = 0; i < magdepth.length; i++) {
     div.innerHTML +='<i style="background:' + selectColor(magdepth[i] + 1) + '"></i> ' + magdepth[i] + (magdepth[i + 1] ? '&ndash;' + magdepth[i + 1] + '<br>' : '+');
    }
   return div;
 };
 
 
 function createMap(earthquakes) {
 
   // Create the base layers.
   let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
   })
 
   let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
     attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
   });
 
   // Create a baseMaps object.
   let baseMaps = {
     "Street Map": street,
     "Topographic Map": topo
   };
 
   // Create an overlay object to hold our overlay.
   let overlayMaps = {
     Earthquakes: earthquakes
   };
 
   // Create our map, giving it the streetmap and earthquakes layers to display on load.
   let myMap = L.map("map", {
     center: [
       37.09, -95.71
     ],
     zoom: 5,
     layers: [street, earthquakes]
   });
   
   // Create a layer control.
   // Add the layer control to the map.
   L.control.layers(baseMaps, overlayMaps, {
     collapsed: false
   }).addTo(myMap);
   legend.addTo(myMap);
 
 }