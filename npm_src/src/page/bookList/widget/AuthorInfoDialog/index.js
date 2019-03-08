import getWidget from '@/common/widget'
import View from './View'
var ins = null
export default function getIns () {
  ins = ins || getWidget(View)
  return ins
}
