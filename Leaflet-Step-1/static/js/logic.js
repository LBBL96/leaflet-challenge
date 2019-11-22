// GeoJSON Earthquakes

function createFeatures(data) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindTooltip("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>", sticky = true)    
    };

    // Create marker radii based on magnitude
    function getRadius(magnitudes){
        console.log(magnitudes)
        return magnitudes * 4
        
    };

    // Create marker colors
    function markerColor(magnitudes){
        if (magnitudes > 4){
            color = "#b30000"
        } else if (magnitudes > 3){
            color = "#ff0000"
        } else if (magnitudes > 2){
            color = "#ff6600"
        } else if (magnitudes > 1){
            color = "#ffcc00"
        } else 
            color = "#ffff00"
        
        return color
    };

    // Default marker options until radius and fill are updated below
    var markerOptions = {
        radius: 6,
        fillColor: "#ff7800",
        color: "black",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }


    // var legend = L.control({position:"bottomright"})
    // addLegend(myMap, position = "bottomright", 
    //     bins = 5, 
    //     colors = ["b30000", "ff0000", "ff6600", "ffcc00", "ffff00"], 
    //     labels = ["> 4", "> 3", "> 2", "> 1", "< 1"],
    //     opacity = 0.5, 
    //     title = "Magnitudes", 
    //     data = getMapData(earthquakes));


    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array

    const earthquakes = L.geoJSON(data, {
        // markerOptions: markerOptions,
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, markerOptions);
        },
        onEachFeature: onEachFeature,
        style: function(feature){
            return {
                radius: getRadius(feature.properties.mag),
                fillColor: markerColor(feature.properties.mag)
            } 
        }
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}


function createMap(earthquakes) {

    // Define streetmap and piratemap layers
    const streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.streets",
            accessToken: API_KEY
    });

    const piratemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.pirates",
            accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    const baseMaps = {
            "Street Map": streetmap,
            "Pirate Map": piratemap
    };

    // Create overlay object to hold our overlay layer
    const overlayMaps = {
            Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    const myMap = L.map("map-id", {
            center: [37.09, -95.71],
            zoom: 5,
            layers: [streetmap, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map

    L.control.layers(baseMaps, overlayMaps, {
            collapsed: false 
    }).addTo(myMap);
}

(async function(){
    const data = await d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson");
    // Once we get a response, send the data.features object to the createFeatures function
    // createFeatures(data.features);
    createFeatures(data);
})()
