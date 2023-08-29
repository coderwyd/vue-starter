import { withInstall } from '@/utils/with-install'
import _AppProvider from './src/AppProvider.vue'

export { useAppProviderContext } from './src/useAppContext'

export const AppProvider = withInstall(_AppProvider)
