import isObject from './isObject.js'
// 指向全局对象
import root from './.internal/root.js'

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * 创建一个debound函数，该函数将延迟调用' func '，直到上次调用debound函数后的' wait '毫秒之后，
 * milliseconds have elapsed since the last time the debounced function was
 * invoked, or until the next browser frame is drawn. The debounced function
 * 或者直到绘制下一个浏览器帧。debented函数
 * comes with a `cancel` method to cancel delayed `func` invocations and a
 * 带有一个“cancel”方法来取消延迟的“func”调用和一个
 * `flush` method to immediately invoke them. Provide `options` to indicate
 * “flush”方法来立即调用它们。提供' options '来指示
 * whether `func` should be invoked on the leading and/or trailing edge of the
 * ' func '是否应该在' wait '超时的前沿和/或后沿调用。
 * `wait` timeout. The `func` is invoked with the last arguments provided to the
 * ' func '被使用提供给debound函数的上一个参数来调用。
 * debounced function. Subsequent calls to the debounced function return the
 * 对 debounced 函数的后续调用将返回
 * result of the last `func` invocation.
 * 最后一次' func '调用的结果。
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * **注意:**如果' leading '和' trailing '选项为' true '，则' func '
 * invoked on the trailing edge of the timeout only if the debounced function
 * 只在' wait '超时期间多次调用debounced函数时才会在超时的后缘调用。
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * 如果 wait 为 0 且 leading 为 false，则 ' func '调用将被延迟
 * until the next tick, similar to `setTimeout` with a timeout of `0`.
 * 到 the next tick，类似于 timeout 为 0 的 setTimeout。
 *
 * If `wait` is omitted in an environment with `requestAnimationFrame`, `func`
 * 如果在使用requestAnimationFrame的环境中忽略了' wait '， ' func '
 * invocation will be deferred until the next frame is drawn (typically about
 * 调用将被延迟到绘制下一帧(通常约16ms)。
 * 16ms).
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * 参见[David Corbacho的文章](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `debounce` and `throttle`.
 * ，了解' debounce '和' throttle '之间的区别。
 * 
 * 创建一个debound函数，该函数将延迟调用' func '，直到上次调用debound函数后的' wait '毫秒之后，
 * 或者直到绘制下一个浏览器帧。debented函数
 * 带有一个“cancel”方法来取消延迟的“func”调用和一个
 * “flush”方法来立即调用它们。提供' options '来指示
 * ' func '是否应该在' wait '超时的前沿和/或后沿调用。
 * ' func '使用提供给debound函数的最后一个参数来调用。
 * 对该函数的后续调用将返回
 * 最后一次' func '调用的结果。
 * 
 * **注意:**如果' leading '和' trailing '选项为' true '，则' func '
 * 只在' wait '超时期间多次调用debounced函数时才会在超时的后缘调用。
 * 
 * 如果' wait '为' 0 '、' leading '为' false '， ' func '调用将被延迟
 * 到下一次滴答，类似于' setTimeout '的超时为' 0 '。
 * 
 * 如果在使用requestAnimationFrame的环境中忽略了' wait '， ' func '
 * 调用将被延迟到绘制下一帧(通常约16ms)。
 * 
 * 参见[David Corbacho的文章](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * ，了解' debounce '和' throttle '之间的区别。
 *
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0]
 *  The number of milliseconds to delay; if omitted, `requestAnimationFrame` is
 *  used (if available).
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 *  指定在超时的前沿上调用。
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 *  ' func '被调用前允许延迟的最大时间。
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 *  指定在超时后缘上调用。
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * // 避免在窗口大小变化时进行昂贵的计算。
 * jQuery(window).on('resize', debounce(calculateLayout, 150))
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * // 单击时调用' sendMail '，debouncing 后续调用。
 * jQuery(element).on('click', debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }))
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * // 确保 `batchLog` 在 1 秒的 debounced 调用后被调用一次。
 * const debounced = debounce(batchLog, 250, { 'maxWait': 1000 })
 * const source = new EventSource('/stream')
 * jQuery(source).on('message', debounced)
 *
 * // Cancel the trailing debounced invocation.
 * // 取消尾随的 debounced 调用。
 * jQuery(window).on('popstate', debounced.cancel)
 *
 * // Check for pending invocations.
 * // 检查挂起的调用。
 * const status = debounced.pending() ? "Pending..." : "Ready"
 */
function debounce(func, wait, options) {
  let lastArgs,   // 传给被封装函数的参数，debounced 每次触发都刷新，trailingEdge、invokeFunc 里清除
    // 封装后函数的 this 指向
    lastThis,
    // options.maxWait 与传入的 wait 中的较大值
    maxWait,
    // 传入的被封装函数 func 的调用结果，只有 invokeFunc 调用 func 后会刷新，不会清空
    result,
    // 后缘定时器，leadingEdge 每次执行都赋值，主流程只有 trailingEdge 执行时会清空
    timerId,
    // 返回的封装后函数 debounced 的上次触发时间，每次触发都刷新，只有第一次触发才为空，主流程不再清空
    lastCallTime

  // `maxWait` timer
  let lastInvokeTime = 0
  /* options.leading，时间戳已超时且定时器不存在时，封装后的函数 debounced 被触发后
    是否立即调用被封装函数 func */
  let leading = false
  // options 参数中是否指定了 maxWait 属性
  let maxing = false
  // options.trailing
  let trailing = true

  // Bypass `requestAnimationFrame` by explicitly setting `wait=0`.
  // 是否没传入 wait 且 requestAnimationFrame 可用
  const useRAF = (!wait && wait !== 0 && typeof root.requestAnimationFrame === 'function')

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function')
  }
  wait = +wait || 0
  // import isObject from './isObject.js'
  if (isObject(options)) {
    leading = !!options.leading
    maxing = 'maxWait' in options
    maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait
    trailing = 'trailing' in options ? !!options.trailing : trailing
  }

  /**
   * 调用传入的被封装函数 func，清空传给被封装函数的参数、封装后函数的 this 指向
   * @param {number} time 
   * @returns 传入的被封装函数 func 的调用结果
   */
  function invokeFunc(time) {
    // 获取传给被封装函数的参数
    const args = lastArgs
    // 获取封装后函数的 this 指向
    const thisArg = lastThis

    // 清空传给被封装函数的参数、封装后函数的 this 指向
    lastArgs = lastThis = undefined
    lastInvokeTime = time
    // 使用传给被封装函数的参数调用传入的被封装函数 func
    result = func.apply(thisArg, args)
    return result
  }

  /**
   * setTimeout / requestAnimationFrame
   * @param {Function} pendingFunc 定时器到期后的回调
   * @param {number} wait 封装函数传入的 wait
   * @returns {number} timer ID
   */
  function startTimer(pendingFunc, wait) {
    // 没传入 wait 且 requestAnimationFrame 可用时，采用requestAnimationFrame
    if (useRAF) {
      root.cancelAnimationFrame(timerId)
      return root.requestAnimationFrame(pendingFunc)
    }
    return setTimeout(pendingFunc, wait)
  }

  function cancelTimer(id) {
    if (useRAF) {
      return root.cancelAnimationFrame(id)
    }
    clearTimeout(id)
  }

  /**
   * debounced 被触发时，如果时间戳到时间调用函数且定时器不存在，setTimeout 并根据 options.leading 
   * 判断是否立即调用传入的被封装函数 func
   * @param {number} time 返回的封装后函数 debounced 的触发时间
   * @returns `options.leading ? 调用函数返回的结果 : 上次调用返回的结果`
   */
  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time   // /*?*/ 疑问：不明白为何要在 leadingEdge 里刷新 lastInvokeTime。 答：为了在 leading: false 的时候也能正确判断是否 shouldInvoke，如果只在 invokeFunc 里刷新，则 leading: false 时即使第二次触发还没到 maxWait，time - lastInvokeTime 也可认为必然 > maxWait，shouldInvoke 也会返回 true
    // Start the timer for the trailing edge.
    // 启动后缘定时器。
    timerId = startTimer(timerExpired, wait)
    // Invoke the leading edge.
    // 调用前缘。
    return leading ? invokeFunc(time) : result
  }

  /**
   * 定时器回调中重开定时器时计算剩余等待时长
   * @param {number} time 返回的封装后函数 debounced 的触发时间
   * @returns {Number} 剩余等待时长
   */
  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime
    const timeWaiting = wait - timeSinceLastCall

    return maxing   //如果 options 参数中指定了 maxWait 属性
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting
  }

  /**
   * 判断时间戳是否到时候调用传入的被封装函数 func
   * @param {number} time 封装后函数 debounced 的触发时间
   * @returns {boolean} 是否到时候调用被封装函数 func
   */
  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime

    // Either this is the first call, activity has stopped and we're at the
    // 要么这是第一次调用，活动已经停止，我们处于
    // trailing edge, the system time has gone backwards and we're treating
    // 后缘，系统时间已经倒退，我们将其视为
    // it as the trailing edge, or we've hit the `maxWait` limit.
    // 后缘，要么我们已经达到了' maxWait '限制。
    return (
      lastCallTime === undefined    //若是首次触发封装后的函数 debounced，则直接根据 leading 判断是否调用被封装函数 func
        || (timeSinceLastCall >= wait)
        || (timeSinceLastCall < 0)
        || (maxing && timeSinceLastInvoke >= maxWait)
    )
  }

  /**
   * 定时器到期后的回调
   * @returns {unknown}
   */
  function timerExpired() {
    const time = Date.now()
    if (shouldInvoke(time)) {   //如果执行定时器回调时时间戳超时了（说明定时器等待期间 debounced 没有被触发），就有条件地调用传入的被封装函数 func
      return trailingEdge(time)
    }
    // 如果时间戳还没超时（说明定时器等待期间 debounced 还被触发过），就 setTimeout，等到时间戳超时了再有条件地调用被封装函数 func
    // Restart the timer.
    timerId = startTimer(timerExpired, remainingWait(time))
  }

  /**
   * 定时器回调执行时时间戳超时的操作，清除定时器ID、保存的参数与 this 指向，
   * 有条件地调用传入的被封装函数 func，否则返回之前的调用结果
   * @param {number} time 定时器回调执行时的时间戳
   * @returns 传入的被封装函数 func 调用结果或之前的调用结果
   */
  function trailingEdge(time) {
    // 后缘清除定时器ID
    timerId = undefined

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    // 只有当我们有' lastArgs '时才调用，这意味着' func '已经至少被
    // debounced一次。
    if (trailing && lastArgs) {   //? 疑问：为何要判断 lastArgs
      return invokeFunc(time)
    }
    /* 如果 options.trailing 没被指定为 falsy 值，或 lastArgs 为空，则清空
      传给被封装函数的参数、封装后函数的 this 指向，并返回之前的被封装函数 func 的调用结果 */
    lastArgs = lastThis = undefined   //? 疑问：为什么 trailingEdge 一定要清除 lastArgs 而 leadingEdge 只有执行 func 才清除
    return result
  }

  function cancel() {
    if (timerId !== undefined) {
      cancelTimer(timerId)
    }
    lastInvokeTime = 0
    lastArgs = lastCallTime = lastThis = timerId = undefined
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now())
  }

  function pending() {
    return timerId !== undefined
  }

  /**
   * 封装操作返回的函数
   * @param  {...any} args 传给被封装函数的参数
   * @returns {Function} 返回封装好的函数
   */
  function debounced(...args) {
    // 封装后函数 debounced 的触发时间
    const time = Date.now()
    // 时间戳是否到时间调用被封装函数 func
    const isInvoking = shouldInvoke(time)

    // 获取传给被封装函数的参数
    lastArgs = args
    // 获取封装后函数的 this 指向
    lastThis = this
    // 刷新封装后函数 debounced 的上次触发时间
    lastCallTime = time

    if (isInvoking) {
      /* leadingEdge部分：
        如果时间戳到时间调用被封装函数 func，且不存在定时器（
          意味着：
            1. 封装返回的函数 debounced 首次被触发，
            2. 或 trailingEdge 执行过
        ），则 setTimeout 并根据 options.leading 判断是否立即调用传入的被封装函数 func */
      if (timerId === undefined) {
        return leadingEdge(lastCallTime)
      }
      /* 节流部分：
        如果时间戳到时间调用被封装函数 func，但定时器还存在，（意味着是节流的判断结果为 true）
        且 options 中指定了 maxWait，
        则以 wait 时长 setTimeout 刷新定时器，并立即调用一次被封装函数 func */
      if (maxing) {
        // Handle invocations in a tight loop.
        // 在一个紧密循环中处理调用。
        timerId = startTimer(timerExpired, wait)
        return invokeFunc(lastCallTime)
      }
      // 如果进了这个块但是没进上面两个块，则属于系统时间回拨情况，下面的 if 也不会符合，直接到 return
    }
    /* 如果时间戳还没到时间调用被封装函数 func，且不存在定时器，（
      意味着定时器回调调用过 trailingEdge，且封装返回的函数 debounced 不是首次被触发，
      即 trailing 被 cancel 掉了
    ）就 setTimeout */
    if (timerId === undefined) {
      timerId = startTimer(timerExpired, wait)    //? 疑问：为什么不像 leadingEdge 一样刷新 lastInvokeTime 并根据 leading 判断是否执行 invokeFunc？
    }
    /* 如果时间戳还没到时间调用被封装函数 func 或（
      时间戳到了时间调用 func，且定时器存在且 options 中没指定 maxWait（系统时间回拨）
    ），就直接返回之前的调用结果  */
    return result
  }
  debounced.cancel = cancel
  debounced.flush = flush
  debounced.pending = pending
  return debounced
}

export default debounce
