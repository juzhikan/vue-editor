<script type="text/javascript">
  const props = {
    value: {
      type: Array,
      required: false,
      default: null
    },
    tagName: {
      type: String,
      required: false,
      default: 'div'
    },
    effectAllowed: {
      type: Boolean,
      required: false,
      default: true
    }
  }

  const draggableComponent = {
    props,
    data () {
      return {
        coordinateStart: {},
        dragTarget: null
      }
    },
    render (h) {
      return h(
        this.tagName,
        {
          on: {
            dragover: this.onDragover,
            drop: this.onDrop
          }
        },
        [
          this.$scopedSlots.default({
            dragstart: this.onDragstart,
            dragenter: this.onDragenter
          })
        ]
      )
    },
    methods: {
      onDragstart () {
        event.dataTransfer.effectAllowed = 'move'
        this.$emit('beforestart', event)
        var target = event.currentTarget
        this.dragTarget = target
      },
      onDragenter () {
        if (this.effectAllowed && event.currentTarget !== this.dragTarget) {
          var dragTargetIndex = this.getOrder(this.dragTarget)
          var targetIndex = this.getOrder(event.currentTarget)
          var dragTargetData = this.value[dragTargetIndex]
          this.value.splice(dragTargetIndex, 1)
          this.value.splice(targetIndex, 0, dragTargetData)
        }
      },
      onDragover () {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
        this.$emit('over', event)
      },
      onDrop (event) {
        event.preventDefault()
        this.$emit('end', event)
      },
      getOrder (node) {
        var children = node.parentNode.children
        for (var i = 0; i < children.length; i++) {
          if (node === children[i]) return i
        }
      }
    }
  }
  module.exports = draggableComponent
</script>

