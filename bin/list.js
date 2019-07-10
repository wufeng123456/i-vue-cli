const request = require('request')
const chalk = require('chalk')

function list () {
  request({
    url: 'https://api.github.com/users/vuejs-templates/repos',
    headers: {
      'User-Agent': 'i-vue-cli'
    }
  }, (err, res, body) => {
    if (err) console.log(err)
    const bodyJson = JSON.parse(body)
    if (Array.isArray(bodyJson)) {
      bodyJson.forEach(resp => {
        console.log(`${chalk.blue(resp.name)}:  ${resp.description}`)
      })
    }
  })
}

module.exports = list