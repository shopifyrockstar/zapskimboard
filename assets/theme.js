/*jshint -W087 */
/*jshint sub:true*/
/*jshint esnext: true */
/*jshint loopfunc:true */

// CustomEvent polyfill
(function() {
  if (typeof window.CustomEvent === "function") return false; //If not IE

  function CustomEvent(event, params) {
	params = params || { bubbles: false, cancelable: false, detail: undefined };
	var evt = document.createEvent("CustomEvent");
	evt.initCustomEvent(
	  event,
	  params.bubbles,
	  params.cancelable,
	  params.detail
	);
	return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

if (typeof theme === "undefined") {
  theme = {};
}
var html = $("html");
var body = $("body");
var winWidth = $(window).width();
var winHeight = $(window).height();
theme.mobileBrkp = 768;
theme.tabletBrkp = 981;
 
theme.LibraryLoader = (function() {
  var types = {
    link: 'link',
    script: 'script'
  };

  var status = {
    requested: 'requested',
    loaded: 'loaded'
  };

  var cloudCdn = 'https://cdn.shopify.com/shopifycloud/';

  var libraries = {
    youtubeSdk: {
      tagId: 'youtube-sdk',
      src: 'https://www.youtube.com/iframe_api',
      type: types.script
    },
    plyr: {
      tagId: 'plyr',
      src: 'https://cdn.shopify.com/s/files/1/2333/0623/t/70/assets/plyr.min.js?v=12623909983095429511',
      type: types.script
    },
    plyrShopify: {
      tagId: 'plyr-shopify',
      src: cloudCdn + 'shopify-plyr/v1.0/shopify-plyr-legacy.en.js',
      type: types.script
    },
    plyrShopifyStyles: {
      tagId: 'plyr-shopify-styles',
      src: cloudCdn + 'shopify-plyr/v1.0/shopify-plyr.css',
      type: types.link
    },
    shopifyXr: {
      tagId: 'shopify-model-viewer-xr',
      src: cloudCdn + 'shopify-xr-js/assets/v1.0/shopify-xr.en.js',
      type: types.script
    },
    modelViewerUi: {
      tagId: 'shopify-model-viewer-ui',
      src: cloudCdn + 'model-viewer-ui/assets/v1.0/model-viewer-ui.en.js',
      type: types.script
    },
    modelViewerUiStyles: {
      tagId: 'shopify-model-viewer-ui-styles',
      src: cloudCdn + 'model-viewer-ui/assets/v1.0/model-viewer-ui.css',
      type: types.link
    },
    masonry: {
      tagId: 'masonry',
      src: 'https://cdn.shopify.com/s/files/1/2333/0623/t/70/assets/masonry.min.js?v=5294686724106038817',
      type: types.script
    },
    autocomplete: {
      tagId: 'autocomplete',
      src: 'https://cdn.shopify.com/s/files/1/2333/0623/t/70/assets/autocomplete.min.js?v=4264706039149904448',
      type: types.script
    },
	photoswipe: {
      tagId: 'photoswipe',
      src: 'https://cdn.shopify.com/s/files/1/2333/0623/t/70/assets/photoswipe.min.js?v=2536502651186615362',
      type: types.script
    },
	fecha: {
      tagId: 'fecha',
      src: 'https://cdn.shopify.com/s/files/1/2333/0623/t/70/assets/fecha.min.js?v=7789264902528830535',
      type: types.script
    }
  };

  function load(libraryName, callback) {
    var library = libraries[libraryName];

    if (!library) return;
    if (library.status === status.requested) return;

    callback = callback || function() {};
    if (library.status === status.loaded) {
      callback();
      return;
    }

    library.status = status.requested;

    var tag;

    switch (library.type) {
      case types.script:
        tag = createScriptTag(library, callback);
        break;
      case types.link:
        tag = createLinkTag(library, callback);
        break;
    }

    tag.id = library.tagId;
    library.element = tag;

    var firstScriptTag = document.getElementsByTagName(library.type)[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  function createScriptTag(library, callback) {
    var tag = document.createElement('script');
    tag.src = library.src;
    tag.addEventListener('load', function() {
      library.status = status.loaded;
      callback();
    });
    return tag;
  }

  function createLinkTag(library, callback) {
    var tag = document.createElement('link');
    tag.href = library.src;
    tag.rel = 'stylesheet';
    tag.type = 'text/css';
    tag.addEventListener('load', function() {
      library.status = status.loaded;
      callback();
    });
    return tag;
  }

  return {
    load: load
  };
})();

theme.StoreAvailability = function() {
	var selectors = {
  		storeAvailabilityContainer: '[data-store-availability-container]',
    	storeAvailabilityModalProductTitle: '[data-store-availability-modal-product-title]',
    	storeAvailabilityModalVariantTitle: '[data-store-availability-modal-variant-title]'
	};

	StoreAvailabilityInit = (function() {

	  function StoreAvailability(container) {
	    this.container = container;
	  }

	  StoreAvailability.prototype = Object.assign({}, StoreAvailability.prototype, {
	    updateContent: function(variantId, productTitle) {

	      var variantSectionUrl =
	        '/variants/' + variantId + '/?section_id=store-availability';
	      this.container.innerHTML = '';

	      var self = this;

	      fetch(variantSectionUrl)
	        .then(function(response) {
	          return response.text();
	        })
	        .then(function(storeAvailabilityHTML) {
	          if (storeAvailabilityHTML.trim() === '') {
	            return;
	          }

	          $('.product-single__store-availability-container').html(storeAvailabilityHTML);
	          $('.product-single__store-availability-container').html($('.product-single__store-availability-container').children().html());     
	          
	          self._updateProductTitle(productTitle);

	        });
	    },

	    _updateProductTitle: function(productTitle) {
	      var storeAvailabilityModalProductTitle = $(this.container).find(
	      	selectors.storeAvailabilityModalProductTitle
	      );

	      storeAvailabilityModalProductTitle.text(productTitle); 
	    }
	  });

	  return StoreAvailability;
	})();

	var storeAvailability;

	if ($('.js-product-single-box').find(selectors.storeAvailabilityContainer).length) {
		storeAvailability = new StoreAvailabilityInit(selectors.storeAvailabilityContainer);
	}

	if (storeAvailability) {
		document.addEventListener("venue:variant:update",function(event) {
			//if variant exists
			if (event.detail.variant !== null) {
				$(selectors.storeAvailabilityContainer).show();
				storeAvailability.updateContent(
					event.detail.variant.id, 
					event.detail.product.title
				);
			} else {
				$(selectors.storeAvailabilityContainer).hide();
			}
		});
	}
};

theme.homeMaps = function() {
  mapInit = function(mapId, mapSection, mapAddress, mapStyle, mapPin) {
	var geocoder;
	var map;

	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(1, 1);
	var myOptions = {
	  zoom: 14,
	  center: latlng,
	  disableDefaultUI: true,
	  scrollwheel: false,
	  keyboardShortcuts: false,
	  styles: mapStyles[mapStyle]
	};
	map = new google.maps.Map(document.getElementById(mapId), myOptions);

	if (geocoder) {
	  geocoder.geocode({ address: mapAddress }, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
		  if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
			map.setCenter(results[0].geometry.location);

			var marker = new google.maps.Marker({
			  position: results[0].geometry.location,
			  map: map,
			  icon: window[mapPin]
			});
		  }
		}
	  });
	}
  };

  theme.runMap = function(map) {
	var thisMap = $("#" + map);

	var mapId = thisMap.data("map-id");
	var mapSection = thisMap.data("map-section");
	var mapAddress = thisMap.data("map-address");
	var mapStyle = thisMap.data("map-style");
	var mapPin = thisMap.data("map-pin");

	mapInit(mapId, mapSection, mapAddress, mapStyle, mapPin);
  };

  function eachMapInit() {
	$(".js-map-ids").each(function() {
	  var thisMapId = $(this).data("map-id");
	  theme.runMap(thisMapId);
	});
  }

  //home map accordion
  function mapTrigger() {
	var item = $(".js-map-info");
	var trigger = $(".js-map-trigger");
	var items = item.hide(); //hide all items
	var activeClass = "js-active";

	//show and acivate first item in each map
	$(".js-map").each(function(i) {
	  $(this)
		.find(item)
		.first()
		.addClass(activeClass)
		.show();
	  $(this)
		.find(trigger)
		.first()
		.addClass(activeClass);
	});

	trigger.click(function() {
	  var thisItem = $(this).attr("href");
	  var theseItems = $(thisItem)
		.parents(".js-map")
		.find(".js-map-info");

	  //check if info is not active
	  if (!$(thisItem).hasClass(activeClass)) {
		theseItems.removeClass(activeClass).slideUp();
		$(thisItem)
		  .addClass(activeClass)
		  .slideDown();
	  }

	  //map canvas functions
	  $(this)
		.parents(".js-map")
		.find(".js-map-media")
		.removeClass(activeClass); //hide all within section
	  $('.js-map-media[data-map-id="' + thisItem + '"]').addClass(activeClass); //show active

	  //run current map function if it's hidden within tab
	  if ($(thisItem).find(".home-map__media-canvas").length) {
		var thisMapId = $(thisItem)
		  .find(".home-map__media-canvas")
		  .attr("id");

		if (typeof thisMapId != "undefined") {
		  theme.runMap(thisMapId);
		}
	  }

	  //check if info is not active
	  if (!$(this).hasClass(activeClass)) {
		trigger.removeClass(activeClass);
		$(this).addClass(activeClass);
	  }

	  return false;
	});
  }
  mapTrigger();

  //lazily initiate google maps
  var lazyMap = new LazyLoad({
	elements_selector: ".js-lazy-map",
	callback_set: function(el) {
	  if ($(".js-map-ids").length > 0) {
		if (typeof window.google === "undefined") {
		  //get google key or set empty var
		  var google_key;
		  if (typeof theme.map.key !== "undefined") {
			google_key = theme.map.key;
		  } else {
			google_key = "";
		  }

		  $.getScript(
			"https://maps.googleapis.com/maps/api/js?key=" + google_key
		  ).then(function() {
			//set SVG map pins
			mapPinDark = {
			  path:
				"M50,9.799c-15.188,0-27.499,12.312-27.499,27.499S50,90.201,50,90.201s27.499-37.715,27.499-52.902S65.188,9.799,50,9.799z   M50,44.813c-4.15,0-7.515-3.365-7.515-7.515S45.85,29.784,50,29.784s7.514,3.365,7.514,7.515S54.15,44.813,50,44.813z",
			  fillColor: "#000000",
			  anchor: new google.maps.Point(55, 85),
			  fillOpacity: 1,
			  scale: 0.6,
			  strokeWeight: 0
			};
			mapPinLight = {
			  path:
				"M50,9.799c-15.188,0-27.499,12.312-27.499,27.499S50,90.201,50,90.201s27.499-37.715,27.499-52.902S65.188,9.799,50,9.799z   M50,44.813c-4.15,0-7.515-3.365-7.515-7.515S45.85,29.784,50,29.784s7.514,3.365,7.514,7.515S54.15,44.813,50,44.813z",
			  fillColor: "#ffffff",
			  anchor: new google.maps.Point(55, 85),
			  fillOpacity: 1,
			  scale: 0.6,
			  strokeWeight: 0
			};
			mapStyles = {
			  light: [
				{
				  featureType: "water",
				  elementType: "geometry",
				  stylers: [{ color: "#e9e9e9" }, { lightness: 17 }]
				},
				{
				  featureType: "landscape",
				  elementType: "geometry",
				  stylers: [{ color: "#f0f0f0" }, { lightness: 20 }]
				},
				{
				  featureType: "road.highway",
				  elementType: "geometry.fill",
				  stylers: [{ color: "#ffffff" }, { lightness: 17 }]
				},
				{
				  featureType: "road.highway",
				  elementType: "geometry.stroke",
				  stylers: [
					{ color: "#ffffff" },
					{ lightness: 29 },
					{ weight: 0.2 }
				  ]
				},
				{
				  featureType: "road.arterial",
				  elementType: "geometry",
				  stylers: [{ color: "#ffffff" }, { lightness: 18 }]
				},
				{
				  featureType: "road.local",
				  elementType: "geometry",
				  stylers: [{ color: "#ffffff" }, { lightness: 16 }]
				},
				{
				  featureType: "poi",
				  elementType: "geometry",
				  stylers: [{ color: "#f0f0f0" }, { lightness: 21 }]
				},
				{
				  featureType: "poi.park",
				  elementType: "geometry",
				  stylers: [{ color: "#dedede" }, { lightness: 21 }]
				},
				{
				  elementType: "labels.text.stroke",
				  stylers: [
					{ visibility: "on" },
					{ color: "#ffffff" },
					{ lightness: 16 }
				  ]
				},
				{
				  elementType: "labels.text.fill",
				  stylers: [
					{ saturation: 36 },
					{ color: "#333333" },
					{ lightness: 40 }
				  ]
				},
				{
				  elementType: "labels.icon",
				  stylers: [{ visibility: "off" }]
				},
				{
				  featureType: "transit",
				  elementType: "geometry",
				  stylers: [{ color: "#f2f2f2" }, { lightness: 19 }]
				},
				{
				  featureType: "administrative",
				  elementType: "geometry.fill",
				  stylers: [{ color: "#fefefe" }, { lightness: 20 }]
				},
				{
				  featureType: "administrative",
				  elementType: "geometry.stroke",
				  stylers: [
					{ color: "#fefefe" },
					{ lightness: 17 },
					{ weight: 1.2 }
				  ]
				}
			  ],
			  dark: [
				{
				  featureType: "all",
				  elementType: "labels.text.fill",
				  stylers: [
					{ saturation: 36 },
					{ color: "#000000" },
					{ lightness: 40 }
				  ]
				},
				{
				  featureType: "all",
				  elementType: "labels.text.stroke",
				  stylers: [
					{ visibility: "on" },
					{ color: "#000000" },
					{ lightness: 16 }
				  ]
				},
				{
				  featureType: "all",
				  elementType: "labels.icon",
				  stylers: [{ visibility: "off" }]
				},
				{
				  featureType: "administrative",
				  elementType: "geometry.fill",
				  stylers: [{ color: "#000000" }, { lightness: 20 }]
				},
				{
				  featureType: "administrative",
				  elementType: "geometry.stroke",
				  stylers: [
					{ color: "#000000" },
					{ lightness: 17 },
					{ weight: 1.2 }
				  ]
				},
				{
				  featureType: "administrative",
				  elementType: "labels",
				  stylers: [{ visibility: "off" }]
				},
				{
				  featureType: "administrative.country",
				  elementType: "all",
				  stylers: [{ visibility: "simplified" }]
				},
				{
				  featureType: "administrative.country",
				  elementType: "geometry",
				  stylers: [{ visibility: "simplified" }]
				},
				{
				  featureType: "administrative.country",
				  elementType: "labels.text",
				  stylers: [{ visibility: "simplified" }]
				},
				{
				  featureType: "administrative.province",
				  elementType: "all",
				  stylers: [{ visibility: "off" }]
				},
				{
				  featureType: "administrative.locality",
				  elementType: "all",
				  stylers: [
					{ visibility: "simplified" },
					{ saturation: "-100" },
					{ lightness: "30" }
				  ]
				},
				{
				  featureType: "administrative.neighborhood",
				  elementType: "all",
				  stylers: [{ visibility: "off" }]
				},
				{
				  featureType: "administrative.land_parcel",
				  elementType: "all",
				  stylers: [{ visibility: "off" }]
				},
				{
				  featureType: "landscape",
				  elementType: "all",
				  stylers: [
					{ visibility: "simplified" },
					{ gamma: "0.00" },
					{ lightness: "74" }
				  ]
				},
				{
				  featureType: "landscape",
				  elementType: "geometry",
				  stylers: [{ color: "#000000" }, { lightness: 20 }]
				},
				{
				  featureType: "landscape.man_made",
				  elementType: "all",
				  stylers: [{ lightness: "3" }]
				},
				{
				  featureType: "poi",
				  elementType: "all",
				  stylers: [{ visibility: "off" }]
				},
				{
				  featureType: "poi",
				  elementType: "geometry",
				  stylers: [{ color: "#000000" }, { lightness: 21 }]
				},
				{
				  featureType: "road",
				  elementType: "geometry",
				  stylers: [{ visibility: "simplified" }]
				},
				{
				  featureType: "road.highway",
				  elementType: "geometry.fill",
				  stylers: [{ color: "#000000" }, { lightness: 17 }]
				},
				{
				  featureType: "road.highway",
				  elementType: "geometry.stroke",
				  stylers: [
					{ color: "#000000" },
					{ lightness: 29 },
					{ weight: 0.2 }
				  ]
				},
				{
				  featureType: "road.arterial",
				  elementType: "geometry",
				  stylers: [{ color: "#000000" }, { lightness: 18 }]
				},
				{
				  featureType: "road.local",
				  elementType: "geometry",
				  stylers: [{ color: "#000000" }, { lightness: 16 }]
				},
				{
				  featureType: "transit",
				  elementType: "geometry",
				  stylers: [{ color: "#000000" }, { lightness: 19 }]
				},
				{
				  featureType: "water",
				  elementType: "geometry",
				  stylers: [{ color: "#000000" }, { lightness: 17 }]
				}
			  ],
			  flat: [
				{
				  featureType: "administrative",
				  elementType: "labels.text.fill",
				  stylers: [{ color: "#6195a0" }]
				},
				{
				  featureType: "administrative.province",
				  elementType: "geometry.stroke",
				  stylers: [{ visibility: "off" }]
				},
				{
				  featureType: "landscape",
				  elementType: "geometry",
				  stylers: [
					{ lightness: "0" },
					{ saturation: "0" },
					{ color: "#f5f5f2" },
					{ gamma: "1" }
				  ]
				},
				{
				  featureType: "landscape.man_made",
				  elementType: "all",
				  stylers: [{ lightness: "-3" }, { gamma: "1.00" }]
				},
				{
				  featureType: "landscape.natural.terrain",
				  elementType: "all",
				  stylers: [{ visibility: "off" }]
				},
				{
				  featureType: "poi",
				  elementType: "all",
				  stylers: [{ visibility: "off" }]
				},
				{
				  featureType: "poi.park",
				  elementType: "geometry.fill",
				  stylers: [{ color: "#bae5ce" }, { visibility: "on" }]
				},
				{
				  featureType: "road",
				  elementType: "all",
				  stylers: [
					{ saturation: -100 },
					{ lightness: 45 },
					{ visibility: "simplified" }
				  ]
				},
				{
				  featureType: "road.highway",
				  elementType: "all",
				  stylers: [{ visibility: "simplified" }]
				},
				{
				  featureType: "road.highway",
				  elementType: "geometry.fill",
				  stylers: [{ color: "#fac9a9" }, { visibility: "simplified" }]
				},
				{
				  featureType: "road.highway",
				  elementType: "labels.text",
				  stylers: [{ color: "#4e4e4e" }]
				},
				{
				  featureType: "road.arterial",
				  elementType: "labels.text.fill",
				  stylers: [{ color: "#787878" }]
				},
				{
				  featureType: "road.arterial",
				  elementType: "labels.icon",
				  stylers: [{ visibility: "off" }]
				},
				{
				  featureType: "transit",
				  elementType: "all",
				  stylers: [{ visibility: "simplified" }]
				},
				{
				  featureType: "transit.station.airport",
				  elementType: "labels.icon",
				  stylers: [
					{ hue: "#0a00ff" },
					{ saturation: "-77" },
					{ gamma: "0.57" },
					{ lightness: "0" }
				  ]
				},
				{
				  featureType: "transit.station.rail",
				  elementType: "labels.text.fill",
				  stylers: [{ color: "#43321e" }]
				},
				{
				  featureType: "transit.station.rail",
				  elementType: "labels.icon",
				  stylers: [
					{ hue: "#ff6c00" },
					{ lightness: "4" },
					{ gamma: "0.75" },
					{ saturation: "-68" }
				  ]
				},
				{
				  featureType: "water",
				  elementType: "all",
				  stylers: [{ color: "#eaf6f8" }, { visibility: "on" }]
				},
				{
				  featureType: "water",
				  elementType: "geometry.fill",
				  stylers: [{ color: "#c7eced" }]
				},
				{
				  featureType: "water",
				  elementType: "labels.text.fill",
				  stylers: [
					{ lightness: "-49" },
					{ saturation: "-53" },
					{ gamma: "0.79" }
				  ]
				}
			  ],
			  clean_cut: [
				{
				  featureType: "road",
				  elementType: "geometry",
				  stylers: [{ lightness: 100 }, { visibility: "simplified" }]
				},
				{
				  featureType: "water",
				  elementType: "geometry",
				  stylers: [{ visibility: "on" }, { color: "#C6E2FF" }]
				},
				{
				  featureType: "poi",
				  elementType: "geometry.fill",
				  stylers: [{ color: "#C5E3BF" }]
				},
				{
				  featureType: "road",
				  elementType: "geometry.fill",
				  stylers: [{ color: "#D1D1B8" }]
				}
			  ],
			  minimal_dark: [
				{
				  featureType: "all",
				  elementType: "all",
				  stylers: [
					{ hue: "#ff0000" },
					{ saturation: -100 },
					{ lightness: -30 }
				  ]
				},
				{
				  featureType: "all",
				  elementType: "labels.text.fill",
				  stylers: [{ color: "#ffffff" }]
				},
				{
				  featureType: "all",
				  elementType: "labels.text.stroke",
				  stylers: [{ color: "#353535" }]
				},
				{
				  featureType: "landscape",
				  elementType: "geometry",
				  stylers: [{ color: "#656565" }]
				},
				{
				  featureType: "poi",
				  elementType: "geometry.fill",
				  stylers: [{ color: "#505050" }]
				},
				{
				  featureType: "poi",
				  elementType: "geometry.stroke",
				  stylers: [{ color: "#808080" }]
				},
				{
				  featureType: "road",
				  elementType: "geometry",
				  stylers: [{ color: "#454545" }]
				},
				{
				  featureType: "transit",
				  elementType: "labels",
				  stylers: [
					{ hue: "#000000" },
					{ saturation: 100 },
					{ lightness: -40 },
					{ invert_lightness: true },
					{ gamma: 1.5 }
				  ]
				}
			  ],
			  blue_water: [
				{
				  featureType: "administrative",
				  elementType: "labels.text.fill",
				  stylers: [{ color: "#444444" }]
				},
				{
				  featureType: "landscape",
				  elementType: "all",
				  stylers: [{ color: "#f2f2f2" }]
				},
				{
				  featureType: "poi",
				  elementType: "all",
				  stylers: [{ visibility: "off" }]
				},
				{
				  featureType: "road",
				  elementType: "all",
				  stylers: [{ saturation: -100 }, { lightness: 45 }]
				},
				{
				  featureType: "road.highway",
				  elementType: "all",
				  stylers: [{ visibility: "simplified" }]
				},
				{
				  featureType: "road.arterial",
				  elementType: "labels.icon",
				  stylers: [{ visibility: "off" }]
				},
				{
				  featureType: "transit",
				  elementType: "all",
				  stylers: [{ visibility: "off" }]
				},
				{
				  featureType: "water",
				  elementType: "all",
				  stylers: [{ color: "#46bcec" }, { visibility: "on" }]
				}
			  ]
			};
			eachMapInit();
		  });
		} else {
		  eachMapInit();
		}
	  }
	}
  });
};

theme.layoutSlider = function(slider) {
  $(window)
	.resize(function() {
	  //get sizes
	  winWidth = $(window).width();
	  var thisSlider = $(slider);

	  if (winWidth < theme.mobileBrkp) {
		thisSlider.not(".slick-initialized").slick({
		  slidesToShow: 1,
		  infinite: false,
		  dots: true,
		  arrows: false,
		  centerMode: true,
		  centerPadding: "30px"
		});
	  } else {
		//check if slick is initiated
		if (thisSlider.hasClass("slick-initialized")) {
		  //detach slick
		  thisSlider.slick("unslick");
		}
	  }
	  thisSlider.on("afterChange", function(event, slick, currentSlide) {
		$(this)
		  .find(".slick-current")
		  .addClass("js-slide-seen");
	  });
	})
	.resize();
};

theme.productCollSwatch = function() {
	$('.product__swatch__item').click(function() {
		var currentProduct = $(this).parents('.js-product');
		var currentProudctImage = currentProduct.find('.product__img');
		var variantProductImage = $(this).data('variant-image');
		var variantUrl = $(this).data('variant-url');

		//replace product image
		currentProudctImage.attr('data-src', variantProductImage);
		currentProudctImage.addClass('lazyload');

		//replace product variant link
		currentProduct.find('.js-product-link').attr('href', variantUrl);

		//set swatch to active
		currentProduct.find('.js-product-swatch-item').removeClass('js-active');
		$(this).addClass('js-active');

		return false;
	});
};

// Youtube API callback
// eslint-disable-next-line no-unused-vars
function onYouTubeIframeAPIReady() {
  theme.ProductVideo.loadVideos(theme.ProductVideo.hosts.youtube);
}

theme.ProductVideo = (function() {
  var productCarousel = $('.js-product-slider');

  var videos = {};

  var hosts = {
    html5: 'html5',
    youtube: 'youtube'
  };

  var selectors = {
    productMediaWrapper: '[data-product-media-wrapper]'
  };

  var attributes = {
    enableVideoLooping: 'enable-video-looping',
    videoId: 'video-id'
  };

  function init(videoContainer, sectionId) {
    if (!videoContainer.length) {
      return;
    }

    var videoElement = videoContainer.find('iframe, video')[0];
    var mediaId = videoContainer.data('mediaId');

    if (!videoElement) {
      return;
    }

    videos[mediaId] = {
      mediaId: mediaId,
      sectionId: sectionId,
      host: hostFromVideoElement(videoElement),
      container: videoContainer,
      element: videoElement,
      ready: function() {
        createPlayer(this);
      }
    };

    var video = videos[mediaId];

    switch (video.host) {
      case hosts.html5:
        theme.LibraryLoader.load(
          'plyrShopify',
          loadVideos.bind(this, hosts.html5)
        );
        theme.LibraryLoader.load('plyrShopifyStyles');
        break;
      case hosts.youtube:
        theme.LibraryLoader.load('youtubeSdk');
        break;
    }
  }

  function createPlayer(video) {
    if (video.player) {
      return;
    }

    var productMediaWrapper = video.container.closest(
      selectors.productMediaWrapper
    );
    var enableLooping = productMediaWrapper.data(attributes.enableVideoLooping);

    switch (video.host) {
      case hosts.html5:
        // eslint-disable-next-line no-undef
        video.player = new Shopify.Plyr(video.element, {
          controls: [
            'play',
            'progress',
            'mute',
            'volume',
            'play-large',
            'fullscreen'
          ],
          youtube:	{ noCookie: true },
          loop: { active: enableLooping },
          hideControlsOnPause: true,
          iconUrl:
            '//cdn.shopify.com/shopifycloud/shopify-plyr/v1.0/shopify-plyr.svg',
          tooltips: { controls: false, seek: true }
        });
        break;
      case hosts.youtube:
        var videoId = productMediaWrapper.data(attributes.videoId);

        video.player = new YT.Player(video.element, {
          videoId: videoId,
          events: {
            onStateChange: function(event) {
              if (event.data === 0 && enableLooping) event.target.seekTo(0);
            }
          }
        });
        break;
    }

    //on media reveal
   	productCarousel.on('beforeChange', function(event, slick, currentSlide, nextSlide){
   		var thisSectionId = $(this).parents('.section').data('section-id');
	   	if (thisSectionId == video.sectionId) {
			if (video.container.data('slide-id') == nextSlide) {
	  			if (!Modernizr.touchevents) {
	  				if (nextSlide !== currentSlide ) {//check if is first slide and is first load
	  					setTimeout(function() {
		  					if (video.host === hosts.html5) {
						        video.player.play();
						    }
						    if (video.host === hosts.youtube && video.player.playVideo) {
						        video.player.playVideo();
						    }
					    }, 300);
	  				}
	  			}
  			}
  		}
	});
	//on media hidden
	productCarousel.on('afterChange', function(event, slick, currentSlide){
		var thisSectionId = $(this).parents('.section').data('section-id');
	   	if (thisSectionId == video.sectionId) {
	      	if (video.container.data('slide-id') != currentSlide) {
	  			if (video.host === hosts.html5) {
			        video.player.pause();
			    }
			    if (video.host === hosts.youtube && video.player.pauseVideo) {
			        video.player.pauseVideo();
			    }
	      	}
      	}
    });

    //on XR launch
	$(document).on('shopify_xr_launch', function() {
		if (video.host === hosts.html5) {
	        video.player.pause();
	    }
	    if (video.host === hosts.youtube && video.player.pauseVideo) {
	        video.player.pauseVideo();
	    }
	});
  }

  function hostFromVideoElement(video) {
    if (video.tagName === 'VIDEO') {
      return hosts.html5;
    }
    if (video.tagName === 'IFRAME') {
      if (
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtube-nocookie\.com|youtu\.?be)\/.+$/.test(
          video.src
        )
      ) {
        return hosts.youtube;
      }
    }
    return null;
  }

  function loadVideos(host) {
    for (var key in videos) {
      if (videos.hasOwnProperty(key)) {
        var video = videos[key];
        if (video.host === host) {
          video.ready();
        }
      }
    }
  }

  function removeSectionVideos(sectionId) {
    for (var key in videos) {
      if (videos.hasOwnProperty(key)) {
        var video = videos[key];
        if (video.sectionId === sectionId) {
          if (video.player) video.player.destroy();
          delete videos[key];
        }
      }
    }
  }

  return {
    init: init,
    hosts: hosts,
    loadVideos: loadVideos,
    removeSectionVideos: removeSectionVideos
  };
})();

theme.ProductModel = (function() {
  var modelJsonSections = {};
  var models = {};
  var xrButtons = {};
  var productCarousel = $('.js-product-slider');

  var selectors = {
    mediaGroup: '[data-product-media-group]',
    xrButton: '[data-shopify-xr]'
  };

  function init(modelViewerContainers, sectionId) {
    modelJsonSections[sectionId] = {
      loaded: false
    };

    modelViewerContainers.each(function(index) {
      var $modelViewerContainer = $(this);
      var mediaId = $modelViewerContainer.data('media-id');
      var $modelViewerElement = $(
        $modelViewerContainer.find('model-viewer')[0]
      );
      var modelId = $modelViewerElement.data('model-id');

      if (index === 0) {
        var $xrButton = $modelViewerContainer
          .closest(selectors.mediaGroup)
          .find(selectors.xrButton);
        xrButtons[sectionId] = {
          $element: $xrButton,
          defaultId: modelId
        };
      }

      models[mediaId] = {
        modelId: modelId,
        sectionId: sectionId,
        $container: $modelViewerContainer,
        $element: $modelViewerElement
      };
    });

    window.Shopify.loadFeatures([
      {
        name: 'shopify-xr',
        version: '1.0',
        onLoad: setupShopifyXr
      },
      {
        name: 'model-viewer-ui',
        version: '1.0',
        onLoad: setupModelViewerUi
      }
    ]);
    theme.LibraryLoader.load('modelViewerUiStyles');
  }

  function setupShopifyXr(errors) {
    if (errors) return;

    if (!window.ShopifyXR) {
      document.addEventListener('shopify_xr_initialized', function() {
        setupShopifyXr();
      });
      return;
    }

    for (var sectionId in modelJsonSections) {
      if (modelJsonSections.hasOwnProperty(sectionId)) {
        var modelSection = modelJsonSections[sectionId];

        if (modelSection.loaded) continue;
        var $modelJson = $('#ModelJson-' + sectionId);

        window.ShopifyXR.addModels(JSON.parse($modelJson.html()));
        modelSection.loaded = true;
      }
    }
    window.ShopifyXR.setupXRElements();
  }

  function setupModelViewerUi(errors) {
    if (errors) {
      // When loadFeature is implemented, you can console or throw errors by doing something like this:
      // errors.forEach((error) => { console.warn(error.message); });
      return;
    }
    for (var key in models) {
      if (models.hasOwnProperty(key)) {
        var model = models[key];
        if (!model.modelViewerUi) {
          model.modelViewerUi = new Shopify.ModelViewerUI(model.$element);
        }
        setupModelViewerListeners(model);
      }
    }
  }

  function setupModelViewerListeners(model) {
      	var xrButton = xrButtons[model.sectionId];

		//on media reveal
	   	productCarousel.on('beforeChange', function(event, slick, currentSlide, nextSlide){
	   		var thisSectionId = $(this).parents('.section').data('section-id');
	   		if (thisSectionId == model.sectionId) {
		   		if (model.$container.data('slide-id') == nextSlide) {
	      			if (!Modernizr.touchevents) {
	      				if (nextSlide !== currentSlide ) {//check if is first slide and is first load
		      				xrButton.$element.attr('data-shopify-model3d-id', model.modelId);
		      				setTimeout(function() {
								model.modelViewerUi.play();	
				  			}, 300);
				      	}
			      	}
			      	$(this).slick("slickSetOption", "swipe", false);
	      		}
	      	}
		});
		//on media hidden
		productCarousel.on('beforeChange', function(event, slick, currentSlide, nextSlide){
			var thisSectionId = $(this).parents('.section').data('section-id');
	   		if (thisSectionId == model.sectionId) {
		      	if (model.$container.data('slide-id') == currentSlide && model.$container.data('slide-id') != nextSlide) {
		      		xrButton.$element.attr('data-shopify-model3d-id', xrButton.defaultId);
		      		model.modelViewerUi.pause();	
		      		$(this).slick("slickSetOption", "swipe", true);
		      	}
		    }
	    });

		//on XR launch
		$(document).on('shopify_xr_launch', function() {
			model.modelViewerUi.pause();
		});
  }

  function removeSectionModels(sectionId) {
    for (var key in models) {
      if (models.hasOwnProperty(key)) {
        var model = models[key];
        if (model.sectionId === sectionId) {
          delete models[key];
        }
      }
    }
    delete modelJsonSections[sectionId];
  }

  return {
    init: init,
    removeSectionModels: removeSectionModels
  };
})();


theme.productMediaInit = function() {
  $('.product-single__photo__item--video').each(function(index) {
	theme.ProductVideo.init($(this) ,$('.section--product-single').data('section-id'));
  });
  if ($('.product-single__photo__item--model').length > 0) {
	theme.ProductModel.init($('.product-single__photo__item--model'), $('.section--product-single').data('section-id'));
  }
};

theme.homeProductMediaInit = function() {  
  $('.product-featured__photo__item--video').each(function(index) {
	theme.ProductVideo.init($(this), $(this).parents('.section').data('section-id'));
  });
  $('.js-section__home-product').each(function(index) {
  	if ($(this).has('.product-featured__photo__item--model').length) {
  		theme.ProductModel.init($(this).find('.product-featured__photo__item--model'), $(this).children('.section').data('section-id'));
  	}
  });
};

theme.productSelect = function(sectionId, cssClass, historyState) {
  var productObj = document.getElementById("ProductJson-" + sectionId).innerHTML;
	  productObj = JSON.parse(productObj || '{}');

  var sectionClass = cssClass;

  var selectCallback = function(variant, selector) {
	var productId = productObj.id;
	sectionClass = sectionClass;

	document.dispatchEvent(
	  new CustomEvent("venue:variant:update", {
		bubbles: true,
		detail: { product: productObj, variant: variant, cssClass: cssClass }
	  })
	);

	//Price functions
	if (variant) {
      
      $(".product-single__photo__nav__dots ul li").each(function(){
        if( $(this).hasClass("show") ){
          $(this).removeClass("show");
        }        
      	var alt_text = $(this).find(".product-single__photo-thumbs__item img").attr("alt");
        console.log(alt_text);        
        var updated_variant_title = (variant.title).replace('"', '');
        if ( updated_variant_title.indexOf('/') > 0){
          updated_variant_title = updated_variant_title.substring(0, (updated_variant_title.indexOf('/') - 1));
          console.log("updated variant title is " + updated_variant_title);
        }
        if ( alt_text == updated_variant_title ){
          console.log("yes");
        	$(this).addClass("show");
        }
      });
	  // Selected a valid variant that is available.
	  // Variant unit pricing
  	  if (variant.unit_price_measurement) {
  		var unitPrice = $('.js-product-' + productId + ' .js-price-unit-price');
  		var unitMeasure = $('.js-product-' + productId + ' .js-price-unit-measure');

  		var unitCurrentPrice = Shopify.formatMoney(variant.unit_price, theme.money_format);
		var unitCurrentMeasure = variant.unit_price_measurement.reference_value === 1 ? variant.unit_price_measurement.reference_unit
				    			: variant.unit_price_measurement.reference_value +variant.unit_price_measurement.reference_unit;

		unitPrice.html('<span class="money">' + unitCurrentPrice + '</span>');
		unitMeasure.text(unitCurrentMeasure);
		$('.js-product-' + productId + ' .js-price-unit-note').show();
	  } else {
		$('.js-product-' + productId + ' .js-price-unit-note').hide();
	  }
	  if (variant.available) {
	  	// Variant stock notification
	  	if (variant.inventory_management) {
	  		var qtyLimit = $(".js-product-" + productId + " .js-price-stock-note").data('qty-limit');
          	var variantQty = $(".js-product-" + productId + " .js-product-variant-select option[value=" + variant.id + "]").data("qty");
	  		if (variantQty <= qtyLimit) {
	  			$(".js-product-" + productId + " .js-price-stock-note").show();
	  			$(".js-product-" + productId + " .js-price-stock-note span").text(variantQty);
	  		} else {
                $(".js-product-" + productId + " .js-price-stock-note").hide();
            }
	  	} else {
	  		$(".js-product-" + productId + " .js-price-stock-note").hide();
	  	}
		// Enabling add to cart button.
		$(".js-product-" + productId + " .js-product-add")
		  .removeClass("disabled")
		  .addClass("c-btn--plus")
		  .prop("disabled", false)
		  .find(".js-product-add-text")
		  .text(theme.t.add_to_cart);
		$(".js-product-" + productId + " .js-product-buttons").removeClass(
		  "product-single__add--sold"
		);
		// Compare at price
		if (variant.compare_at_price > variant.price) {
		  $(".js-product-" + productId + " .js-product-price-number").html(
			'<span class="product-' +
			  sectionClass +
			  "__price-number product-" +
			  sectionClass +
			  '__price-number--sale"><span class="money">' +
			  Shopify.formatMoney(variant.price, theme.money_format) +
			  "</span></span>"
		  );
		  $(".js-product-" + productId + " .js-product-price-compare").html(
			'<s class="product-' +
			  sectionClass +
			  '__price-compare"><span class="money">' +
			  Shopify.formatMoney(
				variant.compare_at_price,
				theme.money_format
			  ) +
			  "</span></s>"
		  );
		} else {
		  $(".js-product-" + productId + " .js-product-price-number").html(
			'<span class="product-' +
			  sectionClass +
			  '__price-number"><span class="money">' +
			  Shopify.formatMoney(variant.price, theme.money_format) +
			  "</span></span>"
		  );
		  $(".js-product-" + productId + " .js-product-price-compare").empty();
		}
	  } else {
	  	// Variant stock notification hide
	  	$(".js-product-" + productId + " .js-price-stock-note").hide();
		// Variant is sold out.
		$(".js-product-" + productId + " .js-product-add")
		  .addClass("disabled")
		  .removeClass("c-btn--plus")
		  .prop("disabled", true)
		  .find(".js-product-add-text")
		  .text(theme.t.sold_out);
		$(".js-product-" + productId + " .js-product-buttons").addClass(
		  "product-single__add--sold"
		);
		// Compare at price
		if (variant.compare_at_price > variant.price) {
		  $(".js-product-" + productId + " .js-product-price-number").html(
			'<span class="product-' +
			  sectionClass +
			  "__price-number product-" +
			  sectionClass +
			  '__price-number--sale"><span class="money">' +
			  Shopify.formatMoney(variant.price, theme.money_format) +
			  "</span></span>"
		  );
		  $(".js-product-" + productId + " .js-product-price-compare").html(
			'<s class="product-' +
			  sectionClass +
			  '__price-compare"><span class="money">' +
			  Shopify.formatMoney(
				variant.compare_at_price,
				theme.money_format
			  ) +
			  "</span></s>"
		  );
		} else {
		  $(".js-product-" + productId + " .js-product-price-number").html(
			'<span class="product-' +
			  sectionClass +
			  '__price-number"><span class="money">' +
			  Shopify.formatMoney(variant.price, theme.money_format) +
			  "</span></span>"
		  );
		  $(".js-product-" + productId + " .js-product-price-compare").empty();
		}
	  }
	} else {
	  // variant doesn't exist.
	  // Variant unit notificaton hide
	  $('.js-product-' + productId + ' .js-price-unit-note').hide();
	  // Variant stock notification hide
  	  $(".js-product-" + productId + " .js-price-stock-note").hide();
	  // Price and button
	  $(".js-product-" + productId + " .js-product-price-number").html('&nbsp;');
	  $(".js-product-" + productId + " .js-product-price-compare").empty();
	  $(".js-product-" + productId + " .js-product-add")
		.addClass("disabled")
		.prop("disabled", true)
		.find(".js-product-add-text")
		.text(theme.t.unavailable);
	}

	//slider functions
	var thisSlider = $(".js-product-" + productId + " .js-product-slider");
	function checkSlick(slideToGo) {
	  //move slider to variant after slick is init
	  var interval = setInterval(function() {
		if (thisSlider.hasClass("slick-initialized")) {
		  thisSlider.slick("slickGoTo", slideToGo);
		  clearInterval(interval);
		}
	  }, 100);
	}
	if (variant.featured_image !== null) {
		if (variant.featured_image.variant_ids.length > 0) {
			var mediaId = variant.featured_media.id;
			var slide = $(".js-product-" + productId + " .product-" + sectionClass + "__photo__item[data-media-id*=" + variant.featured_media.id + "]");
			var slideId = slide.attr("data-slide-id");

			checkSlick(slideId);
		} else {
		  checkSlick(0);
		}
	}

	document.dispatchEvent(
	  new CustomEvent("venue:variant:updated", {
		bubbles: true,
		detail: { product: productObj, variant: variant, cssClass: cssClass }
	  })
	);
  };

  //SWATCH functions
  //match swatch to dropdown
  $('.js-product-single-swatch :radio').change(function() {

	var optionIndex = $(this).closest('.js-product-single-swatch').attr('data-option-index');
	var optionValue = $(this).val();

	$(this)
	  .closest('form')
	  .find('.single-option-selector')
	  .eq(optionIndex - 1)
	  .val(optionValue)
	  .change();

	//update sub title text
	var value = $(this).val();
	var sub_title = $(this).parents('.js-product-single-swatch').find('.js-swatch-variant-title');
	sub_title.text(value);

  });
  //initial color title text
  $('.js-swatch-variant-title').text($('.js-swatch-color-item :radio:checked').val());

  //check if product selected
  if (productObj.onboarding !== true) {
	new Shopify.OptionSelectors("productSelect-" + sectionId, {
	  product: productObj,
	  onVariantSelected: selectCallback,
	  enableHistoryState: historyState
	});

	if (productObj.options.length == 1 && productObj.options[0] != "Title") {
	  // Add label if only one product option and it isn't 'Title'. Could be 'Size'.
	  $(".js-product-" + productObj.id + " .selector-wrapper:eq(0)").prepend(
		'<label for="productSelect-option-0">' +
		  productObj.options[0] +
		  "</label>"
	  );
	}
	if (
	  productObj.variants.length == 1 &&
	  productObj.variants[0].title.indexOf("Default") > -1
	) {
	  // Hide selectors if we only have 1 variant and its title contains 'Default'.
	  $(".js-product-" + productObj.id + " .selector-wrapper").hide();
	  $(".js-product-" + productObj.id + " .swatch").hide();
	}
  }
};

theme.eventFeed = function(apiKey, templateId, anchorId, sectionId) {
 
  var orgUrl = "https://www.eventbriteapi.com//v3/users/me/organizations/?token=" + apiKey;
  
  $.getJSON(orgUrl, function(data) {}).done(function( data ) {
  
	var orgId = data.organizations[0].id;
    
    var eventsUrl =
		"https://www.eventbriteapi.com//v3/organizations/" + 
        orgId + 
        "/events/?token=" +
        apiKey +
        "&expand=venue&status=live";
 
      $.getJSON(eventsUrl, function(data) {
        var template = $(templateId).html();
        var compile = Handlebars.compile(template)(data);
 
        //compile and append tempalte with data
        $(anchorId).append(compile);
        //slider dunction
        theme.layoutSlider(".js-layout-slider-" + sectionId);
 
        //scrollreveal
        if ($("body").data("anim-load")) {
          sr.reveal(".section--" + sectionId + " .section__link", { distance: 0 });
          sr.reveal(".section--" + sectionId + " .home-event__item", {
            interval: theme.intervalValue
          });
        }
      });
      
      //format time helper
	  theme.LibraryLoader.load(
		'fecha',
		fechaHelper
	  );
  	
  	  function fechaHelper() {
  		Handlebars.registerHelper("formatDate", function(date) {
	        return fecha.format(new Date(date), "ddd, DD MMM, HH:mm");
	    });
  	  }
      
      //limit loop helper
      Handlebars.registerHelper("each_upto", function(ary, max, options) {
        if (!ary || ary.length === 0) return options.inverse(this);
        var result = [];
        for (var i = 0; i < max && i < ary.length; ++i)
          result.push(options.fn(ary[i]));
        return result.join("");
      });
  }); 
};

//home carousel functions & video backgound
theme.homeMainCarousel = function() {
  var carousels = $(".js-home-carousel");
  var currWinWidth = $(window).width();

  var mobileCond = currWinWidth >= 1;

  //slick carousel functions and init
  carousels.each(function() {
	var carousel = $(this);

	carousel.on("init", function(event, slick) {
	  //check if this carousel has youtube videos
	  if ($(this).find(".js-home-carousel-video--yt").length) {
		if (mobileCond) {
		  var thisCarousel = $(this);
		  //check if youtube API is loaded
		  if (typeof YT === "undefined") {
			// insert youtube iframe API
			$.getScript("https://www.youtube.com/iframe_api")
			  //after loaded
			  .done(function() {
				var interval = setInterval(function() {
				  //check if YT is function and loop if not
				  if ($.isFunction(YT.Player)) {
					loadVideos(thisCarousel);
					clearInterval(interval);
				  }
				}, 100);
			  });
		  } else {
			loadVideos(thisCarousel);
		  }
		}
	  }

	  //check if this carousel has self hosted videos
	  if ($(this).find(".js-home-carousel-video--self").length) {
	  	// check if self hosted video is first slide and initiate active class
	  	if ($(this).find("[data-slide-id='0']").find('.js-home-carousel-video--self').length) {
	  		var thisSelfVideo = $(this).find("[data-slide-id='0']").find('.js-home-carousel-video--self');
			setTimeout(function() {
			  thisSelfVideo.addClass("js-loaded");
			}, 300);
	  	}
	  }

	  //content loading classes
	  $(this)
		.find(".slick-active")
		.addClass("js-slide-active");
	});

	carousel.on("afterChange", function(event, slick, currentSlide) {
	  if (mobileCond) {
	  	//for youtube

	  	var currentSlideElement = $(this).find("[data-slide-id='"+currentSlide+"']");

		if (currentSlideElement.find(".js-home-carousel-video--yt").length) {
			var dataPlayerId = $(this)
			  .find(".slick-active .js-home-carousel-video-data")
			  .attr("data-player-id");

			if (window[dataPlayerId].B) {
			  //check if element is ready
			  window[dataPlayerId].playVideo();
			} else {
			  setTimeout(function() {
				window[dataPlayerId].playVideo();
			  }, 1000);
			}

			var thisYTVideo = $(this).find(
			  ".slick-active .js-home-carousel-video"
			);
			//ading timeout so video cover waits for youtube to initiate loading
			setTimeout(function() {
			  thisYTVideo.addClass("js-loaded");
			}, 800);
		}
		//for self hosted
		if (currentSlideElement.find(".js-home-carousel-video--self").length) {
			var thisSelfVideo = $(this).find(
			  ".slick-active .js-home-carousel-video"
			);
			setTimeout(function() {
			  thisSelfVideo.addClass("js-loaded");
			}, 300);
		}
	  }

	  //content loading classes
	  $(this)
		.find(".slick-slide")
		.removeClass("js-slide-active");
	  $(this)
		.find(".slick-active")
		.addClass("js-slide-active");
	});

	carousel.not(".slick-initialized").slick({
	  slidesToShow: 1,
	  slidesToScroll: 1,
	  infinite: true,
	  dots: true,
	  fade: true,
	  cssEase: "linear",
	  prevArrow:
		'<div class="home-carousel__nav home-carousel__nav--prev"><i class="icon icon--left-t"></i></div>',
	  nextArrow:
		'<div class="home-carousel__nav home-carousel__nav--next"><i class="icon icon--right-t"></i></div>'
	});

	//checking for adaptive height when loading for smoother first view
	for (var i = 0; i < 10; i++) {
	  setTimeout(function() {
		$('.js-home-carousel').slick('setPosition');
	  }, 250 * i);
	}
  });

  function loadVideos(thisCarousel) {
	var players = $(thisCarousel).find(".js-home-carousel-video-data");

	function onReadyVideo(event) {
	  event.target.mute();
	  theme.videoSize(event.target.f);

	  //check if this slide is active and play video if so
	  if (
		$(event.target.f)
		  .parents(".slick-slide")
		  .hasClass("slick-active")
	  ) {
		event.target.playVideo();
		//ading timeout so video cover waits for youtube to start playing
		setTimeout(function() {
		  $(event.target.f)
			.parent()
			.addClass("js-loaded");
		}, 800);
	  }
	}

	function onChangeVideo(event) {
	  if (event.data === YT.PlayerState.ENDED) {
		//when video ends - repeat
		event.target.playVideo();
	  }
	}

	for (var i = 0; i < players.length; i++) {
	  window[players[i].getAttribute("data-player-id")] = new YT.Player(
		players[i],
		{
		  videoId: players[i].getAttribute("data-video-id"),
		  host: 'https://www.youtube-nocookie.com',
		  playerVars: {
			iv_load_policy: 3,
			modestbranding: 1,
			playsinline: 1,
			cc_load_policy: 0,
			fs: 0,
			autoplay: 1,
			mute: 1,
			controls: 0,
			showinfo: 0,
			wmode: "opaque",
			quality: 'hd720',
			branding: 0,
			autohide: 0,
			rel: 0
		  },
		  events: {
			onReady: onReadyVideo,
			onStateChange: onChangeVideo
		  }
		}
	  );
	}
  }

  //recalcluate all iframe sizes on browser resize
  var videoResizeTimer;
  $(window).resize(function() {
	winWidth = $(window).width();
	  clearTimeout(videoResizeTimer);
	  videoResizeTimer = setTimeout(function() {
		theme.videoSize($(".js-home-carousel-video-data"));
	  }, 500);
  });
};

theme.videoSize = function(video) {
  //set elems
  var iframe = $(video);

  //find video size
  var origHeight = iframe.attr("height");
  var origWidth = iframe.attr("width");

  //find element width and caclulate new height
  var parentHeigt = iframe.parent().height();
  var parentWidth = iframe.parent().width();

  //calc height and width based on original ratio
  var newHeight = (parentWidth / origWidth) * origHeight;
  var newWidth = (parentHeigt / origHeight) * origWidth;

  //check if video ratio fits with carousel container and add css settings
  if (parentHeigt < newHeight) {
	iframe.css({
	  width: parentWidth + "px",
	  height: newHeight + 120 + "px",
	  top: (parentHeigt - newHeight) / 2 - 60 + "px",
	  left: 0
	});
  } else {
	iframe.css({
	  width: newWidth + "px",
	  height: parentHeigt + 120 + "px",
	  left: (parentWidth - newWidth) / 2 + "px",
	  top: '-60px'
	});
  }
};

//home video gallery
theme.homeVideoGallery = function() {
  function vimeoThumbs() {
	//iteration for all thumbs while waiting for ajax to complete
	var i = 0;
	function next() {
	  if (i < $(".js-vimeo-thumb").length) {
		thisThumb = $(".js-vimeo-thumb")[i];
		var vimeoID = $(thisThumb).attr("data-video-id");

		$.ajax({
		  url: "https://vimeo.com/api/oembed.json?url=https://vimeo.com/" + vimeoID,
		  dataType: "json",
		  complete: function(data) {
			$(thisThumb).attr(
			  "data-bgset",
			  data.responseJSON.thumbnail_url
			);
			i++;
			next();
		  }
		});
	  }
	}
	// kick off the first thumb iteration
	next();

	//placeholder thumb
	if ($(".js-vimeo-placeholder").length > 0) {
	  var vimeoID = $(".js-vimeo-placeholder").attr("data-video-id");

	  $.ajax({
		url: "https://vimeo.com/api/oembed.json?url=https://vimeo.com/" + vimeoID,
		dataType: "json",
		success: function(data) {
		  var img = data.thumbnail_url.split('_')[0]  + "_1280.jpg";
		  $(".js-vimeo-placeholder").attr("data-bgset", img);
		}
	  });
	}
  }
  vimeoThumbs(); //run

  //init player plugin after lazy loaded iframes
  homePlayers = [];
  var lazyVideoGallery = new LazyLoad({
	elements_selector: ".js-home-video-stage",
	callback_set: function(el) {
		//load Plyr library
		theme.LibraryLoader.load(
			'plyr',
			videoPlayersInit
		);
		//load in Shopify Plyr styles
  		theme.LibraryLoader.load('plyrShopifyStyles');

  		function videoPlayersInit() {
  			
  			$(el).find('.js-lazy-iframe').each(function(i) {
	  			$(this).attr("src", $(this).data('src')).removeAttr('data-src');
	  		});

			$(el).find('.js-home-video-player').each(function(i) {
	 			var videoId = $(this).attr("id");
		 		//setup each player with unique var
			  	window[videoId] = new Plyr(".js-home-video-player", {
		          controls: [
		            'play',
		            'progress',
		            'mute',
		            'volume',
		            'play-large',
		            'fullscreen'
		          ],
		          loop: { active: false },
		          hideControlsOnPause: true,
		          iconUrl:
		            '//cdn.shopify.com/shopifycloud/shopify-plyr/v1.0/shopify-plyr.svg',
		          tooltips: { controls: false, seek: true }
			  	});

			  	//array of all players for mass functions
			  	homePlayers.push(window[videoId]);	
			});
  		}
	}
  });	

  //placeholder click
  $(".js-home-video-placeholder-trigger").click(function(e) {
	e.preventDefault();

	var triggerTarget = $(this).attr("href");
	var triggerId = $(this)
	  .attr("href")
	  .replace(/#/, "");

	//hide placeholder
	$(this)
	  .parent(".js-home-video-placeholder")
	  .addClass("js-hidden");

	//pause all videos if playing
	homePlayers.forEach(function(instance) {
	  instance.pause();
	});

	//start video
	window["home_player_" + triggerId].play();
  });

  //thumbs click
  $(".js-home-video-trigger").click(function(e) {
	e.preventDefault();

	var triggerTarget =
	  "#js-home-video-" +
	  $(this)
		.attr("href")
		.replace(/#/, "");
	var triggerId = $(this)
	  .attr("href")
	  .replace(/#/, "");
	var sectionPlaceholder = $(this)
	  .parents(".home-video")
	  .find(".js-home-video-placeholder");

	//hide placeholder
	sectionPlaceholder.addClass("js-hidden");

	//remove and add active class
	$(this)
	  .parents(".home-video")
	  .find(".js-home-video")
	  .removeClass("js-active");
	$(triggerTarget).addClass("js-active");

	//pause all videos
	homePlayers.forEach(function(instance) {
	  instance.pause();
	});

	//pause on second click and play function
	if (
	  $(this)
		.parent()
		.hasClass("js-paused")
	) {
	  window["home_player_" + triggerId].play();
	  $(this)
		.parent()
		.removeClass("js-paused");
	} else if (
	  $(this)
		.parent()
		.hasClass("js-active")
	) {
	  $(this)
		.parent()
		.addClass("js-paused");
	} else {
	  window["home_player_" + triggerId].play();
	}

	//set correct thumb to active
	$(".js-home-video-trigger")
	  .parent()
	  .removeClass("js-active");
	$(".js-home-video-trigger")
	  .parent()
	  .removeClass("js-init");
	$(this)
	  .parent()
	  .addClass("js-active");
  });
};

theme.masonryLayout = function() {
  	// Masonry layout init
  	if (document.querySelector('.o-layout--masonry') !== null) {

  		theme.LibraryLoader.load(
			'masonry',
			masonryInit
		);
  	}
  	function masonryInit() {
		$(".o-layout--masonry")
		.imagesLoaded()
		.always(function(instance) {
		  $(".o-layout--masonry").masonry({
			itemSelector: ".o-layout__item",
			transitionDuration: 0
		  });

		  //reset scroll reveal geometry
		  if ($("body").data("anim-load")) {
			sr.delegate();
		  }
		})
		// Run masonry while loading images
		.progress(function(instance, image) {
		  $(".o-layout--masonry").masonry({
			itemSelector: ".o-layout__item",
			transitionDuration: 0
		  });

		  //reset scroll reveal geometry
		  if ($("body").data("anim-load")) {
			sr.delegate();
		  }
		});
	}
};

theme.animFade = function() {
  if ($("body").data("anim-fade")) {
	// add class to stop transition to non navigational links
	$(
	  'a[href^="#"], a[target="_blank"], a[href^="mailto:"], a[href^="tel:"], a[href*="youtube.com/watch"], a[href*="youtu.be/"]'
	).each(function() {
	  $(this).addClass("js-no-transition");
	});
	//fix for safari and firefox back button issues
	if (!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/) || !!navigator.userAgent.match(/Firefox\/([0-9]+)\./)) {
	  $("a").on("click", function() {
		window.setTimeout(function() {
		  $("body").removeClass("js-theme-unloading");
		}, 1200);
	  });
	}

	$(
	  "a:not(.js-no-transition, .js-header-sub-link-a, .js-header-sub-t-a)"
	).bind("click", function(e) {
	  if (e.metaKey) return true;
	  e.preventDefault();
	  //close all popups
	  $.magnificPopup.close();
	  //add class for unloading
	  $("body").addClass("js-theme-unloading");
	  //redirect
	  var src = $(this).attr("href");
	  window.setTimeout(function() {
		location.href = src;
	  }, 50);
	});
  }
};

theme.animScroll = function() {
  if ($("body").data("anim-load")) {
	theme.intervalStyle = {};
	if ($("body").data("anim-interval-style") == "fade_down") {
	  theme.intervalStyle = "-20px";
	} else if ($("body").data("anim-interval-style") == "fade_up") {
	  theme.intervalStyle = "20px";
	} else {
	  theme.intervalStyle = "0";
	}

	theme.intervalValue = {};
	if ($("body").data("anim-interval")) {
	  theme.intervalValue = 200;
	} else {
	  theme.intervalValue = 0;
	}

	var config = {
	  viewFactor: 0.1,
	  duration: 1000,
	  distance: theme.intervalStyle,
	  scale: 1,
	  delay: 0,
	  mobile: true,
	  useDelay: "once",
	  beforeReveal: function myCallback(el) {
		$(el).addClass("js-sr-loaded");
	  }
	};

	window.sr = new ScrollReveal(config);

	//elements
	sr.reveal(".section__title", { distance: "5px" });
	sr.reveal(".section__title-desc", { distance: 0, delay: 300 });
	sr.reveal(".newsletter, .section__link, .account", { distance: 0 });
	sr.reveal(".product-top, .collection-list__item", {
	  interval: theme.intervalValue
	});

	//cart
	sr.reveal(".cart .section__title", { distance: "20px" });
	sr.reveal(".cart__content", { distance: 0, delay: 500 });

	//search
	sr.reveal(".search-page .section__title", { distance: "20px" });
	sr.reveal(".search-page__form, .search-page-pagination", {
	  distance: 0,
	  delay: 200
	});
	sr.reveal(".search-page .product-top, .search-page__other-item", {
	  interval: theme.intervalValue,
	  delay: 0
	});

	//blog
	sr.reveal(".blog", { delay: 300, interval: theme.intervalValue });
	sr.reveal(".blog-page__tags, .blog-pagination", {
	  distance: 0,
	  delay: 300
	});
	sr.reveal(".blog-page .section__title", { distance: "20px" });

	//article
	sr.reveal(".article .section__title", { distance: "20px" });
	sr.reveal(".article__date", { distance: "-10px", delay: 500 });
	sr.reveal(".article__featured-media, .article__content", {
	  distance: 0,
	  delay: 200
	});
	sr.reveal(".article__meta, .article-paginate", { distance: 0 });

	//collection page
	sr.reveal(".collection__header-info__title", { distance: "20px" });
	sr.reveal(".collection .product-top", { interval: theme.intervalValue });
	sr.reveal(
	  ".collection__header-media, .collection__header-info__text, .collection-main__sort, .collection-empty, .collection-pagination",
	  { distance: 0, delay: 200 }
	);

	//collection list
	sr.reveal(".list-collections .section__title", { distance: "20px" });
	sr.reveal(".list-collections .collection-list__item", {
	  interval: theme.intervalValue,
	  delay: 500
	});

	//product page
	sr.reveal(".product-single__title-text", { distance: "20px" });
	sr.reveal(
	  ".product-single__title-desc, .breadcrumb, .product-single__photos, .product-single__content, .product-single--minimal .product-single__content-text",
	  { distance: 0, delay: 300, useDelay: "onload" }
	);

	//page
	sr.reveal(".page .section__title", { distance: "20px" });
	sr.reveal(".faq__cta", { distance: 0, delay: 300 });
	sr.reveal(".faq__search", { distance: 0, delay: 300 });
	sr.reveal(".faq__accordion", { distance: 0, delay: 500 });
	sr.reveal(".faq__category__title", { distance: 0 });
	sr.reveal(".page__contact-form", { distance: 0, delay: 200 });

	//sections
	sr.reveal(".home-carousel .section__title", { distance: 0 });
	sr.reveal(".home-image-grid__item", { interval: theme.intervalValue });
	sr.reveal(".home-promo__box");
	sr.reveal(".home-intro", { distance: 0 });
	sr.reveal(
	  ".home-intro__media, .home-intro__text, .home-intro__video, .home-intro__link-wrap"
	);
	sr.reveal(".home-logo-list__items", { distance: 0 });
	sr.reveal(".home-testimonials", { distance: 0 });

	sr.reveal(".product-featured__photo-wrapper", { distance: 0, delay: 500 });
	sr.reveal(".home-event__item", { interval: theme.intervalValue }); //aslo in eventFeed secion for ajax
	sr.reveal(".home-delivery", { distance: 0 });
	sr.reveal(".home-delivery__content", { distance: theme.intervalStyle });
	sr.reveal(".home-map__items");
	sr.reveal(".home-rich-text__content", { distance: 0, delay: 500 });
	sr.reveal(".home-inline__item", { interval: theme.intervalValue });
	sr.reveal(".home-video__stage, .home-video__items", { distance: 0 });
	sr.reveal(".home-custom__item", { interval: theme.intervalValue });
	sr.reveal(".home-html", { distance: 0 });
  }
};


// product thumbs slick slider settings
theme.thumbsCarousel = function() {
  	$(".js-section__product-single .js-product-slider").not(".slick-initialized").each( function() {
		$(this).slick( {
		  focusOnSelect: true,
		  accessibility: true,
		  slidesToShow: 1,
		  slidesToScroll: 1,
		  infinite: false,
		  arrows: true,
		  dots: true,
		  swipe: true,
		  fade: true,
		  adaptiveHeight: true,
		  speed: 300,
		  cssEase: "ease",
		  lazyLoad: "progressive",
		  prevArrow:
			'<div class="product-single__photo__nav__item product-single__photo__nav__item--prev"><i class="icon icon--left-l"></i></div>',
		  nextArrow:
			'<div class="product-single__photo__nav__item product-single__photo__nav__item--next"><i class="icon icon--right-l"></i></div>',
		  customPaging: function(slider, i) {
			return (
			  '<button><div class="product-single__photo-thumbs__item">' +
			  $(".js-product-single-thumbs div:nth-child(" + (i + 1) + ")").html() +
			  "</div></button>"
			);
		  },
		  appendDots: $(this).parent().find('.js-product-slider-nav-dots'),
		  responsive: [{
	      	breakpoint: 768,
	      		settings: {
// 	        		appendArrows: $(this).parent().find('.js-product-slider-nav')
	      		}
		   }]
		})
		//calc height for single product classic view slideshow
		.on("setPosition", function(event, slick) {
			if ($(".product-single").hasClass("product-single--classic")) {
			  if ($(".js-product-bg").hasClass("js-product-bg--full")) {
				heightFraction = 1;
			  } else {
				heightFraction = 0.55;
			  }

			  var photoHeight = $(".js-product-slider")
				.find(".slick-list")
				.height();

			  var thumbsHeight = 0;
			  if ($(".js-product-slider-nav").find(".slick-dots").length) {
				thumbsHeight = $(".js-product-slider-nav")
				  .find(".slick-dots")
				  .outerHeight(true);
			  }

			  var breadcrumbHeight = 0;
			  if ($('.js-breadcrumb').length) {
			  	breadcrumbHeight = $('.js-breadcrumb').outerHeight(true);
			  }

			  var viewInSpaceBtnHeight = 0;
			  if ($('.js-product-view-in-space-btn').length > 0 && !$('.js-product-view-in-space-btn').is('[data-shopify-xr-hidden]')) {
			  	viewInSpaceBtnHeight = $(".js-product-view-in-space-btn").outerHeight(true);
			  }
			  
			  $(".js-product-bg").css(
				"height",
				  photoHeight * 
				  heightFraction + 
				  thumbsHeight +
				  breadcrumbHeight +
				  viewInSpaceBtnHeight +
				  60 +
				  "px"
			  );
			}
		});
	});
	//checking for adaptive height when loading for smoother first view
	for (var i = 0; i < 15; i++) {
	  setTimeout(function() {
		$('.js-product-slider').slick('setPosition');
	  }, 250 * i);
	}
};

theme.logoCarousel = function() {
  function logoCarouselInitFull(carousel) {
	carousel.not(".slick-initialized").slick({
	  slidesToShow: slideCount,
	  slidesToScroll: slideCount,
	  arrows: true,
	  dots: true,
	  fade: false,
	  adaptiveHeight: false,
	  speed: 300,
	  cssEase: "ease",
	  lazyLoad: "progressive",
	  prevArrow:
		'<div class="home-logo-list-carousel__nav home-logo-list-carousel__nav--prev"><i class="icon icon--left-l"></i></div>',
	  nextArrow:
		'<div class="home-logo-list-carousel__nav home-logo-list-carousel__nav--next"><i class="icon icon--right-l"></i></div>',
	  responsive: [
		{
		  breakpoint: theme.mobileBrkp,
		  settings: {
			swipeToSlide: true,
			variableWidth: true,
			slidesToShow: 1,
			slidesToScroll: 1
		  }
		}
	  ]
	});
  }

  function logoCarouselInitDesk(carousel) {
	carousel.not(".slick-initialized").slick({
	  slidesToShow: slideCount,
	  slidesToScroll: slideCount,
	  arrows: true,
	  dots: true,
	  fade: false,
	  adaptiveHeight: false,
	  speed: 300,
	  cssEase: "ease",
	  lazyLoad: "progressive",
	  prevArrow:
		'<div class="home-logo-list-carousel__nav home-logo-list-carousel__nav--prev"><i class="icon icon--left-l"></i></div>',
	  nextArrow:
		'<div class="home-logo-list-carousel__nav home-logo-list-carousel__nav--next"><i class="icon icon--right-l"></i></div>'
	});
  }

  function logoCarouselInitMobile(carousel) {
	carousel.not(".slick-initialized").slick({
	  slidesToShow: 1,
	  slidesToScroll: 1,
	  swipeToSlide: true,
	  variableWidth: true,
	  arrows: false,
	  dots: true,
	  fade: false,
	  adaptiveHeight: false,
	  speed: 300,
	  cssEase: "ease",
	  lazyLoad: "progressive"
	});
  }

  $(window)
	.resize(function() {
	  //get sizes
	  winWidth = $(window).width();

	  var carousels = $(".js-home-logo-list-carousel");

	  //slick carousel functions and init
	  carousels.each(function() {
		carousel = $(this);

		slideCount = carousel.data("carouselCount");

		desktop = carousel.data("carouselDesktop");
		mobile = carousel.data("carouselMobile");

		if (desktop && mobile) {
		  logoCarouselInitFull(carousel, slideCount);
		} else if (desktop) {
		  if (winWidth >= theme.mobileBrkp) {
			logoCarouselInitDesk(carousel, slideCount);
		  } else {
			//check if slick is initiated
			if (carousel.hasClass("slick-initialized")) {
			  //detach slick
			  carousel.slick("unslick");
			}
		  }
		} else if (mobile) {
		  if (winWidth < theme.mobileBrkp) {
			logoCarouselInitMobile(carousel, slideCount);
		  } else {
			//check if slick is initiated
			if (carousel.hasClass("slick-initialized")) {
			  //detach slick
			  carousel.slick("unslick");
			}
		  }
		}
	  });
	})
	.resize();
};

theme.testimonialsCarousel = function() {
  function testimonialsCarouselInit(carousel) {
	carousel.not(".slick-initialized").slick({
	  slidesToShow: 1,
	  slidesToScroll: 1,
	  arrows: true,
	  dots: true,
	  fade: false,
	  adaptiveHeight: false,
	  speed: 300,
	  cssEase: "ease",
	  lazyLoad: "progressive",
	  prevArrow:
		'<div class="home-testimonials-carousel__nav home-testimonials-carousel__nav--prev"><i class="icon icon--left-l"></i></div>',
	  nextArrow:
		'<div class="home-testimonials-carousel__nav home-testimonials-carousel__nav--next"><i class="icon icon--right-l"></i></div>'
	});
  }

  $(window)
	.resize(function() {
	  //get sizes
	  winWidth = $(window).width();

	  var carousels = $(".js-home-testimonials-carousel");

	  //slick carousel functions and init
	  carousels.each(function() {
		carousel = $(this);

		desktop = carousel.data("carouselDesktop");
		mobile = carousel.data("carouselMobile");

		if (desktop && mobile) {
		  testimonialsCarouselInit(carousel);
		} else if (desktop) {
		  if (winWidth >= theme.mobileBrkp) {
			testimonialsCarouselInit(carousel);
		  } else {
			//check if slick is initiated
			if (carousel.hasClass("slick-initialized")) {
			  //detach slick
			  carousel.slick("unslick");
			}
		  }
		} else if (mobile) {
		  if (winWidth < theme.mobileBrkp) {
			testimonialsCarouselInit(carousel);
		  } else {
			//check if slick is initiated
			if (carousel.hasClass("slick-initialized")) {
			  //detach slick
			  carousel.slick("unslick");
			}
		  }
		}
	  });
	})
	.resize();
};

theme.headerScrollUp = function() {
	function hasScrolled() {
		var st = $(this).scrollTop();
		
		// Make sure to scroll more than delta
		if(Math.abs(lastScrollTop - st) <= delta)
			return;
		
		// If scrolled down and are past the navbar, add class .nav-up.
		// This is necessary so you never see what is "behind" the navbar.
		if (st > lastScrollTop && st > navbarHeight){// Scroll Down
			$(body).removeClass('header-down').addClass('header-up');
		} else {// Scroll Up
			$(body).removeClass('header-up').addClass('header-down');
		}
		lastScrollTop = st;
	}

	if ($(".js-header").hasClass("js-header-scroll")) {
		// Hide Header on on scroll down
		var didScroll;
		var lastScrollTop = 0;
		var delta = 5;
		var navbarHeight = $('.js-header').outerHeight() + 50;

		$(window).scroll(function(event){
			didScroll = true;
		});

		setInterval(function() {
			if ($(".js-header").hasClass("js-header-scroll")) {
				if (didScroll) {
					hasScrolled();
					didScroll = false;
				}
			}
		}, 250);
	}
};

theme.accordion = function() {
  var item = $(".js-accordion-info");
  var trigger = $(".js-accordion-trigger");
  var items = item.hide(); //hide all items
  var activeClass = "js-active";

  trigger.click(function() {
	var thisItem = $(this).attr("href");

	//recalculate single product fixed box position on accordion changes
	//added delay to wait for accordion to finish animating
	setTimeout(function() {
	  $(".js-product-single-box").trigger("resize");
	}, 400);

	//review stars scroll and open
	if ($(this).hasClass("js-accordion-scroll")) {
	  var outsideAccordion = $(".js-accordion").find(
		"[href='" + $(this).attr("href") + "']"
	  );

	  //check if sticky header and set correct offset
	  if ($(".js-header").hasClass("js-header-sticky")) {
		scrollOffset = $(".js-header").outerHeight() + 18;
	  } else {
		scrollOffset = 18;
	  }

	  //scroll
	  $("html,body").animate(
		{
		  scrollTop: outsideAccordion.offset().top - scrollOffset
		},
		800
	  );

	  //open accordion
	  $(thisItem)
		.addClass(activeClass)
		.stop()
		.slideDown();
	  outsideAccordion.addClass(activeClass);

	  return false;
	}

	//check if clicked is active
	if ($(thisItem).hasClass(activeClass)) {
	  //close current item
	  $(this).removeClass(activeClass);
	  $(thisItem)
		.removeClass(activeClass)
		.stop()
		.slideUp();
	} else {
	  //open and activate this item
	  $(thisItem)
		.addClass(activeClass)
		.stop()
		.slideDown();
	  $(this).addClass(activeClass);
	}

	return false;
  });

  //FAQ page autocomplete with accordion scroll
  if (typeof faq_items != "undefined") {
	theme.LibraryLoader.load(
		'autocomplete',
		faqAutocomplete
	);
  }
  function faqAutocomplete() {
	$(".js-faq-autocomplete").autocomplete({
	  lookup: faq_items,
	  lookupFilter: function(suggestion, query, queryLowerCase) {
		var content = suggestion.content.toLowerCase(),
		  value = suggestion.value.toLowerCase();

		return (
		  content.indexOf(queryLowerCase) > -1 ||
		  value.indexOf(queryLowerCase) > -1
		);
	  },
	  onSelect: function(suggestion) {
		//check if sticky header and set correct offset
		if ($(".js-header").hasClass("js-header-sticky")) {
		  scrollOffset = $(".js-header").outerHeight() + 18;
		} else {
		  scrollOffset = 18;
		}

		//scroll
		$("html,body").animate(
		  {
			scrollTop:
			  $(".js-accordion")
				.find("[href='#" + suggestion.data + "']")
				.offset().top - scrollOffset
		  },
		  800
		);

		setTimeout(function() {
		  //open accordion
		  $("#" + suggestion.data)
			.addClass(activeClass)
			.stop()
			.slideDown();
		  $(".js-accordion")
			.find("[href='#" + suggestion.data + "']")
			.addClass(activeClass);
		}, 800);

		$(this).val('');
	  	}
		});
		//disable browser autocomplete
		$(".js-faq-autocomplete").disableAutoFill();	
	}
};

//animated scroll to div ID
theme.scrollToDiv = function() {
  $(".js-scroll-id").click(function(e) {
	var thisId = $(this).attr("href");

	//check for the offset
	if ($(".js-header").hasClass("js-header-sticky")) {
	  scrollOffset = $(".js-header").outerHeight() + 18;
	} else {
	  scrollOffset = 18;
	}

	//scroll
	$("html,body").animate(
	  {
		scrollTop: $(thisId).offset().top - scrollOffset
	  },
	  800
	);

	return false;
  });
};

//localize popup toggle
theme.localizeToggle = function() {
  var box = $(".js-localize-box");
  var trigger = $(".js-localize-trigger");
  var item = $(".js-localize-item");
  var activeClass = "js-active";

  item.click(function() {
  	var value = $(this).data('value');

    $(this).parents('.js-localize-wrapper').find("[data-disclosure-input]").val(value);
    $(this).parents('form').submit();

    return false;
  });

  trigger.click(function() {
	
	var thisTarget = $(this).parents('.js-localize-wrapper').find(box);

	if ($(this).hasClass(activeClass)) {
	  $(this).removeClass(activeClass).attr("aria-expanded", "false");
	  $(thisTarget).removeClass(activeClass);
	} else {
	  box.removeClass(activeClass);
      trigger.removeClass(activeClass).attr("aria-expanded", "false");

	  $(thisTarget).addClass(activeClass);
	  $(this).addClass(activeClass).attr("aria-expanded", "true");
	}
	
	return false;
  });

  //basic accessibility for keyboard
  box
	.focusin(function() {
	  $(this).addClass(activeClass);	
	  $(this).parents('.js-localize-wrapper').find(trigger).addClass(activeClass).attr("aria-expanded", "true");
	})
	.focusout(function() {
	  $(this).removeClass(activeClass);	
	  $(this).parents('.js-localize-wrapper').find(trigger).removeClass(activeClass).attr("aria-expanded", "false");
	});

  //click outside elem to hide functions
  $(document).click(function(e) {
	if (!box.is(e.target) && box.has(e.target).length === 0) {
	  box.removeClass(activeClass);
	  trigger.removeClass(activeClass).attr("aria-expanded", "false");
	}
  });
};

//header nav functions
theme.headerNav = function() {
  var link = $(".js-header-sub-link");
  var tLink = $(".js-header-sub-t-link");
  var linkA = $(".js-header-sub-link-a");
  var tLinkA = $(".js-header-sub-t-a");
  var activeClass = "js-active";

  var headerNavs = $(".js-heaver-navs");
  var mobileDraw = $(".js-mobile-draw-icon");
  var searchDraw = $(".js-search-draw-icon");
  var cartDraw = $(".js-cart-draw-icon");
  var primaryNav = $(".js-primary-nav");
  var secondaryNav = $(".js-secondary-nav");
  var logoImg = $(".js-main-logo");

  //nav accessibility for keyboard
  link
	.focusin(function() {
	  $(this).addClass(activeClass);
	  $(this).find(linkA).attr("aria-expanded", "true");
	})
	.focusout(function() {
	  link.removeClass(activeClass);
	  $(this).find(linkA).attr("aria-expanded", "false");
	});
  tLink.focusin(function() {
	tLink.removeClass(activeClass);
	tLinkA.attr("aria-expanded", "false");
	$(this).addClass(activeClass);
	$(this).find(tLinkA).attr("aria-expanded", "true");
  });
  link.mouseout(function() {
	$(this).removeClass(activeClass);
  });
  tLink.mouseout(function() {
	$(this).removeClass(activeClass);
  });

  //disable parent links
  $(".header--parent-disabled .js-header-sub-link-a, .header--parent-disabled .js-header-sub-t-a").click(function(e) {
	e.preventDefault();
  });

  //responsive events
  $(window)
	.resize(function() {
	  //get sizes
	  winWidth = $(window).width();
	  var navsWidth = headerNavs.width();
	  var primaryWidth = primaryNav.width();
	  var secondaryWidth = secondaryNav.width();
	  //calculate available space for primary nav
	  var navSpace = navsWidth / 2 - logoImg.width() / 2;
	  if (winWidth >= theme.mobileBrkp) {
		if (!$(".js-header").hasClass("header--center")) {
		  if (navSpace < primaryWidth || navSpace < secondaryWidth) {
		  	$(".js-header").removeClass('header--inline-icons');
			mobileDraw.show();
			searchDraw.show();
			cartDraw.show();
			primaryNav.hide();
			secondaryNav.hide();
		  } else {
			mobileDraw.hide();
			searchDraw.hide();
			cartDraw.hide();
			primaryNav.show();
			secondaryNav.show();
		  }
		} else {
          $(".js-header").removeClass('header--inline-icons');
		  mobileDraw.hide();
		  searchDraw.hide();
		  cartDraw.hide();
		}
	  } else {
		mobileDraw.show();
		searchDraw.show();
		cartDraw.show();
	  }
	})
	.resize();

  //caculate if third sub nav should appear on right ON MOUSEOVER
  tLink.on("mouseover focusin", function() {
	var subNavT = $(this).find(".js-nav-sub-t");
	//calc sub nav offset compared to window width
	var ofsNo = winWidth - (subNavT.offset().left + subNavT.width());
	//place subnav
	if (ofsNo < 1) {
	  subNavT.css("right", "179px");
	  subNavT.css("left", "auto");
	}
  });
};

//home single product carousel
theme.homeFeaturedProduct = function() {
	$(".js-section__home-product .js-product-slider").not(".slick-initialized").each( function() {
        $(this).slick( {
            slidesToShow: 1,
			slidesToScroll: 1,
			accessibility: true,
			arrows: true,
			dots: true,
			fade: true,
			adaptiveHeight: true,
			infinite: false,
			swipe: true,
			speed: 300,
			cssEase: "ease",
			prevArrow: '<div class="product-featured__photo__nav__item product-featured__photo__nav__item--prev"><i class="icon icon--left"></i></div>',
			nextArrow: '<div class="product-featured__photo__nav__item product-featured__photo__nav__item--next"><i class="icon icon--right"></i></div>',
			appendDots: $(this).parent().find('.js-product-slider-nav-dots'),
			appendArrows: $(this).parent().find('.js-product-slider-nav')
        } );
    });
};

//toggle active class on traget div
theme.triggerActive = function() {
  var $target = $(".js-toggle-target");
  var trigger = $(".js-toggle-trigger");
  var activeClass = "js-active";

  trigger.click(function(e) {
	var thisTarget = $(this).attr("href");
	if ($(this).hasClass(activeClass)) {
	  $(this).removeClass(activeClass);
	  $(thisTarget).removeClass(activeClass);
	  //accessibility
	  $(this)
		.parent()
		.attr("aria-expanded", "false");
	} else {
	  $(this).addClass(activeClass);
	  $(thisTarget).addClass(activeClass);
	  //accessibility
	  $(this)
		.parent()
		.attr("aria-expanded", "true");
	}
	e.preventDefault();
  });
};

//select dropdown styling
theme.selectWrapper = function() {
  //add to each select so label can sit next to it
  //no js-... classes this time
  function setWidth() {
	$(".selector-wrapper").each(function(i) {
	  var labelWidth = $(this)
		.find("label")
		.width();
	  $(this)
		.find("select")
		.css("padding-left", 20 + labelWidth);
	});
  }
  setWidth();
  setTimeout(setWidth, 500);//repeat
  setTimeout(setWidth, 2000);//repeat 
};

//check if two sections in row have backgrounds and if so collapse margin
theme.homeSectionMargin = function() {
  $(".main .shopify-section").each(function() {
	var thisSection = $(this).find(".section");

	//remove style attr for theme editor to display correctly without refresh
	thisSection.removeAttr("style");
	if (
	  thisSection.hasClass("section--has-bg") &&
	  $(this)
		.next()
		.find(".section")
		.is(".section--full-bg.section--has-bg")
	) {
	  thisSection.css("margin-bottom", "0");
	}
  });
};

//age checker popup
theme.ageCheckerCookie = function() {
  var ageCookie = "age-checked";

  if ($(".js-age-draw").data("age-check-enabled")) {
	if (typeof Cookies != "undefined") {
	  if (Cookies(ageCookie) !== "1") {
		theme.mfpOpen("age");
	  }
	}
  }

  $(".js-age-close").click(function(e) {
	Cookies(ageCookie, "1", { expires: 14, path: "/" });
	$.magnificPopup.close();

	e.preventDefault();
  });
};
//promo popup
theme.promoPopCookie = function() {
  var promoCookie = "promo-showed";
  var promoDelay = $(".js-promo-pop").data("promo-delay");
  var promoExpiry = $(".js-promo-pop").data("promo-expiry");

  if ($(".js-promo-pop").data("promo-enabled")) {
	if (typeof Cookies != "undefined") {
	  if (Cookies(promoCookie) !== "1") {
		setTimeout(function() {
		  theme.promoPop("open");
		}, promoDelay);
	  }
	}
  }

  $(".js-promo-pop-close").click(function(e) {
	Cookies(promoCookie, "1", { expires: promoExpiry, path: "/" });
	theme.promoPop("close");

	e.preventDefault();
  });
};

theme.footerTweet = function() {
  //set vars
  var twtEnable = $(".js-footer-tweet").data("footer-tweet-enable");

  if (twtEnable) {
	var twtUsername = $(".js-footer-tweet")
	  .data("footer-tweet-user")
	  .substring(1);

	//load twitter widgets JS
	window.twttr = (function(d, s, id) {
	  var js,
		fjs = d.getElementsByTagName(s)[0],
		t = window.twttr || {};
	  if (d.getElementById(id)) return t;
	  js = d.createElement(s);
	  js.id = id;
	  js.src = "https://platform.twitter.com/widgets.js";
	  fjs.parentNode.insertBefore(js, fjs);

	  t._e = [];
	  t.ready = function(f) {
		t._e.push(f);
	  };

	  return t;
	})(document, "script", "twitter-wjs");

	//load feed
	twttr.ready(function() {
	  twttr.widgets
		.createTimeline(
		  {
			sourceType: "profile",
			screenName: twtUsername
		  },
		  document.getElementById("footer-tweet"),
		  {
			tweetLimit: 1
		  }
		)
		.then(function(data) {
		  //get tweet and ass
		  var tweetText = $(data)
			.contents()
			.find(".timeline-Tweet-text")
			.html();
		  $(".js-footer-tweet-text").html(tweetText);
		});
	});
  }
};

//magnific popup functions
theme.mfpOpen = function(popup) {
  var closeBtn =
	'<button title="Close (Esc)" type="button" class="mfp-close mfp-close--custom js-close-mfp" aria-label="close"><i class="icon icon--close"></i></button>';

  switch (popup) {
	case "cart":
	  if (theme.cart_ajax) {
	  	if (theme.cart_type == "modal") {
	  		$.magnificPopup.open({
			  items: {
				src: ".js-cart-draw"
			  },
			  type: "inline",
			  mainClass: "mfp-medium",
			  fixedContentPos: true,
			  midClick: true,
			  closeMarkup: closeBtn,
			  removalDelay: 200
			});
	  	} else {
	  		$.magnificPopup.open({
			  items: {
				src: ".js-cart-draw"
			  },
			  type: "inline",
			  alignTop: true,
			  mainClass: "mfp-notification",
			  fixedContentPos: false,
			  midClick: true,
			  closeMarkup: closeBtn,
			  removalDelay: 200,
			  closeOnBgClick: false,
			  callbacks: {
		          open: function(item) {
		          	var thisPopup = $.magnificPopup.instance;
		        	//automatic close
		            setTimeout(function(){
		            	if (thisPopup.isOpen) {
		               		thisPopup.close();
		               	}
		            }, 4000);
		          }
			  }
			});
	  	}
	  }
	  break;

	case "search":
	  $.magnificPopup.open({
		items: {
		  src: ".js-search-draw"
		},
		type: "inline",
		mainClass: "mfp-medium",
		fixedContentPos: true,
		focus: ".js-search-input",
		closeMarkup: closeBtn,
		removalDelay: 200
	  });
	  break;

	case "age":
	  $.magnificPopup.open({
		items: {
		  src: ".js-age-draw"
		},
		type: "inline",
		mainClass: "mfp-dark",
		fixedContentPos: true,
		modal: true,
		showCloseBtn: false,
		removalDelay: 200
	  });
	  break;

	case "menu-draw":
	  $.magnificPopup.open({
		items: {
		  src: ".js-menu-draw"
		},
		type: "inline",
		mainClass: "mfp-draw",
		fixedContentPos: true,
		closeMarkup: closeBtn,
		removalDelay: 200
	  });
	  break;

	case "store-availability-draw":
	  $.magnificPopup.open({
		items: {
		  src: ".js-store-availability-draw"
		},
		type: "inline",
		mainClass: "mfp-draw mfp-draw--right",
		fixedContentPos: true,
		closeMarkup: closeBtn,
		removalDelay: 200
	  });
	  break;

	case "collection-draw":
	  $.magnificPopup.open({
		items: {
		  src: ".js-collection-draw"
		},
		callbacks: {
		  resize: function() {
			if ($('.js-collection-draw').hasClass('collection-sidebar--sidebar') && winWidth >= theme.tabletBrkp) {
			  $.magnificPopup.close();
			}
		  }
		},
		type: "inline",
		mainClass: "mfp-draw",
		fixedContentPos: true,
		closeMarkup: closeBtn,
		removalDelay: 200
	  });
	  break;
  }
};

theme.collectionSort = function() {
  Shopify.queryParams = {};
  if (location.search.length) {
	for (
	  var aKeyValue, i = 0, aCouples = location.search.substr(1).split("&");
	  i < aCouples.length;
	  i++
	) {
	  aKeyValue = aCouples[i].split("=");
	  if (aKeyValue.length > 1) {
		Shopify.queryParams[
		  decodeURIComponent(aKeyValue[0])
		] = decodeURIComponent(aKeyValue[1]);
	  }
	}
  }

  var defaultSort = $(".js-collection-sort").data("default-sort");
  $("#SortBy")
	.val(defaultSort)
	.bind("change", function() {
	  Shopify.queryParams.sort_by = jQuery(this).val();
	  location.search = jQuery.param(Shopify.queryParams);
	});
};

theme.collectionTagFilter = function() {
	var tagGroupLink = $('.js-collection-group-link');

  	tagGroupLink.on('click', function(e) {
      var tag = $(this).parent();
      var tagCategory = tag.data('category-group');
      var tagUrl = tag.data('tag-url');
      var activeTag = $('.js-active[data-category-group="' + tagCategory + '"]');

      if (!tag.hasClass('js-active') && activeTag.length > 0) {

        e.preventDefault();
        var newPath = window.location.pathname
          .replace(activeTag.data('tag-url'), tagUrl)
          .replace(/(&page=\d+)|(page=\d+&)|(\?page=\d+$)/, '');
        window.location.pathname = newPath;

      }
  	});
};

theme.magnificVideo = function() {
  $(".js-pop-video").magnificPopup({
	type: "iframe",
	mainClass: "mfp-medium mfp-close-corner",
	removalDelay: 200,
	closeMarkup:
	  '<button title="Close (Esc)" type="button" class="mfp-close mfp-close--custom js-close-mfp"><i class="icon icon--close"></i></button>'
  });
};

theme.productZoom = function() {
	if (document.querySelector('.js-pswp-zoom') !== null) {
  		theme.LibraryLoader.load(
			'photoswipe',
			photoswipeInit
		);
  	}
  	function photoswipeInit() {
		var openPhotoSwipe = function(thisBtn, thisImageCount) {
		    var pswpElement = document.querySelectorAll('.pswp')[0];
		    var productGallery = $('.js-product-slider');

		    // build gallery array
		    var galleryItems = [];
		    $('.js-pswp-img').each(function() {
		      var smallSrc = $(this).prop('currentSrc') || $(this).prop('src');
		      var item = {
		      	msrc: smallSrc,
		        src: $(this).data('pswp-src'),
		        w: $(this).data('pswp-width'),
		        h: $(this).data('pswp-height'),
		        mediaId: $(this).data('media-id'),
		        el: $(this)[0]
		      };
		      galleryItems.push(item);
		    });

		    var options = {
		        history: false,
		        index: thisImageCount,
		        closeOnScroll: false,
		        getThumbBoundsFn: function() {
		            var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
		            var thumbnail = galleryItems[thisImageCount].el;
		            var rect = thumbnail.getBoundingClientRect();
		            return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
		        }
		    };

		    var pswpGallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, galleryItems, options);
		    pswpGallery.init();
		    pswpGallery.listen('close', function() {
		    	var thisSlideItem = $('.product-single__photo__item[data-media-id=' + this.currItem.mediaId + ']');
		    	productGallery.slick('slickGoTo', thisSlideItem[0].dataset.slideId);
		    });
		};

		$(document).on('click', '.js-pswp-zoom', function() {
			var thisBtn = $(this);
			var thisImageCount = $(this).data('image-count');
			openPhotoSwipe(thisBtn, thisImageCount);
		});
	}	
};

theme.promoPop = function(action) {
  var popup = $(".js-promo-pop");
  var activeClass = "js-active";

  if (action == "open") {
	popup.addClass(activeClass);
  } else if (action == "close") {
	popup.removeClass(activeClass);
  }
};

theme.cartCheckbox = function() {
	$(document).on('click', '.js-cart-checkout-validate', function() {
		if ($('.js-cart-terms-input').is(':checked')) {
	    	$(this).submit();
	  	} else {
	  		var errorBox = $(this).parents('form').find('.js-cart-terms-error');
	  		errorBox.addClass('js-active');
	    	return false;
	  	}
	});
	$(document).on('change', '.js-cart-terms-input', function() {
        $('.js-cart-terms-error').removeClass('js-active');
    });
};

//funcitions to initiate ajax cart for the first time
theme.runAjaxCart = function() {
	theme.ajaxCartInit();
  	ajaxCart.load();
};

//product page recommendations
theme.productRecommendations = function() {
  // Look for an element with class 'js-product-recommendations'
  var productRecommendationsSection = document.querySelector('.js-product-recommendations');
  if (productRecommendationsSection === null) {return;}
  // Read product id from data attribute
  var productId = productRecommendationsSection.dataset.productId;
  // Read limit from data attribute
  var limit = productRecommendationsSection.dataset.limit;
  // Build request URL
  var requestUrl = productRecommendationsSection.dataset.baseUrl + '?section_id=product-recommendations&limit='+limit+'&product_id='+productId;
  // Create request and submit it using Ajax
  var request = new XMLHttpRequest();
  request.open('GET', requestUrl);
  request.onload = function() {
	if (request.status >= 200 && request.status < 300) {
	  var container = document.createElement('div');
	  container.innerHTML = request.response;
	  productRecommendationsSection.parentElement.innerHTML = container.querySelector('.js-product-recommendations').innerHTML;

	  //run ajax cart functions
	  theme.runAjaxCart();

	  //product swatches
	  theme.productCollSwatch();

	  //mobile carousel
	  $(".js-related-products").each(function(i) {
		var thisSectionId = $(this).data("section-id");
		theme.layoutSlider(".js-layout-slider-" + thisSectionId);
	  });

	  //reset scrolling animations
	  //delaying so the animation doesn't interfere with the main SR function
	  if ($("body").data("anim-load")) {
		setTimeout(function(){ 
		  sr.reveal('.section--related-products .product-top', { interval: theme.intervalValue });
		  sr.reveal('.section--related-products .section__title', { distance: "5px" });
		}, 1000);
	  }
	}
  };
  request.send();
};


/*============================================================================
  Run main theme functions
==============================================================================*/

//Open AJAX cart after new item is added
$("body").on("afterAddItem.ajaxCart", function() {
	setTimeout(function() {
	  theme.mfpOpen("cart");
	}, 100);
});

//wait for TAB to be clicked and add class for outline accessible class
function tabClick(e) {
	if (e.keyCode === 9) {
	  body.addClass('js-using-tab');
	  window.removeEventListener('keydown', tabClick);
	}
}
window.addEventListener('keydown', tabClick);

//home events get feed
document.querySelectorAll('.js-events').forEach(function(element, index) {
	var thisSectionId = $(element).data("section-id");
	var thisApiKey = $(element).data("api-key");
	theme.eventFeed(
	  thisApiKey,
	  "#eventTemplate" + thisSectionId,
	  "#eventContainer" + thisSectionId,
	  thisSectionId
	);
});
//mobile sliders
document.querySelectorAll('.js-section__home-collection .js-home-products').forEach(function(element, index) {
    var thisSectionId = $(element).data("section-id");
	theme.layoutSlider(".js-layout-slider-" + thisSectionId);
});
document.querySelectorAll('.js-page-products').forEach(function(element, index) {
    var thisSectionId = $(element).data("section-id");
	theme.layoutSlider(".js-layout-slider-" + thisSectionId);
});
document.querySelectorAll('.js-home-testimonials').forEach(function(element, index) {
    var thisSectionId = $(element).data("section-id");
	theme.layoutSlider(".js-layout-slider-" + thisSectionId);
});
document.querySelectorAll('.js-home-collection-list').forEach(function(element, index) {
    var thisSectionId = $(element).data("section-id");
	theme.layoutSlider(".js-layout-slider-" + thisSectionId);
});
document.querySelectorAll('.js-events-onboarding').forEach(function(element, index) {
    var thisSectionId = $(element).data("section-id");
	theme.layoutSlider(".js-layout-slider-" + thisSectionId);
});

//fitvids
$(".video-wrapper").fitVids();
//rich text fitvids
$('.rte iframe[src*="youtube"]')
.parent()
.fitVids();
$('.rte iframe[src*="vimeo"]')
.parent()
.fitVids();

//rich text table overflow
$(".rte table").wrap(
"<div style='overflow:auto;-webkit-overflow-scrolling:touch'></div>"
);

//move maps inside tab on mobile
$(".js-map-replace").appendAround();
//move cart box for classic layout
$(".js-cart-replace").appendAround();

//search popup trigger click
$(document).on("click", ".js-search-trigger", function(e) {
theme.mfpOpen("search");
e.preventDefault();
});
//cart popup trigger click
if (theme.cart_ajax) {
$(document).on("click", ".js-cart-trigger", function(e) {
  theme.mfpOpen("cart");
  e.preventDefault();
});
}
//mobile menu drawer trigger click
$(document).on("click", ".js-mobile-draw-trigger", function(e) {
theme.mfpOpen("menu-draw");
e.preventDefault();
});

//mobile menu drawer trigger click
$(document).on("click", ".js-store-availability-draw-trigger", function(e) {
theme.mfpOpen("store-availability-draw");
e.preventDefault();
});

//collection sidebar drawer trigger click
$(document).on("click", ".js-collection-draw-trigger", function(e) {
theme.mfpOpen("collection-draw");
e.preventDefault();
});

//magnific js close link
$(document).on("click", ".js-close-mfp", function(e) {
$.magnificPopup.close();
e.preventDefault();
});

//fixing lazyload image masonry layout
$(document).on("lazybeforeunveil", function() {
theme.masonryLayout();
});

//recalculating imagelazy sizes after few seconds and after scroll reveal for product
function checkLazySize(){
lazySizes.autoSizer.checkElems();
}
setTimeout(checkLazySize(), 2000);
setTimeout(checkLazySize(), 4000);

//general
//check if recommended products are not present and init cart 
//checking to avoid double cart initiation
if (document.querySelector('.js-product-recommendations') === null) {
	theme.runAjaxCart();
}

theme.headerScrollUp();
	if ($('.js-header').hasClass('js-header-sticky')) {
	stickybits(".js-section__header", { useStickyClasses: true });
}

theme.productRecommendations();
theme.masonryLayout();
theme.selectWrapper();
theme.triggerActive();
theme.headerNav();
theme.localizeToggle();
theme.magnificVideo();
theme.ageCheckerCookie();
theme.promoPopCookie();
theme.footerTweet();
theme.scrollToDiv();
theme.animFade();
theme.animScroll();
theme.productCollSwatch();
theme.cartCheckbox();

//homepage
theme.homeMaps();
theme.homeVideoGallery();
theme.homeMainCarousel();
theme.homeProductMediaInit();
theme.homeFeaturedProduct();
theme.homeSectionMargin();
theme.testimonialsCarousel();
theme.logoCarousel();

//collection
theme.collectionSort();
theme.collectionTagFilter();

//product single
theme.productMediaInit();
theme.thumbsCarousel();
theme.accordion();
theme.productZoom();
theme.StoreAvailability();

/*============================================================================
  Shopify Theme Editor functions
==============================================================================*/

$(document)
  .on("shopify:section:load", function(event) {
	var section = $(event.target);
	var type = section
	  .attr("class")
	  .replace("shopify-section", "")
	  .trim();
	var id = event.originalEvent.detail.sectionId;
	var sectionId = ".section--" + id;

	theme.homeSectionMargin();
	if ($("body").data("anim-load")) {
	  sr.reveal(sectionId + " .section__title", { distance: "5px" });
	  sr.reveal(sectionId + " .section__title-desc", {
		distance: 0,
		delay: 300
	  });
	  sr.reveal(sectionId + " .section__link", { distance: 0 });
	}

	switch (type) {
	  case "js-section__home-collection":
		theme.layoutSlider(".js-layout-slider-" + id);
		theme.masonryLayout();
		theme.productCollSwatch();
		if ($("body").data("anim-load")) {
		  sr.reveal(sectionId + " .product-top", {
			interval: theme.intervalValue
		  });
		}
		break;

	  case "js-section__home-events":
		var thisEvents = $(".js-events-" + id);
		var thisSectionId = thisEvents.data("section-id");
		var thisApiKey = thisEvents.data("api-key");
		if ($("body").data("anim-load")) {
		  sr.reveal(sectionId + " .home-event__item", {
			interval: theme.intervalValue
		  });
		}
		//check if onboarding content exists
		if ($(section).find(".js-events-onboarding").length) {
		  theme.layoutSlider(".js-layout-slider-" + id);
		} else {
		  theme.eventFeed(
			thisApiKey,
			"#eventTemplate" + thisSectionId,
			"#eventContainer" + thisSectionId,
			thisSectionId
		  );
		}
		break;

	  case "js-section__home-slider":
		//reset each youtube video object (weird YT re-init bug)
		section.find(".js-home-carousel-video-data").each(function() {
		  var playerId = $(this).attr("data-player-id");
		  window[playerId] = "undefined";
		});
		theme.homeMainCarousel();
		if ($("body").data("anim-load")) {
		  sr.reveal(sectionId + " .home-carousel", { distance: 0 });
		}
		break;

	  case "js-section__home-testimonials":
		theme.testimonialsCarousel();
		if ($("body").data("anim-load")) {
		  sr.reveal(sectionId + " .home-testimonials", { distance: 0 });
		}
		break;

	  case "js-section__home-image-grid":
		if ($("body").data("anim-load")) {
		  sr.reveal(sectionId + " .home-image-grid__item", {
			interval: theme.intervalValue
		  });
		}
		break;

	  case "js-section__home-logo-list":
		theme.logoCarousel();
		if ($("body").data("anim-load")) {
		  sr.reveal(sectionId + " .home-logo-list__items", { distance: 0 });
		}
		break;

	  case "js-section__home-video":
		theme.homeVideoGallery();
		if ($("body").data("anim-load")) {
		  sr.reveal(sectionId + " .home-video__stage, .home-video__items", {
			distance: 0
		  });
		}
		break;

	  case "js-section__home-blog":
		theme.masonryLayout();
		if ($("body").data("anim-load")) {
		  sr.reveal(sectionId + " .blog", {
			delay: 500,
			interval: theme.intervalValue
		  });
		}
		break;

	  case "js-section__home-intro":
		theme.magnificVideo();
		if ($("body").data("anim-load")) {
		  sr.reveal(sectionId + " .home-intro", { distance: 0 });
		  sr.reveal(
			sectionId +
			  " .home-intro__media," +
			  sectionId +
			  " .home-intro__text," +
			  sectionId +
			  " .home-intro__video," +
			  sectionId +
			  " .home-intro__link-wrap"
		  );
		}
		break;

	  case "js-section__home-promo":
		theme.magnificVideo();
		if ($("body").data("anim-load")) {
		  sr.reveal(sectionId + " .home-promo__box");
		}
		break;

	  case "js-section__home-custom":
		if ($("body").data("anim-load")) {
		  sr.reveal(sectionId + " .home-custom__item", {
			interval: theme.intervalValue
		  });
		}
		break;

	  case "js-section__home-html":
		if ($("body").data("anim-load")) {
		  sr.reveal(sectionId + " .home-html", { distance: 0 });
		}
		break;

	  case "js-section__rich-text":
		if ($("body").data("anim-load")) {
		  sr.reveal(sectionId + " .home-rich-text__content", { distance: 0 });
		}
		break;

	  case "js-section__home-map":
		$(".js-map-replace").appendAround();
		theme.homeMaps();
		if ($("body").data("anim-load")) {
		  sr.reveal(sectionId + " .home-map__items");
		}
		break;

	  case "js-section__home-delivery":
		if ($("body").data("anim-load")) {
		  sr.reveal(sectionId + " .home-delivery", { distance: 0 });
		  sr.reveal(sectionId + " .home-delivery__content", {
			distance: theme.intervalStyle
		  });
		}
		break;

	  case "js-section__home-inline":
		if ($("body").data("anim-load")) {
		  sr.reveal(sectionId + " .home-inline__item", {
			interval: theme.intervalValue
		  });
		}
		break;

	  case "js-section__home-collection-list":
		theme.layoutSlider(".js-layout-slider-" + id);
		if ($("body").data("anim-load")) {
		  sr.reveal(sectionId + " .collection-list__item", {
			interval: theme.intervalValue
		  });
		}
		break;

	  case "js-section__home-product":
		//check if onboarding
		if (
		  $(this)
			.find(".section")
			.attr("data-section-onboarding") != "true"
		) {
		  theme.productSelect(id, "featured", false);
		}
		theme.selectWrapper();
		theme.runAjaxCart();
		theme.homeProductMediaInit();

		//slider images smooth loading
		$(".js-product-slider").hide();
		$(".js-product-slider-spinner").show();
		$(".js-product-slider").imagesLoaded(function() {
		  $(".js-product-slider").show();
		  $(".js-product-slider-spinner").hide();
		  theme.homeFeaturedProduct();
		});
		if ($("body").data("anim-load")) {
		  sr.reveal(sectionId + " .product-featured__details", { distance: 0 });
		  sr.reveal(sectionId + " .product-featured__photo-wrapper", {
			distance: 0,
			delay: 500
		  });
		}
		break;

	  case "js-section__product-single":
		theme.selectWrapper();
		theme.accordion();
		theme.runAjaxCart();

		theme.productSelect("1", "single", true);
		theme.selectWrapper();
		theme.productMediaInit();

		//slider images smooth loading
		$(".js-product-slider").imagesLoaded(function() {
		  theme.thumbsCarousel();
		});

		//move cart box for classic layout
		$(".js-cart-replace").appendAround();

		if ($("body").data("anim-load")) {
		  sr.reveal(".product-single__title-text", { distance: "20px" });
		  sr.reveal(
			".product-single__title-desc, .breadcrumb, .product-single__photos, .product-single__content, .product-single--minimal .product-single__content-text",
			{ distance: 0, delay: 500 }
		  );
		}
		break;

	  case "js-section__product-testimonials":
		theme.testimonialsCarousel();
		if ($("body").data("anim-load")) {
		  sr.reveal(sectionId + " .home-testimonials", { distance: 0 });
		}
		break;

	  case "js-section__product-custom":
		if ($("body").data("anim-load")) {
		  sr.reveal(".home-custom__item", { interval: theme.intervalValue });
		  sr.reveal(".home-image-grid__item", {
			interval: theme.intervalValue
		  });
		}
		break;

	  case "js-section__product-related":
		theme.productRecommendations();
		break;

	  case "js-section__blog":
		theme.masonryLayout();
		theme.layoutSlider(".js-layout-slider-" + id);
		theme.productCollSwatch();

		if ($("body").data("anim-load")) {
		  sr.reveal(".blog", { delay: 500, interval: theme.intervalValue });
		  sr.reveal(".blog-page__tags, .blog-pagination", {
			distance: 0,
			delay: 500
		  });
		  sr.reveal(".blog-page .section__title", { distance: "20px" });
		  sr.reveal(".product-top", { interval: theme.intervalValue });
		}
		break;

	  case "js-section__article":
		theme.masonryLayout();
		theme.layoutSlider(".js-layout-slider-" + id);
		theme.productCollSwatch();

		if ($("body").data("anim-load")) {
		  sr.reveal(".article .section__title", { distance: "20px" });
		  sr.reveal(".article__date", { distance: "-10px", delay: 500 });
		  sr.reveal(".article__featured-media, .article__content", {
			distance: 0,
			delay: 200
		  });
		  sr.reveal(".article__meta, .article-paginate", { distance: 0 });
		  sr.reveal(".product-top", { interval: theme.intervalValue });
		}
		break;

	  case "shopify-section-header js-section__header":
		theme.headerNav();
		theme.triggerActive();
		theme.localizeToggle();
		$(body).removeClass('header-down').removeClass('header-up');
		document.documentElement.style.setProperty('--header-height', document.getElementsByClassName('js-header')[0].offsetHeight + 'px');
		if ($('.js-header').hasClass('js-header-sticky')) {
			stickybits(".js-section__header", { useStickyClasses: true });
	  	}
		theme.headerScrollUp();

		break;

	  case "js-section__newsletter":
		if ($("body").data("anim-load")) {
		  sr.reveal(sectionId + " .newsletter", { distance: 0 });
		}
		break;

	  case "js-section__footer":
		theme.footerTweet();
		theme.localizeToggle();
		if ($("body").data("anim-load")) {
		  sr.reveal(sectionId + " .newsletter", { distance: 0 });
		}
		break;

	  case "js-section__collection":
		theme.selectWrapper();
		theme.masonryLayout();
		theme.collectionSort();
		theme.collectionTagFilter();
		theme.productCollSwatch();

		if ($("body").data("anim-load")) {
		  sr.reveal(".collection__header-info__title", { distance: "20px" });
		  sr.reveal(".collection .product-top", {
			interval: theme.intervalValue,
			delay: 500
		  });
		  sr.reveal(
			".collection__header-media, .collection__header-info__text, .collection-main__sort, .collection-empty, .collection-pagination",
			{ distance: 0, delay: 500 }
		  );
		}
		break;

	  case "js-section__list-collections":
		if ($("body").data("anim-load")) {
		  sr.reveal(".list-collections .section__title", { distance: "20px" });
		  sr.reveal(".list-collections .collection-list__item", {
			interval: theme.intervalValue,
			delay: 500
		  });
		}
		break;

	  case "js-section__mobile-draw":
		theme.triggerActive();
		theme.localizeToggle();
		break;

	  case "js-section__promo-pop":
		if ($("body").data("anim-load")) {
		  sr.reveal(".promo-pop .section__title", { distance: 0 });
		}
		break;

	  case "js-section__faq-page":
		theme.accordion();
		theme.scrollToDiv();
		if ($("body").data("anim-load")) {
		  sr.reveal(".page .section__title", { distance: "20px" });
		  sr.reveal(".faq__cta", { distance: 0, delay: 500 });
		  sr.reveal(".faq__search", { distance: 0, delay: 700 });
		  sr.reveal(".faq__accordion", { distance: 0, delay: 900 });
		  sr.reveal(".page__contact-form", { distance: 0, delay: 200 });
		  sr.reveal(".faq__category__title", { distance: 0 });
		}
		break;

	  case "js-section__page-custom":
		if ($("body").data("anim-load")) {
		  sr.reveal(".home-custom__item", { interval: theme.intervalValue });
		  sr.reveal(".home-image-grid__item", {
			interval: theme.intervalValue
		  });
		}
		break;

	  case "js-section__page-contact":
		$(".js-map-replace").appendAround();
		theme.homeMaps();
		if ($("body").data("anim-load")) {
		  sr.reveal(sectionId + " .home-map__items");
		  sr.reveal(".page__contact-form", { distance: 0, delay: 200 });
		}
		break;
	}
  })
  .on("shopify:section:reorder", function(event) {
	theme.homeSectionMargin();
  })
  .on("shopify:section:select", function(event) {
	var section = $(event.target);
	var type = section
	  .attr("class")
	  .replace("shopify-section", "")
	  .trim();
	var id = event.originalEvent.detail.sectionId;

	switch (type) {
	  case "js-section__mobile-draw":
		//record current top offset
		theme.currentOffset = $(document).scrollTop();
		theme.mfpOpen("menu-draw");
		break;

	  case "js-section__age-checker":
		var ageEnabled = $(section)
		  .find(".js-age-draw")
		  .data("age-check-enabled");
		if (ageEnabled) {
		  theme.mfpOpen("age");
		} else {
		  $.magnificPopup.close();
		}
		//record current top offset
		theme.currentOffset = $(document).scrollTop();
		break;

	  case "js-section__promo-pop":
		var promoEnabled = $(section)
		  .find(".js-promo-pop")
		  .data("promo-enabled");
		if (promoEnabled) {
		  theme.promoPop("open");
		} else {
		  theme.promoPop("close");
		}
		//record current top offset
		theme.currentOffset = $(document).scrollTop();
		break;

	  case "js-section__home-slider":
		var currSlideshowSection = $('[data-section-id="' + id + '"]').find(
		  ".js-home-carousel"
		);
		//pause carousel autoplay
		currSlideshowSection.slick("slickPause");
		break;

	  case "js-section__home-testimonials":
		var currTestimonialsSection = $('[data-section-id="' + id + '"]').find(
		  ".js-home-testimonials-carousel"
		);
		//pause carousel autoplay
		currTestimonialsSection.slick("slickPause");
		break;

	  case "js-section__product-testimonials":
		var currProdTestimonialsSection = $(
		  '[data-section-id="' + id + '"]'
		).find(".js-home-testimonials-carousel");
		//pause carousel autoplay
		currProdTestimonialsSection.slick("slickPause");
		break;
	}
  })
  .on("shopify:section:deselect", function(event) {
	var section = $(event.target);
	var type = section
	  .attr("class")
	  .replace("shopify-section", "")
	  .trim();
	var id = event.originalEvent.detail.sectionId;

	switch (type) {
	  case "js-section__mobile-draw":
		//jump back to to previous offset
		$(document).scrollTop(theme.currentOffset);
		$.magnificPopup.close();
		break;

	  case "js-section__age-checker":
		//jump back to to previous offset
		$(document).scrollTop(theme.currentOffset);
		$.magnificPopup.close();
		break;

	  case "js-section__promo-pop":
		theme.promoPop("close");
		//jump back to to previous offset
		$(document).scrollTop(theme.currentOffset);
		break;

	  case "js-section__home-slider":
		var currSlideshowSection = $('[data-section-id="' + id + '"]').find(
		  ".js-home-carousel"
		);
		//play carousel autoplay
		if (currSlideshowSection.data("autoplay")) {
		  currSlideshowSection.slick("slickPlay");
		}
		break;

	  case "js-section__home-testimonials":
		var currTestimonialsSection = $('[data-section-id="' + id + '"]').find(
		  ".js-home-testimonials-carousel"
		);
		//play carousel autoplay
		if (currTestimonialsSection.data("autoplay")) {
		  currTestimonialsSection.slick("slickPlay");
		}
		break;

	  case "js-section__product-testimonials":
		var currProdTestimonialsSection = $(
		  '[data-section-id="' + id + '"]'
		).find(".js-home-testimonials-carousel");
		//play carousel autoplay
		if (currProdTestimonialsSection.data("autoplay")) {
		  currProdTestimonialsSection.slick("slickPlay");
		}
		break;
	}
  })
  .on("shopify:block:select", function(event) {
	var id = event.originalEvent.detail.sectionId;
	var slide = $(event.target);
	var type = slide
	  .parents(".shopify-section")
	  .attr("class")
	  .replace("shopify-section", "")
	  .trim();

	switch (type) {
	  case "js-section__home-slider":
		var currSlideshowSlide = $(slide)
		  .find(".home-carousel__item")
		  .attr("data-slide-id");
		var currSlideshowSlider = $('[data-section-id="' + id + '"]').find(
		  ".js-home-carousel"
		);
		//go to slide
		currSlideshowSlider.slick("slickGoTo", currSlideshowSlide);
		break;

	  case "js-section__home-testimonials":
		var currTestimonialsSlide = $(slide)
		  .find(".home-testimonials__item")
		  .attr("data-slide-id");
		var currTestimonialsSlider = $('[data-section-id="' + id + '"]').find(
		  ".js-home-testimonials-carousel"
		);
		//go to slide
		currTestimonialsSlider.slick("slickGoTo", currTestimonialsSlide);
		break;

	  case "js-section__product-testimonials":
		var currProdTestimonialsSlide = $(slide)
		  .find(".home-testimonials__item")
		  .attr("data-slide-id");
		var currProdTestimonialsSlider = $(
		  '[data-section-id="' + id + '"]'
		).find(".js-home-testimonials-carousel");
		//go to slide
		currProdTestimonialsSlider.slick(
		  "slickGoTo",
		  currProdTestimonialsSlide
		);
		break;
	}
  });

/*============================================================================
  Money Format
  - Shopify.format money is defined in option_selection.js.
	If that file is not included, it is redefined here.
==============================================================================*/
if (typeof Shopify === "undefined") {
  Shopify = {};
}
if (!Shopify.formatMoney) {
  Shopify.formatMoney = function(cents, format) {
	var value = "",
	  placeholderRegex = /\{\{\s*(\w+)\s*\}\}/,
	  formatString = format || this.money_format;

	if (typeof cents == "string") {
	  cents = cents.replace(".", "");
	}

	function defaultOption(opt, def) {
	  return typeof opt == "undefined" ? def : opt;
	}

	function formatWithDelimiters(number, precision, thousands, decimal) {
	  precision = defaultOption(precision, 2);
	  thousands = defaultOption(thousands, ",");
	  decimal = defaultOption(decimal, ".");

	  if (isNaN(number) || number === null) {
		return 0;
	  }

	  number = (number / 100.0).toFixed(precision);

	  var parts = number.split("."),
		dollars = parts[0].replace(
		  /(\d)(?=(\d\d\d)+(?!\d))/g,
		  "$1" + thousands
		),
		cents = parts[1] ? decimal + parts[1] : "";

	  return dollars + cents;
	}

	switch (formatString.match(placeholderRegex)[1]) {
	  case "amount":
		value = formatWithDelimiters(cents, 2);
		break;
	  case "amount_no_decimals":
		value = formatWithDelimiters(cents, 0);
		break;
	  case "amount_with_comma_separator":
		value = formatWithDelimiters(cents, 2, ".", ",");
		break;
	  case "amount_no_decimals_with_comma_separator":
		value = formatWithDelimiters(cents, 0, ".", ",");
		break;
	}

	return formatString.replace(placeholderRegex, value);
  };
}

/*============================================================================
  Detect IE
  - returns version of IE or false, if browser is not Internet Explorer
==============================================================================*/
(function detectIE() {
	var ieV;
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        ieV = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        document.querySelector('html').className += ' ie11';
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        ieV = parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        document.querySelector('html').className += ' ie11';
    }

    // other browser
    return false;
})();


// slick js file
!function(i){"use strict";"function"==typeof define&&define.amd?define(["jquery"],i):"undefined"!=typeof exports?module.exports=i(require("jquery")):i(jQuery)}(function(i){"use strict";var e=window.Slick||{};(e=function(){var e=0;return function(t,o){var s,n=this;n.defaults={accessibility:!0,adaptiveHeight:!1,appendArrows:i(t),appendDots:i(t),arrows:!0,asNavFor:null,prevArrow:'<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',nextArrow:'<button class="slick-next" aria-label="Next" type="button">Next</button>',autoplay:!1,autoplaySpeed:3e3,centerMode:!1,centerPadding:"50px",cssEase:"ease",customPaging:function(e,t){return i('<button type="button" />').text(t+1)},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,focusOnChange:!1,infinite:!0,initialSlide:0,lazyLoad:"ondemand",mobileFirst:!1,pauseOnHover:!0,pauseOnFocus:!0,pauseOnDotsHover:!1,respondTo:"window",responsive:null,rows:1,rtl:!1,slide:"",slidesPerRow:1,slidesToShow:1,slidesToScroll:1,speed:500,swipe:!0,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,useTransform:!0,variableWidth:!1,vertical:!1,verticalSwiping:!1,waitForAnimate:!0,zIndex:1e3},n.initials={animating:!1,dragging:!1,autoPlayTimer:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,$dots:null,listWidth:null,listHeight:null,loadIndex:0,$nextArrow:null,$prevArrow:null,scrolling:!1,slideCount:null,slideWidth:null,$slideTrack:null,$slides:null,sliding:!1,slideOffset:0,swipeLeft:null,swiping:!1,$list:null,touchObject:{},transformsEnabled:!1,unslicked:!1},i.extend(n,n.initials),n.activeBreakpoint=null,n.animType=null,n.animProp=null,n.breakpoints=[],n.breakpointSettings=[],n.cssTransitions=!1,n.focussed=!1,n.interrupted=!1,n.hidden="hidden",n.paused=!0,n.positionProp=null,n.respondTo=null,n.rowCount=1,n.shouldClick=!0,n.$slider=i(t),n.$slidesCache=null,n.transformType=null,n.transitionType=null,n.visibilityChange="visibilitychange",n.windowWidth=0,n.windowTimer=null,s=i(t).data("slick")||{},n.options=i.extend({},n.defaults,o,s),n.currentSlide=n.options.initialSlide,n.originalSettings=n.options,void 0!==document.mozHidden?(n.hidden="mozHidden",n.visibilityChange="mozvisibilitychange"):void 0!==document.webkitHidden&&(n.hidden="webkitHidden",n.visibilityChange="webkitvisibilitychange"),n.autoPlay=i.proxy(n.autoPlay,n),n.autoPlayClear=i.proxy(n.autoPlayClear,n),n.autoPlayIterator=i.proxy(n.autoPlayIterator,n),n.changeSlide=i.proxy(n.changeSlide,n),n.clickHandler=i.proxy(n.clickHandler,n),n.selectHandler=i.proxy(n.selectHandler,n),n.setPosition=i.proxy(n.setPosition,n),n.swipeHandler=i.proxy(n.swipeHandler,n),n.dragHandler=i.proxy(n.dragHandler,n),n.keyHandler=i.proxy(n.keyHandler,n),n.instanceUid=e++,n.htmlExpr=/^(?:\s*(<[\w\W]+>)[^>]*)$/,n.registerBreakpoints(),n.init(!0)}}()).prototype.activateADA=function(){this.$slideTrack.find(".slick-active").attr({"aria-hidden":"false"}).find("a, input, button, select").attr({tabindex:"0"})},e.prototype.addSlide=e.prototype.slickAdd=function(e,t,o){var s=this;if("boolean"==typeof t)o=t,t=null;else if(t<0||t>=s.slideCount)return!1;s.unload(),"number"==typeof t?0===t&&0===s.$slides.length?i(e).appendTo(s.$slideTrack):o?i(e).insertBefore(s.$slides.eq(t)):i(e).insertAfter(s.$slides.eq(t)):!0===o?i(e).prependTo(s.$slideTrack):i(e).appendTo(s.$slideTrack),s.$slides=s.$slideTrack.children(this.options.slide),s.$slideTrack.children(this.options.slide).detach(),s.$slideTrack.append(s.$slides),s.$slides.each(function(e,t){i(t).attr("data-slick-index",e)}),s.$slidesCache=s.$slides,s.reinit()},e.prototype.animateHeight=function(){var i=this;if(1===i.options.slidesToShow&&!0===i.options.adaptiveHeight&&!1===i.options.vertical){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.animate({height:e},i.options.speed)}},e.prototype.animateSlide=function(e,t){var o={},s=this;s.animateHeight(),!0===s.options.rtl&&!1===s.options.vertical&&(e=-e),!1===s.transformsEnabled?!1===s.options.vertical?s.$slideTrack.animate({left:e},s.options.speed,s.options.easing,t):s.$slideTrack.animate({top:e},s.options.speed,s.options.easing,t):!1===s.cssTransitions?(!0===s.options.rtl&&(s.currentLeft=-s.currentLeft),i({animStart:s.currentLeft}).animate({animStart:e},{duration:s.options.speed,easing:s.options.easing,step:function(i){i=Math.ceil(i),!1===s.options.vertical?(o[s.animType]="translate("+i+"px, 0px)",s.$slideTrack.css(o)):(o[s.animType]="translate(0px,"+i+"px)",s.$slideTrack.css(o))},complete:function(){t&&t.call()}})):(s.applyTransition(),e=Math.ceil(e),!1===s.options.vertical?o[s.animType]="translate3d("+e+"px, 0px, 0px)":o[s.animType]="translate3d(0px,"+e+"px, 0px)",s.$slideTrack.css(o),t&&setTimeout(function(){s.disableTransition(),t.call()},s.options.speed))},e.prototype.getNavTarget=function(){var e=this,t=e.options.asNavFor;return t&&null!==t&&(t=i(t).not(e.$slider)),t},e.prototype.asNavFor=function(e){var t=this.getNavTarget();null!==t&&"object"==typeof t&&t.each(function(){var t=i(this).slick("getSlick");t.unslicked||t.slideHandler(e,!0)})},e.prototype.applyTransition=function(i){var e=this,t={};!1===e.options.fade?t[e.transitionType]=e.transformType+" "+e.options.speed+"ms "+e.options.cssEase:t[e.transitionType]="opacity "+e.options.speed+"ms "+e.options.cssEase,!1===e.options.fade?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.autoPlay=function(){var i=this;i.autoPlayClear(),i.slideCount>i.options.slidesToShow&&(i.autoPlayTimer=setInterval(i.autoPlayIterator,i.options.autoplaySpeed))},e.prototype.autoPlayClear=function(){var i=this;i.autoPlayTimer&&clearInterval(i.autoPlayTimer)},e.prototype.autoPlayIterator=function(){var i=this,e=i.currentSlide+i.options.slidesToScroll;i.paused||i.interrupted||i.focussed||(!1===i.options.infinite&&(1===i.direction&&i.currentSlide+1===i.slideCount-1?i.direction=0:0===i.direction&&(e=i.currentSlide-i.options.slidesToScroll,i.currentSlide-1==0&&(i.direction=1))),i.slideHandler(e))},e.prototype.buildArrows=function(){var e=this;!0===e.options.arrows&&(e.$prevArrow=i(e.options.prevArrow).addClass("slick-arrow"),e.$nextArrow=i(e.options.nextArrow).addClass("slick-arrow"),e.slideCount>e.options.slidesToShow?(e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.prependTo(e.options.appendArrows),e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.appendTo(e.options.appendArrows),!0!==e.options.infinite&&e.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true")):e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({"aria-disabled":"true",tabindex:"-1"}))},e.prototype.buildDots=function(){var e,t,o=this;if(!0===o.options.dots){for(o.$slider.addClass("slick-dotted"),t=i("<ul />").addClass(o.options.dotsClass),e=0;e<=o.getDotCount();e+=1)t.append(i("<li />").append(o.options.customPaging.call(this,o,e)));o.$dots=t.appendTo(o.options.appendDots),o.$dots.find("li").first().addClass("slick-active")}},e.prototype.buildOut=function(){var e=this;e.$slides=e.$slider.children(e.options.slide+":not(.slick-cloned)").addClass("slick-slide"),e.slideCount=e.$slides.length,e.$slides.each(function(e,t){i(t).attr("data-slick-index",e).data("originalStyling",i(t).attr("style")||"")}),e.$slider.addClass("slick-slider"),e.$slideTrack=0===e.slideCount?i('<div class="slick-track"/>').appendTo(e.$slider):e.$slides.wrapAll('<div class="slick-track"/>').parent(),e.$list=e.$slideTrack.wrap('<div class="slick-list"/>').parent(),e.$slideTrack.css("opacity",0),!0!==e.options.centerMode&&!0!==e.options.swipeToSlide||(e.options.slidesToScroll=1),i("img[data-lazy]",e.$slider).not("[src]").addClass("slick-loading"),e.setupInfinite(),e.buildArrows(),e.buildDots(),e.updateDots(),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),!0===e.options.draggable&&e.$list.addClass("draggable")},e.prototype.buildRows=function(){var i,e,t,o,s,n,r,l=this;if(o=document.createDocumentFragment(),n=l.$slider.children(),l.options.rows>1){for(r=l.options.slidesPerRow*l.options.rows,s=Math.ceil(n.length/r),i=0;i<s;i++){var d=document.createElement("div");for(e=0;e<l.options.rows;e++){var a=document.createElement("div");for(t=0;t<l.options.slidesPerRow;t++){var c=i*r+(e*l.options.slidesPerRow+t);n.get(c)&&a.appendChild(n.get(c))}d.appendChild(a)}o.appendChild(d)}l.$slider.empty().append(o),l.$slider.children().children().children().css({width:100/l.options.slidesPerRow+"%",display:"inline-block"})}},e.prototype.checkResponsive=function(e,t){var o,s,n,r=this,l=!1,d=r.$slider.width(),a=window.innerWidth||i(window).width();if("window"===r.respondTo?n=a:"slider"===r.respondTo?n=d:"min"===r.respondTo&&(n=Math.min(a,d)),r.options.responsive&&r.options.responsive.length&&null!==r.options.responsive){s=null;for(o in r.breakpoints)r.breakpoints.hasOwnProperty(o)&&(!1===r.originalSettings.mobileFirst?n<r.breakpoints[o]&&(s=r.breakpoints[o]):n>r.breakpoints[o]&&(s=r.breakpoints[o]));null!==s?null!==r.activeBreakpoint?(s!==r.activeBreakpoint||t)&&(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):(r.activeBreakpoint=s,"unslick"===r.breakpointSettings[s]?r.unslick(s):(r.options=i.extend({},r.originalSettings,r.breakpointSettings[s]),!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e)),l=s):null!==r.activeBreakpoint&&(r.activeBreakpoint=null,r.options=r.originalSettings,!0===e&&(r.currentSlide=r.options.initialSlide),r.refresh(e),l=s),e||!1===l||r.$slider.trigger("breakpoint",[r,l])}},e.prototype.changeSlide=function(e,t){var o,s,n,r=this,l=i(e.currentTarget);switch(l.is("a")&&e.preventDefault(),l.is("li")||(l=l.closest("li")),n=r.slideCount%r.options.slidesToScroll!=0,o=n?0:(r.slideCount-r.currentSlide)%r.options.slidesToScroll,e.data.message){case"previous":s=0===o?r.options.slidesToScroll:r.options.slidesToShow-o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide-s,!1,t);break;case"next":s=0===o?r.options.slidesToScroll:o,r.slideCount>r.options.slidesToShow&&r.slideHandler(r.currentSlide+s,!1,t);break;case"index":var d=0===e.data.index?0:e.data.index||l.index()*r.options.slidesToScroll;r.slideHandler(r.checkNavigable(d),!1,t),l.children().trigger("focus");break;default:return}},e.prototype.checkNavigable=function(i){var e,t;if(e=this.getNavigableIndexes(),t=0,i>e[e.length-1])i=e[e.length-1];else for(var o in e){if(i<e[o]){i=t;break}t=e[o]}return i},e.prototype.cleanUpEvents=function(){var e=this;e.options.dots&&null!==e.$dots&&(i("li",e.$dots).off("click.slick",e.changeSlide).off("mouseenter.slick",i.proxy(e.interrupt,e,!0)).off("mouseleave.slick",i.proxy(e.interrupt,e,!1)),!0===e.options.accessibility&&e.$dots.off("keydown.slick",e.keyHandler)),e.$slider.off("focus.slick blur.slick"),!0===e.options.arrows&&e.slideCount>e.options.slidesToShow&&(e.$prevArrow&&e.$prevArrow.off("click.slick",e.changeSlide),e.$nextArrow&&e.$nextArrow.off("click.slick",e.changeSlide),!0===e.options.accessibility&&(e.$prevArrow&&e.$prevArrow.off("keydown.slick",e.keyHandler),e.$nextArrow&&e.$nextArrow.off("keydown.slick",e.keyHandler))),e.$list.off("touchstart.slick mousedown.slick",e.swipeHandler),e.$list.off("touchmove.slick mousemove.slick",e.swipeHandler),e.$list.off("touchend.slick mouseup.slick",e.swipeHandler),e.$list.off("touchcancel.slick mouseleave.slick",e.swipeHandler),e.$list.off("click.slick",e.clickHandler),i(document).off(e.visibilityChange,e.visibility),e.cleanUpSlideEvents(),!0===e.options.accessibility&&e.$list.off("keydown.slick",e.keyHandler),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().off("click.slick",e.selectHandler),i(window).off("orientationchange.slick.slick-"+e.instanceUid,e.orientationChange),i(window).off("resize.slick.slick-"+e.instanceUid,e.resize),i("[draggable!=true]",e.$slideTrack).off("dragstart",e.preventDefault),i(window).off("load.slick.slick-"+e.instanceUid,e.setPosition)},e.prototype.cleanUpSlideEvents=function(){var e=this;e.$list.off("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.off("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.cleanUpRows=function(){var i,e=this;e.options.rows>1&&((i=e.$slides.children().children()).removeAttr("style"),e.$slider.empty().append(i))},e.prototype.clickHandler=function(i){!1===this.shouldClick&&(i.stopImmediatePropagation(),i.stopPropagation(),i.preventDefault())},e.prototype.destroy=function(e){var t=this;t.autoPlayClear(),t.touchObject={},t.cleanUpEvents(),i(".slick-cloned",t.$slider).detach(),t.$dots&&t.$dots.remove(),t.$prevArrow&&t.$prevArrow.length&&(t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.prevArrow)&&t.$prevArrow.remove()),t.$nextArrow&&t.$nextArrow.length&&(t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display",""),t.htmlExpr.test(t.options.nextArrow)&&t.$nextArrow.remove()),t.$slides&&(t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function(){i(this).attr("style",i(this).data("originalStyling"))}),t.$slideTrack.children(this.options.slide).detach(),t.$slideTrack.detach(),t.$list.detach(),t.$slider.append(t.$slides)),t.cleanUpRows(),t.$slider.removeClass("slick-slider"),t.$slider.removeClass("slick-initialized"),t.$slider.removeClass("slick-dotted"),t.unslicked=!0,e||t.$slider.trigger("destroy",[t])},e.prototype.disableTransition=function(i){var e=this,t={};t[e.transitionType]="",!1===e.options.fade?e.$slideTrack.css(t):e.$slides.eq(i).css(t)},e.prototype.fadeSlide=function(i,e){var t=this;!1===t.cssTransitions?(t.$slides.eq(i).css({zIndex:t.options.zIndex}),t.$slides.eq(i).animate({opacity:1},t.options.speed,t.options.easing,e)):(t.applyTransition(i),t.$slides.eq(i).css({opacity:1,zIndex:t.options.zIndex}),e&&setTimeout(function(){t.disableTransition(i),e.call()},t.options.speed))},e.prototype.fadeSlideOut=function(i){var e=this;!1===e.cssTransitions?e.$slides.eq(i).animate({opacity:0,zIndex:e.options.zIndex-2},e.options.speed,e.options.easing):(e.applyTransition(i),e.$slides.eq(i).css({opacity:0,zIndex:e.options.zIndex-2}))},e.prototype.filterSlides=e.prototype.slickFilter=function(i){var e=this;null!==i&&(e.$slidesCache=e.$slides,e.unload(),e.$slideTrack.children(this.options.slide).detach(),e.$slidesCache.filter(i).appendTo(e.$slideTrack),e.reinit())},e.prototype.focusHandler=function(){var e=this;e.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick","*",function(t){t.stopImmediatePropagation();var o=i(this);setTimeout(function(){e.options.pauseOnFocus&&(e.focussed=o.is(":focus"),e.autoPlay())},0)})},e.prototype.getCurrent=e.prototype.slickCurrentSlide=function(){return this.currentSlide},e.prototype.getDotCount=function(){var i=this,e=0,t=0,o=0;if(!0===i.options.infinite)if(i.slideCount<=i.options.slidesToShow)++o;else for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else if(!0===i.options.centerMode)o=i.slideCount;else if(i.options.asNavFor)for(;e<i.slideCount;)++o,e=t+i.options.slidesToScroll,t+=i.options.slidesToScroll<=i.options.slidesToShow?i.options.slidesToScroll:i.options.slidesToShow;else o=1+Math.ceil((i.slideCount-i.options.slidesToShow)/i.options.slidesToScroll);return o-1},e.prototype.getLeft=function(i){var e,t,o,s,n=this,r=0;return n.slideOffset=0,t=n.$slides.first().outerHeight(!0),!0===n.options.infinite?(n.slideCount>n.options.slidesToShow&&(n.slideOffset=n.slideWidth*n.options.slidesToShow*-1,s=-1,!0===n.options.vertical&&!0===n.options.centerMode&&(2===n.options.slidesToShow?s=-1.5:1===n.options.slidesToShow&&(s=-2)),r=t*n.options.slidesToShow*s),n.slideCount%n.options.slidesToScroll!=0&&i+n.options.slidesToScroll>n.slideCount&&n.slideCount>n.options.slidesToShow&&(i>n.slideCount?(n.slideOffset=(n.options.slidesToShow-(i-n.slideCount))*n.slideWidth*-1,r=(n.options.slidesToShow-(i-n.slideCount))*t*-1):(n.slideOffset=n.slideCount%n.options.slidesToScroll*n.slideWidth*-1,r=n.slideCount%n.options.slidesToScroll*t*-1))):i+n.options.slidesToShow>n.slideCount&&(n.slideOffset=(i+n.options.slidesToShow-n.slideCount)*n.slideWidth,r=(i+n.options.slidesToShow-n.slideCount)*t),n.slideCount<=n.options.slidesToShow&&(n.slideOffset=0,r=0),!0===n.options.centerMode&&n.slideCount<=n.options.slidesToShow?n.slideOffset=n.slideWidth*Math.floor(n.options.slidesToShow)/2-n.slideWidth*n.slideCount/2:!0===n.options.centerMode&&!0===n.options.infinite?n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)-n.slideWidth:!0===n.options.centerMode&&(n.slideOffset=0,n.slideOffset+=n.slideWidth*Math.floor(n.options.slidesToShow/2)),e=!1===n.options.vertical?i*n.slideWidth*-1+n.slideOffset:i*t*-1+r,!0===n.options.variableWidth&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,!0===n.options.centerMode&&(o=n.slideCount<=n.options.slidesToShow||!1===n.options.infinite?n.$slideTrack.children(".slick-slide").eq(i):n.$slideTrack.children(".slick-slide").eq(i+n.options.slidesToShow+1),e=!0===n.options.rtl?o[0]?-1*(n.$slideTrack.width()-o[0].offsetLeft-o.width()):0:o[0]?-1*o[0].offsetLeft:0,e+=(n.$list.width()-o.outerWidth())/2)),e},e.prototype.getOption=e.prototype.slickGetOption=function(i){return this.options[i]},e.prototype.getNavigableIndexes=function(){var i,e=this,t=0,o=0,s=[];for(!1===e.options.infinite?i=e.slideCount:(t=-1*e.options.slidesToScroll,o=-1*e.options.slidesToScroll,i=2*e.slideCount);t<i;)s.push(t),t=o+e.options.slidesToScroll,o+=e.options.slidesToScroll<=e.options.slidesToShow?e.options.slidesToScroll:e.options.slidesToShow;return s},e.prototype.getSlick=function(){return this},e.prototype.getSlideCount=function(){var e,t,o=this;return t=!0===o.options.centerMode?o.slideWidth*Math.floor(o.options.slidesToShow/2):0,!0===o.options.swipeToSlide?(o.$slideTrack.find(".slick-slide").each(function(s,n){if(n.offsetLeft-t+i(n).outerWidth()/2>-1*o.swipeLeft)return e=n,!1}),Math.abs(i(e).attr("data-slick-index")-o.currentSlide)||1):o.options.slidesToScroll},e.prototype.goTo=e.prototype.slickGoTo=function(i,e){this.changeSlide({data:{message:"index",index:parseInt(i)}},e)},e.prototype.init=function(e){var t=this;i(t.$slider).hasClass("slick-initialized")||(i(t.$slider).addClass("slick-initialized"),t.buildRows(),t.buildOut(),t.setProps(),t.startLoad(),t.loadSlider(),t.initializeEvents(),t.updateArrows(),t.updateDots(),t.checkResponsive(!0),t.focusHandler()),e&&t.$slider.trigger("init",[t]),!0===t.options.accessibility&&t.initADA(),t.options.autoplay&&(t.paused=!1,t.autoPlay())},e.prototype.initADA=function(){var e=this,t=Math.ceil(e.slideCount/e.options.slidesToShow),o=e.getNavigableIndexes().filter(function(i){return i>=0&&i<e.slideCount});e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({"aria-hidden":"true",tabindex:"-1"}).find("a, input, button, select").attr({tabindex:"-1"}),null!==e.$dots&&(e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function(t){var s=o.indexOf(t);i(this).attr({role:"tabpanel",id:"slick-slide"+e.instanceUid+t,tabindex:-1}),-1!==s&&i(this).attr({"aria-describedby":"slick-slide-control"+e.instanceUid+s})}),e.$dots.attr("role","tablist").find("li").each(function(s){var n=o[s];i(this).attr({role:"presentation"}),i(this).find("button").first().attr({role:"tab",id:"slick-slide-control"+e.instanceUid+s,"aria-controls":"slick-slide"+e.instanceUid+n,"aria-label":s+1+" of "+t,"aria-selected":null,tabindex:"-1"})}).eq(e.currentSlide).find("button").attr({"aria-selected":"true",tabindex:"0"}).end());for(var s=e.currentSlide,n=s+e.options.slidesToShow;s<n;s++)e.$slides.eq(s).attr("tabindex",0);e.activateADA()},e.prototype.initArrowEvents=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.off("click.slick").on("click.slick",{message:"previous"},i.changeSlide),i.$nextArrow.off("click.slick").on("click.slick",{message:"next"},i.changeSlide),!0===i.options.accessibility&&(i.$prevArrow.on("keydown.slick",i.keyHandler),i.$nextArrow.on("keydown.slick",i.keyHandler)))},e.prototype.initDotEvents=function(){var e=this;!0===e.options.dots&&(i("li",e.$dots).on("click.slick",{message:"index"},e.changeSlide),!0===e.options.accessibility&&e.$dots.on("keydown.slick",e.keyHandler)),!0===e.options.dots&&!0===e.options.pauseOnDotsHover&&i("li",e.$dots).on("mouseenter.slick",i.proxy(e.interrupt,e,!0)).on("mouseleave.slick",i.proxy(e.interrupt,e,!1))},e.prototype.initSlideEvents=function(){var e=this;e.options.pauseOnHover&&(e.$list.on("mouseenter.slick",i.proxy(e.interrupt,e,!0)),e.$list.on("mouseleave.slick",i.proxy(e.interrupt,e,!1)))},e.prototype.initializeEvents=function(){var e=this;e.initArrowEvents(),e.initDotEvents(),e.initSlideEvents(),e.$list.on("touchstart.slick mousedown.slick",{action:"start"},e.swipeHandler),e.$list.on("touchmove.slick mousemove.slick",{action:"move"},e.swipeHandler),e.$list.on("touchend.slick mouseup.slick",{action:"end"},e.swipeHandler),e.$list.on("touchcancel.slick mouseleave.slick",{action:"end"},e.swipeHandler),e.$list.on("click.slick",e.clickHandler),i(document).on(e.visibilityChange,i.proxy(e.visibility,e)),!0===e.options.accessibility&&e.$list.on("keydown.slick",e.keyHandler),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),i(window).on("orientationchange.slick.slick-"+e.instanceUid,i.proxy(e.orientationChange,e)),i(window).on("resize.slick.slick-"+e.instanceUid,i.proxy(e.resize,e)),i("[draggable!=true]",e.$slideTrack).on("dragstart",e.preventDefault),i(window).on("load.slick.slick-"+e.instanceUid,e.setPosition),i(e.setPosition)},e.prototype.initUI=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.show(),i.$nextArrow.show()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.show()},e.prototype.keyHandler=function(i){var e=this;i.target.tagName.match("TEXTAREA|INPUT|SELECT")||(37===i.keyCode&&!0===e.options.accessibility?e.changeSlide({data:{message:!0===e.options.rtl?"next":"previous"}}):39===i.keyCode&&!0===e.options.accessibility&&e.changeSlide({data:{message:!0===e.options.rtl?"previous":"next"}}))},e.prototype.lazyLoad=function(){function e(e){i("img[data-lazy]",e).each(function(){var e=i(this),t=i(this).attr("data-lazy"),o=i(this).attr("data-srcset"),s=i(this).attr("data-sizes")||n.$slider.attr("data-sizes"),r=document.createElement("img");r.onload=function(){e.animate({opacity:0},100,function(){o&&(e.attr("srcset",o),s&&e.attr("sizes",s)),e.attr("src",t).animate({opacity:1},200,function(){e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")}),n.$slider.trigger("lazyLoaded",[n,e,t])})},r.onerror=function(){e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),n.$slider.trigger("lazyLoadError",[n,e,t])},r.src=t})}var t,o,s,n=this;if(!0===n.options.centerMode?!0===n.options.infinite?s=(o=n.currentSlide+(n.options.slidesToShow/2+1))+n.options.slidesToShow+2:(o=Math.max(0,n.currentSlide-(n.options.slidesToShow/2+1)),s=n.options.slidesToShow/2+1+2+n.currentSlide):(o=n.options.infinite?n.options.slidesToShow+n.currentSlide:n.currentSlide,s=Math.ceil(o+n.options.slidesToShow),!0===n.options.fade&&(o>0&&o--,s<=n.slideCount&&s++)),t=n.$slider.find(".slick-slide").slice(o,s),"anticipated"===n.options.lazyLoad)for(var r=o-1,l=s,d=n.$slider.find(".slick-slide"),a=0;a<n.options.slidesToScroll;a++)r<0&&(r=n.slideCount-1),t=(t=t.add(d.eq(r))).add(d.eq(l)),r--,l++;e(t),n.slideCount<=n.options.slidesToShow?e(n.$slider.find(".slick-slide")):n.currentSlide>=n.slideCount-n.options.slidesToShow?e(n.$slider.find(".slick-cloned").slice(0,n.options.slidesToShow)):0===n.currentSlide&&e(n.$slider.find(".slick-cloned").slice(-1*n.options.slidesToShow))},e.prototype.loadSlider=function(){var i=this;i.setPosition(),i.$slideTrack.css({opacity:1}),i.$slider.removeClass("slick-loading"),i.initUI(),"progressive"===i.options.lazyLoad&&i.progressiveLazyLoad()},e.prototype.next=e.prototype.slickNext=function(){this.changeSlide({data:{message:"next"}})},e.prototype.orientationChange=function(){var i=this;i.checkResponsive(),i.setPosition()},e.prototype.pause=e.prototype.slickPause=function(){var i=this;i.autoPlayClear(),i.paused=!0},e.prototype.play=e.prototype.slickPlay=function(){var i=this;i.autoPlay(),i.options.autoplay=!0,i.paused=!1,i.focussed=!1,i.interrupted=!1},e.prototype.postSlide=function(e){var t=this;t.unslicked||(t.$slider.trigger("afterChange",[t,e]),t.animating=!1,t.slideCount>t.options.slidesToShow&&t.setPosition(),t.swipeLeft=null,t.options.autoplay&&t.autoPlay(),!0===t.options.accessibility&&(t.initADA(),t.options.focusOnChange&&i(t.$slides.get(t.currentSlide)).attr("tabindex",0).focus()))},e.prototype.prev=e.prototype.slickPrev=function(){this.changeSlide({data:{message:"previous"}})},e.prototype.preventDefault=function(i){i.preventDefault()},e.prototype.progressiveLazyLoad=function(e){e=e||1;var t,o,s,n,r,l=this,d=i("img[data-lazy]",l.$slider);d.length?(t=d.first(),o=t.attr("data-lazy"),s=t.attr("data-srcset"),n=t.attr("data-sizes")||l.$slider.attr("data-sizes"),(r=document.createElement("img")).onload=function(){s&&(t.attr("srcset",s),n&&t.attr("sizes",n)),t.attr("src",o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"),!0===l.options.adaptiveHeight&&l.setPosition(),l.$slider.trigger("lazyLoaded",[l,t,o]),l.progressiveLazyLoad()},r.onerror=function(){e<3?setTimeout(function(){l.progressiveLazyLoad(e+1)},500):(t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),l.$slider.trigger("lazyLoadError",[l,t,o]),l.progressiveLazyLoad())},r.src=o):l.$slider.trigger("allImagesLoaded",[l])},e.prototype.refresh=function(e){var t,o,s=this;o=s.slideCount-s.options.slidesToShow,!s.options.infinite&&s.currentSlide>o&&(s.currentSlide=o),s.slideCount<=s.options.slidesToShow&&(s.currentSlide=0),t=s.currentSlide,s.destroy(!0),i.extend(s,s.initials,{currentSlide:t}),s.init(),e||s.changeSlide({data:{message:"index",index:t}},!1)},e.prototype.registerBreakpoints=function(){var e,t,o,s=this,n=s.options.responsive||null;if("array"===i.type(n)&&n.length){s.respondTo=s.options.respondTo||"window";for(e in n)if(o=s.breakpoints.length-1,n.hasOwnProperty(e)){for(t=n[e].breakpoint;o>=0;)s.breakpoints[o]&&s.breakpoints[o]===t&&s.breakpoints.splice(o,1),o--;s.breakpoints.push(t),s.breakpointSettings[t]=n[e].settings}s.breakpoints.sort(function(i,e){return s.options.mobileFirst?i-e:e-i})}},e.prototype.reinit=function(){var e=this;e.$slides=e.$slideTrack.children(e.options.slide).addClass("slick-slide"),e.slideCount=e.$slides.length,e.currentSlide>=e.slideCount&&0!==e.currentSlide&&(e.currentSlide=e.currentSlide-e.options.slidesToScroll),e.slideCount<=e.options.slidesToShow&&(e.currentSlide=0),e.registerBreakpoints(),e.setProps(),e.setupInfinite(),e.buildArrows(),e.updateArrows(),e.initArrowEvents(),e.buildDots(),e.updateDots(),e.initDotEvents(),e.cleanUpSlideEvents(),e.initSlideEvents(),e.checkResponsive(!1,!0),!0===e.options.focusOnSelect&&i(e.$slideTrack).children().on("click.slick",e.selectHandler),e.setSlideClasses("number"==typeof e.currentSlide?e.currentSlide:0),e.setPosition(),e.focusHandler(),e.paused=!e.options.autoplay,e.autoPlay(),e.$slider.trigger("reInit",[e])},e.prototype.resize=function(){var e=this;i(window).width()!==e.windowWidth&&(clearTimeout(e.windowDelay),e.windowDelay=window.setTimeout(function(){e.windowWidth=i(window).width(),e.checkResponsive(),e.unslicked||e.setPosition()},50))},e.prototype.removeSlide=e.prototype.slickRemove=function(i,e,t){var o=this;if(i="boolean"==typeof i?!0===(e=i)?0:o.slideCount-1:!0===e?--i:i,o.slideCount<1||i<0||i>o.slideCount-1)return!1;o.unload(),!0===t?o.$slideTrack.children().remove():o.$slideTrack.children(this.options.slide).eq(i).remove(),o.$slides=o.$slideTrack.children(this.options.slide),o.$slideTrack.children(this.options.slide).detach(),o.$slideTrack.append(o.$slides),o.$slidesCache=o.$slides,o.reinit()},e.prototype.setCSS=function(i){var e,t,o=this,s={};!0===o.options.rtl&&(i=-i),e="left"==o.positionProp?Math.ceil(i)+"px":"0px",t="top"==o.positionProp?Math.ceil(i)+"px":"0px",s[o.positionProp]=i,!1===o.transformsEnabled?o.$slideTrack.css(s):(s={},!1===o.cssTransitions?(s[o.animType]="translate("+e+", "+t+")",o.$slideTrack.css(s)):(s[o.animType]="translate3d("+e+", "+t+", 0px)",o.$slideTrack.css(s)))},e.prototype.setDimensions=function(){var i=this;!1===i.options.vertical?!0===i.options.centerMode&&i.$list.css({padding:"0px "+i.options.centerPadding}):(i.$list.height(i.$slides.first().outerHeight(!0)*i.options.slidesToShow),!0===i.options.centerMode&&i.$list.css({padding:i.options.centerPadding+" 0px"})),i.listWidth=i.$list.width(),i.listHeight=i.$list.height(),!1===i.options.vertical&&!1===i.options.variableWidth?(i.slideWidth=Math.ceil(i.listWidth/i.options.slidesToShow),i.$slideTrack.width(Math.ceil(i.slideWidth*i.$slideTrack.children(".slick-slide").length))):!0===i.options.variableWidth?i.$slideTrack.width(5e3*i.slideCount):(i.slideWidth=Math.ceil(i.listWidth),i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0)*i.$slideTrack.children(".slick-slide").length)));var e=i.$slides.first().outerWidth(!0)-i.$slides.first().width();!1===i.options.variableWidth&&i.$slideTrack.children(".slick-slide").width(i.slideWidth-e)},e.prototype.setFade=function(){var e,t=this;t.$slides.each(function(o,s){e=t.slideWidth*o*-1,!0===t.options.rtl?i(s).css({position:"relative",right:e,top:0,zIndex:t.options.zIndex-2,opacity:0}):i(s).css({position:"relative",left:e,top:0,zIndex:t.options.zIndex-2,opacity:0})}),t.$slides.eq(t.currentSlide).css({zIndex:t.options.zIndex-1,opacity:1})},e.prototype.setHeight=function(){var i=this;if(1===i.options.slidesToShow&&!0===i.options.adaptiveHeight&&!1===i.options.vertical){var e=i.$slides.eq(i.currentSlide).outerHeight(!0);i.$list.css("height",e)}},e.prototype.setOption=e.prototype.slickSetOption=function(){var e,t,o,s,n,r=this,l=!1;if("object"===i.type(arguments[0])?(o=arguments[0],l=arguments[1],n="multiple"):"string"===i.type(arguments[0])&&(o=arguments[0],s=arguments[1],l=arguments[2],"responsive"===arguments[0]&&"array"===i.type(arguments[1])?n="responsive":void 0!==arguments[1]&&(n="single")),"single"===n)r.options[o]=s;else if("multiple"===n)i.each(o,function(i,e){r.options[i]=e});else if("responsive"===n)for(t in s)if("array"!==i.type(r.options.responsive))r.options.responsive=[s[t]];else{for(e=r.options.responsive.length-1;e>=0;)r.options.responsive[e].breakpoint===s[t].breakpoint&&r.options.responsive.splice(e,1),e--;r.options.responsive.push(s[t])}l&&(r.unload(),r.reinit())},e.prototype.setPosition=function(){var i=this;i.setDimensions(),i.setHeight(),!1===i.options.fade?i.setCSS(i.getLeft(i.currentSlide)):i.setFade(),i.$slider.trigger("setPosition",[i])},e.prototype.setProps=function(){var i=this,e=document.body.style;i.positionProp=!0===i.options.vertical?"top":"left","top"===i.positionProp?i.$slider.addClass("slick-vertical"):i.$slider.removeClass("slick-vertical"),void 0===e.WebkitTransition&&void 0===e.MozTransition&&void 0===e.msTransition||!0===i.options.useCSS&&(i.cssTransitions=!0),i.options.fade&&("number"==typeof i.options.zIndex?i.options.zIndex<3&&(i.options.zIndex=3):i.options.zIndex=i.defaults.zIndex),void 0!==e.OTransform&&(i.animType="OTransform",i.transformType="-o-transform",i.transitionType="OTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.MozTransform&&(i.animType="MozTransform",i.transformType="-moz-transform",i.transitionType="MozTransition",void 0===e.perspectiveProperty&&void 0===e.MozPerspective&&(i.animType=!1)),void 0!==e.webkitTransform&&(i.animType="webkitTransform",i.transformType="-webkit-transform",i.transitionType="webkitTransition",void 0===e.perspectiveProperty&&void 0===e.webkitPerspective&&(i.animType=!1)),void 0!==e.msTransform&&(i.animType="msTransform",i.transformType="-ms-transform",i.transitionType="msTransition",void 0===e.msTransform&&(i.animType=!1)),void 0!==e.transform&&!1!==i.animType&&(i.animType="transform",i.transformType="transform",i.transitionType="transition"),i.transformsEnabled=i.options.useTransform&&null!==i.animType&&!1!==i.animType},e.prototype.setSlideClasses=function(i){var e,t,o,s,n=this;if(t=n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden","true"),n.$slides.eq(i).addClass("slick-current"),!0===n.options.centerMode){var r=n.options.slidesToShow%2==0?1:0;e=Math.floor(n.options.slidesToShow/2),!0===n.options.infinite&&(i>=e&&i<=n.slideCount-1-e?n.$slides.slice(i-e+r,i+e+1).addClass("slick-active").attr("aria-hidden","false"):(o=n.options.slidesToShow+i,t.slice(o-e+1+r,o+e+2).addClass("slick-active").attr("aria-hidden","false")),0===i?t.eq(t.length-1-n.options.slidesToShow).addClass("slick-center"):i===n.slideCount-1&&t.eq(n.options.slidesToShow).addClass("slick-center")),n.$slides.eq(i).addClass("slick-center")}else i>=0&&i<=n.slideCount-n.options.slidesToShow?n.$slides.slice(i,i+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"):t.length<=n.options.slidesToShow?t.addClass("slick-active").attr("aria-hidden","false"):(s=n.slideCount%n.options.slidesToShow,o=!0===n.options.infinite?n.options.slidesToShow+i:i,n.options.slidesToShow==n.options.slidesToScroll&&n.slideCount-i<n.options.slidesToShow?t.slice(o-(n.options.slidesToShow-s),o+s).addClass("slick-active").attr("aria-hidden","false"):t.slice(o,o+n.options.slidesToShow).addClass("slick-active").attr("aria-hidden","false"));"ondemand"!==n.options.lazyLoad&&"anticipated"!==n.options.lazyLoad||n.lazyLoad()},e.prototype.setupInfinite=function(){var e,t,o,s=this;if(!0===s.options.fade&&(s.options.centerMode=!1),!0===s.options.infinite&&!1===s.options.fade&&(t=null,s.slideCount>s.options.slidesToShow)){for(o=!0===s.options.centerMode?s.options.slidesToShow+1:s.options.slidesToShow,e=s.slideCount;e>s.slideCount-o;e-=1)t=e-1,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t-s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");for(e=0;e<o+s.slideCount;e+=1)t=e,i(s.$slides[t]).clone(!0).attr("id","").attr("data-slick-index",t+s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");s.$slideTrack.find(".slick-cloned").find("[id]").each(function(){i(this).attr("id","")})}},e.prototype.interrupt=function(i){var e=this;i||e.autoPlay(),e.interrupted=i},e.prototype.selectHandler=function(e){var t=this,o=i(e.target).is(".slick-slide")?i(e.target):i(e.target).parents(".slick-slide"),s=parseInt(o.attr("data-slick-index"));s||(s=0),t.slideCount<=t.options.slidesToShow?t.slideHandler(s,!1,!0):t.slideHandler(s)},e.prototype.slideHandler=function(i,e,t){var o,s,n,r,l,d=null,a=this;if(e=e||!1,!(!0===a.animating&&!0===a.options.waitForAnimate||!0===a.options.fade&&a.currentSlide===i))if(!1===e&&a.asNavFor(i),o=i,d=a.getLeft(o),r=a.getLeft(a.currentSlide),a.currentLeft=null===a.swipeLeft?r:a.swipeLeft,!1===a.options.infinite&&!1===a.options.centerMode&&(i<0||i>a.getDotCount()*a.options.slidesToScroll))!1===a.options.fade&&(o=a.currentSlide,!0!==t?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o));else if(!1===a.options.infinite&&!0===a.options.centerMode&&(i<0||i>a.slideCount-a.options.slidesToScroll))!1===a.options.fade&&(o=a.currentSlide,!0!==t?a.animateSlide(r,function(){a.postSlide(o)}):a.postSlide(o));else{if(a.options.autoplay&&clearInterval(a.autoPlayTimer),s=o<0?a.slideCount%a.options.slidesToScroll!=0?a.slideCount-a.slideCount%a.options.slidesToScroll:a.slideCount+o:o>=a.slideCount?a.slideCount%a.options.slidesToScroll!=0?0:o-a.slideCount:o,a.animating=!0,a.$slider.trigger("beforeChange",[a,a.currentSlide,s]),n=a.currentSlide,a.currentSlide=s,a.setSlideClasses(a.currentSlide),a.options.asNavFor&&(l=(l=a.getNavTarget()).slick("getSlick")).slideCount<=l.options.slidesToShow&&l.setSlideClasses(a.currentSlide),a.updateDots(),a.updateArrows(),!0===a.options.fade)return!0!==t?(a.fadeSlideOut(n),a.fadeSlide(s,function(){a.postSlide(s)})):a.postSlide(s),void a.animateHeight();!0!==t?a.animateSlide(d,function(){a.postSlide(s)}):a.postSlide(s)}},e.prototype.startLoad=function(){var i=this;!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&(i.$prevArrow.hide(),i.$nextArrow.hide()),!0===i.options.dots&&i.slideCount>i.options.slidesToShow&&i.$dots.hide(),i.$slider.addClass("slick-loading")},e.prototype.swipeDirection=function(){var i,e,t,o,s=this;return i=s.touchObject.startX-s.touchObject.curX,e=s.touchObject.startY-s.touchObject.curY,t=Math.atan2(e,i),(o=Math.round(180*t/Math.PI))<0&&(o=360-Math.abs(o)),o<=45&&o>=0?!1===s.options.rtl?"left":"right":o<=360&&o>=315?!1===s.options.rtl?"left":"right":o>=135&&o<=225?!1===s.options.rtl?"right":"left":!0===s.options.verticalSwiping?o>=35&&o<=135?"down":"up":"vertical"},e.prototype.swipeEnd=function(i){var e,t,o=this;if(o.dragging=!1,o.swiping=!1,o.scrolling)return o.scrolling=!1,!1;if(o.interrupted=!1,o.shouldClick=!(o.touchObject.swipeLength>10),void 0===o.touchObject.curX)return!1;if(!0===o.touchObject.edgeHit&&o.$slider.trigger("edge",[o,o.swipeDirection()]),o.touchObject.swipeLength>=o.touchObject.minSwipe){switch(t=o.swipeDirection()){case"left":case"down":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide+o.getSlideCount()):o.currentSlide+o.getSlideCount(),o.currentDirection=0;break;case"right":case"up":e=o.options.swipeToSlide?o.checkNavigable(o.currentSlide-o.getSlideCount()):o.currentSlide-o.getSlideCount(),o.currentDirection=1}"vertical"!=t&&(o.slideHandler(e),o.touchObject={},o.$slider.trigger("swipe",[o,t]))}else o.touchObject.startX!==o.touchObject.curX&&(o.slideHandler(o.currentSlide),o.touchObject={})},e.prototype.swipeHandler=function(i){var e=this;if(!(!1===e.options.swipe||"ontouchend"in document&&!1===e.options.swipe||!1===e.options.draggable&&-1!==i.type.indexOf("mouse")))switch(e.touchObject.fingerCount=i.originalEvent&&void 0!==i.originalEvent.touches?i.originalEvent.touches.length:1,e.touchObject.minSwipe=e.listWidth/e.options.touchThreshold,!0===e.options.verticalSwiping&&(e.touchObject.minSwipe=e.listHeight/e.options.touchThreshold),i.data.action){case"start":e.swipeStart(i);break;case"move":e.swipeMove(i);break;case"end":e.swipeEnd(i)}},e.prototype.swipeMove=function(i){var e,t,o,s,n,r,l=this;return n=void 0!==i.originalEvent?i.originalEvent.touches:null,!(!l.dragging||l.scrolling||n&&1!==n.length)&&(e=l.getLeft(l.currentSlide),l.touchObject.curX=void 0!==n?n[0].pageX:i.clientX,l.touchObject.curY=void 0!==n?n[0].pageY:i.clientY,l.touchObject.swipeLength=Math.round(Math.sqrt(Math.pow(l.touchObject.curX-l.touchObject.startX,2))),r=Math.round(Math.sqrt(Math.pow(l.touchObject.curY-l.touchObject.startY,2))),!l.options.verticalSwiping&&!l.swiping&&r>4?(l.scrolling=!0,!1):(!0===l.options.verticalSwiping&&(l.touchObject.swipeLength=r),t=l.swipeDirection(),void 0!==i.originalEvent&&l.touchObject.swipeLength>4&&(l.swiping=!0,i.preventDefault()),s=(!1===l.options.rtl?1:-1)*(l.touchObject.curX>l.touchObject.startX?1:-1),!0===l.options.verticalSwiping&&(s=l.touchObject.curY>l.touchObject.startY?1:-1),o=l.touchObject.swipeLength,l.touchObject.edgeHit=!1,!1===l.options.infinite&&(0===l.currentSlide&&"right"===t||l.currentSlide>=l.getDotCount()&&"left"===t)&&(o=l.touchObject.swipeLength*l.options.edgeFriction,l.touchObject.edgeHit=!0),!1===l.options.vertical?l.swipeLeft=e+o*s:l.swipeLeft=e+o*(l.$list.height()/l.listWidth)*s,!0===l.options.verticalSwiping&&(l.swipeLeft=e+o*s),!0!==l.options.fade&&!1!==l.options.touchMove&&(!0===l.animating?(l.swipeLeft=null,!1):void l.setCSS(l.swipeLeft))))},e.prototype.swipeStart=function(i){var e,t=this;if(t.interrupted=!0,1!==t.touchObject.fingerCount||t.slideCount<=t.options.slidesToShow)return t.touchObject={},!1;void 0!==i.originalEvent&&void 0!==i.originalEvent.touches&&(e=i.originalEvent.touches[0]),t.touchObject.startX=t.touchObject.curX=void 0!==e?e.pageX:i.clientX,t.touchObject.startY=t.touchObject.curY=void 0!==e?e.pageY:i.clientY,t.dragging=!0},e.prototype.unfilterSlides=e.prototype.slickUnfilter=function(){var i=this;null!==i.$slidesCache&&(i.unload(),i.$slideTrack.children(this.options.slide).detach(),i.$slidesCache.appendTo(i.$slideTrack),i.reinit())},e.prototype.unload=function(){var e=this;i(".slick-cloned",e.$slider).remove(),e.$dots&&e.$dots.remove(),e.$prevArrow&&e.htmlExpr.test(e.options.prevArrow)&&e.$prevArrow.remove(),e.$nextArrow&&e.htmlExpr.test(e.options.nextArrow)&&e.$nextArrow.remove(),e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden","true").css("width","")},e.prototype.unslick=function(i){var e=this;e.$slider.trigger("unslick",[e,i]),e.destroy()},e.prototype.updateArrows=function(){var i=this;Math.floor(i.options.slidesToShow/2),!0===i.options.arrows&&i.slideCount>i.options.slidesToShow&&!i.options.infinite&&(i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false"),i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false"),0===i.currentSlide?(i.$prevArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled","false")):i.currentSlide>=i.slideCount-i.options.slidesToShow&&!1===i.options.centerMode?(i.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")):i.currentSlide>=i.slideCount-1&&!0===i.options.centerMode&&(i.$nextArrow.addClass("slick-disabled").attr("aria-disabled","true"),i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled","false")))},e.prototype.updateDots=function(){var i=this;null!==i.$dots&&(i.$dots.find("li").removeClass("slick-active").end(),i.$dots.find("li").eq(Math.floor(i.currentSlide/i.options.slidesToScroll)).addClass("slick-active"))},e.prototype.visibility=function(){var i=this;i.options.autoplay&&(document[i.hidden]?i.interrupted=!0:i.interrupted=!1)},i.fn.slick=function(){var i,t,o=this,s=arguments[0],n=Array.prototype.slice.call(arguments,1),r=o.length;for(i=0;i<r;i++)if("object"==typeof s||void 0===s?o[i].slick=new e(o[i],s):t=o[i].slick[s].apply(o[i].slick,n),void 0!==t)return t;return o}});
$('.image-slider').slick({
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  dots: true,
  arrows: false
});

    
const selectVariantByClickingImage = {
  // Create variant images from productJson object
  _createVariantImage: function (product) {
    const variantImageObject = {};
    product.variants.forEach((variant) => {
      if (
        typeof variant.featured_image !== 'undefined' &&
        variant.featured_image !== null
      ) {
        const variantImage = variant.featured_image.src
          .split('?')[0]
          .replace(/http(s)?:/, '');
        variantImageObject[variantImage] =
          variantImageObject[variantImage] || {};
        product.options.forEach((option, index) => {
          const optionValue = variant.options[index];
          const optionKey = `option-${index}`;
          if (
            typeof variantImageObject[variantImage][optionKey] === 'undefined'
          ) {
            variantImageObject[variantImage][optionKey] = optionValue;
          } else {
            const oldValue = variantImageObject[variantImage][optionKey];
            if (oldValue !== null && oldValue !== optionValue) {
              variantImageObject[variantImage][optionKey] = null;
            }
          }
        });
      }
    });
    return variantImageObject;
  },
  _updateVariant: function (event, id, product, variantImages) {
    const arrImage = event.target.src
      .split('?')[0]
      .replace(/http(s)?:/, '')
      .split('.');
    const strExtention = arrImage.pop();
    const strRemaining = arrImage.pop().replace(/_[a-zA-Z0-9@]+$/, '');
    const strNewImage = `${arrImage.join('.')}.${strRemaining}.${strExtention}`; 
    var newimage = strNewImage.replace('_110x110_crop', '');
    console.log(variantImages);
    console.log(newimage);
    if (typeof variantImages[newimage] !== 'undefined') {
      product.variants.forEach((option, index) => {
        const optionValue = variantImages[newimage][`option-${index}`];
        if (optionValue !== null && optionValue !== undefined) {
          console.log('#'+ id + ' [class*=single-option-selector]');
          const selects = document.querySelectorAll('#'+ id + ' [class*=single-option-selector]');
          const options = selects[index].options;
          for (let option, n = 0; (option = options[n]); n += 1) {
            if (option.value === optionValue) {
              selects[index].selectedIndex = n;
              selects[index].dispatchEvent(new Event('change'));
              break;
            }
          }
        }
      });
    }
  },
  _selectVariant: function() {
    const productJson = document.querySelectorAll('[id^=ProductJson-');    
    if (productJson.length > 0) {
      productJson.forEach((product) => {
        const sectionId = "productSelect-1-option-0";        
        const thumbnails = document.querySelectorAll('.product-single__photo__nav__dots' + ' img[src*="/products/"]');
        if (thumbnails.length > 1) {
          const productObject = JSON.parse(product.innerHTML);          
          const variantImages = this._createVariantImage(productObject);          
          // need to check variants > 1
          if (productObject.variants.length > 1) {
			thumbnails.forEach((thumbnail) => {
              thumbnail.addEventListener('click', (e) =>
                this._updateVariant(e, sectionId, productObject, variantImages),
              );
            });         
          }
        }
      });
    }
  },
};

    if (document.readyState !== 'loading') {
      selectVariantByClickingImage._selectVariant();
    } else {
      document.addEventListener(
        'DOMContentLoaded',
        selectVariantByClickingImage._selectVariant(),
      );
    }
    