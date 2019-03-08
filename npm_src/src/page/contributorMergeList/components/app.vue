<template>
  <div class="bl center-block">
      <NavMenu></NavMenu>
      <div class="container-fluid" style="margin-top: 20px">
        <el-table :data="list">
            <el-table-column label="作者ID" prop="sourceContributorId">
            </el-table-column>
            <el-table-column label="合并至" prop="destContributorId">
            </el-table-column>
            <el-table-column label="合并结果">
              <template scope="scope">
                {{result(scope.row.result)}}
              </template>
            </el-table-column>
            <el-table-column label="操作时间">
              <template scope="scope">
                {{genTime(scope.row.createTime)}}
              </template>
            </el-table-column>
            <el-table-column label="提示信息">
              <template scope="scope">
                {{scope.row.message}}
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 10px" v-if="pageCount > 1">
            <el-pagination @current-change="onPageChange" layout="prev, pager, next" :current-page="pageIndex" :page-count="pageCount"></el-pagination>
          </div>
      </div>

  </div>

</template>
<script>
  import NavMenu from '@/common/components/NavMenu'
  import util, {genTime} from '@/common/util'
  export default {
    data () {
      return {
        list: window.__initState.list,
        pageIndex: window.__initState.pageIndex,
        pageCount: window.__initState.pageCount
      }
    },
    methods: {
      onPageChange (page) {
        var query = util.url.getQuery(location.href)
        query.pageIndex = page
        location.href = util.url.genUrl({
          query
        })
      },
      genTime,
      result (val) {
        let res = ''
        switch (val) {
          case 0:
            res = '失败'
            break
          case 1:
            res = '成功'
            break
          default:
            res = '未知'
        }
        return res
      }
    },
    components: {
      NavMenu
    }
  }
</script>
<style scoped>

</style>
