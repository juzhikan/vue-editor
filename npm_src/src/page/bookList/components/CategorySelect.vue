<template>
<el-select v-model="id" placeholder="请选择" v-if="isGroup">
    <el-option-group v-for="parent in parents" :key="parent.id" :label="parent.name">
      <el-option v-for="item in parent.items" :key="item.id" :value="item.id" :label="item.name"></el-option>
    </el-option-group>
</el-select>
<el-select v-model="id" placeholder="请选择" v-else>
  <el-option v-for="item in lists" :value="item.id" :key="item.id" :label="item.name"></el-option>
</el-select>
</template>
<script>
  export default {
    data () {
      return {
        id: null,
        parents: [],
        lists: [],
        isGroup: false
      }
    },
    props: {
      list: Array,
      value: Number
    },
    methods: {
      getData: function () {
        var data = this.getDataById(this.id)
        return data
      },
      getDataById: function (id) {
        var ret = {}
        if (this.isGroup) {
          this.parents.forEach(parent => {
            parent.items.forEach(item => {
              if (item.id === id) {
                ret = item
                return false
              }
            })
            if (ret) return false
          })
          return ret
        } else {
          this.lists.forEach(item => {
            if (item.id === id) {
              ret = item
              return false
            }
          })
          return ret
        }
      },
      _resetId () {
        let data = this.getDataById(this.id)
        if (Object.keys(data).length === 0) {
          this.id = null
        }
      }
    },
    computed: {
      props () {
        return {
          value: this.value,
          list: this.list
        }
      }
    },
    watch: {
      props: function (props) {
        let { value, list } = props
        var parents = []
        var lists = []
        list.forEach(item => {
          if (item.disabled) {
            parents.push({
              items: [],
              ...item
            })
          } else {
            var len = parents.length
            if (len > 0) {
              parents[len - 1].items.push({
                ...item
              })
            } else {
              lists.push({
                ...item
              })
            }
          }
        })
        this.parents = parents
        this.lists = lists
        this.isGroup = this.parents.length > 0

        this.id = value
        this._resetId()
      },

      id: function (val) {
        this.$emit('input', val)
        this.$emit('change', this.getDataById(val))
      }
    }
  }
</script>
