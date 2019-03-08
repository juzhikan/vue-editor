import { arrayContains } from '@/util'
import Range from './Range'

const fontCommon = {
  'bold': 'font-bold',
  'underline': 'font-underline',
  'italic': 'font-italic',
  'sup': 'font-sup',
  'sub': 'font-sub',
  'mark': 'font-mark'
}

const paragraphCommandClass = ['section', 'j-chapter']

const idMapClass = {
  'yd-paragraph-f': 'align-left',
  'yd-paragraph-c': 'align-center',
  'yd-paragraph-j': 'align-justify',
  'yd-paragraph-r': 'align-right',
  'yd-fullscreen': 'full-screen',
  'yd-chapterhide': 'title-hide',
  'yd-fullwidth': 'full-width',
  'yd-code': 'code',
  'yd-box': 'box',
  'yd-quote': 'quote',
  'yd-separate': 'separate',
  'yd-poetry': 'poetry',
  'yd-recommendperson': 'recommend-person',
  'yd-imagetitle': 'image-title',
  'yd-textSubtitle': 'text-subtitle'
}

const classMapId = {
  'align-left': 'yd-paragraph-f',
  'align-center': 'yd-paragraph-c',
  'align-justify': 'yd-paragraph-j',
  'align-right': 'yd-paragraph-r',
  'full-screen': 'yd-fullscreen',
  'title-hide': 'yd-chapterhide',
  'full-width': 'yd-fullwidth',
  'code': 'yd-code',
  'box': 'yd-box',
  'quote': 'yd-quote',
  'poetry': 'yd-poetry',
  'recommend-person': 'yd-recommendperson',
  'image-title': 'yd-imagetitle',
  'text-subtitle': 'yd-textSubtitle'
}

const toolbarState = {
  checkParagraphCommandState (toolbar, node, callback) {
    let _callback = callback || function () {}
    let res = [0]
    let classList = Array.prototype.slice.call(node.classList, 0)
    let NodeActived = Array.prototype.slice.call(toolbar.querySelectorAll('.active'))
    let classActived = NodeActived.map(function (element) {
      return classMapId[element.id]
    })
    let needAdd = classList.filter(function (className) {
      let isSubtitle = /yd-textSubtitle/.test(className)
      let _className = isSubtitle ? 'yd-textSubtitle' : className
      return !arrayContains(classActived, _className) && !arrayContains(paragraphCommandClass, _className)
    })
    let needDel = classActived.filter(function (className) {
      if (/yd-textSubtitle/.test(className)) {
        return (!arrayContains(classList, 'yd-textSubtitle--1') && !arrayContains(classList, 'yd-textSubtitle--2') && !arrayContains(classList, 'yd-textSubtitle--3'))
      }
      return !arrayContains(classList, className)
    })
    needAdd.forEach(function (className) {
      let isSubtitle = /yd-textSubtitle/.test(className)
      let _className = isSubtitle ? 'yd-textSubtitle' : className
      let id = idMapClass[_className]
      if (id) {
        let element = document.querySelector(`#${id}`)
        element && element.classList.add('active')
      }
    })
    needDel.forEach(function (className) {
      let id = idMapClass[className]
      if (id) {
        let element = document.querySelector(`#${id}`)
        element && element.classList.remove('active')
      }
    })
    let subtitleArr = classList.filter(function (className) {
      return /yd-textSubtitle/.test(className)
    })
    if (subtitleArr.length) {
      res[0] = Number(subtitleArr[0].match(/yd-textSubtitle--(\d)/)[1])
    }
    _callback(...res)
  },
  addStatus (className) {
    document.querySelector('#' + fontCommon[className]).classList.add('active')
  },
  clearTextActive (toolbar) {
    document.querySelectorAll('.j-text-process').forEach(function (item) {
      item.classList.remove('active')
    })
    toolbar.fontSizeValue = 'yd-fsize-initial'
    toolbar.fontFamilyValue = 'yd-font-normal'
  },
  extractCommonClass (fragment) {
    var childs = fragment.childNodes
    var textNodeList = []
    var result = []
    var i = 0
    if (childs.length === 0) return result
    for (i = 0; i < childs.length; i++) {
      toolbarState.extractTextNodeList(childs[i], textNodeList)
    }

    var classList = []
    var shortest = []
    for (i = 0; i < textNodeList.length; i++) {
      classList[i] = []
      toolbarState.extractTextNodeParentClass(textNodeList[i].parentNode, fragment, classList[i])
      shortest = classList[i]
      if (i !== 0) {
        if (classList[i].length < classList[i - 1].length) {
          shortest = classList[i]
        }
      }
    }

    var commonflag = true
    for (i = 0; i < shortest.length; i++) {
      for (var j = 0; j < classList.length; j++) {
        if (!arrayContains(classList[j], shortest[i])) commonflag = false
      }
      if (commonflag) {
        result.push(shortest[i])
      }
    }

    return result
  },
  extractTextNodeParentClass (node, boundary, resultArr) {
    if (node === boundary) return
    resultArr.push(node.className)
    toolbarState.extractTextNodeParentClass(node.parentNode, boundary, resultArr)
  },
  extractTextNodeList (node, resultArr) {
    if (node.nodeType === 3) {
      resultArr.push(node)
    } else if (node.nodeType === 1) {
      for (var i = 0; i < node.childNodes.length; i++) {
        toolbarState.extractTextNodeList(node.childNodes[i], resultArr)
      }
    }
  },
  checkTextCommandStatus (toolbar, currentTarget) {
    var range = new Range()
    if (!range.range) return
    if (currentTarget.getAttribute('contenteditable')) {
      var result = range.focusStatus()
      var extractCommonClass = toolbarState.extractCommonClass(range.range.cloneContents())
      result._classList = result._classList ? result._classList.concat(extractCommonClass) : extractCommonClass
      if (!result._classList.length) {
        toolbarState.clearTextActive(toolbar)
        return
      }
      var classstr = result._classList.join(' ')
      toolbarState.clearTextActive(toolbar)
      for (let index = 0; index < result._classList.length; index++) {
        let className = result._classList[index]
        if (/(bold|underline|italic|sup|sub|mark)/g.test(className)) {
          toolbarState.addStatus(className)
        }
  
        if (/yd-fsize-([a-z0-9]*)/g.test(className)) {
          var regfsize = className.match(/yd-fsize-([a-z0-9]*)/g)
          toolbar.fontSizeValue = regfsize[0]
        }
  
        if (/yd-font-([a-z0-9]*)/g.test(className)) {
          var regffamily = className.match(/yd-font-([a-z0-9]*)/g)
          toolbar.fontFamilyValue = regffamily[0]
        }
      }
    }
  }
}

export default toolbarState
