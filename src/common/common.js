
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

export default {
    pushData,
    JSONUtils,
    fillShowTableData,
    sortArray,
    searchArray,
    setCookie,
    getCookie,
    delCookie
}