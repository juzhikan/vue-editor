<template>
  <div>
    <el-dialog ref="dialog" :title="title" v-model="isShow" size="small" custom-class="editDialog" :close-on-click-modal="false">
    <el-form label-width="80px" :rules="rules" :model="formData" ref="form">
      <div class="row">
        <div class="center-table">
          <uploader :maxSize="2" v-model="formData.coverImage">
            <template slot="tip">
               文件格式：jpg/png&nbsp;&nbsp;&nbsp;&nbsp;文件大小：小于2M
            </template>
          </uploader>
        </div>
      </div>
      <div class="row" style="margin-top: 20px">
      <div class="col-md-6">
          <el-form-item :class="isBookTitleExisted ? 'is-warning' : ''" label="书名" prop="title">
            <el-input @blur="_checkBookTitle" v-model="formData.title"></el-input>
            <div class="warning-text" v-if="isBookTitleExisted">该书名已存在</div>
          </el-form-item>
          <el-form-item label="ISBN" prop="isbn">
            <el-input v-model="formData.isbn"></el-input>
          </el-form-item>
          <el-form-item label="原始文件" prop="uploadedFile" v-if="!sourceBookIds">
            <div class="clearfix" v-if="!this.id">
              <div class="pull-left">
                <el-input v-model="formData.uploadedFileName"></el-input>
              </div>
              <div class="pull-left" style="margin-left: 15px">
                <label class="el-button el-button--primary" for="js-book-upload">
                  上传
                </label>
                <input type="file" ref="bookFileUpload" id="js-book-upload" @change="onBookFileChange">
              </div>
              <el-progress :percentage="bookUploadProgress" v-if="bookUploadProgress != 0 && bookUploadProgress != 100"></el-progress>
            </div>
            <div v-else>{{formData.uploadedFileName}}</div>
          </el-form-item>
      </div>
      <div class="col-md-6">
          <el-form-item label="书籍语言">
            <el-select v-model="formData.language">
              <el-option :label="type.label" :value="type.value" v-for="type in languages" :key="type.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出版社" prop="publisher">
            <el-input v-model="formData.publisher"></el-input>
          </el-form-item>
          <el-form-item label="出版时间">
            <el-date-picker
              v-model="formData.publishTime"
              type="month"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
      </div>
    </div>
      <el-form-item label="书籍简介" prop="description">
        <el-input type="textarea" v-model="formData.description"></el-input>
      </el-form-item>
      <author-list v-model="formData.authors" label="作者"></author-list>
      <author-list v-model="formData.translators" label="译者"></author-list>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="formData.remark"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" @click="onSave">保存</el-button>
    </div>
  </el-dialog>
  </div>

</template>
<script>
  import MAP from '@/common/map'
  import Book, {Author} from '../struct/book'
  import {getBookInfoById} from '../store'
  import SearchInput from './SearchInput'
  import AuthorList from './AuthorList'
  import Uploader from '@/common/components/uploader'

  export default {
    name: 'BookInfoDialog',
    props: ['value', 'id', 'sourceBookIds'],
    data () {
      var data = {
        formData: this.id ? this.getBookData(this.id) : new Book(),
        isShow: this.value,
        isBookTitleExisted: false,
        title: this.id ? '出版信息' : '新建书籍',
        publishTime: +new Date(),
        coverUploadToken: {
          data: {}
        },
        coverUploadProgress: 0,
        bookUploadProgress: 0,
        isBookUploading: false,
        isCoverUploading: false,
        rules: {
          title: [
            {required: true, message: '此项不能为空', trigger: 'blur'},
            {max: 100, message: '最多100字'}
          ],
          author: [
            {required: true, message: '此项不能为空', trigger: 'blur'},
            {max: 100, message: '最多100字'}
          ],
          isbn: [
            {max: 100, message: '最多100字'}
          ],
          translator: [
            {max: 100, message: '最多100字'}
          ],
          description: [
            {required: true, message: '此项不能为空', trigger: 'blur'},
            {max: 5000, message: '最多5000字'}
          ],
          authorIntroduce: [
            {required: true, message: '此项不能为空', trigger: 'blur'},
            {max: 5000, message: '最多5000字'}
          ],
          translatorIntroduce: [
            {max: 5000, message: '最多5000字'}
          ],
          remark: [
            {max: 5000, message: '最多5000字'}
          ],
          publisher: [{max: 100, message: '最多100字'}],
          uploadedFile: [{required: !this.id, message: '需要上传文件'}]
        }
      }
      return data
    },
    mounted: function () {
      this.bookUploader = window.Uploader({
        onError: () => {
          this.isBookUploading = false
          this.$message({
            showClose: true,
            message: '上传出错',
            type: 'error'
          })
        },
        onProgress: (curFile) => {
          this.bookUploadProgress = Math.floor(+curFile.progress)
        }
      })
    },
    methods: {
      onAddAuthor: function () {
        this.formData.authors.push(
          new Author()
        )
      },
      onDeleteAuthor: function (index) {
        this.formData.authors.splice(index, 1)
      },
      onAddTranslator: function () {
        this.formData.translators.push(
          new Author()
        )
      },
      onDeleteTranslator: function (index) {
        this.formData.translators.splice(index, 1)
      },
      onProgress: function (event, file, fileList) {
        this.isCoverUploading = true
        this.coverUploadProgress = Math.floor(event.percent)
      },
      onBookFileChange: function (e) {
        var file = e.target.files[0]
        if (file) {
          if (file.size > 1024 * 1024 * 1024) {
            this.$message({
              showClose: true,
              message: '文件过大',
              type: 'error'
            })
            return
          }
          var fragments = file.name.split('.')
          var ext = fragments[fragments.length - 1].toLowerCase()
          if (ext !== 'docx' && ext !== 'epub') {
            this.$message({
              showClose: true,
              message: '格式不支持',
              type: 'error'
            })
            return
          }
          this.bookUploader.addFile(file)
          this.isBookUploading = true
          this.bookFileUpload()
        }
      },
      bookFileUpload: function () {
        this.getBookNosToken().then(({bucket, key, token}) => {
          this.bookUploader.upload({
            bucketName: bucket,
            objectName: key,
            token
          }, ({fileName}) => {
            this.formData.uploadedFileName = fileName
            this.formData.uploadedFile = key
            this.isBookUploading = false
            this.$refs.bookFileUpload.value = ''
            this.$message({
              showClose: true,
              message: '上传成功了',
              type: 'success'
            })
          })
        })
      },
      onCancel: function () {
        this.$refs.dialog.close()
      },
      onSave: function () {
        if (!this.formData.coverImage) {
          this.$message({
            showClose: true,
            message: '封面还没上传呢！',
            type: 'error'
          })
          return
        }

        if (this.isBookUploading) {
          this.$message({
            showClose: true,
            message: '书籍正在上传中，请稍后',
            type: 'error'
          })
          return
        }

        this.$refs.form.validate(res => {
          if (res) {
            for (let author of this.formData.authors) {
              let isExist = this.formData.translators.find(item => item.id === author.id)
              if (isExist) {
                let name = author.name || '空'
                if (name.length > 6) {
                  name = name.split('').slice(0, 6).join('') + '...'
                }
                this.$message.error(`贡献者 "${name}" 同时出现在作者和译者中`)
                return
              }
            }
            this.updateBook().then(res => {
              this.$message({
                showClose: true,
                message: '保存信息成功',
                type: 'success'
              })

              window.location.reload()
              this.isShow = false
            }).catch((err) => {
              this.$message({
                showClose: true,
                message: err.message || '保存信息出错',
                type: 'error'
              })
            })
          }
        })
      },
      updateBook: async function () {
        var data = Object.assign({}, this.formData, {
          id: this.id,
          createTime: +new Date(this.formData.createTime),
          publishTime: +new Date(this.formData.publishTime),
          authors: this._transformAuthors(this.formData.authors),
          translators: this._transformAuthors(this.formData.translators)
        })

        if (this.sourceBookIds) {
          data.sourceBookIds = this.sourceBookIds
        }
        var res = await this.$http.post('/editor/saveBook.json', {
          book: JSON.stringify(data)
        })
        if (res.body.code !== 200) {
          throw new Error(res.body.message)
        }
        return res
      },
      getBookData: function (id) {
        return getBookInfoById(id)
      },
      getCoverNosToken: function () {
        return this.$http.get('/upload/getImageUploadToken.json').then(res => {
          this.coverUploadToken = Object.assign({}, this.coverUploadToken, res.body.token)
          return new Promise((resolve) => {
            resolve(res.body.token)
          })
        })
      },
      getBookNosToken: function () {
        return this.$http.get('/upload/getBookUploadToken.json').then(res => {
          this.bookUploadToken = Object.assign({}, this.bookUploadToken, res.body.token)
          return new Promise((resolve) => {
            resolve(res.body.token)
          })
        })
      },
      onBeforeCoverUpload: function (file) {
        if (file.size > 1 * 1024 * 1024) {
          this.$message({
            showClose: true,
            message: '文件过大',
            type: 'error'
          })
          return Promise.reject()
        } else if (!/\.(png|jpg|jpeg)$/.test(file.name)) {
          this.$message({
            showClose: true,
            message: '文件格式不正确',
            type: 'error'
          })
          return Promise.reject()
        }

        return this.getCoverNosToken().then(() => {
          this.coverUploadToken.data = {
            'x-nos-token': this.coverUploadToken.token,
            'Bucket': this.coverUploadToken.bucket,
            'Expires': this.coverUploadToken.expires,
            'Object': this.coverUploadToken.key
          }
        })
      },
      onCoverUploadSuccess: function (response, file, fileList) {
        this.formData.coverImage = response.url
        this.isCoverUploading = false
      },
      onCoverUploadError: function () {
        this.isCoverUploading = false
        this.$message({
          showClose: true,
          message: '上传出错',
          type: 'error'
        })
      },
      _transformAuthors: function (authors) {
        return authors.filter(author => !!author.id).map(author => {
          return {
            id: author.id,
            aliasName: author.aliasName
          }
        })
      },
      _checkBookTitle () {
        this.isBookTitleExisted = false
        this.$refs.form.validateField('title', errMsg => {
          if (!errMsg) {
            this.$http.post('/book/checkTitle.json', {
              title: this.formData.title
            }).then(data => {
              if (data.body.code === 200) {
                this.isBookTitleExisted = false
              } else {
                this.isBookTitleExisted = true
              }
            }).catch(err => {
              this.isBookTitleExisted = false
              console.error(err)
            })
          }
        })
      }
    },
    watch: {
      value: function (val) {
        this.isShow = val
      },
      isShow: function (val) {
        this.$emit('input', val)
        if (!val) {
          if (this.isBookUploading) {
            this.bookUploader.pauseUpload()
          }
          this.bookUploadProgress = 0
        }
      },
      'formData.publishTime': function (val) {
        var now = +new Date()
        var value = +new Date(val)
        if (value > now) {
          this.formData.publishTime = now
        }
      }
    },
    computed: {
      languages: function () {
        var res = []
        MAP['languages'].forEach((key, value) => {
          res.push({
            label: key,
            value: value
          })
        })
        return res
      },
      coverUploadAction: function () {
        return '//nos.netease.com/' + this.coverUploadToken.bucket
      }
    },
    components: {
      SearchInput,
      AuthorList,
      Uploader
    }
  }
</script>
<style>
  .is-warning .el-input__inner{
    border: 1px solid #ffbf00;
  }
  .warning-text{
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0;
    color: #ffbf00;
  }
</style>
