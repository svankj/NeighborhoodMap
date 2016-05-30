'use strict';

var map; // Map
var markers = []; // Map markers
var mapRect; // Area markers
var icon_marker; // Marker icon
var icon_marker_large; // Large marker icon
var wikiRequestTimeout; // Timeout for wikipedia response
var yelpRequestTimeout; // Timeout for yelp response
var youtubeRequestTimeout; // Timeout for youtube response
var googleRequestTimeout; // Timeout for google response
// Browser language
var languages = navigator.languages?navigator.languages[0]:(navigator.language || navigator.userLanguage);
var language = languages.split('-');
// Check for mobile device
var isMobile = {
	Android: function() {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function() {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function() {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function() {
	return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS()
		|| isMobile.Opera()	|| isMobile.Windows());
	}
};
// Init data model
var init_data = [
{
	id:"palazzo-vecchio-firenze",
	name:"Palazzo Vecchio",
	image_url:"https://s3-media4.fl.yelpcdn.com/bphoto/pVVxSYM2Y0kGRmMwsx7kdA/ms.jpg",
	url:"http://www.yelp.com/biz/book-larder-seattle?utm_campaign=yelp_api&utm_medium=api_v2_search&utm_source=6isCPjgy1XxOmrEw1G0cYQ",
	mobile_url:"http://m.yelp.com/biz/palazzo-vecchio-firenze?utm_campaign=yelp_api&utm_medium=api_v2_search&utm_source=6isCPjgy1XxOmrEw1G0cYQ",
	display_phone:"+39 055 2768325",
	review_count:33,
	categories:[["Museums","museums"],["Landmarks & Historical Buildings","landmarks"]],
	rating:4.5,
	rating_img_url_small:"https://s3-media2.fl.yelpcdn.com/assets/2/www/img/a5221e66bc70/ico/stars/v1/stars_small_4_half.png",
	snippet_text:"Things are often odds and especially when we start to speak about what we liked as a tourist during our holidays. Firenze is known as an open-air museum...",
	location_display_address:["Piazza della Signoria","Duomo","50122 Firenze"],
	location_city:"Firenze",
	location_coordinate:{"latitude":43.7698898,"longitude":11.2559605},
	videoId:"n0dIeBo3cqU",
	title:"Firenze",
	wiki_url:"https://it.wikipedia.org/wiki/Firenze"
},
{	id:"palazzo-del-bargello-firenze",
	name:"Palazzo del Bargello",
	image_url:"https://s3-media1.fl.yelpcdn.com/bphoto/nQUcZU9gHrFvpD0RNWz73A/ms.jpg",
	url:"http://www.yelp.com/biz/palazzo-del-bargello-firenze?utm_campaign=yelp_api&utm_medium=api_v2_search&utm_source=6isCPjgy1XxOmrEw1G0cYQ",
	mobile_url:"http://m.yelp.com/biz/palazzo-del-bargello-firenze?utm_campaign=yelp_api&utm_medium=api_v2_search&utm_source=6isCPjgy1XxOmrEw1G0cYQ",
	display_phone:"+39 055 2388606",
	review_count:22,
	categories:[["Museums","museums"]],
	rating:4.5,
	rating_img_url_small:"https://s3-media2.fl.yelpcdn.com/assets/2/www/img/a5221e66bc70/ico/stars/v1/stars_small_4_half.png",
	snippet_text:"Dozens of marble, bronze, glass, terracotta, wooden and gold sculptures in addition to busts, cameos and panels dating from the 13th century in a small...",
	location_display_address:["Via del Proconsolo 4","Duomo","50122 Firenze","Italy"],
	location_city:"Firenze",
	location_coordinate:{"latitude":43.77048,"longitude":11.25784},
	videoId:"hEqQDLyNNeg",
	title:"Firenze",
	wiki_url:"https://it.wikipedia.org/wiki/Firenze"
},
{	id:"corridoio-vasariano-firenze",
	name:"Corridoio Vasariano",
	image_url:"https://s3-media4.fl.yelpcdn.com/bphoto/5k6eL7KwrL3cDGRtS_QZZw/ms.jpg",
	url:"http://www.yelp.com/biz/corridoio-vasariano-firenze?utm_campaign=yelp_api&utm_medium=api_v2_search&utm_source=6isCPjgy1XxOmrEw1G0cYQ",
	mobile_url:"http://m.yelp.com/biz/corridoio-vasariano-firenze?utm_campaign=yelp_api&utm_medium=api_v2_search&utm_source=6isCPjgy1XxOmrEw1G0cYQ",
	display_phone:"+39 055 294883",
	review_count:14,
	categories:[["Museums","museums"],["Art Galleries","galleries"]],
	rating:5,
	rating_img_url_small:"https://s3-media1.fl.yelpcdn.com/assets/2/www/img/c7623205d5cd/ico/stars/v1/stars_small_5.png",
	snippet_text:"Explore Florence's worth from within and without. And what makes better the city than Uffizi and the Vasari Corridor?\n\nThe Vasari Corridor is from the heart...",
	location_display_address:["Piazzale degli Uffizi 6","Duomo","50122 Firenze","Italy"],
	location_city:"Firenze",
	location_coordinate:{"latitude":43.76802385,"longitude":11.25536978},
	videoId:"xEC_C4eBe_Q",
	title:"Firenze",
	wiki_url:"https://it.wikipedia.org/wiki/Firenze"
},
{	id:"cupola-del-brunelleschi-firenze",
	name:"Cupola del Brunelleschi",
	image_url:"https://s3-media1.fl.yelpcdn.com/bphoto/65eMXy04H8SkN12c2wqlSw/ms.jpg",
	url:"http://www.yelp.com/biz/cupola-del-brunelleschi-firenze?utm_campaign=yelp_api&utm_medium=api_v2_search&utm_source=6isCPjgy1XxOmrEw1G0cYQ",
	mobile_url:"http://m.yelp.com/biz/cupola-del-brunelleschi-firenze?utm_campaign=yelp_api&utm_medium=api_v2_search&utm_source=6isCPjgy1XxOmrEw1G0cYQ",
	display_phone:"+39 055 2302885",
	review_count:14,
	categories:[["Museums","museums"],["Landmarks & Historical Buildings","landmarks"]],
	rating:5,
	rating_img_url_small:"https://s3-media1.fl.yelpcdn.com/assets/2/www/img/c7623205d5cd/ico/stars/v1/stars_small_5.png",
	snippet_text:"Between the Bell Tower and Dome, I personally preferred the climb up the Dome. \n\nAccess is included with the Firenze Card, but I found it a bit confusing...",
	location_display_address:["Piazza del Duomo","Duomo","50122 Firenze","Italy"],
	location_city:"Firenze",
	location_coordinate:{"latitude":43.7734184,"longitude":11.2553701},
	videoId:"TCwjeF0kP7M",
	title:"Firenze",
	wiki_url:"https://it.wikipedia.org/wiki/Firenze"
},
{	id:"palazzo-strozzi-firenze",
	name:"Palazzo Strozzi",
	image_url:"https://s3-media4.fl.yelpcdn.com/bphoto/73L08t9eOGHirXoY9_xF5g/ms.jpg",
	url:"http://www.yelp.com/biz/palazzo-strozzi-firenze?utm_campaign=yelp_api&utm_medium=api_v2_search&utm_source=6isCPjgy1XxOmrEw1G0cYQ",
	mobile_url:"http://m.yelp.com/biz/palazzo-strozzi-firenze?utm_campaign=yelp_api&utm_medium=api_v2_search&utm_source=6isCPjgy1XxOmrEw1G0cYQ",
	display_phone:"+39 055 2776461",
	review_count:16,
	categories:[["Museums","museums"],["Opera & Ballet","opera"],["Music Venues","musicvenues"]],
	rating:4.5,
	rating_img_url_small:"https://s3-media2.fl.yelpcdn.com/assets/2/www/img/a5221e66bc70/ico/stars/v1/stars_small_4_half.png",
	snippet_text:"Situated in the heart of Florence, Palazzo Strozzi is one of the finest examples of Renaissance domestic architecture. It is a prestigious historical...",
	location_display_address:["Piazza Strozzi 1","Duomo","50123 Firenze","Italy"],
	location_city:"Firenze",
	location_coordinate:{"latitude":43.7711159,"longitude":11.25217742},
	videoId:"z_40Duufeno",
	title:"Firenze",
	wiki_url:"https://it.wikipedia.org/wiki/Firenze"
},
{	id:"galleria-degli-uffizi-firenze",
	name:"Galleria degli Uffizi",
	image_url:"https://s3-media2.fl.yelpcdn.com/bphoto/1amZPwzeX0DCus_US1UW8w/ms.jpg",
	url:"http://www.yelp.com/biz/galleria-degli-uffizi-firenze?utm_campaign=yelp_api&utm_medium=api_v2_search&utm_source=6isCPjgy1XxOmrEw1G0cYQ",
	mobile_url:"http://m.yelp.com/biz/galleria-degli-uffizi-firenze?utm_campaign=yelp_api&utm_medium=api_v2_search&utm_source=6isCPjgy1XxOmrEw1G0cYQ",
	display_phone:"+39 055 2388651",
	review_count:152,
	categories:[["Museums","museums"]],
	rating:4.5,
	rating_img_url_small:"https://s3-media2.fl.yelpcdn.com/assets/2/www/img/a5221e66bc70/ico/stars/v1/stars_small_4_half.png",
	snippet_text:"TIP. Repeat BEEEEG TIP. Get there early, skip breakfast and have it after. We arrived as the doors opened, with our important FirenzeCard, walked through...",
	location_display_address:["Piazzale degli Uffizi","Duomo","50122 Firenze","Italy"],
	location_city:"Firenze",
	location_coordinate:{"latitude":43.7684288,"longitude":11.2555704},
	videoId:"wQWAjW6k69Y",
	title:"Firenze",
	wiki_url:"https://it.wikipedia.org/wiki/Firenze"
},
{	id:"galleria-dellaccademia-firenze",
	name:"Galleria dell'Accademia",
	image_url:"https://s3-media4.fl.yelpcdn.com/bphoto/xDkzFvhlgqc2BB-o038P1A/ms.jpg",
	url:"http://www.yelp.com/biz/galleria-dellaccademia-firenze?utm_campaign=yelp_api&utm_medium=api_v2_search&utm_source=6isCPjgy1XxOmrEw1G0cYQ",
	mobile_url:"http://m.yelp.com/biz/galleria-dellaccademia-firenze?utm_campaign=yelp_api&utm_medium=api_v2_search&utm_source=6isCPjgy1XxOmrEw1G0cYQ",
	display_phone:"+39 055 2388612",
	review_count:126,
	categories:[["Museums","museums"],["Art Galleries","galleries"]],
	rating:4.5,
	rating_img_url_small:"https://s3-media2.fl.yelpcdn.com/assets/2/www/img/a5221e66bc70/ico/stars/v1/stars_small_4_half.png",
	snippet_text:"Go here with a guide.  You need to spend time focusing on \"The Prisoners\" as well as the famous David statue.  This is something worth looking at.  Go with...",
	location_display_address:["Via Ricasoli 58","Duomo","50122 Firenze","Italy"],
	location_city:"Firenze",
	location_coordinate:{"latitude":43.776878757696,"longitude":11.258819909625},
	videoId:"1qZ35E-6jhw",
	title:"Firenze",
	wiki_url:"https://it.wikipedia.org/wiki/Firenze"
},
{	id:"cappelle-medicee-firenze",
	name:"Cappelle Medicee",
	image_url:"https://s3-media1.fl.yelpcdn.com/bphoto/UCp5XougGxtdrWSO0Qtf2A/ms.jpg",
	url:"http://www.yelp.com/biz/cappelle-medicee-firenze?utm_campaign=yelp_api&utm_medium=api_v2_search&utm_source=6isCPjgy1XxOmrEw1G0cYQ",
	mobile_url:"http://m.yelp.com/biz/cappelle-medicee-firenze?utm_campaign=yelp_api&utm_medium=api_v2_search&utm_source=6isCPjgy1XxOmrEw1G0cYQ",
	display_phone:"+39 055 2388602",
	review_count:16,
	categories:[["Museums","museums"],["Churches","churches"]],
	rating:4.5,
	rating_img_url_small:"https://s3-media2.fl.yelpcdn.com/assets/2/www/img/a5221e66bc70/ico/stars/v1/stars_small_4_half.png",
	snippet_text:"Cappelle Medicee \"Medici Chapels\" are the two chapels located in the Basilica of San Lorenzo that hold the personal tombs of Florence's great ruling Medici...",
	location_display_address:["Piazza Madonna degli Aldobrandini 6","Santa Maria Novella","50123 Firenze","Italy"],
	location_city:"Firenze",
	location_coordinate:{"latitude":43.774868,"longitude":11.2529631},
	videoId:"i4ML6-kadeI",
	title:"Firenze",
	wiki_url:"https://it.wikipedia.org/wiki/Firenze"
},
{	id:"forte-belvedere-firenze",
	name:"Forte Belvedere",
	image_url:"https://s3-media1.fl.yelpcdn.com/bphoto/Qpp1V_T-9aX2JWeFiYxang/ms.jpg",
	url:"http://www.yelp.com/biz/forte-belvedere-firenze?utm_campaign=yelp_api&utm_medium=api_v2_search&utm_source=6isCPjgy1XxOmrEw1G0cYQ",
	mobile_url:"http://m.yelp.com/biz/forte-belvedere-firenze?utm_campaign=yelp_api&utm_medium=api_v2_search&utm_source=6isCPjgy1XxOmrEw1G0cYQ",
	display_phone:"+39 055 2625961",
	review_count:19,
	categories:[["Museums","museums"]],
	rating:4.5,
	rating_img_url_small:"https://s3-media2.fl.yelpcdn.com/assets/2/www/img/a5221e66bc70/ico/stars/v1/stars_small_4_half.png",
	snippet_text:"Came for the legendary views of the Tuscan hills around Florence and was treated to an amazing stormy view of the whole valley after a\ngreat Aperol spritz...",
	location_display_address:["Via San Leonardo 1","Palazzo Pitti","50125 Firenze","Italy"],
	location_city:"Firenze",
	location_coordinate:{"latitude":43.7632977724898,"longitude":11.2539033407396},
	videoId:"Wv5_UOQygJo",
	title:"Firenze",
	wiki_url:"https://it.wikipedia.org/wiki/Firenze"
}
];
// Init filter keywords
var init_keyword = ["Churches", "Firenze", "Landmarks & Historical Buildings", "Museums"];

// Jquery get request of google map
var googleRequestMap = function() {
	// Set the parameters request
	var message = {
		'action': '//maps.googleapis.com/maps/api/js',
		'method': 'GET',
		'parameters': '?key=AIzaSyClnw1QfEqQePv2n_DgTIp5Wu1h6b2zXKg&signed_in=true&callback=initialize&language='+
		((language[0]!==undefined)?language[0]:'en')+'&region='+((language[1]!==undefined)?language[1]:'US')
	};
	$.ajax({
		type: message.method,
		url: message.action + message.parameters,
		crossdomain: true,
		dataType: 'script',
		timeout: 5000,
		success: clearTimeout(googleRequestTimeout), // Clear timeout variable
		error: function(data_error) { // Error function
					googleRequestTimeout = setTimeout(function(error) {
						console.log("Failed to get google resources. Error Status: " + error + ".");
						errorMessageBuild(".site-wrap", 'Google Map Service Not Available');
					}, 8000, JSON.stringify(data_error.status));
				}
	});
}();

// Google Map initialize
var isMapsApiLoaded = false;
window.initialize = function () {
	isMapsApiLoaded = true;
	// Create map
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 43.7684288, lng: 11.2555704},
		zoom: 14,
		mapTypeControl: true,
		mapTypeControlOptions: {
			style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
			mapTypeIds: [
				google.maps.MapTypeId.ROADMAP,
				google.maps.MapTypeId.TERRAIN,
				google.maps.MapTypeId.SATELLITE,
				google.maps.MapTypeId.HYBRID
			]
		}
	});
	// Map responsive resize
	google.maps.event.addDomListener(window, "resize", function() {
		var center = map.getCenter();
		google.maps.event.trigger(map, "resize");
		map.setCenter(center);
	});
	// map.addListener('click', function(e) { placeMarkerAndPanTo(e.latLng, map); });
	// Create marker customize icon
	icon_marker = new google.maps.MarkerImage(
		'../img/marker-icon.png',
		null,
		null,
		null,
		new google.maps.Size(32, 32)
	);
	// Create large marker customize icon
	icon_marker_large = new google.maps.MarkerImage(
		'../img/marker-icon.png',
		null,
		null,
		null,
		new google.maps.Size(64, 64)
	);
	// Check first time execution
	var flag_obj = JSON.parse(localStorage["__amplify__flag_init"]);
	if(flag_obj.data !== true) initData();
}

// Build message error
// tag: element where append div error
// msg: error message
function errorMessageBuild(tag, msg) {
	$('.header-item').hide();
	$('body').css('overflow-y', 'hidden');
	$(tag).prepend('<div id="error-msg" class="error">'+msg+'</div>');
}

function initData() {
	// Init marker
	var latLng = [];
	init_data.forEach( function(item) {
		var data = new Data(item);
		var lat = data.location_coordinate().latitude;
		var lng = data.location_coordinate().longitude;
		var location = {lat: lat, lng: lng};
		latLng.push(location);
		makeMarker(data);
	});
	// Create the rectangular area included all markers
	var latlngbounds = new google.maps.LatLngBounds();
	for (var i = 0; i < latLng.length; i++) {
		var ll = new google.maps.LatLng(latLng[i].lat, latLng[i].lng);
		latlngbounds.extend(ll);
	}
	// Build map rectangle
	map.fitBounds(latlngbounds);
	mapRect = new google.maps.Rectangle({
		bounds: latlngbounds,
		map: map,
		fillColor: "#000000",
		fillOpacity: 0.2,
		strokeWeight: 0
	});
}

// Add a marker+infowindow at lat long
// latLng: latitude and longitude
// id: id for listner
// infoHTML: Infowindow html code
function placeMarkerAndPanTo(latLng, id, infoHTML) {
	// Wait for loaded map
	if( !isMapsApiLoaded ) {
		setTimeout(placeMarkerAndPanTo, 500, latLng, id, infoHTML);
	} else {
		// Timeout markers animation
		window.setTimeout(function() {
			var self = this;
			// Create infowindow
			var infowindow = new google.maps.InfoWindow({
				content: infoHTML,
				maxWidth: 200
			});
			// Create marker
			var marker = new google.maps.Marker({
				position: latLng,
				map: map,
				animation: google.maps.Animation.DROP,
				icon: icon_marker
			});
			// Add marker identifier
			marker.id = id;
			// Add click listener to markers to scroll datalist
			marker.addListener('click', function() {
				$(".side-nav-item").animate({
					scrollTop: $('#'+id).offset().top-150+$(".side-nav-item").scrollTop()
				}, 600);
			});
			// Add listener mouse over/out from markers
			// change background color list items and open infowindow
			marker.addListener('mouseover', function() {
				infowindow.open(map, marker);
				$('#'+id).css('background-color', 'rgba(255, 241, 75, 0.9)');
			});
			marker.addListener('mouseout', function() {
				$('#'+id).css('background-color', '#ffffff');
				setTimeout(function() {
					infowindow.close(map, marker);
				}, 2000);
			});
			// Add mouseover/mouseout listener to list items
			$('#'+id).on('mouseover', function(e) {
				marker.setIcon(icon_marker_large);
			});
			$('#'+id).on('mouseout', function(e) {
				marker.setIcon(icon_marker);
			});
			// Add click listner to change map position
			$('#'+id).on('click', function(e) {
				var value = $('#'+id).attr('value');
				var str_loc = value.split(',');
				map.panTo({lat: parseFloat(str_loc[0]), lng: parseFloat(str_loc[1])});
				map.setZoom(18);
			});
			markers.push(marker);
		}, 200*Math.floor((Math.random() * 10)));
		// Set map to the given LatLng
		map.panTo(latLng);
	}
}

// Create marker
// data: data to build info window
function makeMarker(data) {
	// Infowindow html code
	var infoHTML = '<div class="info-container">'+
		'<div class="info-box-left">'+
		'<img src="'+data.image_url()+'" width="60" hiegth="60">'+
		'</div>'+
		'<div class="info-box-right">'+
		data.name()+'<br>'+
		'<span class="text-rate">'+data.rating()+' </span><img src="'+data.rating_img_url_small()+'" width="50" hiegth="10"><br>'+
		((data.wiki_url() !== undefined)?('<a href="'+data.wiki_url()+'">wiki#'+data.title()+'</a><br>'):'')+
		((data.videoId() !== undefined)?('<a href="https://www.youtube.com/watch?v='+data.videoId()+'">youtube:pick</a>'):'')+
		'</div>'+
		'</div>';
	// Add markers to the map
	placeMarkerAndPanTo({lat: data.location_coordinate().latitude, lng: data.location_coordinate().longitude}, data.id(), infoHTML);
}

// Automatic Knockout model persistence with Amplify
(function(ko) {
	// For observableArray()
	ko.extenders.localArrayStore = function(target, key) {
		var value = amplify.store(key) || target();
		// Track the changes
		target.subscribe(function(newValue) {
			amplify.store(key, newValue || null);
			if(ko.toJSON(target()) != ko.toJSON(newValue)) target(newValue);
		});
		target(value);
	};
	// For observable()
	ko.extenders.localStore = function(target, key) {
		var value = amplify.store(key) || target();
		var result = ko.computed({
			read: target,
			write: function(newValue) {
				amplify.store(key, newValue);
				target(newValue);
			}
		});
		result(value);
		return result;
	};
})(ko);

function observableStoredArray(key) {
	var storedData = amplify.store(key);
	var data = !(storedData === undefined) ? [storedData] : [];
	return ko.observableArray(data).extend({
		localArrayStore: key
	});
}

function observableStored(key) {
	var storedData = amplify.store(key);
	var data = !(storedData === undefined) ? storedData : "";
	return ko.observable(data).extend({
		localStore: key
	});
}

// Capitalize the first letter of string
String.prototype.capitalizeFirstLetter = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

// data: Model data
var Data = function(data) {
	// Model
	var self = this;
	self.id = ko.observable(data.id);
	self.name = ko.observable(data.name);
	self.image_url = ko.observable(data.image_url);
	self.url = ko.observable((isMobile.any())?data.mobile_url:data.url);
	self.display_phone = ko.observable(data.display_phone);
	self.review_count = ko.observable(data.review_count);
	self.categories = ko.observableArray(data.categories);
	self.rating = ko.observable(data.rating);
	self.rating_img_url_small = ko.observable(data.rating_img_url_small);
	self.snippet_text = ko.observable(data.snippet_text);
	self.location_city = ko.observable(data.location_city);
	var str_address = "";
	for(var i=0; i<data.location_display_address.length-1; i++)
		str_address += data.location_display_address[i] +", ";
	str_address += self.location_city();
	self.location_display_address = ko.observable(str_address);
	self.location_coordinate = ko.observable(data.location_coordinate);
	self.videoId = ko.observable(data.videoId);
	self.title = ko.observable(data.title);
	self.wiki_url = ko.observable(data.wiki_url);
};

// Knockout ViewModel
var viewModel = function() {
	var self = this;
	// Data search and filter
	self.dataListStore = observableStoredArray("data_list_stored");
	self.keywordList = observableStoredArray("keyword_list_stored");
	self.dataList = ko.observableArray([]);
	self.filter_key = ko.observable("");
	// Initialize flag for dataList
	self.flag_init = observableStored("flag_init");
	self.flag_init(false);

	// Initialize
	if(self.dataListStore().length === 0) {
		init_data.forEach( function(item) {
			self.dataListStore.push(item);
			self.dataList.push(new Data(item));
		});
		init_keyword.forEach( function(item) {
			self.keywordList.push(item);
		});
	} else {
		self.dataList.removeAll();
		self.dataListStore().forEach( function(item) {
			var d = new Data(item);
			self.dataList.push(d);
			// Build marker
			makeMarker(d);
		});
		self.flag_init(true);
	}

	// Add new item to Knockout model
	// item: yelp data
	// wiki_data: wikipedia data
	// youtube_data: youtube data
	self.addItem = function(item, wiki_data, youtube_data) {
		// Add only if it is a new element
		var match = ko.utils.arrayFirst(self.dataList(), function(item_comp) {
			return (item.id === item_comp.id());
		});
		// If there isn't any matches
		if(!match) {
			// Add wikipedia and youtube data
			item.videoId = youtube_data[Math.floor((Math.random() * youtube_data.length))].videoId;
			item.title = wiki_data.title;
			item.wiki_url = wiki_data.url;
			// Add element at the beginning of the array
			self.dataList.push(new Data(item));
			self.dataListStore.push(item);
			// Build marker
			makeMarker(new Data(item));
			var arr = [];
			// Add element to the filtering keyword array
			arr.push((item.categories[0][0]).capitalizeFirstLetter());
			arr.push((item.location_city).capitalizeFirstLetter());
			$.each(arr, function(index, value) {
				if ($.inArray(value, self.keywordList()) === -1)
					self.keywordList.push(value);
			});
			// Order array
			self.keywordList.sort();
		}
	};

	// Filtering element from dataList
	ko.computed(function() {
		if (self.filter_key()) {
			// Remove from dataList filtered element
			var list_tmp = ko.utils.arrayFilter(self.dataList(), function(item) {
				return ((item.location_city() === self.filter_key()) ||
					(item.categories()[0][0] === self.filter_key()));
			});
			var found;
			var arr_index = [];
			$.each(self.dataList(), function(index_d, value_d) {
				found = false;
				$.each(list_tmp, function(index_l, value_l) {
					if(value_d.id() === value_l.id())
						found = true;
				});
				if(!found) arr_index.push(index_d);
			});
			(arr_index.reverse()).forEach( function(item) {
				self.dataList.splice(item, 1);
				self.dataListStore.splice(item, 1);
			});
			// Remove linked marker of deleted element
			arr_index = [];
			$.each(markers, function(index_m, value_m) {
				found = false;
				$.each(self.dataList(), function(index_d, value_d) {
					if(value_d.id() === value_m.id)
						found = true;
				});
				if(!found) arr_index.push(index_m);
			});
			(arr_index.reverse()).forEach( function(item) {
				markers[item].setMap(null);
				markers.splice(item, 1);
			});
			// Reset the selected element
			self.filter_key(null);
			// Remove the filtering keywords
			var arr_keyword = [];
			$.each(list_tmp, function(index, value) {
				if ($.inArray(value.location_city(), arr_keyword) === -1)
					arr_keyword.push(value.location_city());
				if ($.inArray(value.categories()[0][0], arr_keyword) === -1)
					arr_keyword.push(value.categories()[0][0]);

			});
			arr_keyword.sort();
			self.keywordList.removeAll();
			self.keywordList(arr_keyword);
		}
	}, self);
};

var vm = new viewModel();
ko.applyBindings( vm );

// Jquery get request of wikipedia data
// w_location: term to search
// callback: callback to return result object
function wikiRequestData(w_location, callback) {
	// Set the parameters request
	var message = {
		'action': 'https://'+((language[0]!==undefined)?language[0]:'en')+'.wikipedia.org/w/api.php',
		'method': 'GET',
		'parameters': '?action=opensearch&search=' + w_location + '&format=json&callback=wikiCallback'
	};
	// Return promise for when
	return $.ajax({
		type: message.method,
		url: message.action + message.parameters,
		dataType: "jsonp",
		jsonp: "callback",
		success: function(data) { // Success function
			var wiki_data;
			if(data !== undefined) {
				wiki_data = {
					'title': data[1][0],
					'description': data[2][0],
					'url': data[3][0]
				};
			} else console.log("Failed to get wikipedia resources.");

			clearTimeout(wikiRequestTimeout); // Clear timeout variable
			callback(wiki_data); // Pass wikipedia data
		},
		error: function(data_error) { // Error function
					wikiRequestTimeout = setTimeout(function(error) {
						console.log("Failed to get wikipedia resources. Error Status: " + error + ".");
					}, 8000, JSON.stringify(data_error.status));
				}
	});
}

// Jquery get request of yelp data
// yelp_city: city to search
// yelp_business: business to search
// callback: callback to return result object
function yelpRequestData(yelp_city, yelp_business, callback) {
	// Set the parameters request
	var auth = {
		// Update with auth tokens
		consumerKey: "6isCPjgy1XxOmrEw1G0cYQ",
		consumerSecret: "", // <----------------------------HERE THE YELP API CONSUMER SECRET
		accessToken: "", // <---------------------------------HERE THE YELP API TOKEN
		accessTokenSecret: "", // <--------------------------HERE THE YELP API TOKEN SECRET
		serviceProvider: { signatureMethod: "HMAC-SHA1"	}
	};
	// Set the parameters request
	var term = yelp_business;
	var location = yelp_city;
	var accessor = {
		consumerSecret: auth.consumerSecret,
		tokenSecret: auth.accessTokenSecret
	};
	// Set the parameters request
	var parameters = [];
	parameters.push(['term', term]);
	parameters.push(['location', location]);
	parameters.push(['sort', '2']);
	parameters.push(['callback', 'cb']);
	parameters.push(['oauth_consumer_key', auth.consumerKey]);
	parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
	parameters.push(['oauth_token', auth.accessToken]);
	parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
	// Set the parameters request
	var message = {
		'action': 'https://api.yelp.com/v2/search',
		'method': 'GET',
		'parameters': parameters
	};
	// OAuth generate the key value for authentication request
	OAuth.setTimestampAndNonce(message);
	OAuth.SignatureMethod.sign(message, accessor);
	var parameterMap = OAuth.getParameterMap(message.parameters);
	parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);
	// Return promise for when
	return $.ajax({
		type: message.method,
		url: message.action,
		data: parameterMap,
		cache: true,
		dataType: 'jsonp',
		jsonpCallback: 'cb',
		success: function(data) { // Success function
			var res = data.businesses;
			var yelp_data = [];
			if(res.length > 0) {
				for(var i=0; i<res.length; i++) {
					if(!res[i].is_closed) {
						yelp_data[i] = {
							'id': res[i].id,
							'name': res[i].name,
							'image_url': res[i].image_url,
							'url': res[i].url,
							'mobile_url': res[i].mobile_url,
							'phone': res[i].phone,
							'display_phone': res[i].display_phone,
							'review_count': res[i].review_count,
							'categories': res[i].categories,
							'rating': res[i].rating,
							'rating_img_url': res[i].rating_img_url,
							'rating_img_url_small': res[i].rating_img_url_small,
							'rating_img_url_large': res[i].rating_img_url_large,
							'snippet_text': res[i].snippet_text,
							'snippet_image_url': res[i].snippet_image_url,
							'location_address': res[i].location.address,
							'location_display_address': res[i].location.display_address,
							'location_city': res[i].location.city,
							'location_state_code': res[i].location.state_code,
							'location_postal_code': res[i].location.postal_code,
							'location_country_code': res[i].location.country_code,
							'location_coordinate': res[i].location.coordinate
						};
					}
				}
			} else console.log("Failed to get yelp resources.");

			clearTimeout(yelpRequestTimeout); // Clear timeout variable
			callback(yelp_data); // Pass yelp data
		},
		error: function(data_error) { // Error function
					yelpRequestTimeout = setTimeout(function(error) {
						console.log("Failed to get yelp resources. Error: " + error + ".");
						errorMessageBuild(".site-wrap", 'Yelp Service Not Available');
						setTimeout(function () {
							$('.header-item').show();
							$('body').css('overflow-y', 'visible');
							$('#error-msg').remove();
						}, 6000);
					}, 8000, JSON.stringify(data_error.status));
				}
	});
}

// Jquery get request of youtube data
// youtube_key: term to search
// callback: callback to return result object
function youtubeRequestData(youtube_key, callback) {
	// Set the parameters request
	var message = {
		'action': 'https://www.googleapis.com/youtube/v3/search',
		'method': 'GET'
	};
	// Return promise for when
	return $.ajax({
		cache: false,
		data: $.extend({
			// Update with api key
			key: '', // <----------------------------------------HERE THE YOUTUBE API KEY
			q: youtube_key,
			part: 'snippet',
			type: 'video',
			safeSearch: 'strict',
			order: 'date',
			videoSyndicated: true,
			videoDefinition: 'high',
			videoEmbeddable: 'true'
		}, {maxResults:50}),
		type: message.method,
		dataType: 'jsonp',
		jsonpCallback: 'cb',
		url: message.action,
		success: function(data) { // Success function
			var res = data.items;
			var youtube_data = [];
			if(res.length > 0) {
				for(var i=0; i<res.length; i++) {
					youtube_data[i] = {
						'videoId': res[i].id.videoId,
						'publishedAt': res[i].snippet.publishedAt,
						'channelId': res[i].snippet.channelId,
						'title': res[i].snippet.title,
						'description': res[i].snippet.description,
						'thumbnails': res[i].snippet.thumbnails
					};
				}
			} else console.log("Failed to get youtube resources.");

			clearTimeout(youtubeRequestTimeout); // Clear timeout variable
			callback(youtube_data); // Pass youtube data
		},
		error: function(data_error) { // Error function
					youtubeRequestTimeout = setTimeout(function(error) {
						console.log("Failed to get youtube resources. Error Status: " + error + ".");
					}, 8000, JSON.stringify(data_error.status));
				}
	});
}

// Get data (yotube/yelp/wikipedia) after pressing enter
$('input[name=search]').on('keydown', function(e) {
	if(e.which === 13) { // Enter key code
		e.preventDefault();
		// Split result
		var result = this.value.split(',');
		var yelp_data;
		var youtube_data;
		var wiki_data;
		// Waiting the results yelp, wikipedia, youtube
		$.when (
			yelpRequestData(result[0], result[1], function (data) {
				yelp_data = data;
		}))
		.then (
			wikiRequestData(result[0], function (data) {
				wiki_data = data;
		}))
		.then (
			youtubeRequestData(result[0]+" "+result[1], function (data) {
				youtube_data = data;
		}))
		.always (function() { // Execute anyway even in failure case
			if(yelp_data.length > 0) {
				// Remove list items
				// $('#list-items').empty();
				var i=0;
				// Data from yelp
				yelp_data.forEach(function(data) {
					// Add new data to model
					vm.addItem(data, wiki_data, youtube_data);
				});
			}
		})
		.fail(function(){ // Failure case
			console.log("Failed to get resources.");
		});
	}
});