/**
 * Created by lihong
 */

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}
/**
 * 判断传入对象的数据类型,返回对象字符串
 * String
 * Number
 * Array
 * Date
 * Function
 * Function
 * @param {*} obj
 */
export function typeOfObj(obj) {
  let objType = Object.prototype.toString.call(obj)
  return objType.replace('[object ', '').replace(']', '')
}
export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}
/**
 * 将一组数据格式化为tree所需数据，根据arr分割
 * @param {数据} arr 
 * @param {识别属性} id
 * @param {分割属性} attr 
 */
export function formatTreeData(source, id, parentId) {
  let cloneData = JSON.parse(JSON.stringify(source))
    let tree = cloneData.filter(father=>{
        let branchArr = cloneData.filter(child=>{
            return father[id] == child[parentId]
        });
        if(branchArr.length>0){
            father["children"] = branchArr
        }
        return father[parentId] == 0    //如果第一层不是parentId=0，请自行修改
    })
    return tree
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}
export function arrGroupBy (array, fun) {
  const groups = {}
  array.forEach(function (o) {
    const group = fun(o)
    groups[group] = groups[group] || []
    groups[group].push(o)
  })
  let newArr = []
  Object.keys(groups).map(function (group, index) {
    newArr.push({
      id: index,
      name: group,
      children: groups[group]
    })
  })
  return newArr
}