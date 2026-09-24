// main.js, by Joseph Kowalczyk
(function(){
    // Pseudoglobal variables

    // Map initializer
    function mapInit(){
        var southWest = L.latLng(41.41, -90.63); // Sets a point in the southwestern corner of the map, used in panning boundary
        var northEast = L.latLng(48.17, -90.90); // Likewise, but northeast.
        var bounds = L.latLngBounds(southWest, northEast) // Combines both prior points into a bounding box
        map = L.map('map', {
            maxBounds: bounds, // Sets the maximum bounds to the geometry set earlier
            maxBoundsViscosity: 1.0 // By default, leaflet eases the user back inside the bounds. Setting this to 1 ensures that the bound is a hard limitation on panning.
        }).setView([44.44, -90.13], 8);

        // Add a tile layer basemap using OSM tiles, and attribute OSM.
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            minZoom: 8,
            maxZoom: 15
        }).addTo(map);
    }

    document.addEventListener('DOMContentLoaded', mapInit)
})(); // Must be the last line. Closes and executes the wrapping function.