<template>
<div class="navbar navbar-default">
  <div class="container-fluid">
    <div class="navbar-header">
      <a href="/" class="navbar-brand" :title="logoTitle" style="padding: 10px;">
        <img :src="logoUrl" height="30">
      </a>
    </div>
    <div class="collapse navbar-collapse">
      <ul class="nav navbar-nav">
        <li>
          <a href="/book/list.do">书籍列表</a>
        </li>
        <li>
          <a href="/authority/user.do" v-if="permission['AUTHORITY_MANAGE']">用户管理</a>
        </li>
        <li>
          <a href="/user/actions.do">操作日志</a>
        </li>
        <li>
          <a href="/contributor/list.do">书籍贡献者</a>
        </li>
        <li>
          <a href="/import/log.do" v-if="permission['BOOK_MIGRATE']">迁移日志</a>
        </li>
      </ul>
      <ul class="nav navbar-nav navbar-right">
        <li>
          <a href="javascript:;">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                <span class="glyphicon glyphicon-user" style="margin-right: 4px"></span>
                <span :class="{'text-primary':permission['SUPER_ADMIN']}">
                  {{name}}({{username}})
                </span>
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item><div @click="logout">退出登录</div></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </a>
        </li>
      </ul>
    </div>
  </div>
</div>
</template>
<script>
  var username = window.SITE_CONFIG.username
  var name = window.SITE_CONFIG.name
  export default {
    name: 'NavMenu',
    data () {
      return {
        username: username,
        name: name
      }
    },
    computed: {
      permission: function () {
        return window.permission || {}
      },
      logoUrl: function () {
        return window.SITE_CONFIG.logoImage
      },
      logoTitle: function () {
        return window.SITE_CONFIG.logoTitle
      }
    },
    methods: {
      logout () {
        this.$http.post('/logout.json', {}).then(res => {
          window.location.href = '/'
        }).catch(() => {
          this.$message({
            showClose: true,
            message: '网络错误',
            type: 'error'
          })
        })
      }
    }
  }
</script>
<style scoped>
  .dropdown:hover .dropdown-menu{
    display: block;
  }
  .glyphicon {
    position: relative;
    top: 1px;
    display: inline-block;
    font-family: 'Glyphicons Halflings';
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .glyphicon-user:before {
    content: "\e008";
  }
</style>
