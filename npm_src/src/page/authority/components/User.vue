<template>
  <div class="user">
    <el-button type="primary" size="small" @click="handleUser">添加用户</el-button>
    <el-table :data="tableData" border style="width: 80%;margin-top: 10px;">
      <el-table-column prop="username" label="账号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
      <el-table-column label="状态">
        <template scope="scope">
          <p>{{ scope.row.status ? '无效' : '有效' }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small" @click="handleUser(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="onPageChange" layout="prev, pager, next" :current-page="pageIndex" :page-count="pageCount">
    </el-pagination>
    <el-dialog title="用户管理" v-model="newUserVisible">
      <el-form :model="form">
        <el-form-item label="账号">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.roleId" placeholder="请选择用户对应的角色">
            <el-option v-for="role in roles" :label="role.name" :value="role.id" :key="role.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch on-text="有效" off-text="无效" v-model="form.status"></el-switch>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSaveUser">保存</el-button>
          <el-button @click="newUserVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import cache from '../cache'
import { shadowCopy } from '@/util'
import urlutil from '@/common/util'

var config = window.PAGE_CONFIG
var data = JSON.parse(config.data)
var roles = JSON.parse(config.roles)
var list = data.list
var pageIndex = data.pageIndex
var pageCount = data.pageCount

var form = {
  id: '',
  username: '',
  name: '',
  roleId: '',
  status: true,
  phone: 0
}

export default {
  data () {
    return {
      newUserVisible: false,
      tableData: list,
      pageIndex: pageIndex,
      pageCount: pageCount,
      form: form,
      roles: roles
    }
  },
  methods: {
    handleUser (index, row) {
      this.newUserVisible = true
      if (row) {
        this.form = {
          id: row.id,
          username: row.username,
          name: row.name,
          roleId: row.roleId,
          status: !row.status,
          phone: row.phone
        }
      } else {
        this.form = form
      }
    },
    onPageChange (page) {
      var url = urlutil.url
      var query = url.getQuery(location.href)
      query.pageIndex = page
      location.href = url.genUrl({
        query
      })
    },
    onSaveUser () {
      if (!this.check()) return
      var user = shadowCopy(this.form)
      user.status = user.status ? 0 : 1
      var data = {
        user: JSON.stringify(user)
      }
      cache.saveUser(data, response => {
        this.$message({
          message: '保存成功',
          type: 'success',
          duration: 1500,
          onClose () {
            location.reload()
          }
        })
        this.newUserVisible = false
      }, response => {
        this.$message({message: '保存失败', type: 'warning', duration: 1500})
        this.newUserVisible = false
      })
    },
    check (value) {
      if (this.form.username === '') {
        this.$message({message: '账号不能为空', type: 'warning', duration: 1500})
        return false
      }
      if (this.form.roleId === '') {
        this.$message({message: '角色不能为空', type: 'warning', duration: 1500})
        return false
      }
      if (this.form.name === '') {
        this.$message({message: '姓名不能为空', type: 'warning', duration: 1500})
        return false
      }
      return true
    }
  }
}
</script>

<style type="text/css">
.el-dialog {
  width: 600px;
}
.el-input {
  width: 480px;
}
</style>
