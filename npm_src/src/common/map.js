const map = {
  editStatus: new Map([
    [0, '未精编'],
    [1, '需精编'],
    [5, '精编中'],
    [10, '已精编']
  ]),
  bookStatus: new Map([
    [0, '正常'],
    [1, '测试']
  ]),
  payType: new Map([
    [0, '免费'],
    [1, '章节付费'],
    [2, '全本付费']
  ]),
  bookType: new Map([
    [0, '出版图书'],
    [1, '原创文学']
  ]),
  contentStatus: new Map([
    [0, '连载'],
    [1, '完结'],
    [2, '抓取样章']
  ]),
  languages: new Map([
    ['Chinese', '中文'],
    ['English', '英语']
  ]),
  publishStatus: new Map([
    [0, '未发布'],
    [1, '发布成功'],
    [2, '发布中'],
    [3, '发布失败']
  ]),
  bookStatus2: new Map([
    [0, '正常'],
    [9, '等待解析'],
    [10, '解析中'],
    [11, '解析失败'],
    [20, '数据迁移中']
  ]),
  publishChannel: new Map([
      [1, '阅读'],
      [2, '蜗牛']
  ]),
  roles: new Map([
    ['aut', '作者'],
    ['trl', '译者']
  ]),
  reviewStatus: new Map([
    [0, '普通'],
    [1, '提交审核'],
    [2, '审核不通过'],
    [3, '审核通过']
  ]),
  cloneFlag: new Map([
    [0, '正常书籍'],
    [1, '复制书籍']
  ])
}

export default map

export function getSelectList (type) {
  var ret = []
  map[type].forEach((value, key) => {
    ret.push({
      label: value,
      value: key
    })
  })
  return ret
}

export function getValue (type, key) {
  return map[type].get(key)
}
