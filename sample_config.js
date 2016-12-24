// This is a sample configuration file. Use this to configure settings for your homepage
// The application expects a file of this format called config.js

// You can get an API key for weather at https://darksky.net/dev/
// weather.units is based on Dark Sky's units in their weather api. See their docs for info.
// The order parameter in weather specifies the sorting of the weather forecasts on the homepage
module.exports = {
  greetingName: "Kevin",
  weather: {
    apiKey: "<your api key here>",
    units: 'ca',
    locations: [
    {
      name: "Kingston",
      lat: "44.231172",
      lng: "-76.485954",
      order: 0
    },
    {
      name: "Gravenhurst",
      lat: "44.919643",
      lng: "-79.374183",
      order: 1
    }
    ]
  }
}