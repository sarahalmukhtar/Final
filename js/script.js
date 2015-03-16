$('#mapModal').modal()

var CartoDBTiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
  attribution: 'Map Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors, Map Tiles &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

var map = L.map('map', {
    center: [33.22,43.68],
    zoom: 7,
    minZoom: 6,
    maxZoom: 20,
    layers: [CartoDBTiles]
});

//var markers = new L.markerClusterGroup({showCoverageOnHover: false});
var markers = L.featureGroup();

var dataset = '';
d3.csv("data/IraqDeathsData.csv", function(data) {
    dataset = data;
    //console.log(dataset);
    latlng(dataset);
    plotCriminal(dataset);
    plotExplosive(dataset);
    //slider(dataset);
});

function latlng(dataset) {
    $.each(dataset, function( i, d ) {
        d.lat = parseFloat(d.Latitude);
        d.lng = parseFloat(d.Longitude);
    });
}

/*
function parseDates(dataset) {
    var dateTimeFormat = d3.time.format("%d/%m/%Y %H:%M");

    $.each(dataset, function( i, d ) {
            var dateString = d.Time;
            var dateObject = dateTimeFormat.parse(dateString);
            //console.log(dateString);
        });
}

function filter(dataset) {
    var cf = crossfilter(dataset);

    var cfDate = cf.dimension(function(d) { return d.dateObject; });
    var cfCategory = cf.dimension(function(d) { return d.Category; });
    var cfTotal = cf.dimension(function(d) { return d.Total; });

    var selectCategory = function(byCategory, selection) {
    cfCategory.filter(selection);
    cfDate.filterRange([date1, date2]);
    var allType1 = cfDate.top(Infinity);
    return allType1;
    };
}
*/

function slider(dataset) {
    var sliderControl = L.control.sliderControl({position: "topright", layer: markers, range: true});
    map.addControl(sliderControl);
    sliderControl.startSlider();
}

var criminalEvent = plotCriminal(dataset);
function plotCriminal(dataset) {
    $.each(dataset, function( i, d ) {
        if(d.Type === 'Criminal Event') {
        var civilian = parseInt(d.Civilian);
        var total = parseInt(d.Total);
        
        var fillColor = '#000000';
        if(civilian > 0) {
            fillColor = '#520000';
        }
                
        var radius = 0;
        if(total === 1){
            radius = 2;
        }
        if(total > 1 && total <= 5){
            radius = 3;
        }
        if(total > 5 && total <= 15){
            radius = 4;
        }
        if(total > 15 && total <= 30){
            radius = 5;
        }
        if(total > 30 && total <= 60){
            radius = 6;
        }
        if(total > 60 && total <= 100){
            radius = 8;
        }
        if(total > 100 && total <= 300){
            radius = 12;
        }
        if(total > 300){
            radius = 16;
        }

        var location = new L.LatLng(d.lat, d.lng);
        var marker = L.circleMarker(location, {
            time: d.Time,
            stroke: true,
            color: '#ffffff',
            weight: 0.2,
            opacity: 1,
            fillColor: fillColor,
            fillOpacity: 0.8,
        });

        marker.setRadius(radius);
        marker.bindPopup(d.Total + " Total<br>" + d.Civilian + " Civilian<br>" + d.Coalition + " Coalition<br>" + d.IraqiForces + " Iraqi Forces<br>" + d.Enemy + " Enemy<br><br>" + d.Type + "<br>" + d.Description, {maxWidth: 200});
        markers.addLayer(marker);
        }
        
    });

    map.addLayer(markers);
}

var explosiveHazard = plotExplosive(dataset);
function plotExplosive(dataset) {
    $.each(dataset, function( i, d ) {
        if(d.Type === 'Explosive Hazard') {
        var civilian = parseInt(d.Civilian);
        var total = parseInt(d.Total);
        
        var fillColor = '#000000';
        if(civilian > 0) {
            fillColor = '#520000';
        }
                
        var radius = 0;
        if(total === 1){
            radius = 2;
        }
        if(total > 1 && total <= 5){
            radius = 3;
        }
        if(total > 5 && total <= 15){
            radius = 4;
        }
        if(total > 15 && total <= 30){
            radius = 5;
        }
        if(total > 30 && total <= 60){
            radius = 6;
        }
        if(total > 60 && total <= 100){
            radius = 8;
        }
        if(total > 100 && total <= 300){
            radius = 12;
        }
        if(total > 300){
            radius = 16;
        }

        var location = new L.LatLng(d.lat, d.lng);
        var marker = L.circleMarker(location, {
            time: d.Time,
            stroke: true,
            color: '#ffffff',
            weight: 0.2,
            opacity: 1,
            fillColor: fillColor,
            fillOpacity: 0.8,
        });

        marker.setRadius(radius);
        marker.bindPopup(d.Total + " Total<br>" + d.Civilian + " Civilian<br>" + d.Coalition + " Coalition<br>" + d.IraqiForces + " Iraqi Forces<br>" + d.Enemy + " Enemy<br><br>" + d.Type + "<br>" + d.Description, {maxWidth: 200});
        markers.addLayer(marker);
        }
        
    });

    map.addLayer(markers);
}

var baseMaps = {
    "CartoDB Light": CartoDBTiles
};

var overlayMaps = {
    "Criminal Event<br>(Arson, Carjacking, Kidnapping, Looting, Murder, Sabotage, Shooting, Smuggling, Theft": criminalEvent,
    "Explosive Hazard": explosiveHazard
};

L.control.layers(baseMaps, overlayMaps).addTo(map);