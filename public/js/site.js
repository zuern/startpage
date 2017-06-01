var Site = (function($, ko, moment) {

  // --- Module variables ----------------------------------------------------
  var _vm = new ViewModel();
  var _apiUrl = "http://localhost:3000/getData";
  // --- Models --------------------------------------------------------------
  function ViewModel() {
    var self = this;

    self.greeting     = ko.pureComputed(getGreeting);
    self.greetingName = ko.observable();
    self.navLinks     = ko.observable();
    self.xkcd         = ko.observable();
    self.forecasts    = ko.observable();
    self.crypto       = ko.observable();

    return self;
  }
  // --- API functions -------------------------------------------------------
  function init() {
    // If secret token was provided, send it with the request
    var params = getQueryStrings();
    if (params["secretToken"])
      _apiUrl += "?secretToken=" + params["secretToken"];

    $.post(_apiUrl).done(function(res) {
      _vm.xkcd(res.xkcd);
      _vm.forecasts(res.forecasts);
      _vm.greetingName(res.greetingName);
      _vm.navLinks(res.navLinks);
      _vm.crypto(res.crypto);
      registerKOBindings();
      ko.applyBindings(_vm);
      $("body").fadeIn();
      $("#fullpage").fullpage({
        anchors: ['search', 'theExtras']
      });
    })
  }
  // --- Private functions ---------------------------------------------------
  function getGreeting() {
    var timeOfDay = "";

    if (moment().hour() < 12)
      timeOfDay = "Morning";
    else if (moment().hour() < 16)
      timeOfDay = "Afternoon";
    else
      timeOfDay = "Evening";
    
    return "Good " + timeOfDay + ", " + _vm.greetingName();
  }

  function map(val, in_min, in_max, out_min, out_max) {
    return (val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

  function registerKOBindings() {
    ko.bindingHandlers.temperature = {
      update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var units = (_vm.weatherUnits === "us") ? "&#176;F" : "&#176;C";
        var text = Math.round(valueAccessor()) + " " + units;
        $(element).html(text);
      }
    };
  }

  // https://stackoverflow.com/a/2907506
  function getQueryStrings() {
    var assoc  = {};
    var decode = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); };
    var queryString = location.search.substring(1);
    var keyValues = queryString.split('&');

    for(var i in keyValues) {
      var key = keyValues[i].split('=');
      if (key.length > 1) {
        assoc[decode(key[0])] = decode(key[1]);
      }
    }

    return assoc; 
  } 
  // --- Expose module API ---------------------------------------------------
  return {
  // Public API
  init: init,
  viewModel: _vm,
  // Expose for testing
  __internal__: {}
  };
})(jQuery, ko, moment);

Site.init();
