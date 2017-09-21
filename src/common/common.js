
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

export default {
    pushData,
    JSONUtils
}