type LabelValueOptions = {
  label: string
  value: any
  [key: string]: string | number | boolean
}[]

type RefType<T> = T | null

type EmitType = (event: string, ...args: any[]) => void

type TargetContext = '_self' | '_blank'

type ComponentRef<T extends HTMLElement = HTMLDivElement> =
  ComponentElRef<T> | null

type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>

type ForDataType<T> = {
  [P in T]?: ForDataType<T[P]>
}

type AnyFunction<T> = (...args: any[]) => T

type PropType<T> = VuePropType<T>

type Writable<T> = {
  -readonly [P in keyof T]: T[P]
}

type Nullable<T> = T | null

type Recordable<T = any> = Record<string, T>

interface ReadonlyRecordable<T = any> {
  readonly [key: string]: T
}

interface Indexable<T = any> {
  [key: string]: T
}

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}

type TimeoutHandle = ReturnType<typeof setTimeout>

type IntervalHandle = ReturnType<typeof setInterval>

type Effect = 'light' | 'dark'

interface ChangeEvent extends Event {
  target: HTMLInputElement
}

interface WheelEvent {
  path?: EventTarget[]
}

interface ImportMetaEnv extends ViteEnv {
  __: unknown
}

interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>
}

interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
  $el: T
}

function parseInt(s: string | number, radix?: number): number

function parseFloat(string: string | number): number
