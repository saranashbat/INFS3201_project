const express = require('express') 
const business = require('./business.js') 
const bodyParser = require('body-parser') 
const cookieParser = require('cookie-parser') 
const handlebars = require('express-handlebars')
const path = require('path');


let app = express()


app.set('views', __dirname+"/coreui")
app.set('view engine', 'handlebars')
app.engine('handlebars', handlebars.engine())

app.use(express.static(path.join(__dirname, 'coreui')));

app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())

app.get('/', (req, res) => {
    
    res.render('index', {layout: false})
})

app.get('/colors', async (req, res) => {
    let sessionKey = req.cookies.session
    if (!sessionKey) {
        res.redirect("/login?message=Not logged in")
        return
    }
    let sessionData = await business.getSessionData(sessionKey)
    if (!sessionData) {
        res.redirect("/login?message=Not logged in")
        return
    }

    if (sessionData && sessionData.data && sessionData.data.usertype && sessionData.data.usertype != 'public') {
        res.redirect("/login?message=Invalid User Type")
        return
    }
    res.render('colors', {layout: false})
})

app.get('/404', (req, res) => {
    
    res.render('404', {layout: false})
})


app.get('/500', (req, res) => {
    
    res.render('500', {layout: false})
})

app.get('/charts', (req, res) => {
    
    res.render('charts', {layout: false})
})

app.get('/login', (req, res) => {

    res.render('login', {layout: false})
})

app.post('/login', async (req, res) => {
    let username = req.body.username
    let password = req.body.password

    let userType = await business.checkLogin(username, password)
    if (!userType) {
        res.redirect("/login?message=Invalid Username/Password")
        return
    }

    let session = await business.startSession({
        username: username,
        usertype: userType
    })
    res.cookie('session', session.sessionkey, {expires: session.expiry})

    if (userType == 'public') {
        res.redirect('/colors')
    }
    else if (userType == 'member') {
        res.redirect('/typography')
    }
    else if(userType == 'admin'){
        res.redirect('/widgets')
    }

})

app.get('/register', (req, res) => {
    
    res.render('register', {layout: false})
})

app.get('/typography', async (req, res) => {
    let sessionKey = req.cookies.session
    if (!sessionKey) {
        res.redirect("/login?message=Not logged in")
        return
    }
    let sessionData = await business.getSessionData(sessionKey)
    if (!sessionData) {
        res.redirect("/login?message=Not logged in")
        return
    }

    if (sessionData && sessionData.data && sessionData.data.usertype && sessionData.data.usertype != 'member') {
        res.redirect("/login?message=Invalid User Type")
        return
    }
    
    res.render('typography', {layout: false})
})

app.get('/widgets', async (req, res) => {
    let sessionKey = req.cookies.session
    if (!sessionKey) {
        res.redirect("/login?message=Not logged in")
        return
    }
    let sessionData = await business.getSessionData(sessionKey)
    if (!sessionData) {
        res.redirect("/login?message=Not logged in")
        return
    }

    if (sessionData && sessionData.data && sessionData.data.usertype && sessionData.data.usertype != 'admin') {
        res.redirect("/login?message=Invalid User Type")
        return
    }
    res.render('widgets', {layout: false})
})

app.listen(8000, () => {console.log('Running')})