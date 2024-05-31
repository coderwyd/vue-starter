<script lang="ts">
import { defineComponent, ref } from 'vue'
import { createBreakpointListen } from '@/hooks/useBreakpoint'
import { createAppProviderContext } from './useAppContext'

export default defineComponent({
  name: 'AppProvider',
  inheritAttrs: false,
  setup(_, { slots }) {
    const isMobile = ref(false)
    createBreakpointListen(({ screenMap, sizeEnum, width }) => {
      const mdWidth = screenMap.get(sizeEnum.MD)
      if (mdWidth)
        isMobile.value = width.value - 1 < mdWidth
    })
    createAppProviderContext({ isMobile })

    return () => slots.default?.()
  },
})
</script>
