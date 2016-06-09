'use strict';

var map; // Map
var markers = []; // Map markers
var iconMarker, // Marker icon
	iconMarkerLarge; // Large marker icon
var infowindow; // Infowindow
var errorTimeout; // Set timeout error

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
	return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() ||
		isMobile.Opera() || isMobile.Windows());
	}
};

// Google Map initialize
window.initialize = function () {
	// Create map
	map = new google.maps.Map(document.getElementsByClassName('map')[0], {
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
	// Create marker customize icon
	iconMarker = new google.maps.MarkerImage(
		'../img/marker-icon.png',
		null,
		null,
		null,
		new google.maps.Size(32, 32)
	);
	// Create large marker customize icon
	iconMarkerLarge = new google.maps.MarkerImage(
		'../img/marker-icon.png',
		null,
		null,
		null,
		new google.maps.Size(64, 64)
	);
	// Create infowindow
	infowindow = new google.maps.InfoWindow();
	// var flag_obj = JSON.parse(localStorage["__amplify__flag_init"]);
	var request = ['firenze','museum'];
	// Request data at the beginning
	google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
		// Get data from ajax call to yelp, youtube, wikipedia
		getRequestedData(request);
		// Initialize dataList
		vm.dataList.removeAll();
		vm.dataListStored().forEach( function(item) {
			var data = new Data(item);
			// Build marker
			data.marker = makeMarker(data);
			// Add new element to dataList
			vm.dataList.push(data);
		});
	});
};

// Add a marker and infowindow at latitude, longitude
// latLng: latitude and longitude
// id: id for listner
// infoHTML: Infowindow html code
function placeMarkerAndPanTo(latLng, id, infoHTML) {
	// Create marker
	var marker = new google.maps.Marker({
		position: latLng,
		map: map,
		animation: google.maps.Animation.DROP,
		icon: iconMarker
	});
	// Add marker identifier
	marker.id = id;
	// Add marker latitude and longitude
	marker.latLng = latLng;
	// Add listener click on marker to open infowindow
	// and bouncing animation of relative marker,
	// stopping other markers animation, and
	// scrolling datalist
	marker.addListener('click', function() {
		infowindow.setContent(infoHTML);
		infowindow.open(map, this);
		for(var i=0; i<markers.length; i++)
			markers[i].setAnimation(null);
		marker.setAnimation(google.maps.Animation.BOUNCE);
		$(".side-nav-item").animate({
			scrollTop: $('#'+id).offset().top-150+$(".side-nav-item").scrollTop()
		}, 600);
	});
	// Stop marker animation on closing infowindow
	google.maps.event.addListener(infowindow,'closeclick',function(){
		marker.setAnimation(null);
	});
	// Add listener mouse over/out from markers
	// change background color list items
	marker.addListener('mouseover', function() {
		$('#'+id).css('background-color', 'rgba(255, 241, 75, 0.9)');
	});
	marker.addListener('mouseout', function() {
		$('#'+id).css('background-color', '#ffffff');
	});
	// Add marker to markers
	markers.push(marker);
	// Set map to the last given LatLng
	map.panTo(latLng);
	return marker;
}

// Create marker
// data: data to build info window
function makeMarker(data) {
	// Infowindow html code
	var infoHTML = '<div class="info-container">'+
		'<div class="info-box-left">'+
		'<img src="'+data.imageUrl()+'" width="60" hiegth="60" alt="Place photo">'+
		'</div>'+
		'<div class="info-box-right">'+
		data.name()+'<br>'+
		'<span class="text-rate">'+data.rating()+' </span><img src="'+data.ratingImgUrlSmall()+'" width="50" hiegth="10"><br>'+
		((data.wikiUrl() !== undefined)?('<a href="'+data.wikiUrl()+'">wiki#'+data.title()+'</a><br>'):'')+
		((data.videoId() !== undefined)?('<a href="https://www.youtube.com/watch?v='+data.videoId()+'">youtube:pick</a>'):'')+
		'</div>'+
		'</div>';
	// Add markers to the map
	return placeMarkerAndPanTo({lat: data.locationCoordinate().latitude, lng: data.locationCoordinate().longitude}, data.id(), infoHTML);
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

// Stored observable array
function observableStoredArray(key) {
	var storedData = amplify.store(key);
	var data = (storedData !== undefined) ? [storedData] : [];
	return ko.observableArray(data).extend({
		localArrayStore: key
	});
}

// Stored Observable
function observableStored(key) {
	var storedData = amplify.store(key);
	var data = (storedData !== undefined) ? storedData : "";
	return ko.observable(data).extend({
		localStore: key
	});
}

// Check if string start with startsWith
// string: string to compare
// startsWith: starting set of characters to compare
var stringStartsWith = function (string, startsWith) {
	string = string || "";
	if (startsWith.length > string.length)
		return false;
	return string.substring(0, startsWith.length) === startsWith;
};

// data: Model data
var Data = function(data) {
	// Model
	var self = this;
	self.id = ko.observable(data.id);
	self.name = ko.observable(data.name);
	self.imageUrl = ko.observable(data.image_url);
	self.url = ko.observable((isMobile.any())?data.mobile_url:data.url);
	self.displayPhone = ko.observable(data.display_phone);
	self.reviewCount = ko.observable(data.review_count);
	self.categories = ko.observableArray(data.categories);
	self.rating = ko.observable(data.rating);
	self.ratingImgUrlSmall = ko.observable(data.rating_img_url_small);
	self.snippetText = ko.observable(data.snippet_text);
	self.locationCity = ko.observable(data.location.city);
	var strAddress = "";
	for(var i=0; i<data.location.display_address.length-1; i++)
		strAddress += data.location.display_address[i] +", ";
	strAddress += self.locationCity();
	self.locationDisplayAddress = ko.observable(strAddress);
	self.locationCoordinate = ko.observable(data.location.coordinate);
	self.videoId = ko.observable(data.videoId);
	self.title = ko.observable(data.title);
	self.wikiUrl = ko.observable(data.wikiUrl);
};

// Knockout ViewModel
var viewModel = function() {
	var self = this;
	// Data list element as stored observable array
	self.dataListStored = observableStoredArray("data_list_stored");
	// Data list element as observable array
	self.dataList = ko.observableArray([]);
	// Search value observable
	self.keyword = ko.observable("");
	// Filter value observable
	self.filter = ko.observable("");
	// Toggle class elment stored observable
	self.toggleClass = observableStored("toggle_class");
	// Initialize toggle class element
	if(self.toggleClass === undefined) self.toggleClass("");
	// Help observable
	self.helpText = ko.observable();
	self.helpText = '<p><font color="red"><b>--REAMD.md for usage--</b><br></font>'+
					'<b>How to use the Search:</b><br>'+
					'e.g. los angeles<br>'+
					'e.g. paris, restaurant<br>'+
					'<b>How to use the Filter:<br></b>'+
					'Insert the name to filter.<br>'+
					'(<font size="1"><a href="https://www.yelp.com/">Yelp</a><sup>©</sup>, '+
					'<a href="https://www.wikipedia.org/">Wikipedia</a><sup>©</sup>, '+
					'<a href="https://www.youtube.com/">Youtube</a><sup>©</sup></font>)'+
					'</p>';
	// Add new item to Knockout model
	// item: yelp data
	// wikiData: wikipedia data
	// youtubeData: youtube data
	self.addItem = function(item, wikiData, youtubeData) {
		// Add only if it is a new element
		var match = ko.utils.arrayFirst(self.dataList(), function(itemComp) {
			return (item.id === itemComp.id());
		});
		// If there isn't any matches
		if(!match) {
			// Add wikipedia and youtube data
			item.videoId = youtubeData[Math.floor((Math.random() * youtubeData.length))].id.videoId;
			item.title = wikiData[1][0];
			item.wikiUrl = wikiData[3][0];
			// Create new data element
			var data = new Data(item);
			// Build marker
			data.marker = makeMarker(data);
			// Add element to observable dataList
			self.dataList.push(data);
			// Add element to observable dataListStored
			self.dataListStored.push(item);
		}
	};
	// Get data (youtube/yelp/wikipedia) after pressing enter
	self.searchItems = function(data, event){
		if(event.keyCode === 13) { // Enter key code
			// Split result
			var request = self.keyword().split(',');
			if(self.keyword().trim() !== "" && self.keyword() !== undefined)
				getRequestedData(request);
		}
		return true;
	};
	// Filter the list elements using the filter text
	self.filteredItems = ko.computed(function() {
		var filter = self.filter().toLowerCase();
		if (!filter) {
			for(var i=0; i<markers.length; i++) markers[i].setVisible(true);
			return self.dataList();
		} else {
			return ko.utils.arrayFilter(self.dataList(), function(data) {
				var filterValue = stringStartsWith(data.name().toLowerCase(), filter) ||
				stringStartsWith(data.locationCity().toLowerCase(), filter);
				var marker = data.marker;
				if(filterValue)
					marker.setVisible(true);
				else
					marker.setVisible(false);
				return filterValue;
			});
		}
	}, self);
	// Add class to open the panel
	self.openPanel = function() {
		if(self.toggleClass() === "open")
			self.toggleClass("");
		else
			self.toggleClass("open");
	};
	// Open marker function
	self.openMarker = function(id) {
		return function() {
			var marker;
			for(var i=0; i<markers.length; i++)
				if(markers[i].id === id()) {
					marker = markers[i];
					google.maps.event.trigger(marker, 'click');
				}
			map.panTo(marker.latLng);
			map.setZoom(16);
		};
	};
	// Add mouseover event to list items
	self.mouseOver = function(id) {
		return function () {
			for(var i=0; i<markers.length; i++)
				if(markers[i].id === id()) {
					var marker = markers[i];
					marker.setIcon(iconMarkerLarge);
				}
		};
	};
	// Add mouseout event to list items
	self.mouseOut = function(id) {
		return function () {
			for(var i=0; i<markers.length; i++)
				if(markers[i].id === id()) {
					var marker = markers[i];
					marker.setIcon(iconMarker);
				}
		};
	};
	// Close Help tip
	self.closeHelpTip = function() {
		$('.help-tip p').toggle();
	};
};

var vm = new viewModel();
ko.applyBindings( vm );

// Build message error
// tag: element where append div error
// msg: error message
function errorMessageBuild(tag, msg) {
	$('.error-msg').remove();
	$('.header-item').hide();
	$('body').css('overflow-y', 'hidden');
	$(tag).prepend('<div class="error error-msg">'+msg+'</div>');
}

// Jquery get request of wikipedia data
// wikiLocation: term to search
function wikiRequestData(wikiLocation) {
	// Set the parameters request
	var message = {
		'action': 'https://'+((language[0]!==undefined)?language[0]:'en')+'.wikipedia.org/w/api.php',
		'method': 'GET',
		'parameters': '?action=opensearch&search=' + wikiLocation + '&format=json&callback=wikiCallback'
	};
	// Return promise for when
	return $.ajax({
		type: message.method,
		url: message.action + message.parameters,
		dataType: "jsonp",
		jsonp: "callback"
	}).fail(function(jqXHR, textStatus) { // Fail function
			clearTimeout(errorTimeout);
			errorMessageBuild(".site-wrap", 'Wikipedia Not Available or Wrong Request');
			errorTimeout = setTimeout(function () {
				$('.header-item').show();
				$('body').css('overflow-y', 'visible');
				$('.error-msg').remove();
			}, 5000);
	});
}

// Jquery get request of yelp data
// yelpCity: city to search
// yelpBusiness: business to search
function yelpRequestData(yelpCity, yelpBusiness) {
	// Set the parameters request
	var auth = {
		// Update with auth tokens
		consumerKey: "6isCPjgy1XxOmrEw1G0cYQ",
		consumerSecret: "", // <--------------------HERE THE YELP API CONSUMER SECRET
		accessToken: "", // <--------------------------HERE THE YELP API TOKEN
		accessTokenSecret: "", // <--------------------HERE THE YELP API TOKEN SECRET
		serviceProvider: { signatureMethod: "HMAC-SHA1"	}
	};
	// Set the parameters request
	var term = yelpBusiness;
	var location = yelpCity;
	var accessor = {
		consumerSecret: auth.consumerSecret,
		tokenSecret: auth.accessTokenSecret
	};
	// Set the parameters request
	var parameters = [];
	if(yelpBusiness !== undefined) parameters.push(['term', term]);
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
		jsonpCallback: 'cb'
		}).fail(function(jqXHR, textStatus) { // Fail function
			clearTimeout(errorTimeout);
			errorMessageBuild(".site-wrap", 'Yelp Not Available or Wrong Request');
			errorTimeout = setTimeout(function () {
				$('.header-item').show();
				$('body').css('overflow-y', 'visible');
				$('.error-msg').remove();
			}, 5000);
		});
}

// Jquery get request of youtube data
// youtubeKey: term to search
function youtubeRequestData(youtubeKey) {
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
			key: '', // <--------------------HERE THE YOUTUBE API KEY
			q: youtubeKey,
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
		url: message.action
		}).fail(function(jqXHR, textStatus) { // Fail function
			clearTimeout(errorTimeout);
			errorMessageBuild(".site-wrap", 'Youtube Not Available or Wrong Request');
			errorTimeout = setTimeout(function () {
				$('.header-item').show();
				$('body').css('overflow-y', 'visible');
				$('.error-msg').remove();
			}, 5000);
		});
}

// Get data (youtube/yelp/wikipedia)
// request: request array
function getRequestedData(request) {
	// Waiting for data from yelp, youtube, wikipedia
	$.when (yelpRequestData(request[0], request[1]), youtubeRequestData(((request[1]!==undefined)?(request[0]+" "+request[1]):request[0])), wikiRequestData(request[0]))
	.done (function(yelpData, youtubeData, wikiData) {
		if(yelpData[0].businesses.length > 0) {
			// Add data from yelp, youtube, wikipedia
			yelpData[0].businesses.forEach(function(data) {
				// Add new data to model
				vm.addItem(data, wikiData[0], youtubeData[0].items);
			});
		}
	})
	.fail(function(){ // Failure case
		clearTimeout(errorTimeout);
		errorMessageBuild(".site-wrap", 'Service Not Available');
		errorTimeout = setTimeout(function () {
			$('.header-item').show();
			$('body').css('overflow-y', 'visible');
			$('.error-msg').remove();
		}, 5000);
	});
}