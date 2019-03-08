<template>
  <div class="tTbWrp c-cb">
    <el-dialog title="插入段内图片" ref="imgUpload" v-model="UploadVisible">
      <el-upload
        ref="upload"
        class="upload-demo"
        :action="action"
        :data="uploadParam"
        :on-change="onUploadChange"
        :on-remove="onRemoveFile"
        :before-upload="onBeforeUpload"
        :multiple="false"
        accept=".png"
        list-type="picture">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传png文件，且不超过2mb</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="UploadVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleInsert">确 定</el-button>
      </div>
    </el-dialog>
    <div class="bodyRegion">
      <el-popover ref="fchpopover" placement="top-start" width="164" trigger="hover" v-model="fchpopovervisible">
        <button v-for="(color, index) in fontColorHistory" :style="'background-color:' + color + ';margin:2px;'" @click="setFontColor($event, color)">
          {{color}}
        </button>
      </el-popover>
      <el-popover ref="bchpopover" placement="top-start" width="164" trigger="hover" v-model="bchpopovervisible">
        <button v-for="(color, index) in bgdColorHistory" :style="'background-color:' + color + ';margin:2px;'" @click="setBgdColor($event, color)">
          {{color}}
        </button>
      </el-popover>

      <!-- <button>
        <el-select ref="fontsize" v-model="fontSizeValue" placeholder="请选择" size="mini">
          <el-option v-for="fs in fontSizeList" :label="fs.label" :value="fs.value" :key="fs.value">
            <el-button type="text" size="mini" style="float: left;color: #333;width: 100%;padding: 0;" @click="font('Size', fs.value)">{{ fs.label }}</el-button>
          </el-option>
        </el-select>
      </button>

      <button>
        <el-select ref="fontfamily" v-model="fontFamilyValue" placeholder="请选择" size="mini">
          <el-option v-for="fm in fontFamilyList" :label="fm.label" :value="fm.value" :key="fm.value">
            <el-button type="text" size="mini" style="float: left;color: #333;width: 100%;padding: 0;" @click="font('Family', fm.value)">{{ fm.label }}</el-button>
          </el-option>
        </el-select>
      </button> -->

      <button>
        <select ref="fontsize" v-model="fontSizeValue" placeholder="请选择" class="fontSize" @focus="fontSizeValueBefore = fontSizeValue" @change="font('Size', fontSizeValue)">
          <option  v-for="fs in fontSizeList" :label="fs.label" :value="fs.value" :key="fs.value">
            <button type="text" style="float: left;color: #333;width: 100%;" @click="font('Size', fs.value)">{{ fs.label }}</button>
          </option>
        </select>
      </button>
      
      <button>
        <select ref="fontfamily" v-model="fontFamilyValue" placeholder="请选择" class="fontFamily" @focus="fontFamilyValueBefore = fontFamilyValue" @change="font('Family', fontFamilyValue)">
          <option  v-for="fm in fontFamilyList" :label="fm.label" :value="fm.value" :key="fm.value">
            <button type="text" style="float: left;color: #333;width: 100%;" @click="font('Family', fm.value)">{{ fm.label }}</button>
          </option>
        </select>
      </button>
      <!-- <button>
        <input ref="color" type="color" class="jscolor" style="height:22px;width:50px;font-size:12px;border:none;text-align:center;">
      </button>
      <button @click="setBgdColor" v-popover:bchpopover title="背景颜色">
        <span class="fa fa-square" aria-hidden="true"></span>
      </button>
      <button @click="setFontColor" v-popover:fchpopover title="字体颜色">
        <span class="fa fa-font" style="color: #fb8334;font-size: 14px;" aria-hidden="true"></span>
      </button> -->
      <button @click="onClickImageInsert" title="插入段内图片">
        <span class="fa fa-file-image-o" aria-hidden="true"></span>
      </button>
      <button id="font-bold" @click="exc('bold')" class="j-text-process" title="加粗">
        <span class="fa fa-bold" aria-hidden="true"></span>
      </button>
      <button id="font-underline" @click="exc('underline')" class="j-text-process" title="下划线">
        <span class="fa fa-underline" aria-hidden="true"></span>
      </button>
      <button id="font-italic" @click="exc('italic')" class="j-text-process" title="斜体">
        <span class="glyphicon glyphicon-italic" aria-hidden="true"></span>
      </button>
      <button id="font-sup" @click="exc('sup')" class="j-text-process" title="上标">
        <span class="fa fa-superscript" aria-hidden="true"></span>
      </button>
      <button id="font-sub" @click="exc('sub')" class="j-text-process" title="下标">
        <span class="fa fa-subscript" aria-hidden="true"></span>
      </button>
      <button id="font-mark" @click="exc('mark')" class="j-text-process" title="注释">
        <span class="glyphicon glyphicon-registration-mark" aria-hidden="true"></span>
      </button>
      <button id="undo" @click="undo" title="撤销">
        <span class="fa fa-undo" aria-hidden="true"></span>
      </button>
      <button id="close" @click="hideToolbar" style="color: #ff2525;" title="关闭">
        <span class="glyphicon glyphicon-off" aria-hidden="true"></span>
      </button>
    </div>
  </div>
</template>

<script>
import Range from './Range'
import Cache from '../../cache/cache'
import { addHistory, clearHistory } from '@/util'
const timeBefore = new Date().getTime()
export default {
  name: 'vue-toolbar',
  data () {
    return {
      fontColor: '#ffffff',
      bgdColor: '#ffffff',
      action: '//nos.netease.com/',
      uploadParam: {},
      UploadVisible: false,
      fileList: [],
      fchpopovervisible: false,
      bchpopovervisible: false,
      timeBefore: timeBefore,
      fontSizeList: [{
        value: 'yd-fsize-initial',
        label: '默认大小'
      }, {
        value: 'yd-fsize-15',
        label: '15px'
      }, {
        value: 'yd-fsize-17',
        label: '17px'
      }, {
        value: 'yd-fsize-19',
        label: '19px'
      }, {
        value: 'yd-fsize-21',
        label: '21px'
      }, {
        value: 'yd-fsize-23',
        label: '23px'
      }, {
        value: 'yd-fsize-25',
        label: '25px'
      }],
      fontFamilyList: [{
        value: 'yd-font-normal',
        label: '默认字体'
      }, {
        value: 'yd-font-hksong',
        label: '宋体'
      }, {
        value: 'yd-font-hkkai',
        label: '楷体'
      }/* {
        value: 'yd-font-hksong',
        label: '华康宋体W5'
      }, {
        value: 'yd-font-hkhei',
        label: '华康黑体W3'
      }, {
        value: 'yd-font-hkkai',
        label: '华康楷体W5'
      }, {
        value: 'yd-font-hkyuan',
        label: '华康圆体W3'
      }, {
        value: 'yd-font-hkpop',
        label: '华康POP1体W5'
      }, {
        value: 'yd-font-hkgirl',
        label: '华康少女文字W5'
      }, {
        value: 'yd-font-hkbaby',
        label: '华康娃娃体W5'
      } */],
      fontSizeValue: 'yd-fsize-initial',
      fontFamilyValue: 'yd-font-normal',
      fontFamilyValueBefore: 'yd-font-normal',
      fontSizeValueBefore: 'yd-fsize-initial'
    }
  },
  computed: {
    fontColorHistory () {
      this.fontColor
      var colorsArr = []
      var colorsStr = localStorage.getItem('fontColor')
      if (colorsStr) colorsArr = colorsStr.split(',')
      return colorsArr
    },
    bgdColorHistory () {
      this.bgdColor
      var colorsArr = []
      var colorsStr = localStorage.getItem('backgroundColor')
      if (colorsStr) colorsArr = colorsStr.split(',')
      return colorsArr
    }
  },
  methods: {
    hideToolbar () {
      this.$store.commit('updateToolbarVisible', false)
      var selected = this.$store.state.selected
      if (selected) selected.setAttribute('contenteditable', false)
    },
    exc (type) {
      var target = event.currentTarget
      var range = new Range()
      var selected = this.$store.state.selected
      addHistory(selected.innerHTML)
      range.insertNode(type, target)
      target.classList.toggle('active')
      this.$store.commit('updateHasBeenSaved', false)
    },
    font (type, value) {
      var range = new Range()
      var selected = this.$store.state.selected
      addHistory(selected.innerHTML)
      var ftype = type === 'Size' ? 'fsize' : 'font'
      range.insertNode(value, undefined, this[`font${type}ValueBefore`], ftype)
      this.$store.commit('updateHasBeenSaved', false)
    },
    undo () {
      var selected = this.$store.state.selected
      var history = localStorage.getItem('editHistory')
      if (history) {
        var arr = JSON.parse(history)
        if (arr.length) {
          selected.innerHTML = arr[arr.length - 1]
          arr.pop()
          localStorage.setItem('editHistory', JSON.stringify(arr))
        }
      }
    },
    setFontColor (event, color) {
      var value = color || this.$refs.color.value
      var range = new Range()
      if (range.range && !range.range.collapsed) {
        var selected = this.$store.state.selected
        addHistory(selected.innerHTML)
        range.insertColorNode('font-color', value)
        this.$store.commit('updateHasBeenSaved', false)
        this.updateLocalColor(value, 'fontColor')
        this.fontColor = value
      }
    },
    setBgdColor (event, color) {
      var value = color || this.$refs.color.value
      var selected = this.$store.state.selected
      addHistory(selected.innerHTML)
      selected.querySelector('.section').style.backgroundColor = value
      this.$store.commit('updateHasBeenSaved', false)
      this.updateLocalColor(value, 'backgroundColor')
      this.bgdColor = value
    },
    updateLocalColor (value, type) {
      var color = localStorage.getItem(type)
      var arr = []
      if (!color) {
        arr.push(value)
        localStorage.setItem(type, arr.join(','))
      } else {
        if (color.indexOf(value) !== -1) return
        arr = color.split(',')
        if (arr.length > 9) {
          arr.shift()
          arr.push(value)
        } else {
          arr.push(value)
        }
        localStorage.setItem(type, arr.join(','))
      }
    },
    onClickImageInsert () {
      Cache.getImageUploadToken(response => {
        this.action = '//nos.netease.com/' + response.token.bucket
        this.uploadParam.Object = response.token.key
        this.uploadParam['x-nos-token'] = response.token.token
        this.uploadParam['Bucket'] = response.token.bucket
        this.uploadParam['Expires'] = response.token.expires
        this.$refs.imgUpload.open()
        this.fileList = []
      }, response => {
        console.log('erro')
      })
    },
    onBeforeUpload (file) {
      var list = this.$refs.upload.uploadFiles
      if (this.fileList.length > 1) {
        this.$message({message: '只允许上传一张图片', type: 'warning', duration: 1500})
        return false
      }
      var size = (file.size / 1024).toFixed(3)
      if (size > 2048) {
        this.$message({message: '图片大小超过了2mb！', type: 'warning', duration: 1500})
        return false
      }
      if (file.type !== 'image/png') {
        this.$message({message: '图片格式要求PNG！', type: 'warning', duration: 1500})
        return false
      }
    },
    onRemoveFile (file, fileList) {
      this.fileList = fileList
    },
    onUploadChange (file, fileList) {
      this.fileList = fileList
    },
    handleInsert () {
      var timeNow = +new Date().getTime()
      var timeBefore = this.timeBefore
      if (timeNow - timeBefore < 1000) return
      this.timeBefore = timeNow
      var selected = this.$store.state.selected
      var list = this.fileList
      if (list.length === 0) {
        this.$message({message: '还未上传图片！', type: 'warning', duration: 1500})
        return
      }
      
      if (list[0].response) {
        var range = new Range()
        range.range.deleteContents()
        let imageSrc = list[0].response.url
        var newImageNode = document.createElement('img')
        newImageNode.className = 'paragraph-img--internal'
        console.log(newImageNode)
        newImageNode.src = imageSrc
        range.range.insertNode(newImageNode)
        range.selection.addRange(range.range)
        range.selection.collapseToEnd()
        this.UploadVisible = false
        this.hideToolbar()
        this.$store.commit('updateHasBeenSaved', false)
        this.$refs.upload.clearFiles()
        this.$nextTick(() => {
          selected.click()
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.tTbWrp {
  position: absolute;
  height: 30px;
  left: 38px;
  padding-right: 10px;
  background-color: #e3e7ea;
  box-shadow: 0 0 5px 0px rgba(0, 0, 0, 0.5);
}
.bodyRegion button.active .fa,
.bodyRegion button.active .glyphicon {
  color: #2196f3;
}
.bodyRegion button {
  border-radius: 0;
  border: none;
  float: left;
  padding: 4px 7px;
  background: none;
  box-shadow: none;
  -webkit-box-shadow: none;
}
.bodyRegion button:hover {
  background: #d4d4d4;
}
.bodyRegion button.active {
  background: #d4d4d4;
  box-shadow: inset 0 3px 5px rgba(0,0,0,.125);
}
.bodyRegion .el-select {
  width: 80px;
}
.bodyRegion select.fontFamily,
.bodyRegion select.fontSize {
  outline: none;
  width: 110px;
  padding: 1px 10px;
  box-sizing: border-box;
  height: 22px;
  border-radius: 4px;
  border: 1px solid #bfcbd9;
  box-sizing: border-box;
  color: #1f2d3d;
  font-size: 12px;
}
.bodyRegion .el-input--mini input {
    height: 22px!important;
}
</style>
