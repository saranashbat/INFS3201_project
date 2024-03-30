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

app.get('/charts', async (req, res) => {
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
    res.render('charts', {layout: false})
})

app.get('/404', (req, res) => {
    
    res.render('404', {layout: false})
})


app.get('/500', (req, res) => {
    
    res.render('500', {layout: false})
})

app.get('/colors', async (req, res) => {
    let locations = await business.getAllLocations() 
    res.render('colors', {layout: false, location: locations})
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

    if (userType == 'member') {
        res.redirect('/colors')
    }
    else if(userType == 'admin'){
        res.redirect('/typography')
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

    if (sessionData && sessionData.data && sessionData.data.usertype && sessionData.data.usertype != 'admin') {
        res.redirect("/login?message=Invalid User Type")
        return
    }
    
    res.render('typography', {layout: false})
})

app.get('/widgets', async (req, res) => {
    
    res.render('widgets', {layout: false})
})

app.use('/posts/:name', express.static(path.join(__dirname, 'coreui')));

app.get('/posts/:name', async (req, res) =>{
    let location = req.params.name
    let data = await business.getLocation(location)

    if(data){
        res.render('posts', {layout: false, data: data})
    }//put 404 error
})

app.listen(8000, () => {console.log('Running')})