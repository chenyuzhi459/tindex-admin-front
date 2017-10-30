const pushData = (fromData, toData) => {
  for (var index in fromData) {
    toData.push(fromData[index])
  }
}

const JSONUtils = {
  toString(data) {
    if (!data) {
      return null
    }
    return JSON.stringify(data, null, 2)
  },
  toJsonObject(data) {
    return JSON.parse(data)
  }
}

const fillShowTableData = (originData, currentPage, pageSize) => {
  let showTableData = []
  let position = (currentPage - 1) * pageSize
  let limit = (position + pageSize) >= originData.length ? originData.length - position : pageSize;
  for (let i = 0; i < limit; i++) {
    showTableData.push(originData[position + i])
  }
  return showTableData
}
const sortArray = (array, field, direction) => {
  const sortedArray = _.orderBy(array, [field], [direction])
  return sortedArray
}

const searchArray = (arry, field, keyword) => {
  let searchedArr = []
  for (let index = 0; index < arry.length; index++) {
    if (arry[index][field].indexOf(keyword) >= 0) {
      searchedArr.push(arry[index])
    }
  }
  return searchedArr
}

const setCookie = (c_name, value, expiredays) => {
  let exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = c_name + '=' + escape(value) +
    ((expiredays === null) ? '' : ';expires=' + exdate.toGMTString())
}

const getCookie = (name) => {
  let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return (arr[2]);
  else
    return null;
}
const delCookie = (name) => {
  let exp = new Date();
  exp.setTime(exp.getTime() - 1);
  const cval = getCookie(name);
  if (cval != null) {
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
  }
}
const fillObject = (source, target) => {
  for (let item in source) {
    target[item] = source[item]
  }
}
//this.$common.methods.conver(10000)
const conver = (limit) => {
  let size
  if (limit < 1 * 1024) {
    size = limit.toFixed(2) + "B"
  } else if (limit < 1 * 1024 * 1024) {
    size = (limit / 1024).toFixed(2) + "KB"
  } else if (limit < 1 * 1024 * 1024 * 1024) { 
    size = (limit / (1024 * 1024)).toFixed(2) + "MB"
  } else if (limit < 1 * 1024 * 1024 * 1024 * 1024) {   
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB"
  } else {
    size = (limit / (1024 * 1024 * 1024 * 1024)).toFixed(2) + "TB"
  }
  const sizestr = size + "";
  const len = sizestr.indexOf("\.");
  const dec = sizestr.substr(len + 1, 2);
  if (dec == "00") {//当小数点后为00时 去掉小数部分  
    return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
  }
  return sizestr;
}

function trim(str) { //删除左右两端的空格
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

export default {
  pushData,
  JSONUtils,
  fillShowTableData,
  sortArray,
  searchArray,
  setCookie,
  getCookie,
  delCookie,
  fillObject,
  conver,
  trim
}