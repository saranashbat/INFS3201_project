const mongodb = require('mongodb')

let client = undefined
let db = undefined


async function connectDatabase() {
    if (!client) {
        client = new mongodb.MongoClient('mongodb+srv://saranashbat:sshdmhy135@infs3201.dpuxvt5.mongodb.net/')
        await client.connect()
        db = client.db('project')

    }
}


async function getUserDetails(username) {
    await connectDatabase()
    let users = db.collection('UserAccounts')
    let result = await users.find({username: username})
    let resultData = await result.toArray()
    return resultData[0]
}


async function saveSession(sessionkey, expiry, data) {
    await connectDatabase()
    let sessionData = db.collection('SessionData')
    
    await sessionData.insertOne({
        sessionkey: sessionkey,
        expiry: expiry,
        data: data
    })
}


async function getSessionData(key) {
    await connectDatabase()
    let sessionData = db.collection('SessionData')
    let result = await sessionData.find({sessionkey: key})
    let resultData = await result.toArray()
    return resultData[0]
}


async function deleteSession(key) {
    await connectDatabase()
    let sessionData = db.collection('SessionData')

    await sessionData.deleteOne({sessionkey: key})
}


module.exports = {
    getUserDetails, saveSession, getSessionData, deleteSession
}