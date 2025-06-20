const obj = {
  name: '张三',
  age: 18,
  gender: '男',
  friend: {
    name: '萧逸'
  }
}
//手写深拷贝
function deepClone(obj) {
  //判断是否是对象或者数组
  if (obj == null || typeof obj !== 'object') {
    return obj
  }
  let result
  //判断是否是数组
  if (obj instanceof Array) {
    result = []
  }
  //判断是否是对象
  else {
    result = {}
  }
  //遍历对象 递归深拷贝
  for (let key in obj) {
    //判断对象中是否有该属性
    if (obj.hasOwnProperty(key)) {
      result[key] = deepClone(obj[key])
    }
  }
  return result
}
const obj1 = deepClone(obj)
obj1.name = '李四'
console.log(obj)
console.log(obj1)
