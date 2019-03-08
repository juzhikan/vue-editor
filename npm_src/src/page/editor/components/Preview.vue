<template>
  <div>
    <Preview :content="content" :key="content"></Preview>
  </div>
</template>
<script>
  import Preview from '@/common/components/Preview'
  export default {
    data () {
      return {}
    },
    computed: {
      content: function () {
        var ps = this.$store.state.paragraphs
        var res = ''
        ps.forEach(p => {
          res += p.content
        })
        return res
      }
    },
    components: {
      Preview
    }
  }
</script>
