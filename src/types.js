/**
 * Returns the keys of an object of type `T`. This is like `Object.keys` except the return type
 * captures the known keys of `T`.
 *
 * Note that it is the responsibility of the caller to use this wisely -- there are cases where
 * the runtime set of keys returned may be broader than the type checked set at compile time,
 * so there's potential for this to be abused in ways that are not inherently type safe. For
 * example, given base class `Animal`, subclass `Fish`, and `const animal: Animal = new Fish();`
 * then `keysOf(animal)` will not type-check the entire set of keys of the object `animal` since
 * it is actually an instance of type `Fish`, which has an extended property set.
 *
 * In general, it should be both convenient and type-safe to use this when enumerating the keys
 * of simple data objects with known properties.
 *
 * ```
 * interface Point { x: number; y: number; }
 * const point: Point = { x: 1, y: 2 };
 * const keys = keysOf(point);
 * // type of keys -> ('a' | 'b')[]
 * for (const key of keys) {
 *   console.log(key, point[key]);
 * }
 * // x 1
 * // y 2
 * ```
 *
 * @param {Object} obj The object of interest.
 * @returns {Array} keys
 */
export function keysOf(obj) {
  return Object.keys(obj || {});
}

/**
 * Returns the entries of an object of type `T`. This is like `Object.entries` except the return type
 * captures the known keys and value types of `T`.
 *
 * Note that it is the responsibility of the caller to use this wisely -- there are cases where
 * the runtime set of entries returned may be broader than the type checked set at compile time,
 * so there's potential for this to be abused in ways that are not inherently type safe. For
 * example, given base class `Animal`, subclass `Fish`, and `const animal: Animal = new Fish();`
 * then `entriesOf(animal)` will not type-check the entire set of keys of the object `animal` since
 * it is actually an instance of type `Fish`, which has an extended property set.
 *
 * In general, it should be both convenient and type-safe to use this when enumerating the entries
 * of simple data objects with known properties.
 *
 * ```
 * interface Point { x: number; y: number; }
 * const point: Point = { x: 1, y: 2 };
 * // type of entries -> ['x' | 'y', number][]
 * const entries = entriesOf(point);
 * for (const entry of entries) {
 *   console.log(entry[0], entry[1]);
 * }
 * // x 1
 * // y 2
 * ```
 *
 * @param {Object} obj The object of interest.
 * @returns {Array} An array of the given object's own enumerable string-keyed property [key, value] pairs
 */
export function entriesOf(obj) {
  return Object.entries(obj || {});
}

/**
 * Returns the values of an object of type `T`. This is like `Object.values` except the return type
 * captures the possible value types of `T`.
 *
 * Note that it is the responsibility of the caller to use this wisely -- there are cases where
 * the runtime set of values returned may be broader than the type checked set at compile time,
 * so there's potential for this to be abused in ways that are not inherently type safe. For
 * example, given base class `Animal`, subclass `Fish`, and `const animal: Animal = new Fish();`
 * then `valuesOf(animal)` will not type-check the entire set of values of the object `animal` since
 * it is actually an instance of type `Fish`, which has an extended property set.
 *
 * In general, it should be both convenient and type-safe to use this when enumerating the values
 * of simple data objects with known properties.
 *
 * ```
 * interface Point { x: number; y: number; }
 * const point: Point = { x: 1, y: 2 };
 * const values = valuesOf(point);
 * // type of values -> number[]
 * for (const value of values) {
 *   console.log(value);
 * }
 * // 1
 * // 2
 * ```
 *
 * @param {Object} obj The object of interest.
 * @returns {Array} An array containing the given object's own enumerable property values.
 */
export function valuesOf(obj) {
  return Object.values(obj || {});
}

/**
 * Returns an array of all `string` keys in an object of type `T` whose values are neither `null` nor `undefined`.
 * This can be convenient for enumerating the keys of definitely assigned properties in an object or `Dictionary`.
 *
 * See also caveats outlined in {@link keysOf}.
 *
 * @param {Object} obj The object of interest.
 * @returns {Array} An array of all string keys in given object whose values neither `null` nor `undefined`.
 */
export function definiteKeysOf(obj) {
  return definiteEntriesOf(obj).map(entry => entry[0]);
}

/**
 * Returns an array of all entry tuples of type `[K, NonNullable<T[K]>]` in an object `T` whose values are neither
 * `null` nor `undefined`. This can be convenient for enumerating the entries of unknown objects with optional properties
 * (including `Dictionary`s) without worrying about performing checks against possibly `undefined` or `null` values.
 *
 * See also caveats outlined in {@link entriesOf}.
 *
 * @param {Object} obj The object of interest.
 * @returns {Array} Returns an array of all entry tuples in an object whose values are neither `null` nor `undefined`.
 */
export function definiteEntriesOf(obj) {
  return entriesOf(obj).filter(entry => entry[1] != null);
}

/**
 * Returns an array of all values of type `T` in an object `T` for values that are neither `null` nor `undefined`.
 * This can be convenient for enumerating the values of unknown objects with optional properties (including
 * `Dictionary`s) without worrying about performing checks against possibly `undefined` or `null` values.
 *
 * @param {Object} obj The object of interest.
 * @returns {Array} An array of all values in an object for values that are neither `null` nor `undefined`.
 */
export function definiteValuesOf(obj) {
  return definiteEntriesOf(obj).map(entry => entry[1]);
}

// Is ********************************************************************** //

/**
 * Tests whether an `unknown` value is a `string`.
 *
 * @param {*} value The value to test.
 * @returns {boolean} Returns true if is a string otherwise false
 */
export function isString(value) {
  return typeof value === 'string';
}

/**
 * Tests whether an `unknown` value is a `number`.
 *
 * @param {*} value The value to test.
 * @returns {boolean} Returns true if is a number otherwise false
 */
export function isNumber(value) {
  return typeof value === 'number';
}

/**
 * Tests whether an `unknown` value is a `boolean`.
 *
 * @param {*} value The value to test.
 * @returns {boolean} Returns true if is a boolean
 */
export function isBoolean(value) {
  return typeof value === 'boolean';
}

/**
 * Tests whether an `unknown` value is an `Object` subtype (e.g., arrays, functions, objects, regexes,
 * new Number(0), new String(''), and new Boolean(true)). Tests that wish to distinguish objects that
 * were created from literals or that otherwise were not created via a non-`Object` constructor and do
 * not have a prototype chain should instead use {@link isPlainObject}.
 *
 * @param {*} value The value to test.
 * @returns {boolean} Returns true if is an object
 */
export function isObject(value) {
  return (
    value != null && (typeof value === 'object' || typeof value === 'function')
  );
}

/**
 * Tests whether or not an `unknown` value is a plain JavaScript object. That is, if it is an object created
 * by the Object constructor or one with a null `prototype`.
 *
 * @param {*} value The value to test.
 * @returns {boolean} Returns true if is a plain JS object (null proto or object constructor)
 */
export function isPlainObject(value) {
  const isObjectObject = o => {
    return (
      isObject(o) && Object.prototype.toString.call(o) === '[object Object]'
    );
  };
  if (!isObjectObject(value)) return false;
  const ctor = value.constructor;
  if (!isFunction(ctor)) return false;
  if (!isObjectObject(ctor.prototype)) return false;
  if (!ctor.prototype.hasOwnProperty('isPrototypeOf')) return false;
  return true;
}

/**
 * Tests whether an `unknown` value is a instance of `ctor`.
 *
 * @param {*} value The value to test.
 * @param {*} ctor The class to test against
 * @returns {boolean} Returns true if is instance of ctor
 */
export function isInstance(value, ctor) {
  return value instanceof ctor;
}

/**
 * Tests whether an `unknown` value is a class constructor that is either equal to or extends another class
 * constructor.
 *
 * @param {*} value The value to test.
 * @param {*} cls The class to test against.
 * @returns {boolean} If is class or extends
 */
export function isClassAssignableTo(value, cls) {
  // Avoid circular dependency with has.ts
  return (
    value === cls || (has(value, 'prototype') && value.prototype instanceof cls)
  );
}

/**
 * Tests whether an `unknown` value is an `Array`.
 *
 * @param {*} value The value to test.
 * @returns {boolean} Returns true for array
 */
export function isArray(value) {
  return Array.isArray(value);
}

/**
 * Tests whether an `unknown` value conforms to {@link AnyArrayLike}.
 *
 * @param {*} value The value to test.
 * @returns {boolean} Returns true for an array like obj
 */
export function isArrayLike(value) {
  // Avoid circular dependency with has.ts
  const hasLength = v => isObject(v) && 'length' in v;
  return !isFunction(value) && (isString(value) || hasLength(value));
}

/**
 * Tests whether an `unknown` value is a `function`.
 *
 * @param {*} value The value to test.
 * @returns {boolean} Returns true if is a function
 */
export function isFunction(value) {
  return typeof value === 'function';
}

/**
 * Tests whether `unknown` value is a valid JSON type. Note that objects and
 * arrays are only checked using a shallow test. To be sure that a given value
 * is JSON-compatible at runtime, see {@link toAnyJson}.
 *
 * @param {*} value The value to test.
 * @returns {boolean} Returns true if is a valid JSON type
 */
export function isAnyJson(value) {
  return (
    value === null ||
    isString(value) ||
    isNumber(value) ||
    isBoolean(value) ||
    isPlainObject(value) ||
    isArray(value)
  );
}

/**
 * Tests whether an `AnyJson` value is an object.
 *
 * @param {*} value The value to test.
 * @returns {Boolean} Returns true if value is an object
 */
export function isJsonMap(value) {
  return isPlainObject(value);
}

/**
 * Tests whether an `AnyJson` value is an array.
 *
 * @param {*} value The value to test.
 * @returns {Boolean} Returns true if value is an array
 */
export function isJsonArray(value) {
  return isArray(value);
}

/**
 * Tests whether or not a `key` string is a key of the given object type `T`.
 *
 * @param {Object} obj The target object to check the key in.
 * @param {String} key The string to test as a key of the target object.
 * @returns {boolean} Returns true if key is a key of obj
 */
export function isKeyOf(obj, key) {
  return Object.keys(obj).includes(key);
}

// Internal **************************************************************** //

/**
 * Returns the given `value` if not either `undefined` or `null`, or the given
 * `defaultValue` otherwise if defined.
 * Returns `null` if the value is `null` and `defaultValue` is `undefined`.
 *
 * @ignore
 * @param {*} value The value to test.
 * @param {*} defaultValue The default to return if `value` was not defined.
 * @returns {*} value
 */
export function valueOrDefault(value, defaultValue) {
  return value != null || defaultValue === undefined ? value : defaultValue;
}

// Has ********************************************************************* //

/**
 * Tests whether a value of type `T` contains one or more property `keys`. If so, the type of the tested value is
 * narrowed to reflect the existence of those keys for convenient access in the same scope. Returns false if the
 * property key does not exist on the target type, which must be an object. Returns true if the property key exists,
 * even if the associated value is `undefined` or `null`.
 *
 * ```
 * // type of obj -> unknown
 * if (has(obj, 'name')) {
 *   // type of obj -> { name: unknown }
 *   if (has(obj, 'data')) {
 *     // type of obj -> { name: unknown } & { data: unknown }
 *   } else if (has(obj, ['error', 'status'])) {
 *     // type of obj -> { name: unknown } & { error: unknown, status: unknown }
 *   }
 * }
 * ```
 *
 * @param {Object} value The value to test.
 * @param {String} keys One or more `string` keys to check for existence.
 * @returns {boolean} Returns true if a value contains one or more prop keys
 */
export function has(value, keys) {
  return (
    isObject(value) &&
    (isArray(keys) ? keys.every(k => k in value) : keys in value)
  );
}

/**
 * Tests whether a value of type `T` contains a property `key` of type `string`. If so, the type of the tested value is
 * narrowed to reflect the existence of that key for convenient access in the same scope. Returns `false` if the
 * property key does not exist on the object or the value stored by that key is not of type `string`.
 *
 * ```
 * // type of obj -> unknown
 * if (hasString(obj, 'name')) {
 *   // type of obj -> { name: string }
 *   if (hasString(obj, 'message')) {
 *     // type of obj -> { name: string } & { message: string }
 *   }
 * }
 * ```
 *
 * @param {Object} value The value to test.
 * @param {String} key A `string` key to check for existence.
 * @returns {boolean} Returns true if a value contains prop of type string
 */
export function hasString(value, key) {
  return has(value, key) && isString(value[key]);
}

/**
 * Tests whether a value of type `T` contains a property `key` of type `number`. If so, the type of the tested value is
 * narrowed to reflect the existence of that key for convenient access in the same scope. Returns `false` if the
 * property key does not exist on the object or the value stored by that key is not of type `number`.
 *
 * ```
 * // type of obj -> unknown
 * if (hasNumber(obj, 'offset')) {
 *   // type of obj -> { offset: number }
 *   if (hasNumber(obj, 'page') && hasArray(obj, 'items')) {
 *     // type of obj -> { offset: number } & { page: number } & { items: unknown[] }
 *   }
 * }
 * ```
 *
 * @param {Object} value The value to test.
 * @param {String} key A `number` key to check for existence.
 * @returns {boolean} Returns true if a value contains prop of type number
 */
export function hasNumber(value, key) {
  return has(value, key) && isNumber(value[key]);
}

/**
 * Tests whether a value of type `T` contains a property `key` of type `boolean`. If so, the type of the tested value is
 * narrowed to reflect the existence of that key for convenient access in the same scope. Returns `false` if the
 * property key does not exist on the object or the value stored by that key is not of type `boolean`.
 *
 * ```
 * // type of obj -> unknown
 * if (hasBoolean(obj, 'enabled')) {
 *   // type of obj -> { enabled: boolean }
 *   if (hasBoolean(obj, 'hidden')) {
 *     // type of obj -> { enabled: boolean } & { hidden: boolean }
 *   }
 * }
 * ```
 *
 * @param {Object} value The value to test.
 * @param {String} key A `boolean` key to check for existence.
 * @returns {boolean} Returns true if a value contains prop of type boolean
 */
export function hasBoolean(value, key) {
  return has(value, key) && isBoolean(value[key]);
}

/**
 * Tests whether a value of type `T` contains a property `key` of type `object`. If so, the type of the tested value is
 * narrowed to reflect the existence of that key for convenient access in the same scope. Returns `false` if the
 * property key does not exist on the object or the value stored by that key is not of type `object`.
 *
 * ```
 * // type of obj -> unknown
 * if (hasNumber(obj, 'status')) {
 *   // type of obj -> { status: number }
 *   if (hasObject(obj, 'data')) {
 *     // type of obj -> { status: number } & { data: object }
 *   } else if (hasString('error')) {
 *     // type of obj -> { status: number } & { error: string }
 *   }
 * }
 * ```
 *
 * @param {Object} value The value to test.
 * @param {String} key An `object` key to check for existence.
 * @returns {boolean} Returns true if a value contains prop of type object
 */
export function hasObject(value, key) {
  return has(value, key) && isObject(value[key]);
}

/**
 * Tests whether a value of type `T` contains a property `key` whose type tests positively when tested with
 * {@link isPlainObject}. If so, the type of the tested value is narrowed to reflect the existence of that key for
 * convenient access in the same scope. Returns `false` if the property key does not exist on the object or the value
 * stored by that key is not of type `object`.
 *
 * ```
 * // type of obj -> unknown
 * if (hasNumber(obj, 'status')) {
 *   // type of obj -> { status: number }
 *   if (hasPlainObject(obj, 'data')) {
 *     // type of obj -> { status: number } & { data: object }
 *   } else if (hasString('error')) {
 *     // type of obj -> { status: number } & { error: string }
 *   }
 * }
 * ```
 *
 * @param {Object} value The value to test.
 * @param {String} key A "plain" `object` key to check for existence.
 * @returns {boolean} Returns true if a value contains prop of type object
 */
export function hasPlainObject(value, key) {
  return has(value, key) && isPlainObject(value[key]);
}

/**
 * Tests whether a value of type `T` contains a property `key` whose type tests positively when tested with
 * {@link isInstance} when compared with the given constructor type `C`. If so, the type of the tested value is
 * narrowed to reflect the existence of that key for convenient access in the same scope. Returns `false` if the
 * property key does not exist on the object or the value stored by that key is not an instance of `C`.
 *
 * ```
 * class ServerResponse { ... }
 * // type of obj -> unknown
 * if (hasNumber(obj, 'status')) {
 *   // type of obj -> { status: number }
 *   if (hasInstance(obj, 'data', ServerResponse)) {
 *     // type of obj -> { status: number } & { data: ServerResponse }
 *   } else if (hasString('error')) {
 *     // type of obj -> { status: number } & { error: string }
 *   }
 * }
 * ```
 *
 * @param {Object} value The value to test.
 * @param {String} key An instance of type `C` key to check for existence.
 * @param {Object} ctor The constructor type to test against
 * @returns {boolean} Returns true if a value contains prop is instance of ctor
 */
export function hasInstance(value, key, ctor) {
  return has(value, key) && value[key] instanceof ctor;
}

/**
 * Tests whether a value of type `T` contains a property `key` of type {@link AnyArray}. If so, the type of the tested
 * value is narrowed to reflect the existence of that key for convenient access in the same scope. Returns `false` if
 * the property key does not exist on the object or the value stored by that key is not of type {@link AnyArray}.
 *
 * ```
 * // type of obj -> unknown
 * if (hasNumber(obj, 'offset')) {
 *   // type of obj -> { offset: number }
 *   if (hasNumber(obj, 'page') && hasArray(obj, 'items')) {
 *     // type of obj -> { offset: number } & { page: number } & { items: AnyArray }
 *   }
 * }
 * ```
 *
 * @param {Object} value The value to test.
 * @param {String} key An `AnyArray` key to check for existence.
 * @returns {boolean} Returns true if a value contains prop of type array
 */
export function hasArray(value, key) {
  return has(value, key) && isArray(value[key]);
}

/**
 * Tests whether a value of type `T` contains a property `key` of type {@link AnyFunction}. If so, the type of the
 * tested value is narrowed to reflect the existence of that key for convenient access in the same scope. Returns
 * `false` if the property key does not exist on the object or the value stored by that key is not of type
 * {@link AnyFunction}.
 *
 * ```
 * // type of obj -> unknown
 * if (hasFunction(obj, 'callback')) {
 *   // type of obj -> { callback: AnyFunction }
 *   obj.callback(response);
 * }
 * ```
 *
 * @param {Object} value The value to test.
 * @param {String} key An `AnyFunction` key to check for existence.
 * @returns {boolean} Returns true if a value contains prop of type function
 */
export function hasFunction(value, key) {
  return has(value, key) && isFunction(value[key]);
}

/**
 * Tests whether a value of type `T` contains a property `key` of type {@link AnyJson}, _using a shallow test for
 * `AnyJson` compatibility_ (see {@link isAnyJson} for more information). If so, the type of the
 * tested value is narrowed to reflect the existence of that key for convenient access in the same scope. Returns
 * `false` if the property key does not exist on the object or the value stored by that key is not of type
 * {@link AnyJson}.
 *
 * ```
 * // type of obj -> unknown
 * if (hasAnyJson(obj, 'body')) {
 *   // type of obj -> { body: AnyJson }
 * }
 * ```
 *
 * @param {Object} value The value to test.
 * @param {String} key An `AnyJson` key to check for existence.
 * @returns {boolean} Returns true if a value contains prop key of type json
 */
export function hasAnyJson(value, key) {
  return has(value, key) && isAnyJson(value[key]);
}

// Coerce ****************************************************************** //
export function coerceAnyJson(value, defaultValue) {
  return isAnyJson(value) ? value : defaultValue;
}

// As ********************************************************************** //

export function asString(value, defaultValue) {
  return isString(value) ? value : defaultValue;
}

export function asNumber(value, defaultValue) {
  return isNumber(value) ? value : defaultValue;
}

export function asBoolean(value, defaultValue) {
  return isBoolean(value) ? value : defaultValue;
}

export function asObject(value, defaultValue) {
  return isObject(value) ? value : defaultValue;
}

export function asPlainObject(value, defaultValue) {
  return isPlainObject(value) ? value : defaultValue;
}

export function asInstance(value, ctor, defaultValue) {
  return isInstance(value, ctor) ? value : defaultValue;
}

export function asArray(value, defaultValue) {
  return isArray(value) ? value : defaultValue;
}

export function asFunction(value, defaultValue) {
  return isFunction(value) ? value : defaultValue;
}

// Get ********************************************************************* //

/**
 * Given a deep-search query path, returns an object property or array value of an object or array.
 *
 * ```
 * const obj = { foo: { bar: ['baz'] } };
 * const value = get(obj, 'foo.bar[0]');
 * // type of value -> unknown; value === 'baz'
 *
 * const value = get(obj, 'foo.bar.nothing', 'default');
 * // type of value -> unknown; value === 'default'
 *
 * const value = get(obj, 'foo["bar"][0]');
 * // type of value -> unknown; value === 'baz'
 *
 * const arr = [obj];
 * const value = get(arr, '[0].foo.bar[0]');
 * // type of value -> unknown; value === 'baz'
 * ```
 *
 * @param {Object|Array} from Any value to query.
 * @param {String} path The query path.
 * @param {*} defaultValue The default to return if the query result was not defined.
 * @returns {*} The object prop or array val
 */
export function get(from, path, defaultValue) {
  return valueOrDefault(
    path
      .split(/[.[\]'"]/)
      .filter(p => !!p)
      .reduce((r, p) => (has(r, p) ? r[p] : undefined), from),
    defaultValue,
  );
}

export function getString(from, path, defaultValue) {
  return valueOrDefault(asString(get(from, path)), defaultValue);
}

export function getNumber(from, path, defaultValue) {
  return valueOrDefault(asNumber(get(from, path)), defaultValue);
}

export function getBoolean(from, path, defaultValue) {
  return valueOrDefault(asBoolean(get(from, path)), defaultValue);
}

export function getObject(from, path, defaultValue) {
  return valueOrDefault(asObject(get(from, path)), defaultValue);
}

export function getPlainObject(from, path, defaultValue) {
  return valueOrDefault(asPlainObject(get(from, path)), defaultValue);
}

export function getInstance(from, path, ctor, defaultValue) {
  return valueOrDefault(asInstance(get(from, path), ctor), defaultValue);
}

export function getArray(from, path, defaultValue) {
  return valueOrDefault(asArray(get(from, path)), defaultValue);
}

export function getFunction(from, path, defaultValue) {
  return valueOrDefault(asFunction(get(from, path)), defaultValue);
}

export function getAnyJson(from, path, defaultValue) {
  return valueOrDefault(coerceAnyJson(get(from, path)), defaultValue);
}

export function asJsonMap(value, defaultValue) {
  return isJsonMap(value) ? value : defaultValue;
}

export function getJsonMap(from, path, defaultValue) {
  return valueOrDefault(asJsonMap(getAnyJson(from, path)), defaultValue);
}

/**
 * Returns true if the a value is an empty object, collection, has no
 * enumerable properties or is any type that is not considered a collection.
 *
 * @example
 * ```
 * isEmpty([]); // true
 * isEmpty({}); // true
 * isEmpty(''); // true
 * isEmpty([1, 2]); // false
 * isEmpty({ a: 1, b: 2 }); // false
 * isEmpty('text'); // false
 * isEmpty(123); // true - type is not considered a collection
 * isEmpty(true); // true - type is not considered a collection
 * ```
 *
 * @param {*} val - The value to test
 * @returns {Boolean} - True if given value is empty or not a collection
 *
 * @example
 */
export function isEmpty(val) {
  return val == null || !(Object.keys(val) || val).length;
}

/**
 * Narrows a type `Nullable<T>` to a `T` or raises an error.
 *
 * @param {*} value The value to test.
 * @param {String} [message] The error message to use if `value` is `undefined` or `null`.
 * @returns {*} The value to test if passed
 */
export function ensure(value, message) {
  if (value == null) throw new Error(message || 'Value is undefined');

  return value;
}

/**
 * Narrows an `unknown` value to an `Array` if it is type-compatible, or raises an error otherwise.
 *
 * @param {*} value The value to test.
 * @param {String} [message] The error message to use if `value` is not type-compatible.
 * @returns {*} value The value to test if passed
 */
export function ensureArray(value, message) {
  return ensure(asArray(value), message || 'Value is not an array');
}

/**
 * Narrows an `unknown` value to a `string` if it is type-compatible, or raises an error otherwise.
 *
 * @param {*} value The value to test.
 * @param {String} [message] The error message to use if `value` is not type-compatible.
 * @returns {*} value The value to test if passed
 */
export function ensureString(value, message) {
  return ensure(asString(value), message || 'Value is not an string');
}

/**
 * Narrows an `unknown` value to a `number` if it is type-compatible, or raises an error otherwise.
 *
 * @param {*} value The value to test.
 * @param {String} [message] The error message to use if `value` is not type-compatible.
 * @returns {*} value The value to test if passed
 */
export function ensureNumber(value, message) {
  return ensure(asNumber(value), message || 'Value is not an number');
}

/**
 * Narrows an `unknown` value to a `boolean` if it is type-compatible, or raises an error otherwise.
 *
 * @param {*} value The value to test.
 * @param {String} [message] The error message to use if `value` is not type-compatible.
 * @returns {*} value The value to test if passed
 */
export function ensureBoolean(value, message) {
  return ensure(asBoolean(value), message || 'Value is not an boolean');
}

/**
 * Narrows an `unknown` value to an `object` if it is type-compatible, or raises an error otherwise.
 *
 * @param {*} value The value to test.
 * @param {String} [message] The error message to use if `value` is not type-compatible.
 * @returns {*} value The value to test if passed
 */
export function ensureObject(value, message) {
  return ensure(asObject(value), message || 'Value is not an object');
}

/**
 * Narrows an `unknown` value to an `object` if it is type-compatible and tests positively with {@link isPlainObject},
 * or raises an error otherwise.
 *
 * @param {*} value The value to test.
 * @param {String} [message] The error message to use if `value` is not type-compatible.
 * @returns {*} value The value to test if passed
 */
export function ensurePlainObject(value, message) {
  return ensure(asObject(value), message || 'Value is not an object');
}

/**
 * Narrows an `unknown` value to an `AnyFunction` if it is type-compatible, or raises an error otherwise.
 *
 * @param {*} value The value to test.
 * @param {String} [message] The error message to use if `value` is not type-compatible.
 * @returns {*} value The value to test if passed
 */
export function ensureFunction(value, message) {
  return ensure(asFunction(value), message || 'Value is not a function');
}

/**
 * Narrows an `AnyJson` value to a `JsonMap` if it is type-compatible, or raises an error otherwise.
 *
 * @param {*} value The value to test.
 * @param {String} [message] The error message to use if `value` is not type-compatible.
 * @returns {*} value The value to test if passed
 */
export function ensureJsonMap(value, message) {
  return ensure(asJsonMap(value), message || 'Value is not a JsonMap');
}