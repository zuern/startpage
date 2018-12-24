module.exports = {
  greetingName: "Kevin",
  navLinks: [
    {
      text: "Reddit",
      icon: "fa-reddit",
      url: "https://old.reddit.com"
    },
    {
      text: "Twitch",
      icon: "fa-twitch",
      url: "https://twitch.tv"
    },
    {
      text: "YouTube",
      icon: "fa-youtube",
      url: "https://youtube.com"
    },
    {
      text: "Hacker News",
      icon: "fa-hacker-news",
      url: "https://news.ycombinator.com"
    },
    {
      text: "Todoist",
      icon: "fa-check-square",
      url: "https://todoist.com/app?r=1545615701763#start"
    }
  ],
  weather: {
    apiKey: "",
    units: 'ca',
    locations: [
    {
      name: "Toronto",
      lat: "43.642605",
      lng: "-79.387068",
      order: 0
    },
    ]
  },
  crypto: {
    secretToken: "",
    currencies: [
      {
			label: "ɃTC",
			major: "btc",
			minor: "cad",
			buyInPrice:  00.00,
			buyInAmount: 0,
			order: 0
      },
      {
			label: "ΞTH",
			major: "eth",
			minor: "cad",
			buyInPrice: 0,
			buyInAmount: 0,
			order: 1
      },
      {
			label: "ŁTC",
			major: "ltc",
			minor: "cad",
			buyInPrice: 0,
			buyInAmount: 0,
			order: 2
      },
      {
			label: "BCH",
			major: "bch",
			minor: "cad",
			buyInPrice: 0,
			buyInAmount: 0,
			order: 3
      },
      {
			label: "BTG",
			major: "btg",
			minor: "cad",
			buyInPrice: 0,
			buyInAmount: 0,
			order: 4
      }
    ]
  }
}
