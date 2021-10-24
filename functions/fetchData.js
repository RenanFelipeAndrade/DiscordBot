const {
  apiKey
} = require("../config.json")
const axios = require('axios').default

var names = []
var gadgets = []
var starPowers = []

async function fetchAllBrawlers() {
  request = await axios.get("https://api.brawlstars.com/v1/brawlers", {
    headers: {
      "Authorization": `Bearer: ${apiKey}`
    }
  }).then(request => {
    data = request.data
    for (let index in data) {
      for (let brawler in data[index]) {
        names.push(data[index][brawler].name)
        starPowers.push(data[index][brawler].starPowers)
        gadgets.push(data[index][brawler].gadgets)
        // brawlerInfo.toString().toLowerCase() != 'id' ? results.push(data[index][brawler][brawlerInfo]) : console.log(brawlerInfo)
      }
    }
  })
}


fetchAllBrawlers(),
  module.exports = {
    fn: fetchAllBrawlers(),
    names: names,
    starPowers: starPowers,
    gadgets: gadgets
  }