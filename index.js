var ArrayFunxName = ['shift', 'pop', 'unshift', 'push'];
var OBJECT_EMPTY = {}, Nil,
    $1 = '$1',
    SPACE = '',
    r_ANYTHING = /\[object\s(\w+)\]/,
    s_NODELIST = '[object NodeList]',
    /* 提取属性时, 如果多个属性名 'height;line-height=>h'  'height|line-height=>h' */
    r_MULTI_SPLIT_SEP = /\s*[;|]\s*/;
/**
 * 实现继承扩展 merge( O1, O2, O3[,...], data# 要扩展数据 #, cover# 是否覆盖添加 # )
 * [宿主]或[目标]至少有一个长度为1 [1,2,3,4] <= [5] | [1] <= [2,3,4,5] = 末尾参数为 [mix|one|first] 字符串
 */
function merge(s, o, e, i) {
    var cover, args;
    /* 格式化参数 */
    args = iList2Array(arguments);
    /*获取最后一位*/
    cover = args.pop();
    var revers = false;
    if (/^mix|one|first$/i.test(cover)) {
        revers = true;
        cover = args.pop();
    }
    /*是否是boolean类型*/
    if (!/^false|true$/ig.test(cover)) {
        /* 归位 */
        args.push(cover);
        //默认不替换
        cover = false;
    }
    // 导流
    var source = [[args[ArrayFunxName[+!revers]]()]];
    // 添加 [宿主] 或者 [来源]
    source[ArrayFunxName[+revers + 2]](args);
    // 第一层遍历宿主 一对多, 或者多对一
    each(source[0], function (k, v) {
        // 遍历来源, 当来源为多个时
        each(source[1], function (key, v, host) {
            // 遍历[宿主]是否含有[目标]属性
            for (key in v) {
                if (cover || !(host.hasOwnProperty && host.hasOwnProperty(key))) {
                    host[key] = v[key];
                }
            }
        }, v)
    })
};

/**
 * 执行方法列队(走私)
 * @param  {Array|String} rank    要执行的列表
 * @param  {Object} context 执行上下文
 */
function runer(rank, context) {
    if (isNil(rank)) return Nil;
    var args = iList2Array(arguments);
    rank = args.shift();
    context = args.shift();
    // 判断宿主
    context = isNullOrUndefined(context) ? this : context;
    var msg, exec, length;
    if (!isArray(rank)) {
        rank = [rank];
    }
    for (var r = 0, rl = rank.length; r < rl; r++) {
        exec = rank[r];
        /* 判断是否通过索引访问数组 */
        if (isArray(context) && isNumber(exec)) {
            return context[
                /* 获取数组长度 */
                length = context.length,
                (
                    length + (exec % length)
                ) % length
            ];
        }
        /* 如果是基本数据类型, 作为属性获取 */
        isSimplyType(exec) && (exec = context[exec]);
        /* 如果获得的值为function, 执行 */
        if (isFunction(exec)) {
            /* 包含不含有apply方法的函数执行, 处理,原型链缺失apply的function */
            msg = Function.prototype.apply.call(exec, context, args);
            if (msg !== Nil) return msg;
        } else if (!isNil(exec)) return exec;
    }
}
/**
 * 获取字符串类型
 * @param  {object}   object 
 * @return {String}          
 */
function iTypeTo(object) {
    return OBJECT_EMPTY.toString.call(object);
}

var sString = iTypeTo($1); //'[object String]';

function picktype(O) {
    return iTypeTo(O).replace(r_ANYTHING, $1);
}

/* 分割字符串 */
function iSplit(str, split) {
    return str.split(split || r_MULTI_SPLIT_SEP);
}
var OBJECT = picktype(OBJECT_EMPTY);
var FUNCTION = iTypeTo(function () { });

/**
 * 判断是否为空
 * @Time   2019-07-17
 * @param  {Object}   val 要鉴别的对象
 * @return {Boolean}      返回
 */
function isNil(val) {
    return val === Nil;
}
function isFunction(fn) {
    return iTypeTo(fn) === FUNCTION;//fn instanceof Function;
}

/**
 * 转换数组
 * @param {Object} args 
 */
function iList2Array(args) {
    return args && args.length === 1/*  && isDigital(args[0])  */
        ? [
            /* 
                当args[0] == number 且 args.lenth == 1
                Array.apply(null, [0]) => 相当于 new Array(0) => [].length == number 
            */
            args[0]
        ]
        : Array.apply(Nil, args)/*= Array(args[0][, args[1], ..., args[n]]) */;
}
// 遍历Set Map
function MS(source, fn, args) {
    /* 2023-12-24 优化 */
    for (var [key, value] of source) {
        if (EACH.changeWay.call(this, key, args, { [key]: value }, fn)) return this.ret;
    }
    // source.forEach(function (v, k) {
    //     fn.call(this, k, v);
    // }, this);
}
var EACH = {
    'changeWay': function (key, args, source, cb) {
        args[0] = key; /*设置KEY*/
        args[1] = source[key]; /*设置对应的*/
        return !isNil(this.ret = cb.apply(this.context, args));
    },
    'Array': function (source, fn, args) {
        for (var key = 0, length = source.length >> 0; key < length; key++) {
            if (EACH.changeWay.call(this, key, args, source, fn)) return this.ret;
        }
    },
    'Object': function (source, fn, args) {
        for (var key in source) {
            if (source.hasOwnProperty && source.hasOwnProperty(key) && EACH.changeWay.call(this, key, args, source, fn)) return this.ret;
        }
    },
    'Set': MS,
    'Map': MS
}
// 支持NodeList
EACH.NodeList = EACH.Array;
/**
 * 循环
 * @Time   2018-11-14
 */
function each(source, func, context) {
    if (!isFunction(func)) return;
    //挑选处理方方法
    return (EACH[picktype(source)] || EACH[OBJECT]).call({
        context: context || source /* || source 2022-11-02 */
    }, source, func, iList2Array(arguments));
}
function isNullOrUndefined(data) {
    return data === null || data === undefined;
}
function isSimplyType(data) {
    return /\[object (?:string|number|boolean|null|undefined|Symbol)\]/i.test(iTypeTo(data))
}
function isElement(data) {
    return /\[object \w+Element\]/i.test(iTypeTo(data))
}
function isArray(data) {
    return data instanceof Array;
}
function isType(data, type) {
    return iTypeTo(data) == type;
}

function isString(data) {
    return isType(data, sString);
}

var isNodeList = function (nl) {
    return isType(nl, s_NODELIST) || isArray(nl);
}

/* 判断对象是否为空 */
function isEmpty(O) {
    if (isElement(O)) return false;
    for (var _ in O) if (O.hasOwnProperty(_)) return false;
    return true;
}
/**
 * 计算目标元素显示在指定容器中的实际宽高
 * 
 * @param {Number} x 容器宽
 * @param {Number} y 容器高
 * @param {Number} w 目标对象宽
 * @param {Number} h 目标对象高
 * @param {String} suffix 后缀
 * @returns Array [width, height]
 */
function zoom(x, y, w, h, suffix) {
    suffix || (suffix = 0);
    each(arguments, function (k, v) {
        if (isString(v) && k < 4) this[k] = parseFloat(v);
    })
    let r = w / h;
    return x / y > r ? [
        r * y + suffix,
        y + suffix
    ] : [
        x + suffix,
        x / r + suffix
    ]
}

/**
 * 判断参数是否为"数值"
 * @param {Object} value 
 */
function isNumber(value) {
    return !isNaN(+value)
}

// 处理数值
var iPickNumber = {
    number: function (v) {
        return parseFloat(v);
    },
    float: function (v) {
        return parseFloat(v);
    },
    int: function (v) {
        return parseInt(v);
    }
}

function length(data) {
    return data.toString().length;
}
function Between(me) {
    this.decimal = me.decimal || 0;
    this.max = me.max || 0;
    this.min = me.min || 0;
    this.maxl = length(this.max);
    this.minl = length(this.min);
    this.last = SPACE;
    this.R = new RegExp('(\\.\\d{' + this.decimal + '})\\d+');
}
Between.prototype.fire = function (data, isinput) {
    isinput = isNil(isinput) ? false : isinput;
    var decimal = this.decimal;
    var max = this.max;
    var min = this.min;
    let ret;
    /* 处理-0000 012 => 12 */
    if (/^-?0\d+/.test(data)) {
        data = +data;
    }
    if (isinput &&
        (
            /* 删除操作 */
            this.last.indexOf(data) == 0
            ||
            /* 判断是否为同等级数值 两位数, 三位数 */
            this.minl > length(data)
        )
    ) {
        ret = data;
    } else
        if (+data <= max && +data >= min) {
            if (decimal) {
                ret = (data + SPACE).replace(this.R, '$1')
            } else {
                /* 取整 */
                ret = data >> 0;
            }
        }
    this.last = ret = (ret ? ret : data === SPACE ? SPACE : data > max ? max : min).toString()
    return isinput ? ret : decimal ? (+ret).toFixed(decimal) : ret;
}
module.exports = {
    each,
    merge,
    runer,
    zoom,
    iList2Array,
    iPickNumber,
    iSplit,
    isFunction,
    isNil,
    isSimplyType,
    isArray,
    isString,
    isNodeList,
    isEmpty,
    isNumber,
    isElement,
    iTypeTo,

    Between,
    length
};