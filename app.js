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

app.get('/colors', (req, res) => {
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

app.get('/register', (req, res) => {
    
    res.render('register', {layout: false})
})

app.get('/typography', (req, res) => {
    
    res.render('typography', {layout: false})
})

app.get('/widgets', (req, res) => {
    
    res.render('widgets', {layout: false})
})

app.listen(8000, () => {console.log('Running')})