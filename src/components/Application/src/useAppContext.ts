import type { InjectionKey, Ref } from 'vue'
import { createContext, useContext } from '@/hooks/useContext'

export interface AppProviderContextProps {
  prefixCls?: Ref<string>
  isMobile: Ref<boolean>
}

const key: InjectionKey<AppProviderContextProps> = Symbol(
  'app-provider-context',
)

export function createAppProviderContext(context: AppProviderContextProps) {
  return createContext<AppProviderContextProps>(context, key)
}

export function useAppProviderContext() {
  return useContext<AppProviderContextProps>(key)
}
