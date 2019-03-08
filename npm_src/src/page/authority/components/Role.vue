<template>
  <div class="role">
    <el-button type="primary" size="small" @click="handleRole">添加角色</el-button>
    <el-table :data="tableData" border style="width: 80%;margin-top: 10px;">
      <el-table-column prop="name" label="角色"></el-table-column>
        <el-table-column label="权限">
          <template scope="scope">
            <span>{{ printRoles(scope.row.authorities) }}</span>
          </template>
        </el-table-column>
      <el-table-column prop="role" label="操作">
        <template scope="scope">
          <el-button @click="handleRole(scope.$index, scope.row)" size="small">编辑</el-button>
          <el-button @click="delRole(scope.$index, scope.row)" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="权限管理" v-model="newRoleVisible">
      <el-form :model="form">
        <el-form-item label="角色名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色权限">
          <el-select v-model="form.authorities" multiple placeholder="请选择角色对应的权限">
            <el-option v-for="authority in authorities" :label="authority.label" :value="authority.name" :key="authority.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSaveRole">保存</el-button>
          <el-button @click="newRoleVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import cache from '../cache'
import { shadowCopy } from '@/util'

var config = window.PAGE_CONFIG
var authorities = JSON.parse(config.authorities)
var roles = JSON.parse(config.roles)

var role = {
  id: '',
  name: '',
  authorities: [authorities[0].name]
}

export default {
  data () {
    return {
      tableData: roles,
      form: role,
      authorities: authorities,
      newRoleVisible: false
    }
  },
  methods: {
    delRole (index, row) {
      this.$confirm('确定要删除该角色吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnPressEscape: false,
        type: 'warning'
      }).then(() => {
        this.doDelRole(index, row.id)
      })
    },
    doDelRole (index, id) {
      cache.delRole({id: id}, response => {
        if (response.code === 200) {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1500,
            onClose () {
              location.reload()
            }
          })
        } else {
          this.$message({message: response.message, type: 'warning', duration: 1500})
        }
      }, response => {
        this.$message({message: '删除出错了', type: 'error', duration: 1500})
      })
    },
    handleRole (index, row) {
      if (row) {
        this.form = {
          id: row.id,
          name: row.name,
          authorities: row.authorities
        }
      } else {
        this.form = role
      }
      this.newRoleVisible = true
    },
    onSaveRole () {
      if (!this.check()) return
      var role = shadowCopy(this.form)
      var data = {
        role: JSON.stringify(role)
      }
      cache.saveRole(data, response => {
        this.$message({
          message: '保存成功',
          type: 'success',
          duration: 1500,
          onClose () {
            location.reload()
          }
        })
        this.newRoleVisible = false
      }, response => {
        this.$message({message: '保存失败', type: 'error', duration: 1500})
        this.newRoleVisible = false
      })
    },
    printRoles (as) {
      var roles = []
      for (var i = 0; i < as.length; i++) {
        roles.push(this.getRoleNameByKey(as[i]))
      }
      return roles.join(',')
    },
    getRoleNameByKey (key) {
      for (var i = 0; i < authorities.length; i++) {
        if (authorities[i].name === key) return authorities[i].label
      }
    },
    check (value) {
      if (this.form.name === '') {
        this.$message({message: '角色名不能为空', type: 'warning', duration: 1500})
        return false
      }
      if (this.form.authorities === []) {
        this.$message({message: '权限不能为空', type: 'warning', duration: 1500})
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
.el-form-item__label {
  width: 68px;
  text-align: left;
}
</style>
