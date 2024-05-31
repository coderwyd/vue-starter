import { camelize, kebabCase } from '@/utils'
import type { App, Component, Plugin } from 'vue'

export type SFCWithInstall<T> = T & Plugin

export function withInstall<T extends Component>(component: T, alias?: string) {
  ;(component as SFCWithInstall<T>).install = (app: App): void => {
    const { name } = component
    if (name) {
      app.component(name, component)
      if (name.includes('-'))
        app.component(camelize(`-${name}`), component)
      else app.component(kebabCase(name), component)

      if (alias)
        app.config.globalProperties[alias] = component
    }
  }
  return component as SFCWithInstall<T>
}
