<template>
  <div>
    <el-dialog v-model="isShowDialog" title="业务信息" custom-class="editDialog" :close-on-click-modal="false">
      <div class="panel panel-default">
        <div class="panel-heading">阅读业务信息</div>
        <div class="panel-body">
          <el-form label-width="80px">
            <div class="row">
              <div class="col-md-6">
                <el-form-item label="书籍状态">
                  <el-select v-model="form.status">
                    <el-option v-for="status in this.CON.bookStatus" :label="status.label" :value="status.value" :key="status.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="CP归属">
                  <CopyRight v-model="yueduCpValue"></CopyRight>
                </el-form-item>
                <el-form-item label="书籍类型">
                  <el-select v-model="form.bookType">
                    <el-option v-for="status in this.CON.bookType" :label="status.label" :value="status.value" :key="status.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="阅读分类">
                  <CategorySelect :list="yueduCategory" v-model="form.categoryId" ref="yueduCategory" @change="$onYueduCategoryChange"></CategorySelect>
                </el-form-item>
                <el-form-item label="内容状态">
                  <el-select v-model="form.contentStatus">
                    <el-option v-for="item in this.CON.contentStatus" :label="item.label" :value="item.value" :key="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="反垃圾">
                  <el-switch
                    v-model="form.antiSpam"
                    :on-value="1"
                    :off-value="0"
                    ></el-switch>
                </el-form-item>
              </div>
              <div class="col-md-6">
                <el-form-item label="书籍价格">
                  <div class="clearfix">
                    <div class="pull-right">{{priceType}}</div>
                    <div class="input-price">
                      <el-input v-model.number="form.price"></el-input>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item label="付费类型">
                  <el-select v-model="form.payType">
                    <el-option v-for="item in payType" :label="item.label" :value="item.value" :key="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="书籍标签">
                  <Tags v-model="form.bookTags"></Tags>
                </el-form-item>
                <el-form-item label="频道归属">
                  {{channel}}
                </el-form-item>
                <el-form-item label="精编状态">
                  {{yueduEditStatus}}
                </el-form-item>
              </div>
          </div>
          <Sections v-if="isShowYueduRange" :list="form.articles" ref="yueduSection" title="阅读付费范围设置" :key="yueduRangeId" @change="$onYueduSectionsChange">
          </Sections>
          <div class="clearfix">
            <div class="pull-right">
              <el-button type="primary" @click="$updateYueduInfo" v-if="$store.state.permission['BOOK_BUSINESS_EDIT']" :disabled="!isYueduEdited">保存</el-button>
              <template v-if="$store.state.permission['BOOK_BUSINESS_SYNC'] && canPublish">
                <el-button type="danger" v-if="form.reviewStatus === 1" @click="rejectYd">驳回</el-button>
                <el-button type="primary" v-if="form.reviewStatus !== 3" @click="$verifyYuedu()" :disabled="isYueduEdited">确认上线</el-button>
                <el-button type="primary" :disabled="true" v-else>已上线</el-button>
              </template>
              <template v-if="canPublish">
                <el-button type="primary" :disabled="isYueduEdited" v-if="form.reviewStatus === 0 || form.reviewStatus === 2" @click="submitYdData">提交审核</el-button>
                <el-button type="danger" disabled v-if="form.reviewStatus === 3 || form.reviewStatus === 1">{{getValue('reviewStatus', form.reviewStatus)}}</el-button>
              </template>
            </div>
          </div>
          </el-form>

        </div>
      </div>
      <div v-if="!$store.state.snailDisabled" class="panel panel-default">
        <div class="panel-heading">蜗牛业务信息</div>
        <div class="panel-body">
          <el-form label-width="80px">
            <div class="row">
              <div class="col-md-6">
                <el-form-item label="书籍状态">
                  <el-select v-model="wnForm.status">
                    <el-option v-for="status in this.CON.bookStatus" :label="status.label" :value="status.value" :key="status.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="CP归属">
                {{yueduCpValue.name}}
                </el-form-item>
                <el-form-item label="书籍类型">
                {{form.bookType|bookType}}
                </el-form-item>
                <el-form-item label="内容状态">
                {{form.contentStatus|contentStatus}}
                </el-form-item>
                <el-form-item label="反垃圾">
                  <el-switch
                    v-model="wnForm.antiSpam"
                    :on-value="1"
                    :off-value="0"
                    ></el-switch>
                </el-form-item>
              </div>
              <div class="col-md-6">
              <el-form-item label="书籍价格">
                <div class="clearfix">
                  <div class="pull-right">阅点</div>
                  <div class="input-price">
                    <el-input v-model.number="wnForm.price"></el-input>
                  </div>
                </div>

                </el-form-item>
                <el-form-item label="付费类型">
                  <el-select v-model="wnForm.payType">
                    <el-option v-for="item in wnPayType" :label="item.label" :value="item.value" :key="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="蜗牛分类">
                  <CategorySelect :list="wnCategory" v-model="wnForm.categoryId" ref="wnCategory"></CategorySelect>
                </el-form-item>
                <el-form-item label="精编状态">
                  {{yueduEditStatus}}
                </el-form-item>
              </div>
          </div>
          <Sections v-if="isShowWnRange" @change="$onWnSectionsChange" :list="wnForm.articles" ref="wnSection" :key="wnRangeId" title="蜗牛付费范围设置">
          </Sections>
          <div class="clearfix">
            <div class="pull-right">
              <el-button type="primary" @click="$updateWnInfo" v-if="$store.state.permission['BOOK_BUSINESS_EDIT']" :disabled="!isWnEdited">保存</el-button>

              <template v-if="$store.state.permission['BOOK_BUSINESS_SYNC'] && canPublish">
                <el-button type="danger" v-if="wnForm.reviewStatus === 1" @click="rejectWn">驳回</el-button>
                <el-button type="primary" v-if="wnForm.reviewStatus !== 3" @click="$verifyWn()" :disabled="isWnEdited">确认上线</el-button>
                <el-button type="primary" :disabled="true" v-else>已上线</el-button>
              </template>
              <template v-if="canPublish">
                <el-button type="primary" v-if="wnForm.reviewStatus === 0 || wnForm.reviewStatus === 2" @click="submitWnData" :disabled="isWnEdited">提交审核</el-button>
                <el-button type="danger" disabled v-if="wnForm.reviewStatus === 3">{{getValue('reviewStatus', wnForm.reviewStatus)}}</el-button>
              </template>
            </div>
          </div>
          </el-form>

        </div>
      </div>
    </el-dialog>
  </div>

</template>
<script>
  import MAP, {getValue} from '@/common/map'
  import CopyRight from './CopyRight'
  import Tags from './Tags'
  import Sections from './Sections'
  import CategorySelect from './CategorySelect'
  import {getBookInfoById} from '../store'
  import {syncData, isInArray} from '../util'
  import {get, post} from '@/common/http'
  import messageBox from '@/page/bookList/widget/MessageBox'

  export default {
    name: 'BusinessInfoDialg',
    props: ['value', 'id'],
    data () {
      return {
        isShowDialog: this.value,
        form: this._getinitYueduForm(),
        yueduCpValue: {},
        backForm: this._getinitYueduForm(),
        sections: '',
        backSections: '',
        backWnForm: this._getinitYueduForm(),
        backWnSections: '',
        wnSections: '',
        wnForm: this._getinitYueduForm(),
        yueduRangeId: +new Date(),
        wnRangeId: +new Date(),
        yueduCategory: [],
        wnCategory: [],
        isShowYueduRange: false,
        isShowWnRange: false,
        MAP,
        channel: '',
        wnCategoryValue: {id: '', name: ''},
        rejectDlg: {
          visible: false,
          text: ''
        },
        canPublish: true
      }
    },
    mounted: function () {
      if (this.id) {
        this._initYuedu()
        this._initWn()
        let info = getBookInfoById(this.id)
        this.canPublish = info.canPublish === 1
      }
    },
    watch: {
      value: function (val) {
        this.isShowDialog = val
      },
      form: function (val) {},
      isShowDialog: function (val) {
        this.$emit('input', val)
      },
      'form.bookType': async function (val) {
        var categoryId = this.form.categoryId
        this.form.categoryId = null
        await this._refreshYueduCategories(val)
        this.yueduCategory.forEach(item => {
          if (item.id === categoryId) {
            this.form.categoryId = categoryId
            return false
          }
        })
      },
      'form.payType': function (val) {
        this._refreshYueduRange(val)
      },
      'wnForm.payType': function (val) {
        this._refreshWnRange(val)
      },
      yueduCpValue: function (val) {
        this.form.cpId = val.userId
      }
    },
    computed: {
      CON: function () {
        var res = {}
        for (var i in MAP) {
          res[i] = []
          MAP[i].forEach((key, value) => {
            res[i].push({
              label: key,
              value
            })
          })
        }
        return res
      },
      payType: function () {
        var payType = this.CON.payType
        if (!this.yueduCpValue.name) {
          return payType.slice(0, 1)
        } else {
          return payType
        }
      },
      wnPayType: function () {
        var payType = this.CON.payType
        if (!this.yueduCpValue.name) {
          return payType.slice(0, 1)
        } else {
          var temp = [].concat(payType)
          temp.splice(1, 1)
          return temp
        }
      },
      yueduEditStatus: function () {
        var status = ''
        this.$store.state.list.forEach(item => {
          if (+item.id === +this.id) {
            status = item.editStatus
            return false
          }
        })
        return MAP.editStatus.get(+status)
      },
      isYueduEdited: function () {
        var o1 = {...this.form}
        var o2 = {...this.backForm}
        delete o1.reviewStatus
        delete o2.reviewStatus

        return !this._isEqual(o1, o2) || this.sections !== this.backSections
      },
      isWnEdited: function () {
        var o1 = {...this.wnForm}
        var o2 = {...this.backWnForm}
        delete o1.reviewStatus
        delete o2.reviewStatus

        return !this._isEqual(o1, o2) || this.wnSections !== this.backWnSections
      },
      priceType: function () {
        if (this.form.payType === 1) {
          return '阅点/千字'
        } else {
          return '阅点'
        }
      }
    },
    methods: {
      beforeUpdate (form) {
        if (parseInt(form.payType) !== 0 && parseInt(form.price, 10) === 0) {
          this.$message({
            showClose: true,
            message: '书籍价格不能为0！',
            type: 'warning'
          })
          return false
        }
        if (parseInt(form.payType) === 0 && parseInt(form.price, 10) !== 0) {
          this.$message({
            showClose: true,
            message: '免费书籍价格应为0！',
            type: 'warning'
          })
          return false
        }
        return true
      },
      rejectYd () {
        messageBox.open({
          title: '驳回理由',
          rules: [
            {required: true, trigger: 'blur', message: '此项必填'},
            {max: 500, trigger: 'blur', message: '内容过长'}
          ]
        }, text => {
          post('/book/rejectYueduBusinessData.json', {
            id: this.id,
            message: text
          }).then(() => {
            this.$message({
              message: '驳回成功',
              type: 'success'
            })
            this.isShowDialog = false
          }).catch(err => {
            this.$message({
              message: err.message,
              type: 'error'
            })
          })
        })
      },
      rejectWn () {
        messageBox.open({
          title: '驳回理由',
          rules: [
            {required: true, trigger: 'blur', message: '此项必填'},
            {max: 500, trigger: 'blur', message: '内容过长'}
          ]
        }, text => {
          post('/book/rejectSnailBusinessData.json', {
            id: this.id,
            message: text
          }).then(() => {
            this.$message({
              message: '驳回成功',
              type: 'success'
            })
            this.isShowDialog = false
          }).catch(err => {
            this.$message({
              message: err.message,
              type: 'error'
            })
          })
        })
      },
      submitWnData: function () {
        post('/book/submitSnailBusinessData.json', {id: this.id}).then(() => {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.isShowDialog = false
        }).catch(err => {
          this.$message({
            message: err.message,
            type: 'error'
          })
        })
      },
      submitYdData: function () {
        post('/book/submitYueduBusinessData.json', {id: this.id}).then(() => {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.isShowDialog = false
        }).catch(err => {
          this.$message({
            message: err.message,
            type: 'error'
          })
        })
      },
      $onYueduSectionsChange: function (ids) {
        this.sections = ids.join(',')
      },
      $onWnSectionsChange: function (ids) {
        this.wnSections = ids.join(',')
      },
      $updateYueduInfo: function () {
        var id = this.id
        if (!this.beforeUpdate(this.form)) return
        var data = {
          ...this.form,
          articles: this.wnForm.articles.map(item => {
            return {articleId: item.articleId, vip: item.vip}
          })
        }
        this._setVipById(data.articles, this.sections.split(','))
        if (this.sections.length === 0 && this.form.payType !== 0) {
          this.$message({
            showClose: true,
            message: '请选择付费章节',
            type: 'error'
          })
          return
        }

        return new Promise((resolve, reject) => {
          this.$http.post('/book/saveYueduBusinessData.json', {
            data: JSON.stringify(data)
          }).then((res) => {
            if (res.body.code === 200) {
              this.$message({
                showClose: true,
                message: '保存阅读业务信息成功',
                type: 'success'
              })
              this.backForm = {...this.form}
              this.backSections = this.sections
              resolve()
            } else {
              this.$message({
                showClose: true,
                message: res.body.message,
                type: 'error'
              })
              reject()
            }
          }).catch(() => {
            this.$message({
              showClose: true,
              message: '保存阅读业务信息失败',
              type: 'error'
            })
            reject()
          })
        })
      },
      $updateWnInfo: function () {
        var id = this.id
        if (!this.beforeUpdate(this.wnForm)) return
        var data = {
          ...this.wnForm,
          ...{
            cpId: this.yueduCpValue.userId,
            cpName: this.yueduCpValue.name,
            contentStatus: this.form.contentStatus,
            bookType: this.form.bookType,
            articles: this.wnForm.articles.map(item => {
              return {articleId: item.articleId, vip: item.vip}
            })
          }
        }
        this._setVipById(data.articles, this.wnSections.split(','))
        if (this.wnSections.length === 0 && this.wnForm.payType !== 0) {
          this.$message({
            showClose: true,
            message: '请选择付费章节',
            type: 'error'
          })
          return
        }
        return new Promise((resolve, reject) => {
          this.$http.post('/book/saveSnailBusinessData.json', {
            data: JSON.stringify(data)
          }).then((res) => {
            if (res.body.code === 200) {
              this.$message({
                showClose: true,
                message: '保存蜗牛业务信息成功',
                type: 'success'
              })
              this.backWnForm = {...this.wnForm}
              this.backWnSections = this.wnSections
              resolve()
            } else {
              this.$message({
                showClose: true,
                message: res.body.message,
                type: 'error'
              })
              reject()
            }
          }).catch(() => {
            this.$message({
              showClose: true,
              message: '保存蜗牛业务信息失败',
              type: 'error'
            })
            reject()
          })
        })
      },
      $verifyYuedu: async function () {
        this.$loading()
        post('/book/passYueduBusinessData.json', {
          id: this.id
        }).then(res => {
          this.$message({
            showClose: true,
            message: '审核成功',
            type: 'success'
          })
          this.form.reviewStatus = 3
          return this.syncData('1', 0)
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        }).then(() => {
          this.$loading().close()
        })
      },
      $verifyWn: async function () {
        var info = getBookInfoById(this.id)
        if (info.editStatus !== 10) {
          this.$message({
            showClose: true,
            message: '书籍没有完成精编',
            type: 'error'
          })
          return
        }
        this.$loading()
        post('/book/passSnailBusinessData.json', {
          id: this.id
        }).then(res => {
          this.$message({
            showClose: true,
            message: '审核成功',
            type: 'success'
          })
          this.wnForm.reviewStatus = 3
          return this.syncData('2', 0)
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        }).then(() => this.$loading().close())
      },
      $onYueduCategoryChange: function (data) {
        if (data.gender === 1) {
          this.channel = '男频'
        } else if (data.gender === 2) {
          this.channel = '女频'
        } else if (data.gender === 0) {
          this.channel = '其它'
        } else {
          this.channel = ''
        }
      },
      _initYuedu: async function () {
        var res = await this.$http.get('/book/getYueduBusinessData.json', {
          params: {
            bookId: this.id
          }
        })
        this.form = res.body.data
        if (this.form.bookTags === null) {
          this.form.bookTags = ''
        }
        if (this.form.categoryId === 0) {
          this.form.categoryId = null
        }
        this.backForm = {...this.form}
        this.backSections = this._getStrByArticles(this.backForm.articles)
        this.sections = this.backSections
        this._refreshYueduRange()
        this.yueduCpValue = {
          name: this.form.cpName,
          userId: this.form.cpId,
          realName: this.form.cpRealName
        }
      },
      _initWn: async function () {
        var res = await this.$http.get('/book/getSnailBusinessData.json', {
          params: {
            bookId: this.id
          }
        })
        this.wnForm = res.body.data || {articles: []}

        if (this.wnForm.categoryId === 0) {
          this.wnForm.categoryId = null
        }
        if (this.wnForm.price === null) {
          this.wnForm.price = 0
        }
        this.backWnForm = {...this.wnForm}
        this.backWnSections = this._getStrByArticles(this.backWnForm.articles)
        this.wnSections = this.backWnSections
        this._refreshWnRange()
        res = await this.$http.get('/book/getSnailCategories.json')
        this.wnCategory = res.body.list
        this.wnCategory.forEach(item => {
          if (item.level === 0) {
            item.disabled = true
          }
        })
      },
      syncData: function (type, force) {
        return syncData(this.id, type, force)
      },
      _refreshYueduRange: function (val = this.form.payType) {
        if (val === 1 || val === 2) {
          this.isShowYueduRange = true
        } else {
          this.isShowYueduRange = false
        }
      },
      _refreshWnRange: function (val = this.wnForm.payType) {
        if (val === 2) {
          this.isShowWnRange = true
        } else {
          this.isShowWnRange = false
        }
      },
      _refreshYueduCategories: function (type) {
        return this.$http.get('/book/getYueduCategories.json', {
          params: {
            type
          }
        }).then(res => {
          var list = res.body.list
          if (type === 0) {
            list.forEach(item => {
              if (item.level === 1) {
                item.disabled = true
              }
            })
          }
          this.yueduCategory = list
        })
      },
      _getinitYueduForm: function () {
        return {
          bookId: null,
          bookTags: null,
          bookType: null,
          categoryId: null,
          categoryName: null,
          contentStatus: null,
          cpId: null,
          cpName: null,
          payType: null,
          price: null,
          status: null,
          verified: null,
          articles: [],
          antiSpam: 0
        }
      },
      _isEqual: function (o1, o2) {
        if (Array.isArray(o1) && Array.isArray(o2)) {
          for (let i = 0; i < o1.length; i++) {
            if (!this._isEqual(o1[i], o2[i])) {
              console.log(`Array:${i}:${o1[i]}:${o2[i]}`)
              return false
            }
          }
          return o1.length === o2.length
        } else if (typeof o1 === 'object' && typeof o2 === 'object') {
          for (var i in o1) {
            if (!this._isEqual(o1[i], o2[i])) {
              console.log(`Object:${i}:${o1[i]}:${o2[i]}`)
              return false
            }
          }
          return true
        } else {
          return o1 === o2
        }
      },
      _getStrByArticles: function (articles) {
        var res = []
        articles.forEach(item => {
          if (item.vip) {
            res.push(item.articleId)
          }
        })
        return res.join(',')
      },
      _setVipById: function (articles, ids) {
        articles.forEach(item => {
          if (isInArray(ids, '' + item.articleId)) {
            item.vip = true
          } else {
            item.vip = false
          }
        })
      },
      getValue
    },
    filters: {
      contentStatus: function (value) {
        return MAP.contentStatus.get(value)
      },
      bookType: function (value) {
        return MAP.bookType.get(value)
      }
    },
    components: {
      CopyRight,
      Tags,
      Sections,
      CategorySelect
    }
  }
</script>
<style>
  .demo-percent > *{
    vertical-align: text-bottom;
  }
  .input-price{
    margin-right: 80px;
  }
</style>
