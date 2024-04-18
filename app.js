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

app.post('/register', async (req, res) => {

    let errors = {}

    if (!req.body.username || req.body.username.trim() == '') {
        errors.usernameError = "Please enter a username."

    }else{
        let user = await business.getUserDetails(req.body.username)
        if(user){
            errors.userExistsError = "This username already exists."
        }
    }


    if (!req.body.email || req.body.email.trim() == '') {
        errors.emailError = "Please enter an email."
    }

    if (!req.body.password || req.body.password.trim() == '') {
        errors.passwordError = "Please enter a password."
    }

    if (!req.body.repeatpassword || req.body.repeatpassword.trim() == '') {
        errors.repeatError = "Please re-enter your password."

    }else if (req.body.password !== req.body.repeatpassword){
        errors.matchError = "Your password does not match the re-entered password."
    }

    if (Object.keys(errors).length > 0) {
        res.render('register', { layout: false, errors: errors, username: req.body.username, email: req.body.email, password: req.body.password })
        return
    }

    let postData = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        usertype: "member"
    }

    await business.registerUser(postData)

    let message = "Registered Successfully"

    res.redirect(`/?message=${message}`)

})

app.get('/typography', async (req, res) => {
    /*let sessionKey = req.cookies.session
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
    }*/
    
    let allLocations = await business.getAllLocations()

    res.render('typography', {layout: false, allLocations: allLocations})
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

    let token = await business.generateFormToken(sessionKey)

    res.render('addpost', {layout: false, data: data, csrfToken: token})
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

    let token = req.body.csrfToken
    if (!sessionData.csrfToken) {
        let message = "CSRF token issue"
        res.redirect(`/posts/${data.name}?message=${message}`)
        return
    }
    if (sessionData.csrfToken != token) {
        let message = "CSRF token issue"
        res.redirect(`/posts/${data.name}?message=${message}`)
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

    await business.cancelToken(sessionKey)

    let message = 'Post Added'
    res.redirect(`/posts/${location}?message=${message}`)
})

app.get('/dashboard/data', async (req, res) => {
    let allLocations = await business.getAllLocations()

    let latestPosts = []
    for (i of allLocations){
        let latestPost = null
        let latestDate = null

        for (post of i.posts){
            const postDate = new Date(post.timestamp);
            if(!latestDate || postDate > latestDate){
                latestDate = postDate
                latestPost = post
            }
        }
        latestPosts.push(latestPost)
    }

    let response = {
        allLocations: allLocations,
        latestPosts: latestPosts

    }
    res.json(response)
})

app.use((req,res) => {
    res.status(404).render('404', {layout: undefined});
})


app.listen(8000, () => {console.log('Running')})