export function isUrl(path) {
  const reg
    // eslint-disable-next-line regexp/no-unused-capturing-group, regexp/no-super-linear-backtracking, regexp/no-useless-quantifier, regexp/no-useless-non-capturing-group, regexp/prefer-w, regexp/no-useless-character-class
    = /(((^https?:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-]*)?\??(?:[-+=&;%@.\w]*)#?(?:[\w]*))?)$/
  return reg.test(path)
}
export function isEmail(val: string) {
  const reg = /^[\w.%+-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}$/i
  return reg.test(val)
}
