import Vue from 'vue'
import ElementUI from 'element-ui'

Vue.use(ElementUI)

export default function (Widget) {
  const div = document.createElement('div')
  document.body.appendChild(div)

  var App = Vue.extend(Widget)
  const ins = new App({
    el: div
  })
  return ins
}
