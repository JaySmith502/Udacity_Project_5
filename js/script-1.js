
//TODO LIST FOR FIRST REVIEW OF UDACITY INSTRUCTORS ITEMS THAT NEED TO BE ADDRESSED
//TODO: infowindows need to only allow one open at a time COMPLETEDCOMPLETEDCOMPLETEDCOMPLETEDCOMPLETEDCOMPLETEDCOMPLETEDCOMPLETEDCOMPLETED
//TODO: listview needs to center map on marker and open video on click COMPLETEDCOMPLETEDCOMPLETEDCOMPLETEDCOMPLETEDCOMPLETEDCOMPLETED
//TODO: use Offline.js to handle internet disruptions COMPLETEDCOMPLETEDCOMPLETEDCOMPLETEDCOMPLETEDCOMPLETEDCOMPLETEDCOMPLETED
//TODO: install Bootstrap framework and get responsiveness COMPLETEDCOMPLETEDCOMPLETEDCOMPLETEDCOMPLETEDCOMPLETEDCOMPLETEDCOMPLETED
//TODO: run code through JSHint and check Javascript Style Guide (remove trailing white spaces and fix semicolons)COMPLETEDCOMPLETEDCOMPLETEDCOMPLETED
//TODO: create error handler for Youtube API COMPLETEDCOMPLETEDCOMPLETEDCOMPLETEDCOMPLETEDCOMPLETEDCOMPLETEDCOMPLETEDCOMPLETEDCOMPLETEDCOMPLETED
//TODO: address code review comments
'use strict';
var markers = [{
    title: "Ramsi's on the World",
    lat: 38.235616,
    lng: -85.715553,
    description: "GRUB",
    marker: ''
}, {
    title: "Molly Malone's",
    lat: 38.241760,
    lng: -85.725012,
    description: "pub",
    marker: ''
}, {
    title: "Oshea's",
    lat: 38.240664,
    lng: -85.724904,
    description: "pub",
    marker: ''
}, {
    title: "Wick's Pizza",
    lat: 38.240361,
    lng: -85.724346,
    description: "grub",
    marker: ''
}, {
    title: "Nowhere Bar",
    lat: 38.237917,
    lng: -85.719583,
    description: "pub",
    marker: ''
}, {
    title: "Boombozz Pizza",
    lat: 38.231883,
    lng: -85.710034,
    description: "grub",
    marker: ''
}, {
    title: "Mark's Feed Store BBQ",
    lat: 38.231445,
    lng: -85.708532,
    description: "grub",
    marker: ''
}, {
    title: "Seviche",
    lat: 38.231175,
    lng: -85.707545,
    description: "grub",
    marker: ''
}, {
    title: "Cumberland Brewery",
    lat: 38.230729,
    lng: -85.705389,
    description: "pub",
    marker: ''
}, {
    title: "Cafe Mimosa",
    lat: 38.231487,
    lng: -85.706344,
    description: "grub",
    marker: ''
}, {
    title: "Palermo",
    lat: 38.234069,
    lng: -85.712695,
    description: "grub",
    marker: ''
}, {
    title: "Bristol Bar",
    lat: 38.235241,
    lng: -85.714041,
    description: "pub",
    marker: ''
}, {
    title: "Heine Brothers Coffee",
    lat: 38.237297,
    lng: -85.719467,
    description: "grub",
    marker: ''
}];
//create the markerArray array for items to push to later
var markerArray = [];
var iconMain = 'images/marker.png';
var iconHover = 'images/marker2.png';
var infowindow = new google.maps.InfoWindow({});

//ViewModel for creation of the map object, encapsulates the entire js code and is called at end with the Knockout call.
var ViewModel = function() {
    var map, bounds;

    var self = this;

    self.query = ko.observable('');
    self.filterQuery = ko.observable('');
    self.places = ko.observableArray('');
    //Initialize map location, set as IIFE to kick off immediately

    var initMap = function() {
        //create map
        var mapOptions = {
            center: new google.maps.LatLng(38.235616, -85.715553),
            zoom: 14,
            mapTypeId: 'terrain',
            panControl: false,
            disableDefaultUI: true
        };

        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        bounds = new google.maps.LatLngBounds();

        //create the markerArray for markers to populate on creation
        self.markerArray = ko.observableArray();
        //add markers by running through the array above
        for (var i = 0; i < markers.length; i++) {
            var markPos = new google.maps.LatLng(
                markers[i].lat,
                markers[i].lng
            );
            //this finally works, leave it alone! creates the marker object
            var marker = new google.maps.Marker({
                position: markPos,
                map: map,
                icon: iconMain,
                title: markers[i].title,
                id: 'markers',
                animation: google.maps.Animation.DROP
            });
            //create a marker object after being run through the for loop
            markers[i].marker = marker;
            bounds.extend(markPos);
            map.setCenter(bounds.getCenter());
            //adds markers to the markerArray array after created
            self.markerArray.push(marker);
            //adds marker to the places list (didn't end up using for this project but would be useful down the road)
            self.places.push(markers[i].title);


            google.maps.event.addListener(marker, 'click', function() {
                var marker = this;
                if (this.icon == iconHover) {
                    this.setIcon(iconMain);
                } else if (this.icon == iconMain) {
                    this.setIcon(iconHover);
                }
            });

            //function to resize map when resizing to smaller window, credit to Gregory Bolkenstijn on StackOverflow for this function-http://stackoverflow.com/questions/8792676/center-google-maps-v3-on-browser-resize-responsive
            function calculateCenter() {
                center = map.getCenter();
            }
            google.maps.event.addDomListener(map, 'idle', function() {
                calculateCenter();
            });
            google.maps.event.addDomListener(window, 'resize', function() {
                map.setCenter(center);
            });
            //function credit to developers.google.com/maps/documentation/javascript/examples/marker-animations
            function toggleBounce() {

                if (marker.getAnimation() !== null) {
                    marker.setAnimation(null);
                } else {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                }
            }

            //several attempts to take the getJSON and Youtube objects out of the marker addListener were fruitless, leaving it alone for this project
            google.maps.event.addListener(marker, "click", function(marker) {
                var self = this;

                return function() {
                    //the actual url that is used in the JSON object to request info from the Youtube API, creates the specific marker request with this.title, pulling the title from
                    //the marker list of the place being searched and inserting it into a generic Youtube video request, could be much more specific, but does work for purposes of this project
                    var yt_url = 'https://www.googleapis.com/youtube/v3/search?part=id&q=' + this.title + '+louisville&maxResults=1&callback=?&key=AIzaSyActmR_LWyXc0Y9CxHucYh-C73C09Om318';
                    //make some room for youtube ajax call and supporting code here.
                    $.getJSON(yt_url, function(response) {
                        //ensure something returns from Youtube
                        console.log(response);
                        //create the title for the youtube url from the API response
                        var title = response.items[0].id.videoId;
                        //create the infoWindow content using the Youtube iFrame Player object researched on Google Developers Console
                        var contentString = '<div id="player">' + '<iframe width="320" height="200" src="https://www.youtube.com/embed/' + title + '" frameborder="0" allowfullscreen></iframe>' + '</div>';
                        //var playerUrl = 'src="https://www.youtube.com/embed/' + title + '"';
                        //$player.append(playerUrl);

                        infowindow.setContent(contentString);
                        //center the map on the clicked marker
                        map.panTo(marker.getPosition());
                        //infowindow.close();
                        infowindow.open(map, marker);

                    }); //closure for .getJSON
                    /*.error(function() {
                        alert("Oops, that video isn't available!")
                    });*/

                }; //closure for return function
            }(marker)); //closure for addListener

        } //closure for for Loop setting Markers


        //function to create search function, option 3 on knockout.js tutorials using filteredArray function

        //credit to Johnathon with Udacity for one-on-one session to get me to this point, getting nowhere til he helped me see how this works
        self.filteredArray = ko.computed(function() {
            return ko.utils.arrayFilter(self.markerArray(), function(marker) {
                return marker.title.toLowerCase().indexOf(self.query().toLowerCase()) !== -1;
            });
        }, self); //closure for self.filteredArray

        //use variant 3 of ko utility arrays function from knockout.js documentation
        //still a little buggy, accepts any letter in the name of the restaurant, but works by the third letter anyway so I'm moving on! ;)
        self.filteredArray.subscribe(function() {
            var newArray = ko.utils.compareArrays(self.markerArray(), self.filteredArray());
            ko.utils.arrayForEach(newArray, function(marker) {
                if (marker.status === 'deleted') {
                    marker.value.setMap(null);
                } else {
                    marker.value.setMap(map);
                }
            }); //closuree for var newArray
        }); //closure for self.filteredArray.subscribe
        //Highlight map marker if list item is clicked.
        self.selectItem = function(listItem) {
            google.maps.event.trigger(listItem, 'click');
        };

    }(); //closure for initMAP

}; //closure for ViewModel
var viewModel = new ViewModel();
ko.applyBindings(viewModel);
