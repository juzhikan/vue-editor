<template>
 <div class="panel panel-default">
   <div class="panel-heading clearfix">
    {{this.label}}
     <div class="pull-right" style="width:400px;">
        <search-input
          @change="toggleItem($event)"
        ></search-input>
     </div>
   </div>
   <div class="panel-body">
     <el-table :data="tableList">
      <el-table-column label="名称">
        <template scope="scope">
          <el-tooltip placement="top">
            <div slot="content" style="width: 200px">
              {{scope.row.name}}
            </div>
            <div class="toe">{{scope.row.name}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="描述">
        <template scope="scope">
          <el-tooltip placement="top">
            <div slot="content" style="width: 200px; max-height: 400px;overflow:auto">
              {{scope.row.description}}
            </div>
            <div class="toe">{{scope.row.description}}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="显示名">
        <template scope="scope">
            <el-input size="small" v-model="scope.row.aliasName"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="mini" type="text" @click="showDetail(scope.row)">详情</el-button>
          <el-button size="mini" type="text" @click="toggleItem(scope.row)">删除</el-button>
        </template>
      </el-table-column>
     </el-table>
   </div>
 </div>
</template>
<script>
  import SearchInput from './SearchInput'
  import getAuthorInfoDlg from '@/page/bookList/widget/AuthorInfoDialog'

  export default {
    name: 'AuthorList',
    data () {
      return {
        tableList: this.value
      }
    },
    props: ['value', 'label'],
    methods: {
      toggleItem (item) {
        for (let i = 0; i < this.tableList.length; i++) {
          if (this.tableList[i] === item) {
            this.tableList.splice(i, 1)
            return
          }
        }
        this.tableList.push(item)
      },
      showDetail (item) {
        getAuthorInfoDlg().open(item)
      }
    },
    components: {
      SearchInput
    },
    watch: {
      'value': function (val) {
        this.tableList = val
      },
      'tableList': function (val) {
        this.$emit('input', val)
      }
    }
  }
</script>
<style scoped>
.toe{
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
