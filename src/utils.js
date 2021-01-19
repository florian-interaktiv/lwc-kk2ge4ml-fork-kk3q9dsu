// import { ShowToastEvent } from "lightning/platformShowToastEvent";
import {
  has,
  hasArray,
  isArray,
  isEmpty,
  isFunction,
  isInstance,
  isNumber,
  isObject,
  isString,
  entriesOf
} from "./types";

// import lang from '@salesforce/i18n/lang';
const lang = 'en';

/**
 * Classnames port from https://github.com/JedWatson/classnames/blob/master/index.js
 *
 * @param {String/Object} classArgument - If the value associated with a given key is falsy, that key won't be included in the output
 * @returns {String} - The joined class names string
 */
export const classnames = classArgument => {
  let classes = [];
  const hasOwn = {}.hasOwnProperty;

  const arg = classArgument;
  const argType = typeof arg;

  if (argType === "string" || argType === "number") {
    classes = [arg];
  }

  if (Array.isArray(arg)) {
    classes = [...arg];
  }

  if (argType === "object") {
    classes = Object.entries(arg)
      .filter(([key, value]) => hasOwn.call(arg, key) && !!value)
      .map(([key]) => key);
  }

  return classes.join(" ");
};

/**
 * Generates a random ID
 *
 * @returns {String} - The generated id
 */
export function genericId() {
  return (Math.random() * 10000 + 10000).toString(16);
}

export function keyGenerator() {
  return { key: genericId() };
}

/**
 * Returns sorting by index.
 *
 * @param {*} a - The first element for comparison
 * @param {*} b - The second element for comparison
 * @returns {Number} - The sort order
 */
export function sortIndex(a, b) {
  return a.Index__c - b.Index__c;
}

/**
 * Currying function to create functions that
 * sort by a given field.
 * 
 * @param {String} fieldName The name of the field which should be sorted
 */
export const sortByField = fieldName => (a, b) => ((a[fieldName] || 0) - (b[fieldName] || 0));

export function defer(func) {
  delay(func);
}

export function delay(func, wait = 1) {
  // eslint-disable-next-line @lwc/lwc/no-async-operation
  setTimeout(func, wait);
}

export const omit = (obj, arr) =>
  Object.keys(obj)
    .filter(k => !arr.includes(k))
    .reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked, or until the next browser frame is drawn. The debounced function
 * comes with a `cancel` method to cancel delayed `func` invocations and a
 * `flush` method to immediately invoke them. Provide `options` to indicate
 * whether `func` should be invoked on the leading and/or trailing edge of the
 * `wait` timeout. The `func` is invoked with the last arguments provided to the
 * debounced function. Subsequent calls to the debounced function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * If `wait` is omitted in an environment with `requestAnimationFrame`, `func`
 * invocation will be deferred until the next frame is drawn (typically about
 * 16ms).
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `debounce` and `throttle`.
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
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', debounce(calculateLayout, 150))
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }))
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * const debounced = debounce(batchLog, 250, { 'maxWait': 1000 })
 * const source = new EventSource('/stream')
 * jQuery(source).on('message', debounced)
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel)
 *
 * // Check for pending invocations.
 * const status = debounced.pending() ? "Pending..." : "Ready"
 */
// eslint-disable-next-line max-lines-per-function
export function debounce(func, wait, options) {
  let lastArgs, lastThis, maxWait, result, timerId, lastCallTime;

  let lastInvokeTime = 0;
  let leading = false;
  let maxing = false;
  let trailing = true;

  // Bypass `requestAnimationFrame` by explicitly setting `wait=0`.
  const useRAF =
    !wait && wait !== 0 && typeof requestAnimationFrame === "function";

  if (typeof func !== "function") throw new TypeError("Expected a function");

  const timeToWait = +wait || 0;

  if (isObject(options)) {
    leading = !!options.leading;
    maxing = "maxWait" in options;
    maxWait = maxing ? Math.max(+options.maxWait || 0, timeToWait) : maxWait;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = undefined;
    lastThis = undefined;

    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function startTimer(pendingFunc, waitFor) {
    if (useRAF) {
      cancelAnimationFrame(timerId);

      // eslint-disable-next-line @lwc/lwc/no-async-operation
      return requestAnimationFrame(pendingFunc);
    }
    // eslint-disable-next-line @lwc/lwc/no-async-operation
    return setTimeout(pendingFunc, waitFor);
  }

  function cancelTimer(id) {
    if (useRAF) return cancelAnimationFrame(id);
    return clearTimeout(id);
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = startTimer(timerExpired, timeToWait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= timeToWait ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= maxWait)
    );
  }

  // eslint-disable-next-line consistent-return
  function timerExpired() {
    const time = Date.now();

    if (shouldInvoke(time)) return trailingEdge(time);

    // Restart the timer
    timerId = startTimer(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) return invokeFunc(time);

    lastArgs = undefined;
    lastThis = undefined;

    return result;
  }

  function cancel() {
    if (timerId !== undefined) cancelTimer(timerId);

    lastInvokeTime = 0;
    lastArgs = undefined;
    lastCallTime = undefined;
    lastThis = undefined;
    timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now());
  }

  function pending() {
    return timerId !== undefined;
  }

  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) return leadingEdge(lastCallTime);

      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = startTimer(timerExpired, timeToWait);
        return invokeFunc(lastCallTime);
      }
    }

    if (timerId === undefined) timerId = startTimer(timerExpired, timeToWait);

    return result;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;
  debounced.pending = pending;

  return debounced;
}

/**
 * Creates a function that invokes `func`, with the `this` binding and arguments
 * of the created function, while it's called less than `n` times. Subsequent
 * calls to the created function return the result of the last `func` invocation.
 *
 * @param {number} n The number of calls at which `func` is no longer invoked.
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * jQuery(element).on('click', before(5, addContactToList))
 * // => Allows adding up to 4 contacts to the list.
 */
export function before(n, func) {
  let result;

  if (typeof func != "function") throw new TypeError("Expected a function");

  return function beforeInternal(...args) {
    if (--n > 0) result = func.apply(this, args);
    if (n <= 1) func = undefined;
    return result;
  };
}

/**
 * Creates a function that is restricted to invoking `func` once. Repeat calls
 * to the function return the value of the first invocation. The `func` is
 * invoked with the `this` binding and arguments of the created function.
 *
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * const initialize = once(createApplication)
 * initialize()
 * initialize()
 * // => `createApplication` is invoked once
 */
export function once(func) {
  return before(2, func);
}

export function handleDataServiceError(context, err = {}) {
  // eslint-disable-next-line no-console
  console.error("Data service error occurred:", err);

  let errorObject = err;

  if (isInstance(err, Error)) {
    errorObject = {
      body: {
        message: err.toString()
      }
    };
  }

  const { body = {} } = errorObject;

  let message = "Unknown error";

  if (isArray(body)) {
    message = body.map(e => e.message).join(", ");
  } else if (isString(body.message)) {
    ({ message } = body);
  }

  /* context.dispatchEvent(
    new ShowToastEvent({
      title: `Error`,
      message,
      variant: "error"
    })
  ); */
}

/**
 * Runs tasks in sequence. All tasks should return a Promise.
 *
 * @param {Function[]} tasks - The tasks to run
 * @returns {Promise} - A promise that resolves if all tasks have resolve
 */
export function promiseAllSerial(tasks) {
  if (Array.isArray(tasks) === false) return Promise.resolve();

  return tasks
    .filter(Boolean)
    .reduce((future, next) => future.then(() => next()), Promise.resolve());
}

/**
 * Turns a JSON like object argument to param query string
 *
 * @public
 * @param {Object} obj - The query data as a key,value map
 * @param {string} prefix - A prefix for the query keys
 * @returns {string} - Returns the serialized string
 */
export function serialize(obj, prefix) {
  return Object.keys(obj)
    .filter(property => Object.prototype.hasOwnProperty.call(obj, property))
    .map(property => {
      // Fetch value and add prefix to key
      const key = prefix ? `${prefix}[${property}]` : property;
      const value = obj[property];

      // Call self recursively or add key/value pair
      if (typeof value === "object") return serialize(value, key);

      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join("&");
}

export function encodeData(obj, url = "") {
  // Remove all falsey values (false, null, 0, "", undefined, and NaN)
  const cleandedParams = Object.keys(obj)
    .filter(prop => !!obj[prop])
    .map(prop => ({ [prop]: obj[prop] }))
    .reduce((cleaned, prop) => Object.assign({}, cleaned, prop), {});

  if (isEmpty(cleandedParams)) return url;

  const queryParamSeparator = url.indexOf("?") > -1 ? "&" : "?";

  return `${url}${queryParamSeparator}${serialize(cleandedParams)}`;
}

export function preciseRound(num, dec) {
  if (isNumber(num) === false || isNumber(dec) === false) return num;

  const numSign = num >= 0 ? 1 : -1;

  return parseFloat(
    (Math.round(num * 10 ** dec + numSign * 0.0001) / 10 ** dec).toFixed(dec)
  );
}

/**
 * An emitter implementation based on the Node.js EventEmitter API:
 * https://nodejs.org/dist/latest-v6.x/docs/api/events.html#events_class_eventemitter
 **/
export class EventEmitter {
  constructor() {
    this.registry = {};
  }

  /**
   * Registers a listener on the emitter
   *
   * @method EventEmitter#on
   * @param {String} name - The name of the event
   * @param {Function} listener - The callback function
   * @return {EventEmitter} - Returns a reference to the `EventEmitter` so that * calls can be chained
   **/
  on(name, listener) {
    this.registry[name] = this.registry[name] || [];
    this.registry[name].push(listener);
    return this;
  }
  /**
   * Registers a listener on the emitter that only executes once
   *
   * @method EventEmitter#once
   * @param {String} name - The name of the event
   * @param {Function} listener - The callback function
   * @return {EventEmitter} - Returns a reference to the `EventEmitter` so that * calls can be chained
   **/
  once(name, listener) {
    const doOnce = (...args) => {
      listener(...args);
      this.removeListener(name, doOnce);
    };

    this.on(name, doOnce);
    return this;
  }

  /**
   * Synchronously calls each listener registered with the specified event
   *
   * @method EventEmitter#emit
   * @param {String} name - The name of the event
   * @return {Boolean} - Returns `true` if the event had listeners, `false` otherwise
   **/
  emit(name, ...args) {
    const listeners = this.registry[name];
    let count = 0;

    if (listeners) {
      listeners.forEach(listener => {
        count += 1;
        listener(...args);
      });
    }

    return count > 0;
  }

  /**
   * Removes the specified `listener` from the listener array for the event  named `name`
   *
   * @method EventEmitter#removeListener
   * @param {String} name - The name of the event
   * @param {Function} listener - The callback function
   * @return {EventEmitter} - Returns a reference to the `EventEmitter` so that calls can be chained
   **/
  removeListener(name, listener) {
    const listeners = this.registry[name];

    if (listeners == null) return this;

    for (let i = 0, len = listeners.length; i < len; i += 1) {
      if (listeners[i] === listener) {
        listeners.splice(i, 1);
        return this;
      }
    }

    return this;
  }
}

/**
 * Add an event listener.
 *
 * @param {HTMLDOMElement|SVGElement|Object} element The element or object to add a listener to. It can be a
 * @param {string} type A case-sensitive string representing the event type to listen for.
 * @param {Function} listener The function callback to execute when the event is fired.
 * @param {Object} [options] Options for adding the event.
 * @returns {Function} A callback function to remove the added event.
 */
export function addEvent(element, type, listener, options = {}) {
  let events;

  // If we're setting events directly on the constructor, use a separate
  // collection, `protoEvents` to distinguish it from the item events in
  // `lwcEvents`.
  if (typeof element === "function" && element.prototype) {
    element.prototype.protoEvents = element.prototype.protoEvents || {};
    events = element.prototype.protoEvents;
  } else {
    element.lwcEvents = element.lwcEvents || {};
    events = element.lwcEvents;
  }

  // Handle DOM events
  if (element.addEventListener) element.addEventListener(type, listener, false);

  if (hasArray(events, type) === false) events[type] = [];

  const eventObject = {
    listener,
    order: typeof options.order === "number" ? options.order : Infinity
  };

  events[type] = [...events[type], eventObject];

  // Order the calls
  events[type].sort((a, b) => a.order - b.order);

  // Return a function that can be called to remove this event.
  return () => removeEvent(element, type, listener);
}

/**
 * Remove an event that was added with {@link addEvent}.
 *
 * @param {HTMLDOMElement|SVGElement|Object} element The element to remove events from.
 * @param {string} [type] The type of events to remove. If undefined, all events are removed from the element.
 * @param {Function} [listener] The specific callback to remove. If undefined, all events that match the element and optionally the type are removed.
 */
export function removeEvent(element, type, listener) {
  /**
   * @private
   * @param {string} _type The event type
   * @param {Function} _listener The event callback
   */
  const removeOneEvent = (_type, _listener) => {
    if (element.removeEventListener) {
      element.removeEventListener(_type, _listener, false);
    }
  };

  /**
   * @private
   * @param {Object[]} eventCollection The collection holding the events/listeners
   */
  const removeAllEvents = eventCollection => {
    // Break on non-DOM events
    if (!element.nodeName) return;

    const types = type ? { [type]: true } : eventCollection;

    entriesOf(types)
      .filter(([key]) => has(eventCollection, key))
      .forEach(([key]) => {
        eventCollection[key].forEach(event =>
          removeOneEvent(key, event.listener)
        );
      });
  };

  ["protoEvents", "lwcEvents"].forEach(collectionName => {
    const eventCollection = element[collectionName];

    if (eventCollection == null) return;

    if (type) {
      const events = eventCollection[type] || [];

      if (listener) {
        eventCollection[type] = events.filter(obj => listener !== obj.listener);

        removeOneEvent(type, listener);
        return;
      }

      removeAllEvents(eventCollection);
      eventCollection[type] = [];
      return;
    }

    removeAllEvents(eventCollection);
    element[collectionName] = {};
  });
}

export const groupBy = (xs, key) => {
  return xs.reduce((rv, x) => {
    const v = isFunction(key) ? key(x) : x[key];
    (rv[v] = rv[v] || []).push(x);
    return rv;
  }, {});
};

export const sumBy = (arr, fn) =>
  arr
    .map(isFunction(fn) ? fn : val => val[fn])
    .reduce((acc, val) => acc + val, 0);

export const getNameByLanguage = () => {};

export const debounce2 = (func, isEvent = false, timeout = 400) => {
  let internalTimer;

  return (payload) => {
    clearTimeout(internalTimer);

    const calleeArguments = isEvent ? { value: payload.target.value } : payload;

    console.log(calleeArguments);

    internalTimer = window.setTimeout(() => func(calleeArguments), timeout);
  }
}