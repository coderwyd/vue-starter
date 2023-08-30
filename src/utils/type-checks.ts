export function isUrl(path: string): boolean {
  const reg = /^https?:\/\/([\w-]+\.)+[\w-]+(\/[\w- %&./=?]*)?$/i
  return reg.test(path)
}
export function isEmail(path: string): boolean {
  const reg
    = /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Za-z\-]+\.)+[A-Za-z]{2,}))$/
  return reg.test(path)
}
