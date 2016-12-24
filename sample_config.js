// This is a sample configuration file. Use this to configure settings for your homepage
// The application expects a file of this format called config.js

// icons for nav links are from https://font-awesome.io/icons
// You can get an API key for weather at https://darksky.net/dev/
// weather.units is based on Dark Sky's units in their weather api. See their docs for info.
// The order parameter in weather specifies the sorting of the weather forecasts on the homepage
module.exports = {
  greetingName: "Your Name",
  navLinks: [
    {
      text: "Reddit",
      icon: "fa-reddit",
      url: "https://reddit.com"
    },
    {
      text: "Facebook",
      icon: "fa-facebook",
      url: "https://facebook.com"
    }
  ],
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