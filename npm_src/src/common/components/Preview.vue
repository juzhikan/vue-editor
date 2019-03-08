<template>
  <div id="preview" class="preview">
    <span class="glyphicon glyphicon-triangle-left prev-btn" @click="pagination('prev')"></span>
    <span class="glyphicon glyphicon-triangle-right next-btn" @click="pagination('next')"></span>
    <div class="chapter-wrapper" :style="wStyle">
      <div class="chapter-content" :style="cStyle">
        <div class="g-book">
          <div class="m-mb">
            <div class="m-content">
              <div v-html="contentHtml"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import imagesLoaded from 'imagesloaded'

export default {
  data () {
    return {
      pageNumber: 0,
      wStyle: {
        backgroundImage: ''
      },
      cStyle: {
        width: '',
        marginLeft: 0,
        backgroundImage: '',
        backgroundPosition: ''
      }
    }
  },
  props: {
    content: String,
    onEnd: {
      type: Function,
      default: function () {
        this.$message({
          showClose: true,
          message: '没有内容了',
          type: 'warning'
        })
      }
    }
  },
  watch: {
    pageNumber: function (val) {
      this.cStyle.marginLeft = (-val * 375) + 'px'
    }
  },
  computed: {
    contentHtml: function () {
      return this.content + '<div class="js-end"></div>'
    }
  },
  mounted: function () {
    var vm = this
    imagesLoaded('#preview', function () {
      var chapterend = vm.$el.getElementsByClassName('js-end')[0]
      var offsetLeft = chapterend.offsetLeft
      var x = Math.floor((offsetLeft - 25) / 375)
      if (
        chapterend.previousSibling &&
        chapterend.previousSibling.classList.contains('yd-fullscreen')
      ) {
        x--
      }
      var fsnode = vm.$el.querySelector('.yd-fullscreen')
      var backspacing = fsnode && fsnode.previousSibling.classList.contains('yd-chapterhide')
      if (backspacing) {
        x--
        fsnode.style.marginTop = 0
      }
      vm.cStyle.width = (x + 1) * 375 + 'px'
      var section = vm.$el.querySelectorAll('.section')

      for (var i = 0; i < section.length; i++) {
        var url = section[i].getAttribute('data-imgurl')
        if (url) {
          vm.wStyle.backgroundImage = `url(${url})`
          break
        }
      }

      var fullScreenNode = vm.$el.querySelectorAll('.yd-fullscreen')
      var fullscreenImage = []
      var fullscreenPosition = []
      if (fullScreenNode.length) {
        Array.prototype.forEach.call(fullScreenNode, item => {
          fullscreenImage.push(
            `url(${item.querySelector('img').getAttribute('src')})`
          )
          if (backspacing) {
            fullscreenPosition.push((item.offsetLeft - 25) + 'px 0px')
          } else {
            fullscreenPosition.push((item.offsetLeft - 25) + 'px 0px')
          }
        })

        vm.cStyle.backgroundImage = fullscreenImage.join(',')
        vm.cStyle.backgroundPosition = fullscreenPosition.join(',')
      }
    })
  },
  methods: {
    pagination (action) {
      if (action === 'prev') {
        if (this.pageNumber > 0) {
          this.pageNumber--
        } else {
          this.onEnd({action})
        }
      } else {
        var width = parseInt(this.cStyle.width)
        var pageCount = Math.floor(width / 375)
        if (this.pageNumber + 1 < pageCount) {
          this.pageNumber++
        } else {
          this.onEnd({action})
        }
      }
    }
  }
}
</script>
<style type="text/css">
@font-face {
  font-family: 'hkstw5';
  src: url('/assets/fonts/hkstw5.ttf');
}
@font-face {
  font-family: 'hkhtw3';
  src: url('/assets/fonts/hkhtw3.ttf');
}
@font-face {
  font-family: 'hkktw5';
  src: url('/assets/fonts/hkktw5.ttf');
}
@font-face {
  font-family: 'hkpop1w5';
  src: url('/assets/fonts/hkpop1w5.ttc');
}
@font-face {
  font-family: 'hksnwzw5';
  src: url('/assets/fonts/hksnwzw5.ttf');
}
@font-face {
  font-family: 'hkwwtw5';
  src: url('/assets/fonts/hkwwtw5.ttf');
}
@font-face {
  font-family: 'hkytw3';
  src: url('/assets/fonts/hkytw3.ttf');
}
.preview {
  font-family: "Helvetica Neue", Helvetica, hiragino sans GB, sans-serif;
  position: relative;
  margin: 50px auto 0 auto;
  border: 1px solid #eee;
  border-radius: 10px;
  width: 377px;
  height: 669px;
  font-size: 12px;
  color: #151515;
  text-align: justify;
}
.preview .prev-btn,
.preview .next-btn {
  position: absolute;
  font-size: 45px;
  top: 50%;
  cursor: pointer;
  transform: translate(0, -50%);
  z-index: 100;
  color: #2db7f5;
  display: none;
}
.preview:hover .prev-btn,
.preview:hover .next-btn {
  display: inline-block;
}
.preview .prev-btn {
  left: -20px;
}
.preview .next-btn {
  right: -20px;
}
.chapter-wrapper {
  line-height: 1.9;
  overflow: hidden;
  width: 100%;
  background-position: 0 0;
  background-repeat: no-repeat;
  background-size: 375px 667px;
}
.chapter-content img {
  display: block;
  margin: 0 auto;
}
.chapter-content h1,
.chapter-content h2,
.chapter-content h3,
.chapter-content h4,
.chapter-content h5 {
  font-weight: normal;
  margin-top: 0;
}
.chapter-content h1.j-chapter,
.chapter-content h2.j-chapter,
.chapter-content h3.j-chapter {
  border-bottom: 1px dotted rgba(0, 0, 0, 0);
  font-size: 1.6em;
  padding-top: 1.2em;
  margin-bottom: 2.6em;
  line-height: 1.3;
}
.chapter-content {
  height: 667px;
  width: 375px;
  box-sizing: border-box;
  padding: 63px 25px 62px;
  -webkit-column-width: 325px;
     -moz-column-width: 325px;
          column-width: 325px;
  -webkit-column-gap: 50px;
     -moz-column-gap: 50px;
          column-gap: 50px;
  column-fill: auto;
  font-size: 12px;
  transition: margin .5s;
  background-size: 375px 100%;
  background-position: 0 0;
  background-repeat: no-repeat;
}
.chapter-content img {
  max-width: 330px;
  max-height: 405px;
}
.chapter-content p {
  text-indent: 2em;
  text-align: justify;
  text-justify: inter-ideograph;
  clear: none;
  margin-bottom: 1.8em;
  word-wrap: break-word;
  word-break: break-all;
}
.chapter-content a {
  text-decoration: underline;
  color: #151515;
}
.chapter-content a:visited {
  color: #000;
}
.chapter-content a.highlight {
  color: black;
  text-shadow: 0px 1px 1px #fff;
}
.chapter-content .m-img {
  margin: 6px 0;
  text-align: center;
  text-indent: 0;
  max-height: 100%;
}
.chapter-content .chatu img {
  max-width: 100%;
}
.chapter-content .legend {
  display: block;
  text-align: center;
}
.chapter-content .kaiti {
  font-family: "kaiti";
}
.chapter-content .custom-indent {
  text-indent: 0em!important;
}
.chapter-content .page img {
  max-width: 277px;
  max-height: 395px;
  display: block;
  margin: 0 auto;
}
.chapter-content .clear-float {
  clear: both;
}
.chapter-content .custom-h1 {
  border-bottom: none;
}
.chapter-content img,
.chapter-content a {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.chapter-content img.img-normal {
  margin: 12px auto 12px auto;
  border: 3px double #DCDCDC;
}
.chapter-content img.img-left {
  box-sizing: border-box;
  float: left;
  margin: 0px 12px 5px 0;
  border: 3px double #DCDCDC;
}
.chapter-content img.img-right {
  box-sizing: border-box;
  float: right;
  margin: 0px 0 5px 12px;
  border: 3px double #DCDCDC;
}
.chapter-content .math {
  text-indent: 0;
}
.chapter-content .nightMode {
  color: #6b7980;
}
.chapter-content .nightMode h1,
.chapter-content .nightMode h2,
.chapter-content .nightMode h3,
.chapter-content .nightMode h4,
.chapter-content .nightMode h5,
.chapter-content .nightMode h6 {
  color: #6b7980!important;
}
.chapter-content .nightMode h1 {
  border-bottom-color: #917869;
}
.chapter-content .nightMode p {
  color: #6b7980 !important;
}
.chapter-content .nightMode a {
  color: #999999;
}
.chapter-content .nightMode a:visited {
  color: #999999;
}
.chapter-content .nightMode a.highlight {
  color: #999999;
  text-shadow: 0px 1px 1px #000000;
}
.chapter-content .nightMode img.img-normal {
  border: 3px double #8C8C8C;
}
.chapter-content .nightMode img.img-left {
  float: left;
  margin: 0px 12px 5px 0;
  border: 3px double #8C8C8C;
}
.chapter-content .nightMode img.img-right {
  float: right;
  margin: 0px 0 5px 12px;
  border: 3px double #8C8C8C;
}
.chapter-content .coverTop {
  display: block;
  height: 1px;
}
.chapter-content .cover {
  margin-top: 37.5%;
  background: rgba(94, 83, 83, 0.1);
  text-align: center;
  padding: 24px 0px 24px 0px;
  width: 100%;
}
.chapter-content .cover h1,
.chapter-content .cover h2,
.chapter-content .cover h3 {
  color: #933!important;
  font-weight: normal!important;
  line-height: 1.13!important;
  margin-top: 0px;
  margin-bottom: 0px;
  padding-bottom: 0px;
  border-bottom: none;
  z-index: 1;
}
.chapter-content .nightMode .cover {
  background: rgba(115, 115, 115, 0.1);
}
.chapter-content .nightMode .cover h1 {
  color: #888!important;
}
.chapter-content .mark {
  position: relative;
  width: 24px;
  height: 20px;
  display: inline-block;
  margin-left: -4px;
  margin-right: -4px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAUCAYAAACXtf2DAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAIqSURBVHja7JVLaFNREIa/Se5NMC9bNWliIIo09EGLFbIQRIqoC0UqKPWBC0HoSkhFcVNBVATBoqjoRrt1IdouilUhLlrQItLaFgq1WFpchMQkumjiok3S48Lc4KPWG6E7ZzVn5p/5z5lh5ohSitUUC6ssq06gLWcUEd1Qz3ac2LAp6O+0WKz7RQgDKMX00lLx6cd48t7NBw8zJaxSSuV/y7VcD0TECsjtS+cOaZp2H1hr+BQKQYzjfD5f6Dhz+UZfiaFglsBy58r5w5rV+giMbN9xNrsdgMWFBcOlCsXi0ejF7j6lVNFUD653Rb26Zu0RQdraDxKuDyMigFBbV0tkewQRQQREEF2z9nRfiHpN98Dtcp4GPADDg6/YsWsn3hofDqcD3abjcKxh9769iMDY23d8znzxuJzOKNBligBoA3B7XDRta+ZF/3Pcbhc2u43q9euoqq5ibmYWgGw2Z8QcME0gQj1ALpujkC/QuqeV2ECs7Nd1nUQ8iUgZD1BnukQ/ysibEfwb/bREWmhoaijbG5sbyaQzvHxWJl6shOA9sBUgtDlEMBRkKDbIxOg4gWAAn7+GidHxX2NmK5nkfkPx+X2kP6XNDO1AJS+4C3QCnkAwQCqZ4tjJ4z8BjHJNTU4xMTo+D9yqhCAFnAIeDw+9lkQ8wcz0hz/dXJWwqUqXXS9wJBFPZFfAZIH2EvaftukTYAtwDZgE8sBXYAy4WvL1rpRA/n84f5NvAwDQq6Wz/2kvlwAAAABJRU5ErkJggg==) center center no-repeat;
  background-size: 24px 20px;
}
.chapter-content .nightMode .mark {
  background-image: url(data:image/png;base64,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);
}
.chapter-content .remark {
  width: 16px;
  height: 16px;
  display: inline-block;
  position: absolute;
  bottom: -5px;
  margin-left: -10px;
  z-index: 9999;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAIFSURBVHjadNNraA1gGAfw3zlnY0Y6aEPk1OTSKKLmy5DcpVyKEpqMWplSSinKJWmfRimlfNoXTUzKB40Py3GZUS5hMpddsIYxl1nWzId3Z84mz5f37Xne///5v//3eSO9ZQmDIg87sRJTkYkWVKMCN9IPR9IIYjiEfRji/3EJxWiHaBq4Egf+AUczBhOsxS3kQKp6GOsDVSazNjNjHbn5RCJ0dfAmyb2ztD6CaajCgkhvWSIPzzBE9mg2VPC2jidVtD2lp5vsMUxezIrj1JRx90xKzZYM7AiyI6w5zctrJMsHiu78xONKmu+w6CBTXvOiGkqjWAUmzCUaC+CMLDKzA3jYqLBmxfnSxIMKCkpS1AXRvvuQO522+pBefozV5SQK2VVH3iJ232d4Ds21jJ05wOJgZNdXskaG9M2TodTRwvlttNRSWcSPD4wYR9fnv4+EZvC6Jhg1sSBIbX9Fzy8ak8HIxmRAzCmi/soAgutBQQdX97PpXCAaHJEo8/cyZQk3T6SyDbFDS+Pt2A4+Pg/vvOwo8QTvHwbz5pWwsYJvrVwuDc1ClKdGuapvwvq6xSjcw9CRYf+9lScX+fouXVMz8lOjXIyG/lJvD8kTjJ9NLIPbpwaDO7EB39M/Uy4uoLD/WHxScL77Zzr4bd/Y303/TNCGhdiKWvz2pSkd3IAjmJkCw58BAMCPnUvi2KjYAAAAAElFTkSuQmCC) center center no-repeat;
  background-size: 12px 12px;
}
.chapter-content .m-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0);
  z-index: 100;
}
.chapter-content .m-mask .content {
  position: absolute;
  padding: 20px;
  top: 50%;
  left: 50%;
  max-width: 80%;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
  background-color: #000;
  text-align: center;
  font-size: 14px;
  line-height: 1.5;
  color: #fff;
  z-index: 101;
}
.chapter-content .m-mask .content .toast-words {
  text-indent: 0;
  color: #fff!important;
  margin: 0;
}
.chapter-content .book-link.matched {
  color: #6392C5!important;
  font-size: inherit!important;
}
.chapter-content .nightMode .book-link.matched {
  color: #4f759e!important;
}
.chapter-content .section {
  width: 325px;
  padding: 0;
  box-sizing: border-box;
}
.chapter-content i {
  font-style: italic;
}
.chapter-content b {
  font-weight: 700;
}
.chapter-content .paragraph-img {
  display: block;
  margin: 0 auto;
}
.chapter-content .paragraph-img--internal {
  display: inline;
  margin: 0;
  max-height: 15px;
  vertical-align: text-bottom;
  top: 0;
}
.chapter-content .yd-font-hksong {
  font-family: "hkstw5";
}
.chapter-content .yd-font-hkkai {
  font-family: "hkktw5";
}
.chapter-content .yd-font-hkyuan {
  font-family: "hkytw3";
}
.chapter-content .yd-font-hkpop {
  font-family: "hkpop1w5";
}
.chapter-content .yd-font-hkgirl {
  font-family: "hksnwzw5";
}
.chapter-content .yd-font-hkbaby {
  font-family: "hkwwtw5";
}
.chapter-content .yd-font-hkhei {
  font-family: "hkhtw3";
}

.chapter-content .yd-fsize-14 {
  font-size: 14px;
}
.chapter-content .yd-fsize-16 {
  font-size: 16px;
}
.chapter-content .yd-fsize-18 {
  font-size: 18px;
}
.chapter-content .yd-fsize-20 {
  font-size: 20px;
}
.chapter-content .yd-fsize-24 {
  font-size: 24px;
}
.chapter-content .yd-fsize-32 {
  font-size: 32px;
}

.chapter-content .yd-fsize-15 {
  font-size: 15px;
}
.chapter-content .yd-fsize-17 {
  font-size: 17px;
}
.chapter-content .yd-fsize-19 {
  font-size: 19px;
}
.chapter-content .yd-fsize-21 {
  font-size: 21px;
}
.chapter-content .yd-fsize-23 {
  font-size: 23px;
}
.chapter-content .yd-fsize-25 {
  font-size: 25px;
}

/* 样式向下兼容 */
.chapter-content .yd-fsize-normal {
  font-size: 1em;
}
.chapter-content .yd-fsize-middle {
  font-size: 1.5em;
}
.chapter-content .yd-fsize-big {
  font-size: 2em;
}
/* 样式向下兼容 */

.chapter-content .yd-paragraph-f {
  text-align: left;
}
.chapter-content .yd-paragraph-c {
  text-align: center;
}
.chapter-content .yd-paragraph-j {
  text-align: justify;
}
.chapter-content .yd-paragraph-r {
  text-align: right;
}
.chapter-content .yd-textindent {
  text-indent: 2em;
}
.chapter-content .yd-martop-5 {
  margin-top: 5px;
}
.chapter-content .yd-martop-10 {
  margin-top: 10px;
}
.chapter-content .yd-martop-15 {
  margin-top: 15px;
}
.chapter-content .yd-martop-20 {
  margin-top: 20px;
}
.chapter-content .yd-martop-25 {
  margin-top: 25px;
}
.chapter-content .yd-marbom-5 {
  margin-bottom: 0.5em;
}
.chapter-content .yd-marbom-10 {
  margin-bottom: 1em;
}
.chapter-content .yd-marbom-15 {
  margin-bottom: 1.5em;
}
.chapter-content .yd-marbom-20 {
  margin-bottom: 1.8em;
}
.chapter-content .yd-marbom-25 {
  margin-bottom: 2em;
}
.chapter-content .yd-lineheight-1 {
  line-height: 1.5;
}
.chapter-content .yd-lineheight-2 {
  line-height: 1.7;
}
.chapter-content .yd-lineheight-3 {
  line-height: 1.9;
}
.chapter-content .yd-lineheight-4 {
  line-height: 2;
}
.chapter-content .yd-lineheight-5 {
  line-height: 2.1;
}
.chapter-content .underline {
  text-decoration: underline;
}
.chapter-content .j-chapter {
  text-indent: 0;
}


/* 20180103新增样式 */
.chapter-content .yd-separate {
  margin: 0;
}
.chapter-content .yd-poetry {
  line-height: 1!important;
  margin-bottom: 1.15em;
  font-family: Serif!important;
}
.chapter-content .yd-imagetitle span.yd-imagetitle--left {
  text-align: left;
  line-height: 1;
  display: inline-block;
}
.chapter-content .yd-textSubtitle--1 {
  font-weight: bold;
  font-size: 2em;
}
.chapter-content .yd-textSubtitle--2 {
  font-weight: bold;
  font-size: 1.5em;
}
.chapter-content .yd-textSubtitle--3 {
  font-weight: bold;
  font-size: 1em;
}
.chapter-content .yd-box {
  display: block;
  padding: 9.5px;
  margin: 0 0 10px;
  color: #333;
  word-break: break-all;
  word-wrap: break-word;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-indent: initial;
  white-space: pre-line;
  overflow: auto;
}

.chapter-content .yd-imagetitle{
    margin-top: -1.5em;
    font-size: 14px;
    text-align: center;
    text-indent: 0em!important;
    font-family: "华康楷体W5"!important;
}
.chapter-content .bold {
  font-weight: bold;
}
.chapter-content .italic {
  font-style: italic;
}
.chapter-content .sup {
  vertical-align: super;
  font-size: 12px;
}
.chapter-content .sub {
  vertical-align: sub;
  font-size: 12px;
}

.chapter-content .yd-fullscreen {
  min-height: 1px;
  width: 100%;
  margin-top: 1500px;
  margin-bottom: 1500px;
  visibility: hidden;
}
.chapter-content .yd-chapterhide {
  display: none;
}
.chapter-content .yd-copyright{
    line-height: 2;
    text-align: left;
    text-indent: 0em!important;
    margin-bottom: 0.2em!important;
}
.chapter-content .yd-recommendlg{
    margin-left: 2em;
    text-indent: 0em!important;
    font-family: Serif!important;
}
.chapter-content .yd-quote{
    margin-left: 2em;
    text-indent: 0;
    font-family: Serif!important;
}
.chapter-content .yd-recommendperson {
  text-align: right;
}
.chapter-content .yd-code {
  display: block;
  padding: 9.5px;
  margin: 0 0 10px;
  font-size: 13px;
  line-height: 1.42857143;
  color: #333;
  word-break: break-all;
  word-wrap: break-word;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: Menlo,Monaco,Consolas,Courier New,monospace;
  text-indent: initial;
  white-space: pre;
  overflow: auto;
  -webkit-column-break-inside: avoid;
  page-break-inside: avoid;
  break-inside: avoid;
  max-height: 542px;
}
</style>
