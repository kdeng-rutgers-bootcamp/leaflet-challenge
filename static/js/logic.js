// initializing map
let myMap = L.map("map", {
  center: [
  37.09, -95.71
  ],
  zoom: 5
});

// setting street level tiles
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

// adding tiles to map
street.addTo(myMap)

// chosen query url
let queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// function to choose circle and legend colors later
function selectColor(depth){
  let colors = ['#ffffe0', '#ffcb91', '#fe8f6a', '#e65758', '#c0223b', '#8b0000']

  if(depth <= 10){
    return colors[0]
  }
  if(depth <= 30){
    return colors[1]
  }
  if(depth <= 50){
    return colors[2]
  }
  if(depth <= 70){
    return colors[3]
  }
  if(depth <= 90){
    return colors[4]
  }
  else{
    return colors[5]
  }
}

// reading data from url
d3.json(queryUrl).then(function (data) {
    
  console.log(data)



  // creating circles from queried data
  for (let i = 0; i < data.features.length; i++) {
    
    // selecting an earthquake
    let place = data.features[i];

    // creating circle based on coordinates, size based on magnitude, color based on depth
    L.circle([place.geometry.coordinates[1], place.geometry.coordinates[0]],
      {
        radius: place.properties.mag * 10000,
        color: 'black',
        fillColor: selectColor(place.geometry.coordinates[2]),
        fillOpacity: 0.95,
        weight: 0.3

      }).addTo(myMap)
      .bindPopup(`<h3>${place.properties.place}</h3>
                  <h4>Magnitude: ${place.properties.mag}</h4>
                  <h4>Depth: ${place.geometry.coordinates[2]}</h4>`).addTo(myMap);
  }
});

// creating legend
var legend = L.control({position: 'bottomright'});


legend.onAdd = function (map) {
  // creating div, and array of depths
  // array contains two depths of 10 for ease of creating first element of legend (<10)
  let div = L.DomUtil.create('div', 'info legend'),
      depths = [10, 10, 30, 50, 70, 90];
      

  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < depths.length; i++) {
      if(i == 0){
        div.innerHTML +=
          '<i style="background:' + selectColor(0) + '"></i>' +
          '<'+ depths[i + 1] + '<br>';
      }
      else{
        div.innerHTML +=
          '<i style="background:' + selectColor(depths[i] + 1) + '"></i> ' +
          depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
      }
      
  }

  return div;
};
// adding legend to map
legend.addTo(myMap);

