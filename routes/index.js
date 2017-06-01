var express = require('express')
, router = express.Router()
, config = require('../config')
, xkcd = require('xkcd')
, darksky = require('dark-sky')
, forecast = new darksky(config.weather.apiKey)
, QuadrigaCX = require('quadrigacx')
, async = require('async')
, _ = require('lodash')
, NodeCache = require('node-cache')
, weatherCache = new NodeCache();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/**
 * This route will make the server run each of the tasks below in parallel. This lets us
 * query multiple different APIs simultaneously for data and only return when each of the
 * tasks has completed/failed.
 */
router.post('/getData', function(req, res) {
  async.parallel({
    xkcd: function(callback) {
      xkcd(function(data){
        data.friendlyTitle = "\"" + data.title + "\""; 
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
      }); // end getWeatherForecasts
    },
    crypto: function(callback) {
      if (req.query.secretToken !== config.crypto.secretToken) {
        callback(null, []);
        return;
      }

      getCryptoData(function(err, investmentData) {
        if (err) {
          console.log(err);
          callback(err, null);
        }

        investmentData = _.sortBy(investmentData, [ function(d){ return d.order } ]);
        callback(null, investmentData);
      }); // end getCryptoData
    }

  // This is the section the runs once all of the async tasks above have finished
  }, function(err, results) {
    if (err) {
      console.log(err);
      res.json(results);
    }

    results.navLinks     = config.navLinks;
    results.greetingName = config.greetingName;
    results.weatherUnits = config.weather.units;
    res.json(results);
  });
});

/**
 * Fetches the forecast for each location in the config and concats the data
 * into a list. Calls the callback when completed with (err, data) arguments.
 * @param {callback:Function} - The callback to call. If an error occured
 * err will not be null.
 */
function getWeatherForecasts(callback) {
  async.concat(config.weather.locations, getForecast, callback);
}


/**
 * Fetches investment statistics for each of the investments specified in the
 * config asynchronously. Calls the callback when completed with (err, data) arguments.
 * @param {callback:Function} - The callback to call. If an error occured err
 * will not be null.
 */
function getCryptoData(callback) {
  // If the config is not set up for getting crypto data just return.
  if (!(config.crypto && config.crypto.currencies &&
      config.crypto.currencies.length > 0)) {
    callback(null, []);
    return;
  } // end if

  // We are passing no args because we are only getting public data from their API.
  var api = new QuadrigaCX("", "", "");
  // Asynchronously process each entry in the config currencies and concat the results
  async.concat(config.crypto.currencies, function (currency, concatCallback) {
    // Check the config for problems
    if ((currency.major && currency.minor && currency.buyInPrice > 0 && currency.buyInAmount > 0) !== true) {
      var error = "There is a problem with your currency configuration for: " + currency.label;
      console.log(error);
      callback(error, null);
      return;
    }

    // This is the part that queries the API to get the market data,
    // calculate and return the investment stats.

    var path = "ticker"
        , params = {"book": currency.major + "_" + currency.minor};

    // Run the API query against QuadrigaCX
    api.public_request(path, params, function (err, marketData) {
      if (err) {
        concatCallback("A problem occured querying QuadrigaCX", marketData);
        return;
      }

      concatCallback(null, getInvestmentStats(marketData, currency))
    }); // end api.public_request

  }, callback); // end async.concat
} // end getCryptoData

/**
 * Computes some data specific to the investment using market data.
 * @param {marketData:Object} - The data from QuadrigaCX
 * @param {investmentInfo:Object} - An object containing "buyInPrice" and "buyInAmount" floats
 * @returns {Object} - The investmentInfo but with current value, profit, and % profit added.
 */
function getInvestmentStats(marketData, investmentInfo) {
  investmentInfo.buyInValue    = (investmentInfo.buyInPrice * investmentInfo.buyInAmount).toFixed(2);
  investmentInfo.currentValue  = (investmentInfo.buyInAmount * marketData.ask).toFixed(2);
  investmentInfo.profit        = (investmentInfo.currentValue - investmentInfo.buyInValue).toFixed(2);
  investmentInfo.profitPercent = (investmentInfo.profit / investmentInfo.buyInValue * 100).toFixed(2);
  investmentInfo.marketData    = marketData;

  return investmentInfo;
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
