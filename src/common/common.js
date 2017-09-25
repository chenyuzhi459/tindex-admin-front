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


export default {
  pushData,
  JSONUtils,
  fillShowTableData,
  sortArray,
  searchArray
}