![安装](https://img.shields.io/badge/安装-npm_i_@soei/tools-ffc107?style=flat) [![Latest Version on NPM](https://img.shields.io/badge/✔-线上实例-ae8aff?style=flat)](https://alwbg.github.io)

# JS工具类~ [![Latest Version on NPM](https://img.shields.io/npm/v/@soei/tools?label=npm&style=flat-square)](https://npmjs.com/package/@soei/tools) ![Software License](https://img.shields.io/badge/license-ISC-brightgreen?label=&style=flat-square) [![npm](https://img.shields.io/npm/dw/@soei/tools?label=Downloads&style=flat-square)](https://www.npmjs.com/package/@soei/tools) ![npm bundle size](https://img.shields.io/bundlephobia/min/%40soei%2Ftools?label=Size&color=&style=flat-square)

> #### Online
>
> _[点击这里带你穿越](https://alwbg.github.io)_
>
> - 多个实例应用融合
>   - [合并 Between](#Between)
>   - [合并 merge](#merge)
>   - [遍历 each](#each)
>   - [执行 runer](#runer)
>   - [分割 iSplit](#isplit)
>   - [转换数组 iList2Array](#ilist2array)
>   - ...

## 更新日志

### 1.0.13

- #### 新增 zoom(容器宽, 容器高, 目标宽, 目标高, 追加值) : [宽, 高]

  ```javascript
  zoom(100, 200, 200, 300);
  // ret: [ 100, 150 ]
  zoom("100px", 200, 200, 300, "px");
  // ret: [ '100px', '150px' ]
  ```

- #### 优化 runer(Number, Array)

  ```javascript
  runer("-1", [1, 2]);
  // ret: 2
  runer(-1, [1, 2]);
  // ret: 2
  ```

### 1.0.12

- #### 优化 runer(Function|String, ...args) and isFunction(func);

  ```javascript
  const aSimplyFunction = function (a) {
    return a;
  };
  aSimplyFunction instanceof Function;
  // true
  aSimplyFunction.__proto__ = {}; // 修改原型链

  aSimplyFunction instanceof Function;
  // false

  isFunction(aSimplyFunction);
  // true

  runer(aSimplyFunction, null, 1);
  // ret: 1
  ```

### 1.0.11

- #### 优化 runer(String, null|undefined)

  ```javascript
  runer("push", null);
  // ret: undefined

  runer("pop", undefined);
  // ret: undefined

  runer("toFixed", 0, 1);
  // ret: '0.0'
  ```

### 1.0.10

- #### 优化 isEmpty(HTMLHtmlElement) 对象判断

### 1.0.8

- #### 优化 runer(String, context)

  ```javascript
  runer("push", [1, 2, 3, 4], 0);
  // ret: 5 push的返回值

  runer("pop", [1, 2, 3, 4]);
  // ret: 4
  ```

---

### 1.0.7

- #### 优化 Map、Set 在使用 each 时的中断逻辑

  ```javascript
  let ret,
    map = new Map();

  map.set(10, 20);
  map.set("a", 2);
  ret = each(map, (k, v) => {
    if (v == 2) return k;
  });
  // ret: a
  ```

---

## **Between**

```javascript
// 区间取值
const soei = require("@soei/tools");
let Between = soei.Between;
// 或
import { Between } from "@soei/tools";

data = new Between({
  /* 是否含有小数输出, 默认为0, 整数 */
  // decimal: 3,
  max: 90,
  min: 20,
});
data.fire(20.01);
// 20
data.fire(2);
// 20
data.fire(2, true /* 是否正在输入, 当为true时不直接返回最大最小值 */);
// 2
data = new Between({
  decimal: 3,
  max: 1,
  min: 0,
});

data.fire(20);
// 1.000
data.fire("0.0");
// 0.000
data.fire("0.0", true);
// 0.0
data.fire(0.0, true);
// 0
```

## **merge**

```javascript
// 合并
const soei = require("@soei/tools");
let merge = soei.merge;
// 或
import { merge } from "@soei/tools";

// 合并
merge(args1, args2[,..., true, "mix"])

// ### 用法一

// 基本用法
merge(args1, args2)

let a = { name: "Joy" };
let b = { name: "Band", age: 10 };
merge(a, b);
// a : {name: 'Joy', age: 10}
// b : {name: 'Band', age: 10}

// ### 用法二

// 强制覆盖
merge(args1, args2, args3, true)

// - args1, args2 为接收方
// - args3 为属性输出方

let a = { name: "Joy" };
let b = { name: "Band", age: 10 };
let c = { name: "Juerry" };
// 这里以 c 为模版, 把 c 中的属性强制覆盖到 前面的一个或者多个对象中去
merge(a, b, c, true);
// a, b为接收方
// a : {name: 'Juerry'}
// b : {name: 'Juerry', age: 10}
// c : {name: 'Juerry'}

// ### 用法三

//  多参数
merge(args1, args2, args3)

//  - args1, args2 为接收方
//  - args3 为属性输出方

let a = { name: "Joy" };
let b = { name: "Band", age: 10 };
merge(a, b, {
  age: 11,
});
// a, b为接收方
// a : {name: 'Joy', age: 11}
// b : {name: 'Band', age: 10}

// ### 用法四

// 末尾参数为 "mix" 时, args1 为接收方, 其他参数均为属性输出方
merge(args1, args2[,...], "mix")

let a = { name: "Joy" };
let b = { name: "Band" };
let c = { name: "Juerry", age: 10 };
// 参数1, 参数2
merge(a, b, c, "mix");
// a为接收方 b, c为属性输出方
// a: { name: 'Joy', age: 10 }
// b: { name: 'Band' }
// c: { name: "Juerry", age: 10 }

// ### 用法五

merge(args1, args2[,...], true, "mix")
//  true 和 mix 的混合使用
//  最终属性值取决于最后一次出现的属性

let a = { name: "Joy" };
let b = { name: "Band" };
let c = { name: "Juerry", age: 11 };
merge(a, b, c, true, "mix");
// a为接收方 b, c为属性输出方
// a: {name: 'Juerry', age: 11}
// b: {name: 'Band'}
// c: {name: 'Juerry', age: 11}
```

## **each**

```javascript
const soei = require("@soei/tools");
let each = soei.each;
// 或
import { each } from "@soei/tools";

each({ a: 1, b: 2 }, (k, v) => {
  console.log(k, v);
});
// 输出:
// a 1
// b 2
each([1, 2], (k, v) => {
  // 如果打开注释, 如条件满足,则不再输出,直接跳出循环
  // if(v >= 1) return true;
  console.log(k, v);
});
// 输出:
// 0 1
// 1 2

/**
 * 这里的 ...对应handle(key, item, ...)
 * each(source, handle [, ...])
 * each({}, (key, item, v1, v2, v3) => {
 *  v1 == 1
 *  v2 == 2
 *  v3 == 3
 * }, 1, 2, 3)
 */
each(
  [1, 2],
  (k, v, target /* each的第三个参数, 以此类推... */) => {
    console.log(target);
    /* 输出: 
  {
    1: 2,
    2: 3
  }
  */
  },
  {
    1: 2,
    2: 3,
  }
);
```

## **runer**

```javascript
const soei = require("@soei/tools");
let runer = soei.runer;
// 或
import { runer } from "@soei/tools";

runer(
  function (a, z) {
    return `this is ${this.name} ${a} ${z}`;
  },
  {
    name: "loop",
  },
  1,
  2
);
// 输出: this is loop 1 2
```

## **iList2Array**

```javascript
const soei = require("@soei/tools");
let iList2Array = soei.iList2Array;
// 或
import { iList2Array } from "@soei/tools";

// 转换数组
let array = iList2Array(arguments);
```

## **iSplit**

```javascript
const soei = require("@soei/tools");
let iSplit = soei.iSplit;
// 或
import { iSplit } from "@soei/tools";

// 转换数组
let array = iSplit("name|age;weight");
// ['name', 'age', 'weight']
let array = iSplit("name,age", ",");
// ['name', 'age']
```

## **isFunction**

## isNil

## isSimplyType

## isArray

## isString

## isNodeList
