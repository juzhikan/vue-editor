export function random (len) {
  var num = ''
  for (var i = 0; i < len; i++) {
    num += Math.floor(Math.random() * 10)
  }
  return num
}

export function html2Escape (sHtml) {
  return sHtml.replace(/[<>&"]/g, function (c) { return {'<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;'}[c] })
}

export function mutexclass (obj, actClass, classList) {
  var hasActive = obj.classList.contains(actClass)
  for (var i = 0; i < classList.length; i++) {
    obj.classList.remove(classList[i])
  }
  if (!hasActive) {
    obj.classList.add(actClass)
  }
}

export function clearBR (sections) {
  for (var i = 0; i < sections.length; i++) {
    var html = sections[i].innerHTML
    var regMatch = /^[\S\s]+<br>$/.test(html) && !/^[\S\s]+<br><br>$/.test(html)
    if (regMatch) {
      sections[i].innerHTML = html.replace(/<br>$/, '')
      return
    }
  }
}

export function shadowCopy (src) {
  var dist
  if (src instanceof Array) {
    dist = []
    for (var i = 0; i < src.length; ++i) {
      dist[i] = shadowCopy(src[i])
    }
    return dist
  } else if (src instanceof Object) {
    dist = {}
    for (var j in src) {
      dist[j] = shadowCopy(src[j])
    }
    return dist
  } else {
    return src
  }
}

export function arrayContains (arr, obj) {
  var i = arr.length
  while (i--) {
    if (arr[i] === obj) {
      return true
    }
  }
  return false
}

export function textExploreReplace (node, findValue, replaceValue) {
  var num = 0

  function explore (node, findValue, replaceValue) {
    if (node.nodeType === 3) {
      var textContent = node.textContent

      var splitArray = node.textContent.split(findValue)
      if (splitArray.length > 1) {
        num += (splitArray.length - 1)
        node.textContent = splitArray.join(replaceValue)
      }
    } else if (node.nodeType === 1) {
      for (var index = 0; index < node.childNodes.length; index++) {
        explore(node.childNodes[index], findValue, replaceValue)
      }
    }
  }

  explore(node, findValue, replaceValue)

  return num
}

export function throttle (fn, timeout) {
  var timer = null
  return function () {
    var argus = arguments
    if (!timer) {
      var self = this
      timer = setTimeout(function () {
        fn.apply(self, Array.prototype.slice.call(argus, 0))
        timer = null
      }, timeout)
    }
  }
}

function removeNode (node, condition) {
  var parent = node.parentNode
  var brother = node.nextSibling
  var newNode
  if (node.nodeType !== 1) {
    return
  }
  var childNodes = node.childNodes
  if (condition(node)) {
    while (node.childNodes.length) {
      removeNode(childNodes[0], condition)
      if (brother) {
        parent.insertBefore(childNodes[0], brother)
      } else {
        parent.appendChild(childNodes[0])
      }
    }
    if (node.classList.contains('mark')) {
      var titleNode = document.createTextNode(node.getAttribute('title'))
      if (brother) {
        parent.insertBefore(titleNode, brother)
      } else {
        parent.appendChild(titleNode)
      }
    }
    parent.removeChild(node)
  } else {
    for (var i = 0; i < childNodes.length; i++) {
      removeNode(childNodes[i], condition)
    }
  }
}

function hasLegalClass (node) {
  var legalClassArr = ['font-color', 'bold', 'mark', 'underline', 'italic', 'sub', 'sup', 'paragraph-img', 'paragraph-img--internal']
  if (/yd-/.test(node.className)) return true
  for (let i = 0; i < legalClassArr.length; i++) {
    var legalClass = legalClassArr[i]
    if (node.classList.contains(legalClass)) return true
  }
  return false
}

export function fix (param) {
  function fixContent (node) {
    var childNodes = node.childNodes
    for (var i = 0; i < childNodes.length; i++) {
      removeNode(childNodes[i], function (node) {
        return (!node.className || (node.className && !(hasLegalClass(node)))) && node.tagName !== 'IMG' && node.tagName !== 'BR'
      })
    }
  }

  if (param.length) {
    for (var i = 0; i < param.length; i++) {
      fixContent(param[i])
    }
  } else {
    fixContent(param)
  }
}

export function textual (param, type) {
  function convertToText (node) {
    /* 去除span  不去br */
    /* type true 去注释 */
    var childNodes = node.childNodes
    for (var i = 0; i < childNodes.length; i++) {
      removeNode(childNodes[i], function (node) {
        if (type) {
          return node.tagName !== 'IMG' && node.tagName !== 'BR'
        } else {
          return (!node.className || (node.className && !node.classList.contains('mark'))) && node.tagName !== 'IMG' && node.tagName !== 'BR'
        }
      })
    }

    node.className = node.className.replace(/\byd-[a-z0-9-]+\b ?/g, '')
    node.className = node.className.replace(/\s*$/g, '')
    node.removeAttribute('style')
  }

  if (param.length) {
    for (var i = 0; i < param.length; i++) {
      convertToText(param[i])
    }
  } else {
    convertToText(param)
  }
}

export function getElement (el) {
  if (!(el && (typeof el === 'string' || (typeof el === 'object' && el.nodeType === 1)))) alert('element does not exist')
  return (typeof el === 'string' && document.querySelector('#' + el)) || el
}

export function remove (el, classString) {
  var element = getElement(el)
  element.classList.remove(classString)
}

export function addHistory (value) {
  var arr = []
  var history = localStorage.getItem('editHistory')
  if (!history) {
    arr.push(value)
    localStorage.setItem('editHistory', JSON.stringify(arr))
  } else {
    arr = JSON.parse(history)
    if (arr.length > 9) {
      arr.shift()
      arr.push(value)
    } else {
      arr.push(value)
    }
    localStorage.setItem('editHistory', JSON.stringify(arr))
  }
}

export function clearHistory () {
  var history = localStorage.getItem('editHistory')
  if (history) localStorage.removeItem('editHistory')
}

export function formatStyle (node, fmtBrs) {
  var textValue = node.textContent
  var elementNode = null
  var spanNode = null
  node.removeAttribute('style')
  fmtBrs.styleArray.forEach(function (item) {
    switch (Object.keys(item)[0]) {
      case 'style':
        node.setAttribute('style', item['style'])
        break
      case 'className':
        spanNode = document.createElement('span')
        spanNode.className = item['className']
        if (!elementNode) {
          spanNode.innerHTML = textValue
          elementNode = spanNode
        } else {
          spanNode.appendChild(elementNode)
          elementNode = spanNode
        }
        node.innerHTML = ''
        node.appendChild(elementNode)
        break
      case 'colorClass':
        spanNode = document.createElement('span')
        spanNode.className = item['colorClass']
        spanNode.style = item['color']
        if (!elementNode) {
          spanNode.innerHTML = textValue
          elementNode = spanNode
        } else {
          spanNode.appendChild(elementNode)
          elementNode = spanNode
        }
        node.innerHTML = ''
        node.appendChild(elementNode)
        break
      default:
        break
    }
  })
}

var strategies = {
  closeUp (errorMsg) {
    var content = this.textContent.replace(/\s*$/, '')
    var tailMatch = content.match(/\S$/)
    if (tailMatch) {
      var tail = tailMatch[0]
      return !/[.!?:"(--)(...)(......)。！？：”(——)]/.test(tail) && errorMsg
    }
  },
  invalidSpan (errorMsg) {
    return /<span>/.test(this.innerHTML) && errorMsg
  }
}

export function SyntaxChecking () {
  this.cache = []
}

SyntaxChecking.prototype.add = function (options) {
  var dom = options.dom
  var rules = options.rules

  this.cache.push(function () {
    var errorMsg = ''
    var showTag = dom.parentNode
    var title = showTag.getAttribute('title') || ''
    for (var i = 0; i < rules.length; i++) {
      var rule = rules[i]
      var args = rule[0].split(':')
      var strategy = args.shift()
      args.push(rule[1])
      var checkMsg = strategies[strategy].apply(dom, args) || ''
      checkMsg = checkMsg === '' ? '' : '--' + checkMsg
      errorMsg += checkMsg
    }
    errorMsg = errorMsg.replace(/^--/, '')
    if (errorMsg !== '') {
      showTag.setAttribute('title', errorMsg)
      if (title === '') showTag.style.backgroundColor = 'rgba(255, 0, 0, 0.1)'
    } else {
      showTag.removeAttribute('title')
      if (title !== '') showTag.style.backgroundColor = 'transparent'
    }
  })
}

SyntaxChecking.prototype.check = function () {
  for (var index = 0; index < this.cache.length; index++) {
    this.cache[index]()
  }
}
