<template>
  <div>
    <div class="el-select" v-clickoutside="onOutsideClick">
    <el-input placeholder="添加贡献者" v-model="inputValue" @focus="isDropdownVisible = true"></el-input>
    <drop-down v-show="isDropdownVisible">
      <el-scrollbar
          tag="ul"
          wrap-class="el-select-dropdown__wrap"
          view-class="el-select-dropdown__list"
          v-if="list.length !== 0 && !isLoading"
          >
          <li  @mouseover="active = index" class="el-select-dropdown__item" :class="{'hover': index === active, 'clearfix': true}" v-for="(li, index) in displayList" @click="onLiClick(li, index)">
            <div class="pull-right" style="width: 80px;position:relative;top: -4px">
              <el-button size="mini" @click.stop="displayDetail(index)">查看详情</el-button>
            </div>
            <div style="margin-right: 100px;overflow:hidden;text-overflow:ellipsis">{{li}}</div>
          </li>
      </el-scrollbar>
      <div class="el-select-dropdown__item" style="text-align: center" v-if="list.length === 0 && !isLoading" @click="openAuthorDlg">无匹配结果，点击新建</div>
      <div class="el-select-dropdown__empty" v-if="isLoading">数据加载中</div>
    </drop-down>
  </div>
  </div>

</template>
<script>
  import DropDown from './DropDown'
  import Clickoutside from 'element-ui/lib/utils/clickoutside'
  import _ from 'lodash'
  import {get} from '@/common/http'
  import authorDlg from '@/common/widget/updateAuthorDlg'
  import getAuthorInfoDlg from '@/page/bookList/widget/AuthorInfoDialog'

  export default {
    data: function () {
      return {
        list: [],
        active: undefined,
        isDropdownVisible: false,
        isLoading: false,
        inputValue: this.value
      }
    },
    props: ['value'],
    created: function () {
      this.search = _.debounce(this._search, 500)
      this._lastSearchTime = null
      this.search(this.value)
    },
    methods: {
      onOutsideClick: function () {
        this.isDropdownVisible = false
      },
      onLiClick: function (item, index) {
        this.selectItem(this.list[index])
      },
      selectItem: function (item) {
        this.$emit('change', item)
      },
      changeItem: function (item) {
        this.inputValue = item.name
        this.$emit('change', item)
        this.$emit('input', item.name)
        this.isDropdownVisible = false
      },
      openAuthorDlg: function () {
        authorDlg.open({}, res => this.changeItem(res))
      },
      displayDetail: function (index) {
        getAuthorInfoDlg().open(this.list[index])
      },
      _search: function (keyword) {
        const sendTime = Date.now()
        this._lastSearchTime = sendTime
        if (!keyword) {
          this.list = []
          return
        }
        get('/contributor/find.json', {
          keyword
        }).then(data => {
          if (this._lastSearchTime === sendTime) {
            this.list = data.list
          }
        }).catch(() => {
          if (this._lastSearchTime === sendTime) {
            this.list = []
          }
        })
      }
    },
    watch: {
      inputValue: function (val) {
        this.search(val)
      },
      value: function (val) {
        this.inputValue = val
      }
    },
    computed: {
      displayList: function () {
        return this.list.map(item => {
          return `${item.name}(${item.description})`
        })
      }
    },

    components: {
      DropDown
    },
    directives: { Clickoutside }
  }
</script>
