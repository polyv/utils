/**
 * 本模块提供基础方法。
 * @module lang
 */

import { extendSingle, hasOwnProp, isObject } from './internal/core';

/**
 * 检查指定对象是否具有某个 own property（ESLint 不推荐直接使用 obj.hasOwnProperty）。
 * @author luoliquan
 * @name hasOwnProp
 * @function
 * @static
 * @param {Any} obj 指定对象。
 * @param {string} prop 属性名。
 * @return {boolean} 指定对象是否具有某个 own property。
 */
export { hasOwnProp };

/**
 * 检查指定对象是否为类数组结构。
 * @author luoliquan
 * @param {Any} obj 指定对象。
 * @return {boolean} 检查指定对象是否为类数组结构。
 * @example
 * isArrayLike([]); // true
 * isArrayLike(document.getElementsByTagName('body')); // true
 * isArrayLike({}); // false
 */
export function isArrayLike(obj) {
  return obj != null &&
    typeof obj !== 'function' &&
    typeof obj.length === 'number' &&
    obj.length >= 0 &&
    obj.length % 1 === 0; // 不是小数
}

/**
 * 检查指定值是否为空数据。以下情况会判断为空数据：
 *   null 或者 undefined；
 *   数组结构，但长度为 0；
 *   空字符串或仅包含空白字符的字符串；
 *   没有 own property 的纯对象。
 * @author luoliquan
 * @param {Any} value 指定值。
 * @return {boolean} 指定值是否为空数据。
 * @example
 * isEmptyData(null); // true
 * isEmptyData([]); // true
 * isEmptyData(''); // true
 * isEmptyData({}); // true
 * isEmptyData({ a: 1 }); // false
 * isEmptyData([1]); // false
 */
export function isEmptyData(value) {
  if (value == null) { return true; }
  if (typeof value === 'string') {
    return value.trim() === '';
  } else if (Array.isArray(value)) {
    return !value.length;
  } else if (isObject(value)) {
    for (const key in value) {
      if (hasOwnProp(value, key)) { return false; }
    }
    return true;
  }
  return false;
}

/**
 * 把源对象的属性（own property）扩展到目标对象（同 Object.assign）。
 * @author luoliquan
 * @param {Any} target 目标对象。
 * @param {...Any} [source] 源对象。若有同名属性，则后者覆盖前者。
 * @return {Any} 目标对象。
 */
export function extend(target) {
  if (target == null) {
    throw new Error('The target argument cannot be null or undefined');
  }

  const len = arguments.length;
  let i = 0;
  while (++i < len) {
    extendSingle(target, arguments[i]);
  }
  return target;
}

/**
 * 深度克隆指定对象（仅限 JSON 支持的数据类型）。
 * @author liumin
 * @param {Any} obj 指定对象。
 * @return {Any} 克隆结果。
 * @example
 * cloneJSON({ a: 1, b: 2 }); // { a: 1, b: 2 }
 */
export function cloneJSON(obj) {
  if (obj == null) { return obj; }
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 尝试把指定字符串解析为 JSON 对象。
 * @author luoliquan
 * @param {string} str 指定字符串。
 * @param {Function} [onError] 解析出错时执行的函数。
 * @return {Any} 解析结果，解析失败时返回 undefined。
 * @example
 * tryParseJSON('ss&&**'); // undefined
 * tryParseJSON('{"a": 1}'); // { a: 1 }
 */
export function tryParseJSON(str, onError) {
  let result;
  try {
    result = JSON.parse(str);
  } catch (e) {
    if (onError) { onError(e); }
  }
  return result;
}
