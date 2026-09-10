// 强制展开工具类型
type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

type Trim<S extends string> = S extends ` ${infer R}`
  ? Trim<R>
  : S extends `${infer L} `
    ? Trim<L>
    : S;
type SplitComma<S extends string> = S extends `${infer Item},${infer Rest}`
  ? Trim<Item> | SplitComma<Rest>
  : S;
type Arr<S extends string> = S extends `${infer Item}[]` ? Item : "";
type SplitColon<S extends string> = S extends `${infer L}:${infer R}`
  ? Arr<R> extends ""
    ? R
    : Arr<R>
  : S;
type GetKey<S extends string> = S extends `${infer L}:${infer R}`
  ? Arr<R> extends ""
    ? L
    : [SplitColon<L>]
  : S;

type TakeType =
  | Record<string, any>
  | []
  | ((key: string, value: any, data: any) => any);
/**
 * ## `数据提取器`
 * 按规则从 data 中提取字段。
 * - ### `#使用`
 * ```javascript
 * // #0
 * take({data: {name: 1}}, 'data.name:a.b.c.name');
 * // #1
 * take({data: {name: 1}}, 'data.name:a.b.c.name', {});
 * // #2
 * take({name: 1}, 'na*:*,n*:*xx', {});
 * ```
 * - ### `#返回`
 * ```javascript
 * // #0 == #1 这里相等 是 返回的都是新的, 区别在与 #0 返回新的对象 #1 为指定的对象添加
 * {a: {b: {c: {name: 1}}}}
 * // #2
 * { me: 1, amexx: 1 }
 * ```
 *  multi 支持格式："key1,key2" | "srcKey=>dstKey" | "srcKey:dstKey" | "pattern*=>target*" 等。
 *  filter 为函数时，value 从 {} 起步；filter 为非函数时作为初始值对象。
 */
export function take<
  T = Record<string, any> | [],
  M extends string = string,
  U extends TakeType = TakeType,
>(
  data: T,
  multi: M,
  source?: U,
  filter?: (key: string, value: any, data: any) => any,
): /* U extends Function ? Record<string, any> :  */ {
  [Item in SplitComma<M> as SplitColon<Item>]: Trim<GetKey<Item>>;
};

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

/**
 * ### `执行方法队列`
 * ```javascript
 * runer(-1, [1, 2]);
 * // ret: 2
 * const res = { name: "Joyer" };
 * runer([
 *    // 获取 res 的 data|permission 属性
 *    ["data", res],
 *    ["permission", res],
 *    [["data", "permission", "name"], res],
 *    // 返回 res 自身, 以上都未匹配到时返回自身
 *    [0, [res]],
 * ]);
 * // Or
 * runer(fx, context, ...args)
 * runer([fx, fx, [fx]])
 * runer([fx, fx], ...args)
 * // 等等
 * ```
 *  rank 为函数/值或其嵌套数组 [[fn, context?, ...args], ...]。
 *  返回第一个非 Nil 的执行结果；-1 表示 break。
 */
export function runer<T extends any = any>(
  rank: T,
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

/**
 * ### `数据精度`
 * - 解决丢精度问题
 * ```javascript
 * import { toFixed } from "@soei/tools"
 * let value = toFixed(1.225, 2)
 * value == 1.23
 * ```
 * @param num 目标数值
 * @param fraction 小数
 */
export function toFixed(num: number | string, fraction?: number): number;

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

export type BackFx = (...args: any[]) => any;
export type EventHandlerItem<Payload = any> =
  | [(...args: any[]) => any, any, ...any[]]
  | ((...args: any[]) => any)
  | Record<string, any>
  | [...any[]];

// type EventHandlerItem = ((...args: any[]) => any) | [(...args: any[]) => any, unknown, ...any[]];
type ExpandedHandler = Expand<EventHandlerItem>;
type EventOnType = Expand<EventHandlerItem | any>;
/**
 * 注册事件监听
 */
export declare class Event<T extends any = any> {
  readonly #list: T;
  constructor(key?: string);

  /* 销毁当前对象 */
  destroyed(): void;
  /**
   * 清空当前对象监听 @
   * 如果是单例, 清理当前 new Event(key) 中 key对应的 的所有监听
   */
  clear(): void;
  /**
   * 清理 @see name 事件
   * @param name 事件索引key
   * @param trigger 要移除的回调函数或者完整handler数组项
   */
  off<Name extends keyof T>(name: Name, trigger?: EventHandlerItem): void;
  /**
   * ### `通信` 与 `传值`
   * ```javascript
   * import { bus } from "@soei/tools"
   * let value = bus.on('name', function(){
   *  // todo
   * })
   * // Or
   * let value = bus.on('name', [function(...args){
   *  // this: context
   * }, context[, ...args]])
   * ```
   * @param name 事件索引key
   * @param trigger 回调函数 或者 [fn, context, ...args] 数组
   * - 如果 `自身` 或者 `数组[0]` 为 `非函数`, 作为存储用, let value = emit(`@see name` [,...]); 可获取
   * @returns 返回trigger的返回值
   */
  on<Name extends string = string, TR extends EventOnType = EventOnType>(
    name: Name,
    trigger: TR,
  ): any;

  // on(name: string, trigger: EventHandlerItem): any;
  /**
   * ### `触发|通知`
   * ```javascript
   * import { bus } from "@soei/tools";
   * // 如果对应事件有返回值, 则获取返回值
   * let value = bus.emit('name', 1, 2, 3, 4)
   * ```
   * @param name 事件索引key
   * @param args 参数
   * @returns 返回 *.on() 的返回值
   */
  emit<Name extends string = string, TR extends any[] = any[]>(
    name: Name,
    ...args: TR
  ): any;
}
export declare const bus: Event;
