import moment from 'moment'

var url = {
  getQuery: function (url) {
    var query = url.split('?')[1]
    if (!query) {
      return {}
    } else {
      var res = {}
      var maps = query.split('&')
      maps.forEach(map => {
        var mapArr = map.split('=')
        res[mapArr[0]] = mapArr[1]
      })
      return res
    }
  },
  genUrl: function ({query = {}, protocol = location.protocol, host = location.host, path = location.pathname}) {
    var queryArr = []
    for (var i in query) {
      if (query[i] === '') {
        continue
      }
      queryArr.push(`${i}=${query[i]}`)
    }
    return `${protocol}//${host}${path}?${queryArr.join('&')}`
  }
}

export default {
  url
}

export function genTime (value) {
  let date = moment(value)
  return date.format('YYYY/MM/DD HH:mm:ss')
}
