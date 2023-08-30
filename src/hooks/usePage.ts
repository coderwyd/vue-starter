import { isNumber } from 'lodash-es'
import { PageEnum } from '@/enums/pageEnum'
import type { RouteLocationRaw, Router } from 'vue-router'

export type PathAsPageEnum<T> = T extends { path: string } ? T & { path: PageEnum } : T
export type RouteLocationRawEx = PathAsPageEnum<RouteLocationRaw> | number

function handleError(e: Error) {
  console.error(e)
}

/**
 * 页面切换
 */
export function useGo(_router?: Router) {
  const router = _router || useRouter()
  const { push, replace } = router
  function go(opt: RouteLocationRawEx = PageEnum.BASE_HOME, isReplace = false) {
    if (!opt)
      return

    if (isNumber(opt)) {
      router.go(opt)
      return
    }
    isReplace ? replace(opt).catch(handleError) : push(opt).catch(handleError)
  }
  return go
}
