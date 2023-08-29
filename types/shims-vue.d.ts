import type { VNode } from 'vue'
import type Vue from 'vue'

declare global {
  declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const Component: DefineComponent<{}, {}, any>
    export default Component

    // export type JSXComponent<Props = any> =
    //   | { new (): ComponentPublicInstance<Props> }
    //   | FunctionalComponent<Props>
  }
  declare module 'virtual:*' {
    const result: any
    export default result
  }

  declare module '*.scss' {
    const scss: Record<string, string>
    export default scss
  }

  declare module '*.tsx' {
    import Vue from 'compatible-vue'
    export default Vue
  }
  namespace JSX {
    type Element = VNode
    type ElementClass = Vue
    interface ElementAttributesProperty {
      $props: any
    }
    interface IntrinsicElements {
      [elem: string]: any
    }
    interface IntrinsicAttributes {
      [elem: string]: any
    }
  }
}
