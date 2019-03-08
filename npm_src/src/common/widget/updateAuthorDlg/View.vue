<template>
  <el-dialog :title="title" v-model="visible">
    <el-form label-width="80px" ref="form" :rules="rules" :model="form">
      <div class="center-table">
        <Uploader v-model="form.coverImage">
          <template slot="tip">
             文件格式：jpg/png&nbsp;&nbsp;&nbsp;&nbsp;上传尺寸：750px*469px
          </template>
        </Uploader>
      </div>
      <el-form-item label="姓名" prop="name">
        <el-input v-model.trim="form.name"></el-input>
      </el-form-item>
      <el-form-item label="角色">
        <el-checkbox-group v-model="form.roles">
          <el-checkbox label="aut">作者</el-checkbox>
          <el-checkbox label="trl">译者</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="外文名">
        <el-input v-model="form.otherName"></el-input>
      </el-form-item>
      <el-form-item label="国籍">
        <el-input v-model="form.nationality"></el-input>
      </el-form-item>
      <el-form-item label="出生年月">
        <el-input v-model="form.birthDate"></el-input>
      </el-form-item>
      <el-form-item label="简介" prop="description">
        <el-input type="textarea" :rows="4" v-model.trim="form.description"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" @click="onSave">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import Author from '@/common/struct/author'
  import {post, get} from '@/common/http'
  import Uploader from '@/common/components/uploader'

  export default {
    name: 'updateAuthorDialog',
    data: function () {
      return {
        visible: false,
        form: new Author()
      }
    },
    methods: {
      open (data = {}, cb) {
        this.form = new Author(data)
        this.visible = true
        this.$off()
        this.$once('updated', cb)
      },
      onSave () {
        this.$refs.form.validate(res => {
          if (res) {
            const formData = {...this.form}
            if (formData.roles.length === 0) {
              this.$message({
                message: '请选择角色类型',
                type: 'error'
              })
              return
            }

            var action = 'add'
            if (formData.id) {
              action = 'update'
            }
            post(`/contributor/${action}.json`, {
              contributor: JSON.stringify({
                ...formData,
                roles: formData.roles.join(','),
                birthDate: formData.birthDate
              })
            })
              .then((res) => {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.visible = false
                this.$emit('updated', {
                  ...formData,
                  id: res.id || formData.id
                })
              })
              .catch((err) => {
                this.$message(err.message)
              })
          }
        })
      },
      onCancel () {
        this.visible = false
      }
    },
    computed: {
      rules: function () {
        const map = {
          name: '姓名',
          description: '简介'
        }

        const ret = {
          name: [
            {
              required: true,
              message: '请输入姓名',
              trigger: 'blur'
            },
            {
              max: 100,
              message: '不能超过100个字符',
              trigger: 'blur'
            }
          ],
          description: [
            {
              required: true,
              message: '请输入简介',
              trigger: 'blur'
            },
            {
              max: 5000,
              message: '不能超过' + (5000) + '个字符',
              trigger: 'blur'
            }
          ]
        }
        return ret
      },
      title: function () {
        if (this.form.id) {
          return '作者信息修改'
        } else {
          return '作者信息新建'
        }
      }
    },
    components: {
      Uploader
    }
  }
</script>
