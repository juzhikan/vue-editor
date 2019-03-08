<template>
  <div>
  <BookInfoDialog
    :key="bookInfoDlg.key"
    v-model="bookInfoDlg.visible"
    :sourceBookIds="sourceBookIds"
  ></BookInfoDialog>
  <el-dialog
    title="合并书籍"
    :visible.sync="visible"
  >
    <div v-if="addedList.length > 0" class="list-added">
      <draggable v-model="addedList" :options="{draggable: '.js-item'}">
        <div v-for="item in addedList" :key="item.souceUuid" class="js-item list-item">
          {{item.title}}
          <el-button class="pull-right" size="mini" type="text" @click="_del(item)">删除</el-button>
        </div>
      </draggable>
      <div class="clearfix list-added__action">
        <el-button size="small" class="pull-right" type="primary" @click="_merge">合并书籍</el-button>
      </div>
    </div>
    <div>
      <el-form :inline="true">
        <el-form-item>
          <el-input
            placeholder="书名或UUID"
            v-model="input.value"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="_search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-loading.body="table.loading">
      <el-table :height="300" :data="table.list">
          <el-table-column label="书名">
            <template scope="scope">
              {{scope.row.title}}
            </template>
          </el-table-column>
          <el-table-column label="出版社">
            <template scope="scope">
              {{scope.row.publisher}}
            </template>
          </el-table-column>
          <el-table-column label="作者">
              <template scope="scope">
                <div v-for="item in scope.row.authors">
                  {{item.name}}
                </div>
              </template>
          </el-table-column>
          <el-table-column label="书籍状态">
            <template scope="scope">
              {{getValue('bookStatus2', scope.row.status)}}
            </template>
          </el-table-column>
          <el-table-column label="精编状态">
            <template scope="scope">
              {{getValue('editStatus', scope.row.editStatus)}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
                <el-button
                  v-if="!_isInAddedList(scope.row)"
                  type="text"
                  size="mini"
                  @click="_add(scope.row)"
                >添加</el-button>
                <span v-else>已添加</span>
            </template>
          </el-table-column>
      </el-table>
      <el-pagination
        v-if="pagination.pageCount > 1"
        :page-count="pagination.pageCount"
        :current-page="pagination.currentPage"
        @current-change="_changePage($event)"
      ></el-pagination>
    </div>
  </el-dialog>
</div>
</template>
<script>
  import {get} from '@/common/http'
  import draggable from 'vuedraggable'
  import BookInfoDialog from '../../components/BookInfoDialog'
  import {getValue} from '@/common/map'

  export default {
    data () {
      return {
        visible: false,
        input: {
          value: ''
        },
        table: {
          list: [],
          loading: false
        },
        addedList: [],
        pagination: {
          pageCount: 0,
          currentPage: 1
        },
        bookInfoDlg: {
          visible: false,
          key: Date.now()
        }
      }
    },
    methods: {
      open () {
        this.visible = true
        this._search()
      },
      _changePage (page) {
        this.table.loading = true
        this._requestBook(this.input.value, page).then(data => {
          this.table.list = data.list
          this.pagination.pageCount = data.pageCount
          this.pagination.currentPage = data.pageIndex
          this.table.loading = false
        })
      },
      _merge () {
        this.bookInfoDlg.visible = true
      },
      _add (item) {
        if (!this._isInAddedList(item)) {
          this.addedList.push(item)
        }
      },
      _del (item) {
        var index = this.addedList.findIndex(ele => ele.id === item.id)
        if (index !== -1) {
          this.addedList.splice(index, 1)
        }
      },
      _isInAddedList (item) {
        return this.addedList.find(ele => ele.id === item.id)
      },
      _search () {
        this._changePage(1)
      },
      _requestBook (title = '', page = 1) {
        return get('/book/list.json', {title, pageIndex: page}).then(data => {
          return data.data
        }).catch(() => {
          return {
            list: [],
            count: 0,
            pageCount: 1,
            pageIndex: 1
          }
        })
      },
      getValue
    },
    components: {
      draggable,
      BookInfoDialog
    },
    computed: {
      'sourceBookIds': function () {
        return this.addedList.map(item => item.id)
      }
    }
  }
</script>
<style scoped>
  .list-item{
    padding: 5px 10px;
    background: #eee;
    cursor: move;
  }
  .list-added{
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px dashed #8391a5;
  }
  .list-added__action{
    margin-top: 10px;
  }
</style>
