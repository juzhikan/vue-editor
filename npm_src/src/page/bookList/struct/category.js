export default class Category {
  constructor (list = []) {
    this._data = this._genTree(list)
  }
  getData () {
    return this._data
  }
  getItem (id) {
    var ret = {parent: {}, item: {}}
    this._data.forEach(parent => {
      var next = true
      parent.options.forEach(item => {
        if (item.value === id) {
          ret.parent = parent
          ret.item = item
          next = false
          return false
        }
      })
      return next
    })
    return ret
  }
  getItems (id) {
    var ret = []
    this._data.forEach(parent => {
      if (parent.value === id) {
        ret = parent.options
        return false
      }
    })
    return ret
  }
  _genTree (list) {
    var ret = []
    list.forEach(item => {
      if (item.level === 1) {
        ret.push({label: item.name, options: [], value: item.id})
      } else {
        var lastOption = ret[ret.length - 1].options
        lastOption.push({
          label: item.name,
          value: item.id
        })
      }
    })
    return ret
  }
}
