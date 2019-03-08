<template>
  <div class="cl center-block">
    <NavMenu></NavMenu>
    <div @keyup.enter="onSearch">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="search.name" placeholder="请输入作者名或ID"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="onSearch" type="primary">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="createContributor" type="primary">新建作者</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="mergeAuthors">作者合并</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="toLog">合并日志</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="contributors.list">
        <el-table-column label="ID" width="100" prop="id"></el-table-column>
        <el-table-column
          label="背景图"
          width="200"
          >
          <template scope="scope">
            <img style="width:100px" v-if="scope.row.coverImage" :src="scope.row.coverImage">
          </template>
        </el-table-column>
        <el-table-column
          label="基本信息" width="400">
          <template scope="scope">
            <div class="binfo">
              <div>
                <span class="binfo-title">姓名：</span>
                <span class="binfo-content">{{scope.row.name}}</span>
              </div>
              <div>
                <span class="binfo-title">外文名：</span>
                <span class="binfo-content">{{scope.row.otherName}}</span>
              </div>
              <div>
                <span class="binfo-title">国籍：</span>
                <span class="binfo-content">{{scope.row.nationality}}</span>
              </div>
              <div>
                <span class="binfo-title">出生年月：</span>
                <span class="binfo-content">{{scope.row.birthDate}}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="角色" width="160">
          <template scope="scope">
            <span class="word" :key="item" v-for="item in scope.row.roles">
              <el-tag >{{getValue('roles', item)}}</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="简介" width="400">
          <template scope="scope">
            <div class="description" :title="scope.row.description">
              <span v-html="_escape(scope.row.description)"></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="关联书籍数量">
          <template scope="scope">
            <a :href="`/book/list.do?contributorId=${scope.row.id}`" target="_blank">{{scope.row.bookCount || 0}}</a>
          </template>
        </el-table-column>
        <el-table-column
          label="入库时间">
          <template scope="scope">
            {{genTime(scope.row.createTime)}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作" width="100">
          <template scope="scope">
            <div><el-button type="text" size="mini" @click="editContributor(scope.row, scope.$index)">修改</el-button></div>
            <div><el-button type="text" size="mini" @click="deleteContributor(scope.row, scope.$index)">删除</el-button></div>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-pagination v-if="contributors.pageCount > 1" @current-change="onPageChange" layout="prev, pager, next" :current-page="contributors.pageIndex" :page-count="contributors.pageCount"></el-pagination>
    </div>
  </div>
</template>
<script>
  import NavMenu from '@/common/components/NavMenu'
  import util, {genTime} from '@/common/util'
  import authorDlg from '@/common/widget/updateAuthorDlg'
  import Author from '@/common/struct/author'
  import {getValue} from '@/common/map'
  import {post, get} from '@/common/http'
  import mergeAuthors from '../widget/MergeAuthors'

  import '@/css/binfo.css'

  export default {
    data () {
      return {
        search: {
          name: window.parameters.name || ''
        },
        contributors: {
          list: window.data.list.map(item => new Author(item)),
          pageIndex: window.data.pageIndex,
          pageCount: window.data.pageCount
        }
      }
    },
    methods: {
      mergeAuthors () {
        mergeAuthors.open()
      },
      onSearch () {
        var query = util.url.getQuery(location.href)
        query = {
          ...query,
          ...this.search,
          pageIndex: 1
        }
        location.href = util.url.genUrl({
          query
        })
      },
      onPageChange (page) {
        var query = util.url.getQuery(location.href)
        query.pageIndex = page
        location.href = util.url.genUrl({
          query
        })
      },
      createContributor () {
        authorDlg.open(
          {},
          res => location.reload()
        )
      },
      editContributor (contributor, index) {
        authorDlg.open(
          contributor,
          res => this.contributors.list.splice(index, 1, res)
        )
      },
      deleteContributor (contributor, index) {
        this.$confirm('确认要删除作者吗？').then(() => {
          post('/contributor/delete.json', {
            id: contributor.id
          }).then(() => {
            this.contributors.list.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          }).catch(err => {
            this.$message({
              type: 'error',
              message: err.message
            })
          })
        }).catch(() => {})
      },
      toLog () {
        window.open('/contributor/mergeLogList.do')
      },
      _escape: function (str) {
        if (str) {
          return str.replace(/[\n\r]/g, '<br>')
        } else {
          return str
        }
      },
      getValue,
      genTime
    },
    components: {
      NavMenu
    }
  }
</script>
<style scoped>
  .cl{
    width: 90%;
  }
  .word + .word{
    margin-left: 10px;
  }
  .description{
    margin: 10px 0;
    height: 144px;
    overflow: hidden;
  }
  .binfo-title{
    display: inline-block;
    width: 80px;
  }
</style>
