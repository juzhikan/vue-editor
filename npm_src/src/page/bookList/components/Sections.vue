<template>
<div class="psections">
     <div class="panel panel-default" style="margin-top: 15px">
        <div class="panel-heading">{{title}}</div>
        <div class="panel-body clearfix">
          <div class="psections-actions">
            <div class="number-desc">根据总字数的百分比快速勾选章节</div>
            <el-input-number v-model="percent" :min="0" :max="100"></el-input-number>

            <el-button class="pull-right" @click="$clear()">清空</el-button>
            <slot></slot>
          </div>
          <div style="margin-top: 20px;">
            <table class="table">
              <tr>
                <th>
                    <el-checkbox :indeterminate="table.isIndeterminate" :value="table.checkAll" @change="$handleCheckAllChange">全选</el-checkbox>
                </th>
                <th>章节名</th>
                <td>章节ID</td>
                <td>章节字数</td>
              </tr>
                <tr v-for="(li, index) in showList" :key="li.articleId">
                  <td>
                    <el-checkbox :value="li.vip" @change="$toggleCheck(index)"></el-checkbox>
                  </td>
                  <td>{{li.title}}</td>
                  <td>{{li.articleId}}</td>
                  <td>{{li.wordCount}}</td>
                </tr>
            </table>
            <el-pagination
              layout="prev, pager, next"
              :current-page.sync="table.page"
              :page-size="table.size"
              :total="list.length">
            </el-pagination>
          </div>

        </div>
      </div>
   </div>
</template>
<script>
  import {isInArray} from '../util'

  export default {
    data () {
      return {
        selectedIds: [],
        percent: 0,
        table: {
          isIndeterminate: true,
          checkAll: true,
          size: 10,
          page: 1
        }
      }
    },
    props: {
      list: Array,
      title: String
    },
    mounted: function () {
      this._totalWords = this._getTotalWords(this.list)
      this._reset()
    },
    watch: {
      percent: function (val) {
        this._setCheckedByPercent()
      }
    },
    computed: {
      showList: function () {
        let start = (this.table.page - 1) * this.table.size
        return this.list.slice(start, start + this.table.size)
      }
    },
    methods: {
      $handleCheckAllChange: function (val) {
        if (this.table.checkAll) {
          this.list.forEach(item => {
            item.vip = false
          })
        } else {
          this.list.forEach(item => {
            item.vip = true
          })
        }
        this._reset()
      },
      $toggleCheck: function (index) {
        let start = (this.table.page - 1) * this.table.size
        this.list[start + index].vip = !this.list[start + index].vip
        this._reset()
      },
      $clear: function () {
        this._clear()
      },
      _reset: function () {
        let or = false
        let and = true
        this.list.forEach((item, index) => {
          if (index === 0) {
            return
          }
          or = or || item.vip
          and = and && item.vip
        })
        if (and) {
          this.table.checkAll = true
          this.table.isIndeterminate = false
        } else if (!or) {
          this.table.checkAll = false
          this.table.isIndeterminate = false
        } else {
          this.table.checkAll = true
          this.table.isIndeterminate = true
        }
        if (this.list[0]) {
          this.list[0].vip = false
        }
        this.$emit(
          'change',
          this.list.filter(item => item.vip).map(item => item.articleId)
        )
      },
      _clear: function () {
        this.list.forEach(item => {
          item.vip = false
        })
        this._reset()
      },
      _setCheckedByPercent: function () {
        var max = Math.floor(this.percent * this._totalWords / 100)
        var num = 0
        var len = 0
        for (let i = 0; i < this.list.length; i++) {
          num += this.list[i].wordCount
          if (num >= max) {
            len = i + 1
            break
          }
        }
        for (let i = len; i < this.list.length; i++) {
          if (this.list[i].wordCount === 0) {
            len = i + 1
          } else {
            break
          }
        }
        for (let i = 0; i < this.list.length; i++) {
          if (i < len) {
            this.list[i].vip = false
          } else {
            this.list[i].vip = true
          }
        }
        this._reset()
      },
      _getTotalWords: function (list) {
        var ret = 0
        list.forEach(item => {
          ret += item.wordCount
        })
        return ret
      }
    }
  }
</script>
<style>
  .psections-actions .el-input-number{
    vertical-align: bottom
  }
  .psections .number-desc{
    display: inline-block;
    width: 120px;
    height: 36px;
    line-height: 18px;
  }
</style>
