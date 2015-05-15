//TODO: get infowindows to work when list is filtered--RESOLVED
//TODO: get infowindows to open on clicked marker instead of last marker in array--RESOLVED
//TODO: work on responsiveness across browsers/devices (remove list for smaller/center search bar)
//TODO: beautify the listview a little, it's kinda ugly

var markers = [{
    title: "Ramsis on the World",
    lat: 38.235616,
    lng: -85.715553,
    description: "grub",
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
var markerArray = [];
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
            zoom: 16,
            mapTypeId: 'terrain',
            panControl: false,
            disableDefaultUI: true
        };

        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        bounds = new google.maps.LatLngBounds();

        //create the markerArray for markers to populate on creation
        self.markerArray = ko.observableArray();
        //add markers
        for (var i = 0; i < markers.length; i++) {
            var markPos = new google.maps.LatLng(
                markers[i].lat,
                markers[i].lng
            );
            //this finally works, leave it alone!
            var marker = new google.maps.Marker({
                position: markPos,
                map: map,
                icon: 'images/marker.png',
                title: markers[i].title,
                animation: google.maps.Animation.DROP
            });
            markers[i].marker = marker;
            bounds.extend(markPos);
            map.setCenter(bounds.getCenter());

            self.markerArray.push(marker);
            self.places.push(markers[i].title);


            //still need to work on infoWindow, put more content in
            //creates the window for each marker, just applies a generic youtube video at the moment, need to get it working with Ajax to supply video.

            google.maps.event.addListener(marker, "click", function(marker) {
                return function(){

                var yt_url = 'https://www.googleapis.com/youtube/v3/search?part=id&q=' + this.title + '+louisville&maxResults=1&callback=?&key=AIzaSyActmR_LWyXc0Y9CxHucYh-C73C09Om318';
                //make some room for youtube ajax call and supporting code here.
                $.getJSON(yt_url, function(response) {
                    console.log(response);
                    var title = response.items[0].id.videoId;
                    var contentString = '<div id="player">' + '<iframe width="320" height="200" src="https://www.youtube.com/embed/' + title + '" frameborder="0" allowfullscreen></iframe>' + '</div>';
                    infowindow = new google.maps.InfoWindow({
                    content: contentString
                    });
                    //var playerUrl = 'src="https://www.youtube.com/embed/' + title + '"';
                    //$player.append(playerUrl);

                    infowindow.setContent(contentString);
                    map.panTo(marker.getPosition());
                    infowindow.open(map, marker);

                }); //closure for .getJSON
                }//closure for return function
            }(marker)) //closure for addListener
        } //closure for for Loop setting Markers


    //try different filteredArray approach
    //credit to Johnathon with Udacity for one-on-one session to get me to this point, getting nowhere til he helped me see how this works
    self.filteredArray = ko.computed(function() {
        return ko.utils.arrayFilter(self.markerArray(), function(marker) {
            return marker.title.toLowerCase().indexOf(self.query().toLowerCase()) !== -1;
        });
    }, self);//closure for self.filteredArray

    //use variant 3 of ko utility arrays function from knockout.js documentation
    //still a little buggy, accepts any letter in the name of the restaurant, but works by the third letter anyway so I'm moving on! ;)
    self.filteredArray.subscribe(function() {
        var newArray = ko.utils.compareArrays(self.markerArray(), self.filteredArray());
        ko.utils.arrayForEach(newArray, function(marker) {
            if (marker.status === 'deleted') {
                marker.value.setMap(null);
            }
            else {
                marker.value.setMap(map);
            }
        }); //closuree for var newArray
      });//closure for self.fileredArray.subscribe

   }(); //closure for initMAP

}; //closure for ViewModel
var viewModel = new ViewModel();
ko.applyBindings(viewModel);
