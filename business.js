const persistence = require("./persistence.js")
const crypto = require("crypto")

function computeHash(password){
    let hash = crypto.createHash('sha512')
    hash.update(password)
    let res = hash.digest('hex')
    return res
}

async function checkLogin(username, password) {
    let details = await persistence.getUserDetails(username)
    let hashedPass = computeHash(password)

    if (!details || details.password != hashedPass) {
        return undefined
    }
    return details.usertype
}


async function startSession(data) {
    let sessionkey = crypto.randomUUID()
    let expiry = new Date(Date.now() + 1000*60*5)
    await persistence.saveSession(sessionkey, expiry, data)
    return {
        sessionkey: sessionkey,
        expiry: expiry
    }
}

async function getSessionData(key) {
    return await persistence.getSessionData(key)
}

async function deleteSession(key) {
    await persistence.deleteSession(key)
}


module.exports = {
    checkLogin, startSession, getSessionData, deleteSession
}