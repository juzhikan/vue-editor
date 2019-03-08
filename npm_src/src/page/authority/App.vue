<template>
  <div class="authority">
    <NavMenu></NavMenu>
    <ul class="tabs">
      <router-link tag="li" class="tab-item" to="user"><div class="active-bar"></div>用户管理</router-link>
      <router-link tag="li" class="tab-item" to="role"><div class="active-bar"></div>权限管理</router-link>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
import NavMenu from '@/common/components/NavMenu'
export default {
  data () {
    return {

    }
  },
  components: {
    NavMenu
  }
}
</script>

<style>
.authority {
  width: 90%;
  margin: 0 auto;
}
.tabs {
  border-bottom: 1px solid #d1dbe5;
  padding: 0;
  position: relative;
  margin: 0 0 15px;
}
.tab-item {
  padding: 0 16px;
  height: 42px;
  box-sizing: border-box;
  line-height: 42px;
  display: inline-block;
  list-style: none;
  font-size: 14px;
  color: #8391a5;
  position: relative;
  cursor: pointer;
}
.tab-item.router-link-Active{
  color: #20a0ff;
}
.active-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: #20a0ff;
  z-index: 1;
  transition: transform .3s cubic-bezier(.645,.045,.355,1);
  list-style: none;
}
.router-link-Active .active-bar{
  width: 100%;
}
</style>
