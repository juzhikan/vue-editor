<template>
  <div>
    <div class="el-select-dropdown" style="width: 100%">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  import Popper from 'element-ui/lib/utils/vue-popper'

  export default {
    mixins: [Popper],
    data: function () {
      return {}
    }
  }
</script>
