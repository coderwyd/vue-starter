<script lang="ts">
import { defineComponent, ref } from 'vue'
import { createAppProviderContext } from './useAppContext'

export default defineComponent({
  name: 'AppProvider',
  inheritAttrs: false,
  setup(_, { slots }) {
    const isMobile = ref(false)

    createAppProviderContext({ isMobile })

    return () => slots.default?.()
  },
})
</script>
