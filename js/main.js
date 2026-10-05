// main.js, by Joseph Kowalczyk
(function(){
    // Pseudoglobal variables
    var map;

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

        // Add a tile layer basemap using Stadia tiles, and attribute Stadia and OSM.
        L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}', {
            attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            minZoom: 8,
            maxZoom: 15,
            ext: 'png'
        }).addTo(map);

        addData(map);
        createZoom();
        createSearch();
        createTimeSlider();
        createModes();
        createFilters();
    }

    function createSymbols(json){
        L.geoJSON(json, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: 5,
                    color: '#1f4e79',
                    weight: 1,
                    fillColor: '#4a90e2',
                    fillOpacity: 0.8
                });
            },
            onEachFeature: function (feature, layer) {
                var name = feature.properties && feature.properties.name;
                if (name) {
                    layer.bindPopup(name);
                } else {
                    layer.bindPopup('No stop name registered.')
                }
            }
        }).addTo(map);
    };

    function createZoom() {
        L.control.zoom({position: 'bottomleft'}).addTo(map); // Creates a new zoom control in the bottom left corner of the map.
    };

    function createSearch() {
        var searchControl = L.control({ position: 'topright' }); // Initializes a new Leaflet control.

        searchControl.onAdd = function () {
            var container = L.DomUtil.create('div', 'search-control');
            var input = L.DomUtil.create('input', '', container);

            input.type = 'search';
            input.placeholder = 'Search address...';

            L.DomEvent.disableClickPropagation(container);
            L.DomEvent.disableScrollPropagation(container);

            return container;
        };

        searchControl.addTo(map);
        var heading = document.getElementById('selectLocationBar')
        heading.insertAdjacentElement('afterend', searchControl.getContainer());
    };

    function createTimeSlider() {
        var timeControl = L.control({ position: 'topright' });

        timeControl.onAdd = function () {
            var container = L.DomUtil.create('div', 'time-control');
            var slider = L.DomUtil.create('input', '', container);
            var numberInput = L.DomUtil.create('input', '', container);

            slider.type = 'range';
            slider.min = 5;
            slider.max = 30;
            slider.value = 15;
            slider.setAttribute('aria-label', 'Travel time slider');

            numberInput.type = 'number';
            numberInput.min = slider.min;
            numberInput.max = slider.max;
            numberInput.value = slider.value;
            numberInput.setAttribute('aria-label', 'Travel time in minutes');

            // When the user changes the slider, changes the numberInput value, so the text display shows the same number
            slider.addEventListener('input', function () {
                numberInput.value = slider.value;
            });

            // Checks the value of the number input. If it is not blank, and is between the min and max values of the slider, set the slider's value to that number.
            numberInput.addEventListener('input', function () {
                var value = Number(numberInput.value);
                if (numberInput.value !== '' && value >= slider.min && value <= slider.max) {
                    slider.value = value;
                }
            });

            // When the user finishes editing the number field, if the number is blank or not valid, set it to the slider's value.
            // If it is valid, clamps the number to between slider.max and slider.min, and adjusts the slider respectively.
            numberInput.addEventListener('change', function () {
                var value = Number(numberInput.value);
                if (numberInput.value === '' || !Number.isFinite(value)) {
                    value = slider.value;
                }

                value = Math.max(slider.min, Math.min(slider.max, value));
                slider.value = value;
                numberInput.value = value;
            });

            L.DomEvent.disableClickPropagation(container);
            L.DomEvent.disableScrollPropagation(container);

            return container;
        };

        timeControl.addTo(map);
        var heading = document.getElementById('travelTime');
        heading.insertAdjacentElement('afterend', timeControl.getContainer());
    };

    function createModes() {
        var modeControl = L.control({ position: 'topright' }); // Initializes a new Leaflet control.

        modeControl.onAdd = function () {
            var container = L.DomUtil.create('div', 'mode-control');

            function addMode(value, labelText, checked) {
                var label = L.DomUtil.create('label', '', container);
                var input = L.DomUtil.create('input', '', label);

                input.type = 'radio';
                input.name = 'transportMode';
                input.value = value;
                input.checked = checked;
                label.appendChild(document.createTextNode(' ' + labelText));
                container.appendChild(document.createElement('br'));
            }

            addMode('walk', 'Walk', true);
            addMode('drive', 'Drive', false);

            L.DomEvent.disableClickPropagation(container);
            L.DomEvent.disableScrollPropagation(container);

            return container;
        };

        modeControl.addTo(map);
        var heading = document.getElementById('transportMode')
        heading.insertAdjacentElement('afterend', modeControl.getContainer());
    };

    function createFilters() {
        var filterControl = L.control({ position: 'topright' }); // Initializes a new Leaflet control.

        filterControl.onAdd = function () {
            var container = L.DomUtil.create('div', 'filter-control');

            function addFilter(value, labelText, checked) {
                var label = L.DomUtil.create('label', '', container);
                var input = L.DomUtil.create('input', '', label);

                input.type = 'checkbox';
                input.name = value;
                input.value = checked;
                input.checked = checked;
                label.appendChild(document.createTextNode(' ' + labelText));
                container.appendChild(document.createElement('br'));
            }

            addFilter('wheelchair', 'Wheelchair-accessible', false);
            addFilter('shelter', 'Has a shelter', false);
            addFilter('tactile_paving', 'Has tactile paving', false);
            addFilter('lit', 'Is illuminated', false);
            

            L.DomEvent.disableClickPropagation(container);
            L.DomEvent.disableScrollPropagation(container);

            return container;
        };

        filterControl.addTo(map);
        var heading = document.getElementById('filters')
        heading.insertAdjacentElement('afterend', filterControl.getContainer());
    };

    // Add the transit stop data to the map
    function addData(map) {
        fetch("data/wisconsin_transit.geojson") // Retrieve transit data...
            .then(function(response){
                return response.json(); // Then return the retrieved data in .json format.
            })
            .then(function(json){
                createSymbols(json);
            })
    };

    document.addEventListener('DOMContentLoaded', mapInit)
})(); // Must be the last line. Closes and executes the wrapping function.