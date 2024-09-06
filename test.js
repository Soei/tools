let { merge, isFunction, isSimplyType, Between, each, runer, isEmpty, zoom } = require('./index')
var data = {}
merge(data, {
    name: 'this is name ~'
})
console.log(`
var data = {}\n
merge(data, {
    name: 'this is name ~'
})

// 输出: data == ${JSON.stringify(data)}

isFunction(merge);
// 输出: ${isFunction(merge)}

isSimplyType(new Date);
// 输出: ${isSimplyType(new Date)}
`)
// 1.0.6
data = new Between({
    // decimal: 3,
    max: 90,
    min: 20
})
console.log(data.fire(20.01))
// 20
console.log(data.fire(2))
console.log(data.fire(2, true))
data = new Between({
    decimal: 3,
    max: 1,
    min: 0
})
console.log(data.fire(20.01))
// 20
console.log(data.fire('0.0', true))
console.log(data.fire(0.0))

// 1.0.7
let
    map = new Map();
map.set(111, 2);
map.set(10, 20);
map.set('a', 2);
ret = each(map, (k, v) => {
    if (v == 2) return k;
});
console.log(ret)


let a = { name: "Joy" };
let b = { name: "Band" };
let c = { name: "Juerry", age: 11 };
merge(a, b, c, true, "mix");

console.log(a, b, c)

console.log(runer('push', [1, 2, 3, 4], 1))
console.log(runer('length', [1, 2, 3, 4]))
console.log(runer('-1', [1, 2, 3, 4]))
console.log(runer('pop', [1, 2, 3, 4]))
console.log(runer('shift', [1, 2, 3, 4]))
// console.log(runer([].shift))
console.log(runer('substr', '12345', 1, 2))
console.log(runer('substr', null, 1, 2))
console.log(runer('open'))
console.log(runer('toFixed', 0, 1))
console.log(isEmpty({ 1: 1 }))
const aSimplyFunction = function (a) {
    return a;
};
console.log(aSimplyFunction instanceof Function);
// true
aSimplyFunction.__proto__ = {}; // 修改原型链
console.log(aSimplyFunction instanceof Function);
// false

console.log(isFunction(aSimplyFunction));
// true

console.log(runer(aSimplyFunction, null, 1));

console.log(zoom(100, 200, 200, 300))
console.log(zoom('100px', 200, 200, 300, 'px'))


let arrs = [1, 2, 5, 6, 8, 9], count = 10;
while (count-- > -10) {
    console.log(runer(count + '', arrs), '索引:' + count)
}