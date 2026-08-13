// Type definitions for a/index.js

type TakeFilter = (key: string, value: any, data: any) => any;
/** 数据提取器：按规则从 data 中提取字段。
 *  multi 支持格式："key1,key2" | "srcKey=>dstKey" | "srcKey:dstKey" | "pattern*=>target*" 等。
 *  filter 为函数时，value 从 {} 起步；filter 为非函数时作为初始值对象。
 */
export function take<T = any>(
  data: any,
  multi: string,
  source?: TakeFilter | T,
  filter?: TakeFilter,
): T;

/** 遍历 Array / Object / Set / Map / NodeList。
 *  func 返回非 Nil 值时提前终止遍历并返回该值。
 */
export function each(
  source: any,
  func: (key: any, value: any, host?: any) => any,
  context?: any,
): any;

/** 合并对象。最后一个参数为布尔值时表示是否覆盖已有属性；为 "mix"|"one"|"first" 时倒转宿主/来源。
 *  默认不覆盖。
 */
export function merge(host: any, ...sources: any[]): void;

/** 执行方法队列。
 *  rank 为函数/值或其嵌套数组 [[fn, context?, ...args], ...]。
 *  返回第一个非 Nil 的执行结果；-1 表示 break。
 */
export function runer(
  rank: Array<any> | string,
  context?: any,
  ...args: any[]
): any;

/** 按容器宽高等比缩放目标宽高，返回 [width, height]。suffix 为附加量（默认 0）。 */
export function zoom(
  x: number,
  y: number,
  w: number,
  h: number,
  suffix?: string | number,
): [number, number];

/** 类数组转标准数组 */
export function iList2Array(args: IArguments | any[] | any): any[];

/** 数值提取/转换工具 */
export namespace iPickNumber {
  function number(v: any): number;
  function float(v: any): number;
  function int(v: any): number;
}

/** 按分隔符分割字符串，默认分隔符为 ; | */
export function iSplit(str: string, split?: string | RegExp): string[];

/** 判断是否为函数 */
export function isFunction(fn: any): fn is (...args: any[]) => any;

/** 判断是否为 undefined（模块内部定义的 Nil = undefined） */
export function isNil(val: any): val is undefined;

/** 判断是否为简单类型（string | number | boolean | null | undefined | Symbol） */
export function isSimplyType(data: any): boolean;

/** 判断是否为数组 */
export function isArray(data: any): data is any[];

/** 判断是否为字符串 */
export function isString(data: any): data is string;

/** 判断是否为 NodeList 或数组 */
export function isNodeList(nl: any): boolean;

/** 判断对象是否为空（无自有属性）；Element 始终判非空 */
export function isEmpty(O: any): boolean;

/** 判断参数是否可转为数值（NaN 判 false） */
export function isNumber(value: any): boolean;

/** 判断是否为 DOM Element */
export function isElement(data: any): boolean;

/** 获取对象内部 [[Class]] 字符串，如 "[object Array]" */
export function iTypeTo(object: any): string;

/** 数值区间控制器 */
export class Between {
  decimal: number;
  max: number;
  min: number;
  constructor(options: { decimal?: number; max?: number; min?: number });
  /** 校验/格式化数值。isinput 为 true 时放宽容错（输入中状态）。 */
  fire(data: string | number, isinput?: boolean): string;
}

/** 获取数据的字符串长度（toString 后） */
export function length(data: any): number;
