const url = require('url')
const qs = require('querystring')

module.exports = {
  appendQueryString(original, queryObj) {
    let urlParsed = url.parse(original)
    let queryParsed = qs.parse(urlParsed.query)
    urlParsed.search = undefined
    queryParsed = Object.assign(queryParsed, queryObj)
    urlParsed.query = queryParsed
    return url.format(urlParsed)
  }
}
