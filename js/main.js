// main.js, by Joseph Kowalczyk
(function(){
    // Pseudoglobal variables

    // Map initializer
    function mapInit(){
        var southWest = L.latLng(41.5878, -93.6192); // Sets a point in the southwestern corner of the map, used in panning boundary
        var northEast = L.latLng(47.9708, -85.9852); // Likewise, but northeast.
        var bounds = L.latLngBounds(southWest, northEast) // Combines both prior points into a bounding box
        map = L.map('map', {
            zoomControl: false, // Removes zoom control, repositioned later
            maxBounds: bounds, // Sets the maximum bounds to the geometry set earlier
            maxBoundsViscosity: 1.0 // By default, leaflet eases the user back inside the bounds. Setting this to 1 ensures that the bound is a hard limitation on panning.
        }).setView([44.44, -90.13], 8);

        // Add a tile layer basemap using OSM tiles, and attribute OSM.
        L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}', {
            attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            minZoom: 8,
            maxZoom: 15,
            ext: 'png'
        }).addTo(map);

        createZoom();
    }


    function createZoom() {
        L.control.zoom({position: 'bottomleft'}).addTo(map);
    };

    document.addEventListener('DOMContentLoaded', mapInit)
})(); // Must be the last line. Closes and executes the wrapping function.