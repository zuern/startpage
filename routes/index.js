var express = require('express')
, router = express.Router()
, config = require('../config')
, xkcd = require('xkcd')
, darksky = require('dark-sky')
, forecast = new darksky(config.weather.apiKey)
, async = require('async')
, _ = require('lodash')
, NodeCache = require('node-cache')
, weatherCache = new NodeCache();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/getData', function(req, res) {
  async.parallel({
    xkcd: function(callback) {
      xkcd(function(data){
        data.friendlyTitle = "Comic of the Day: \"" + data.title + "\""; 
        callback(null, data);
      });
    },
    forecasts: function(callback) {
      getWeatherForecasts(function(err, data){
        if (err) {
          console.err(err);
          callback(err, null);
        }
        data = _.sortBy(data, [function(f){ return f.order; }]);
        callback(null, data);
      });
    }
  }, function(err, results) {
    if (err) {
      console.err(err);
      res.json({});
    }

    results.navLinks     = config.navLinks;
    results.greetingName = config.greetingName;
    results.weatherUnits = config.weather.units;
    res.json(results);
  });
});

function getWeatherForecasts(callback) {
  async.concat(config.weather.locations, getForecast, callback);
}

function getForecast(location, callback) {
  getForecastFromCache(
    // Key for the cache
    location.lat + ":" + location.lng,
    // Callback when data ready
    function(data){
      console.log("Cache hit: " + location.name);
      callback(null, data);
    },
    // Function to get data if not in cache
    function(cb){
      console.log("Cache miss: " + location.name);
      forecast
      .latitude(location.lat)
      .longitude(location.lng)
      .units(config.weather.units)
      .get()
      .then(res =>{
        res.name = location.name;
        res.order = location.order;
        cb(res);
      });
    }); // end get from cache
}

/**
 * Fetch forecast information from the cache
 * @param {key:String} - the key to look up
 * @param {callback:function} - function gets passed data when complete
 * @param {getForecastFunction:function} - function to get forecast. it's passed a callback function for when forecast is retrieved
 */
function getForecastFromCache(key, callback, getForecastFunction) {
  weatherCache.get(key, function(err, value) {
    // If data not in cache
    if (err || value === undefined) {
      getForecastFunction(function(data){
        weatherCache.set(key, data, 600);
        callback(data);  
      });
    }
    // If data was found in cache
    else
      callback(value);
  });
}

module.exports = router;
