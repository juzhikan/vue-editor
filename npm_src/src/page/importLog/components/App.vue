<template>
  <div class="container-fluid">
    <NavMenu></NavMenu>
    <div>
      <el-table :data="list" :row-class-name="_calcRowClassName">
        <el-table-column label="时间" prop="time" width="180"></el-table-column>
        <el-table-column label="uuid" prop="uuid" width="350"></el-table-column>
        <el-table-column label="消息" prop="message"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button @click="_import(scope.row.channel, scope.row.uuid)" v-if="scope.row.result === 0" type="primary" size="small">强制迁移</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import NavMenu from '@/common/components/NavMenu'
  export default {
    data: function () {
      return {
        list: window.__initData.list
      }
    },
    methods: {
      _calcRowClassName (row) {
        if (row.result === 0) {
          return 'row-error'
        } else {
          return ''
        }
      },
      _import: function (channel, uuid) {
        this.$http.post('/import/importBook.json', {
          force: true,
          channel,
          uuid
        }).then(res => {
          if (res.body.code === 200) {
            this.$message({
              showClose: true,
              message: '成功',
              type: 'success'
            })
            window.location.reload()
          } else {
            this.$message({
              showClose: true,
              message: res.body.message,
              type: 'error'
            })
          }
        }).catch(() => {
          this.$message({
            showClose: true,
            message: '失败',
            type: 'error'
          })
        })
      }
    },
    components: {
      NavMenu
    }
  }
</script>
<style>
.row-error{
  color: red;
}
</style>
