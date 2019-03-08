import { random, html2Escape } from '@/util'

function removeEmptyNode (type) {
  var selected = document.querySelector('.section-selected')
  if (!selected) return
  var content = selected.querySelector('.section')
  content.normalize()
  var childNodes = content.childNodes
  if (childNodes.length) {
    for (var i = 0; i < childNodes.length; i++) {
      clearNullHtmlNode(childNodes[i])
    }
  }
}

function clearNullHtmlNode (node) {
  if (node.nodeType === 1 && node.tagName !== 'BR' && node.tagName !== 'IMG' && !containsMark(node)) {
    if (!/\S/.test(node.textContent)) {
      node.parentNode.removeChild(node)
    } else {
      for (var i = 0; i < node.childNodes.length; i++) {
        clearNullHtmlNode(node.childNodes[i])
      }
    }
  }
}

function containsMark (node) {
  if (node.nodeType === 1) {
    if (node.classList.contains('mark')) return true
    for (var i = 0; i < node.childNodes.length; i++) {
      if (containsMark(node.childNodes[i])) return true
    }
  }
  return false
}

function removeTypeNode (node, type) {
  var parent = node.parentNode
  var brother = node.nextSibling
  var newNode
  if (node.nodeType !== 1) {
    return
  }
  var childNodes = node.childNodes
  if (node.classList.contains(type)) {
    while (node.childNodes.length) {
      removeTypeNode(childNodes[0], type)
      if (brother) {
        parent.insertBefore(childNodes[0], brother)
      } else {
        parent.appendChild(childNodes[0])
      }
    }
    parent.removeChild(node)
  } else {
    for (var i = 0; i < childNodes.length; i++) {
      removeTypeNode(childNodes[i], type)
    }
  }
}

function getTypeNode (node, type) {
  if (node.classList.contains('section')) return node
  if (node.nodeType === 1 && node.classList.contains(type)) {
    return node
  } else {
    return getTypeNode(node.parentNode, type)
  }
}

function getNodeStr (node) {
  if (node.nodeType === 1) {
    return node.outerHTML
  }
  return node.textContent
}

function setNoty (s) {
  console.log(s)
}

var Range = function () {
  this.selection = window.getSelection()
  try {
    this.range = this.selection.getRangeAt(0)
    this.startContainer = this.range.startContainer
    this.endContainer = this.range.endContainer
  } catch (ex) {
    setNoty('未进行选区！！！')
  }
}
Range.prototype = {
  constructor: Range,
  /**
   * [isEndToNode 判断选区是否是node节点开头或结尾]
   * @return {Boolean} [description]
   */
  isEndToNode: function () {
    var _startOffset = this.range.startOffset
    var _endOffset = this.range.endOffset
    var lastChildLength = (this.endContainer.nodeValue && this.endContainer.nodeValue.length) || 0
    console.log(_startOffset, _endOffset, lastChildLength)
    if (_startOffset === 0 && _endOffset === lastChildLength) {
      return true
    } else {
      return false
    }
  },
  /**
   * [isContainNode 选区是否包含某node节点]
   * @return {Boolean} [description]
   */
  isContainNode: function () {
    return (this.startContainer === this.endContainer)
  },
  /**
   * [isCollapsed description]
   * @return {Boolean} [description]
   */
  isCollapsed: function () {
    return this.range.collapsed
  },
  /**
   * [insertNode description]
   * @param  {[type]} type        [description]
   * @param  {[type]} targetHanle [description]
   * @return {[type]}             [description]
   */
  insertNode: function (type, targetHanle, wraptype, ftype) {
    console.log(1111111111111)
    var fontReg = /^(yd-font-)|(yd-fsize-)/g.test(type)

    if (this.isCollapsed()) {
      setNoty('请选取文本或在有效位置进行编辑！', 'error')
      return
    }

    var _fragdocument = this.range.cloneContents()
    var _html = []
    var i, len
    for (i = 0; i < _fragdocument.childNodes.length; i++) {
      removeTypeNode(_fragdocument.childNodes[i], type)
    }
    for (i = 0, len = _fragdocument.childNodes.length; i < len; i++) {
      var item = _fragdocument.childNodes[i]
      if (item.nodeType === 3) {
        _html.push(html2Escape(item.nodeValue))
      } else if (item.nodeType === 1) {
        if (!item.classList.contains('mark')) {
          if ((/^(yd-font-)|(yd-fsize-)/g.test(item.className) && fontReg) || type === 'mark') {
            _html.push(item.innerHTML)
          } else {
            _html.push(item.outerHTML)
          }
        }
      } else {
        console.info(item, '遗漏的类型....')
      }
    }
    if (fontReg) {
      this._selectdNode(_html, type, wraptype, ftype)
    } else {
      this._insertNode(this.isEndToNode(), _html, type, targetHanle)
    }
  },
  /**
   * [_insertNode description]
   * @param  {Boolean} isCommon [description]
   * @param  {[type]}  _falg    [description]
   * @param  {[type]}  type     [description]
   * @return {[type]}           [description]
   */
  _insertNode: function (isEndToNode, _falg, type, targetHanle) {
    var _newNode = null
    var _newInertNode = null
    if (targetHanle.classList.contains('active')) {
      var rangeContentFragment1 = this.range.extractContents()
      var insertRandom = random(9)
      var flag = 'insertMark-' + insertRandom
      var mark = document.createTextNode(flag)
      this.range.insertNode(mark)

      var boundary = document.querySelector('.section-selected').querySelector('.section')

      var commonAncestorContainer = getTypeNode(this.range.commonAncestorContainer, type)
      var parentNode = mark.parentNode
      var incisionClasses = []
      while (parentNode !== boundary) {
        incisionClasses.unshift(parentNode.className)
        if (parentNode === commonAncestorContainer) break
        parentNode = parentNode.parentNode
      }

      var rightfront = ''
      var leftclose = ''
      var centerclose = ''
      var centerfront = ''

      for (var i = 0; i < incisionClasses.length; i++) {
        leftclose += '</span>'
        rightfront += '<span class="' + incisionClasses[i] + '">'
        if (incisionClasses[i] !== type) {
          centerclose += '</span>'
          centerfront += '<span class="' + incisionClasses[i] + '">'
        }
      }

      var html = commonAncestorContainer.outerHTML
      var centerstr = leftclose + centerfront + _falg.join('') + centerclose + rightfront
      html = html.replace(flag, centerstr)
      commonAncestorContainer.outerHTML = html
    } else {
      var _insertHtml = _falg.length > 0 ? _falg.join('') : '&#8203;'
      switch (type) {
        case 'underline':
        case 'bold':
        case 'yd-code':
        case 'italic':
        case 'sup':
        case 'sub':
          _newNode = '<span class="' + type + '">' + _insertHtml + '</span>'
          break
        case 'mark':
          _newNode = '<span class="' + type + '" title="' + _insertHtml + '"></span>'
          break
      }
      this.range.deleteContents()
      _newInertNode = this.range.createContextualFragment(_newNode)
      this.range.insertNode(_newInertNode)
    }
    removeEmptyNode()
    this.range.collapse(true)
    this.selection.collapseToEnd()
  },
  insertColorNode: function (type, color) {
    var that = this
    var _isCommonNode = false
    var _fragdocument = that.range.cloneContents()
    var _html = []

    Array.prototype.forEach.call(_fragdocument.childNodes, function (item) {
      if (item.nodeType === 3) {
        _html.push(item.nodeValue)
      } else {
        if (/^(font-color)|(back-color)/g.test(item.className)) {
          _html.push(item.innerHTML)
        } else {
          _html.push(item.outerHTML)
        }
      }
    })
    if (!that.isCollapsed()) {
      _isCommonNode = (that.startContainer.parentNode === that.endContainer.parentNode && that.endContainer.parentNode.tagName !== 'P')
      that._insertColorNode(_isCommonNode, _html, type, color)
    }
  },
  /**
   * [_insertColorNode 颜色操作]
   * @param  {Boolean} isCommon [description]
   * @param  {[type]}  tmpl     [description]
   * @param  {[type]}  type     [description]
   * @return {[type]}           [description]
   */
  _insertColorNode: function (isCommon, tmpl, type, color) {
    var that = this
    var isFontTag = /^(font-color)|(back-color)/g.test(that.startContainer.parentNode.className)
    var _newNode = null

    if (isCommon && isFontTag && that.range.startOffset === 0 && that.range.endOffset === that.range.endContainer.length) {
      that.range.setStartAfter(that.endContainer)
      that.range.selectNode(that.range.endContainer)
    }
    var _insertHtml = tmpl.length > 0 ? tmpl.join('') : '&#8203;'
    _newNode = '<span style="color:' + color + '" class="' + type + '">' + _insertHtml + '</span>'
    that.range.deleteContents()
    var _newInertNode = that.range.createContextualFragment(_newNode)
    that.range.insertNode(_newInertNode)
    removeEmptyNode()
  },
  /**
   * [focusStatus description]
   * @return {[type]} [description]
   */
  focusStatus: function () {
    var that = this
    return that.extendWrapNode()
  },
  /**
   * [extendWrapNode description]
   * @return {[type]} [description]
   */
  extendWrapNode: function () {
    var that = this
    if (this.startContainer.nodeType === 1 && this.startContainer.classList.contains('mark')) {
      return {
        _startWrapNode: that.startContainer.tagName.toLowerCase(),
        _endWrapNode: that.endContainer.tagName.toLowerCase(),
        _class: that.endContainer.getAttribute('class'),
        _isCommonNode: true,
        _isEndToNode: true,
        _isCollapsed: that.isCollapsed()
      }
    } else {
      var node
      var array = []
      if (that.range.collapsed) {
        if (that.range.startOffset !== 0) {
          node = that.range.startContainer
          if (node.nodeType === 3) {
            node = node.parentNode
          }
          that.upstream(array, node)
        }
      } else {
        node = that.range.commonAncestorContainer
        if (node.nodeType === 3) {
          node = node.parentNode
        }
        that.upstream(array, node)
      }
      return {
        _startWrapNode: that.startContainer.parentNode.tagName.toLowerCase(),
        _endWrapNode: that.endContainer.parentNode.tagName.toLowerCase(),
        _class: that.startContainer.parentNode.getAttribute('class'),
        _isCommonNode: !!that.isContainNode(),
        _isEndToNode: that.isEndToNode(),
        _isCollapsed: that.isCollapsed(),
        _classList: array
      }
    }
  },
  upstream (array, node) {
    var list = node.classList
    if (list && !list.contains('section')) {
      for (var i = 0, l = list.length; i < l; i++) {
        array.push(list.item(i))
      }
      this.upstream(array, node.parentNode)
    }
  },
  /**
   * [_selectdNode select]
   * @param  {[type]} html   [description]
   * @param  {[type]} type   [description]
   * @param  {[type]} ftype  [description]
   * @return {[type]}        [description]
   */
  _selectdNode: function (html, type, wraptype, ftype) {
    var that = this
    var rangeStatus = that.extendWrapNode()
    var fontReg = /^(yd-font-)|(yd-fsize-)/g.test(rangeStatus._class)
    that._insertSelectNode(fontReg, that.isEndToNode(), html, type, wraptype, ftype, rangeStatus._class)
  },
  /**
   * [_insertSelectNode description]
   * @param  {[type]}  isfontWrap [description]
   * @param  {Boolean} isNodeWrap [description]
   * @param  {[type]}  html       [description]
   * @param  {[type]}  type       [description]
   * @param  {[type]}  ftype      [description]
   * @return {[type]}             [description]
   */
  _insertSelectNode: function (isfontWrap, isNodeWrap, html, type, wraptype, ftype, _class) {
    var that = this
    var _newNode = null
    var _newInertNode = null

    var active = getFtypeNode(that.range.commonAncestorContainer, ftype)

    if (active) {
      var rangeContentFragment1 = that.range.extractContents()
      var mark = document.createTextNode('insertrangemark')
      that.range.insertNode(mark)

      var commonAncestorContainer = active
      that.range.setStartAfter(that.range.startContainer)
      that.range.selectNode(commonAncestorContainer)

      var innerHTML = ''
      var rangeContentFragment2 = that.range.extractContents()

      for (var h = 0; h < rangeContentFragment2.childNodes.length; h++) {
        innerHTML += getNodeStr(rangeContentFragment2.childNodes[h])
      }

      var index = innerHTML.indexOf(mark.textContent)
      var startstr = innerHTML.substring(0, index)
      var endstr = innerHTML.substring(index + mark.textContent.length, innerHTML.length)
      var targetstr = ''
      for (var k = 0; k < rangeContentFragment1.childNodes.length; k++) {
        removeftypeNode(rangeContentFragment1.childNodes[k], ftype)
        targetstr += getNodeStr(rangeContentFragment1.childNodes[k])
      }

      that.range.deleteContents()

      var fullreg = /<span class="([a-z]*)">.*<\/span>/g
      var fullarr = startstr.match(fullreg)
      var startstrcopy = startstr
      if (fullarr) {
        for (var j = 0; j < fullarr.length; j++) {
          startstrcopy.replace(fullarr[j], '')
        }
      }

      var regstart = /<span class=".*">/g
      var regstartarr = startstrcopy.match(regstart)

      var regend = /<\/span>/g
      var regendarr = startstr.match(regend)
      var startcount = regstartarr.length - 1
      var endcount = regendarr === null ? 0 : regendarr.length
      var frontrepair = '</span>'
      var behindrepair = '<span class="' + wraptype + '">'
      var targetwraps = '<span class="' + type + '">'
      var targetwrape = '</span>'
      for (var i = 0; i < startcount - endcount; i++) {
        frontrepair += '</span>'
        var className = regstartarr[i + 1].replace('<span class="', '').replace('">', '')
        behindrepair += '<span class="' + className + '">'
        targetwraps += '<span class="' + className + '">'
        targetwrape += '</span>'
      }

      var insertedHtml = startstr + frontrepair + targetwraps + targetstr + targetwrape + behindrepair + endstr
      _newInertNode = that.range.createContextualFragment(insertedHtml)
      that.range.insertNode(_newInertNode)
    } else {
      var _insertHtml = html.length > 0 ? html.join('') : '&#8203;'
      _newNode = '<span class="' + type + '">' + _insertHtml + '</span>'
      that.range.deleteContents()
      _newInertNode = that.range.createContextualFragment(_newNode)
      that.range.insertNode(_newInertNode)
    }
    removeEmptyNode()
    that.range.collapse(true)
    that.selection.collapseToEnd()
  }
}

function getFtypeNode (node, ftype) {
  if (!node) return false
  if (node.nodeType === 1 && node.classList.contains('section')) return false
  var pat = new RegExp('yd-' + ftype + '-([a-z0-9]*)', 'g')
  if (node.nodeType === 1 && pat.test(node.className)) {
    return node
  } else {
    return getFtypeNode(node.parentNode, ftype)
  }
}

function removeftypeNode (node, ftype, b) {
  var parent = node.parentNode
  var newNode
  var pat = new RegExp('yd-' + ftype + '-([a-z0-9]*)', 'g')
  if (node.nodeType !== 1) {
    if (b) {
      newNode = node.cloneNode(true)
      parent.removeChild(node)
      parent.appendChild(newNode)
    }
    return
  }
  var childNodes = node.childNodes
  var len = childNodes.length
  if (pat.test(node.className)) {
    if (len) {
      for (var j = 0; j < len; j++) {
        removeftypeNode(childNodes[0], ftype)
        parent.appendChild(childNodes[0])
      }
    }
    parent.removeChild(node)
  } else {
    for (var i = 0; i < len; i++) {
      removeftypeNode(node.firstChild, ftype, true)
    }
    if (b) {
      newNode = node.cloneNode(true)
      parent.removeChild(node)
      parent.appendChild(newNode)
    }
  }
}

export default Range
