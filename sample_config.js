// This is a sample configuration file. Use this to configure settings for your homepage
// The application expects a file of this format called config.js

module.exports = {
  greetingName: "Your Name",
/*
 * Icon codes for nav links are from https://font-awesome.io/icons
 */
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

/**
 * You can get an API key for weather at https://darksky.net/dev/
 * weather.units is based on Dark Sky's units in their weather api. See the docs (via the link) for
 * info.
 * The order parameter in weather specifies the sorting of the weather forecasts on the homepage
 */
  weather: {
    apiKey: "<your api key here>",
    units: 'ca',
    locations: [
    {
      name: "Kingston",
      lat: "46.172421",
      lng: "-76.422454",
      order: 0
    },
    {
      name: "Gravenhurst",
      lat: "44.916943",
      lng: "-79.371483",
      order: 1
    }
    ]
  },

/**
 * This section allows you to put in details from your investments in cryptocurrencies
 * and have the current value, profit, and % increase/decrease calculated automatically.
 * If you don't need this functionality just put an empty list for currencies.
 * 
 * Market data is from QuadrigaCX's API, and the cryptos are restricted to what they offer
 * in their API. Look up the details at https://www.quadrigacx.com/api_info.
 *
 * The summary is as follows:
 *    Major denotes any of the Cryptocurrencies such as Bitcoin (BTC) or any other
 *    cryptocurrency which is added to the QuadrigaCX trading platform in the future.
 *    Minor denotes fiat currencies such as Canadian Dollars (CAD), etc.
 *    The currencies are specified with the following 3 letter codes
 *      Canadian Dollars = cad
 *      US Dollars = usd
 *      Bitcoin = btc
 *      Ether = eth
 *
 * If you don't want anyone who visits your start page to see your profit/loss data on the
 * cryptocurrencies you can optionally set secretToken to a string. This will only 
 * show your profit/loss data when the token is included in the url. For example, if 
 * secretToken is "iIZ8i5TnLMUIItifNOiY2oAIk9Wpae" then you would only see the crypto data
 * when accessing via "http://yourstartpageurl.com?secret=iIZ8i5TnLMUIItifNOiY2oAIk9Wpae"
 *
 * Below, "buyInPrice" refers to the value of the major relative to the minor when you
 * bought it. "buyInAmount" is the amount of that currency you bought. We use that info
 * and the latest market data from QuadrigaCX to calculate the investment statistics.
 *
 * The order parameter in weather specifies the sorting of the weather forecasts on the homepage
 *
 * If you bought a crypto more than once at different prices you can add the currency to 
 * the list once for each purchase (putting in your intial cost and amount for each) and 
 * then track the profit/loss accurately.
*/
  crypto: {
    secretToken: null,
    currencies: [
      {
        label: "ɃTC",
        major: "btc",
        minor: "cad",
        buyInPrice:  1000.00,
        buyInAmount: 1.00,
        order: 0
      },
      {
        label: "ΞTH",
        major: "eth",
        minor: "cad",
        buyInPrice: 25.00,
        buyInAmount: 40.00,
        order: 1
      }
    ]
  }
}