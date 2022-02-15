/**
 * Created by zhy on 2016/12/25.
 */
export function stopEvent(e) {
  if (!e) {
    return
  }
  if (e.preventDefault) {
    e.preventDefault()
  }
  if (e.stopPropagation) {
    e.stopPropagation()
  }
}
