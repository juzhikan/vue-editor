<template>
<div>
  <template v-if="!isUploading">
    <template v-if="value">
      <div class="img-wrapper">
        <el-upload accept="image/jpeg,image/png,image/jpg" :on-success="onUploadSuccess" drag :before-upload="onBeforeUpload"
          :data="token.data" :action="uploadAction" :show-file-list="false" :on-progress="onProgress" :on-error="onUploadError">
          <img :src="value">
        </el-upload>
      </div>
    </template>
    <template v-else>
      <div class="upload-wrapper">
        <el-upload accept="image/jpeg,image/png,image/jpg" :on-success="onUploadSuccess" :before-upload="onBeforeUpload"
          :data="token.data" drag :action="uploadAction" :show-file-list="false" :on-progress="onProgress" :on-error="onUploadError">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__text">
            <slot name="tip"></slot>
          </div>
        </el-upload>
      </div>
    </template>
  </template>
  <template v-else>
    <div class="progress">
      {{progress}}%
    </div>
  </template>
</div>
</template>
<script>
  export default {
    props: ['value', 'maxSize'],
    data () {
      return {
        isUploading: false,
        token: {
          data: {}
        },
        progress: 0
      }
    },
    methods: {
      onUploadSuccess (response, file, fileList) {
        this.$emit('input', response.url)
        this.isUploading = false
      },
      onBeforeUpload (file) {
        if (this.maxSize && file.size > this.maxSize * 1024 * 1024) {
          this.$message({
            showClose: true,
            message: '文件过大',
            type: 'error'
          })
          return Promise.reject()
        }

        if (!/\.(png|jpg|jpeg)$/.test(file.name)) {
          this.$message({
            showClose: true,
            message: '文件格式不正确',
            type: 'error'
          })
          return Promise.reject()
        }

        return this.getNosToken().then(() => {
          this.token.data = {
            'x-nos-token': this.token.token,
            'Bucket': this.token.bucket,
            'Expires': this.token.expires,
            'Object': this.token.key
          }
        })
      },
      onProgress (event, file, fileList) {
        this.isUploading = true
        this.progress = Math.floor(event.percent)
      },
      onUploadError () {
        this.isUploading = false
        this.$message({
          showClose: true,
          message: '上传出错',
          type: 'error'
        })
      },
      getNosToken () {
        return this.$http.get('/upload/getImageUploadToken.json').then(res => {
          this.token = Object.assign({}, this.token, res.body.token)
          return new Promise((resolve) => {
            resolve(res.body.token)
          })
        })
      }
    },
    computed: {
      uploadAction: function () {
        return '//nos.netease.com/' + this.token.bucket
      }
    }
  }
</script>
<style>
.img-wrapper{
    width: 150px;
    height: 210px;
  }
  .img-wrapper img{
    display: block;
    margin-left: auto;
    margin-right: auto;
    max-height: 100%;
    max-width: 100%;
  }
  .progress{
    width: 150px;
    height: 210px;
    background: #efefef;
    line-height: 210px;
    text-align: center;
  }
  .img-wrapper .el-upload-dragger {
    border: none;
    width: 100%;
    height: 100%;
    border-radius: 0px;
  }
  .center-table{
    display: table;
    margin-left: auto;
    margin-right: auto;
  }
  input[type="file"]{
    display: none;
  }
</style>
