import debounce from './debounce.js'
import isObject from './isObject.js'

/**
 * Creates a throttled function that only invokes `func` at most once per
 * 创建一个节流函数，每“wait”毫秒最多调用一次“func”
 * every `wait` milliseconds (or once per browser frame). The throttled function
 * (或每浏览器帧一次)。节流函数
 * comes with a `cancel` method to cancel delayed `func` invocations and a
 * 带有一个' cancel '方法来取消延迟的' func '调用和一个
 * `flush` method to immediately invoke them. Provide `options` to indicate
 * ' flush '方法来立即调用它们。提供' options '来指示
 * whether `func` should be invoked on the leading and/or trailing edge of the
 * ' func '是否应该在' wait '超时的前沿和/或后沿调用。
 * `wait` timeout. The `func` is invoked with the last arguments provided to the
 * ' func '是用提供给节流函数的最后一个参数来调用的。
 * throttled function. Subsequent calls to the throttled function return the
 * 对节流函数的后续调用返回
 * result of the last `func` invocation.
 * 最后一次' func '调用的结果。
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * **注意:**如果' leading '和' trailing '选项为' true '，
 * invoked on the trailing edge of the timeout only if the throttled function
 * 则只有在' wait '超时期间调用了多次throttated函数时，才会在超时的后沿调用' func '。
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * 如果' wait '为' 0 '、' leading '为' false '， ' func '调用将被延迟
 * until the next tick, similar to `setTimeout` with a timeout of `0`.
 * 到the next tick，类似于' setTimeout '的超时为' 0 '。
 *
 * If `wait` is omitted in an environment with `requestAnimationFrame`, `func`
 * 如果在使用requestAnimationFrame的环境中忽略了' wait '， ' func '
 * invocation will be deferred until the next frame is drawn (typically about
 * 调用将被延迟到绘制下一帧(通常约16ms)。
 * 16ms).
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * 查看[David Corbacho的文章](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `throttle` and `debounce`.
 * ，了解“throttle”和“debounce”之间的区别。
 * 
 * 创建一个节流函数，每“wait”毫秒最多调用一次“func”
 * (或每浏览器帧一次)。节流函数
 * 带有一个' cancel '方法来取消延迟的' func '调用和一个
 * ' flush '方法来立即调用它们。提供' options '来指示
 * ' func '是否应该在' wait '超时的前沿和/或后沿调用。
 * ' func '是用提供给节流函数的最后一个参数来调用的。
 * 对节流函数的后续调用返回
 * 最后一次' func '调用的结果。
 * 
 * **注意:**如果' leading '和' trailing '选项为' true '，
 * 则只有在' wait '超时期间调用了多次throttated函数时，才会在超时的后沿调用' func '。
 * 
 * 如果' wait '为' 0 '、' leading '为' false '， ' func '调用将被延迟
 * 到the next tick，类似于' setTimeout '的超时为' 0 '。
 * 
 * 如果在使用requestAnimationFrame的环境中忽略了' wait '， ' func '
 * 调用将被延迟到绘制下一帧(通常约16ms)。
 * 
 * 查看[David Corbacho的文章](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * ，了解“throttle”和“debounce”之间的区别。
 *
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0]
 *  The number of milliseconds to throttle invocations to; if omitted,
 *  限制调用的毫秒数;如果省略，
 *  `requestAnimationFrame` is used (if available).
 *  则使用' requestAnimationFrame '(如果可用)。
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 *  指定在超时的前沿上调用。
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 *  指定在超时后缘上调用。
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * // 避免在滚动时过度更新位置。
 * jQuery(window).on('scroll', throttle(updatePosition, 100))
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * // 在触发click事件时调用' renewToken '，但每5分钟不要超过一次。
 * const throttled = throttle(renewToken, 300000, { 'trailing': false })
 * jQuery(element).on('click', throttled)
 *
 * // Cancel the trailing throttled invocation.
 * // 取消尾随的节流调用。
 * jQuery(window).on('popstate', throttled.cancel)
 */
function throttle(func, wait, options) {
  let leading = true
  let trailing = true

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function')
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading
    trailing = 'trailing' in options ? !!options.trailing : trailing
  }
  return debounce(func, wait, {
    leading,
    trailing,
    'maxWait': wait
  })
}

export default throttle
