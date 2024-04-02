const express = require('express') 
const business = require('./business.js') 
const bodyParser = require('body-parser') 
const cookieParser = require('cookie-parser') 
const handlebars = require('express-handlebars')
const path = require('path');
const fileUpload=require('express-fileupload')


let app = express()
app.use(fileUpload())


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
        res.redirect('/')
    }
    else if(userType == 'admin'){
        res.redirect('/')
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

app.use('/posts/:name', express.static(path.join(__dirname, 'coreui')))

app.get('/posts/:name', async (req, res) =>{
    let location = req.params.name
    let data = await business.getLocation(location)

    if(!data){
        res.status(404).render('404', {layout: false})
        return
    }
    res.render('posts', {layout: false, data: data})

})

app.get('/posts/:name/add', async (req, res) =>{
    let location = req.params.name
    let data = await business.getLocation(location)

    if(!data){
        res.status(404).render('404', {layout: false})
        return
    }

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

    res.render('addpost', {layout: false, data: data})
})


app.post('/posts/:name/add', async (req, res) =>{
    let location = req.params.name
    let data = await business.getLocation(location)

    if(!data){
        return
    }

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

    let errors = {}
    //image upload check
    let fileName = ''
    if(req.files && req.files.image){
        let image = req.files.image
        fileName = image.name

        const extensions = ['.jpg', '.jpeg', '.png', '.gif'];
        const fileExtension = path.extname(fileName).toLowerCase();

        if (!extensions.includes(fileExtension)) {
            errors.extError = "Please add a file with a supported extension (.jpg, .jpeg, .png, .gif)"
            
        }

        await image.mv(`${__dirname}/coreui/images/${fileName}`)
    }

    
    if (!req.body.title || req.body.title.trim() == '') {
        errors.titleError = "Please enter a title."
    }

    if (!req.body.content || req.body.content.trim() == '') {
        errors.contentError = "Please enter a description."
    }

    if (Object.keys(errors).length > 0) {
        res.render('addpost', { layout: false, data: data, errors: errors })
        return
    }

    let postData = {
        title: req.body.title, 
        content: req.body.content,
        user: sessionData.data.username,
        image: fileName,
        food_added: req.body.food_added,
        water_added: req.body.water_added,
        current_food_level: req.body.current_food_level, 
        cat_count: req.body.cat_count,
        health_issue: req.body.health_issue, 
        timestamp: new Date().toISOString()
    }

    let locationName = data.name

    await business.addPost(locationName, postData)

    let message = 'Post Added'

    res.redirect(`/posts/${location}?message=${message}`)
})

app.use((req,res) => {
    res.status(404).render('404', {layout: undefined});
});


app.listen(8000, () => {console.log('Running')})