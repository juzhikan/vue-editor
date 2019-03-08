<template>
   <div v-if="editMode">
    <div class="pull-right"><el-button @click="sure">确定</el-button><el-button @click="cancel">取消</el-button></div>
     <div style="margin-right: 140px">
     <el-select
    v-model="item"
    filterable
    remote
    placeholder=""
    :remote-method="remoteMethod"
    :loading="loading">
    <el-option
      v-for="item in options"
      :key="item.userId"
      :label="`${item.name}(${item.realName})`"
      :value="JSON.stringify(item)">
    </el-option>
  </el-select>
    </div>
   </div>
   <div v-else class="clearfix">
     <div class="pull-right">
       <el-button @click="toEdit">编辑</el-button>
     </div>
     <div style="margin-right: 100px;word-break: break-all">{{text}}</div>
   </div>

</template>

<script>
  export default {
    data () {
      return {
        options: [],
        item: '',
        loading: false,
        editMode: false,
        text: ''
      }
    },
    props: {
      value: Object
    },
    watch: {
      value: function (val = {}) {
        this.text = val.name ? `${val.name}(${val.realName})` : ''
        this.editMode = false
      }
    },
    computed: {
      userId: function () {
        var data = JSON.parse(this.item)
        return data && data.userId || null
      }
    },
    methods: {
      sure: function () {
        if (!this.userId) {
          this.$message({
            showClose: true,
            message: '不能为空',
            type: 'error'
          })
          return
        }
        this.editMode = false
        var data = JSON.parse(this.item)
        this.text = data.name ? `${data.name}(${data.realName})` : ''
        this.$emit('input', data)
      },
      cancel: function () {
        this.editMode = false
      },
      toEdit: function () {
        this.editMode = true
        this.options = []
        this.item = ''
      },
      getCp: async function (text) {
        var res = await this.$http.get(`/book/getYueduContentProviders.json?name=${text}`)
        return res.body.list
      },
      remoteMethod (query) {
        if (query !== '') {
          this.loading = true
          this.getCp(query).then(list => {
            this.loading = false
            this.options = list.slice(0, 100)
          })
        } else {
          this.options = []
        }
      }
    }
  }
</script>
