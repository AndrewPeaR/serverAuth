const sqlite3 = require('sqlite3')
const express = require('express')
const session = require('express-session')
const sqliteStoreFactory = require('express-session-sqlite').default
const passport = require('passport')
const cors = require('cors')
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const SqliteStore = sqliteStoreFactory(session)
const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(session({
    secret: 'secret',
    store: new SqliteStore({
        driver: sqlite3.Database,
        path: './prisma/dev.db',
        ttl: 60 * 60 * 1000,
        prefix: 'sess',
        cleanupInterval: 300000
    }),
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 1000
    },
    resave: false,
    saveUninitialized: false
}))

require('./passport-config')
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
    // console.log(req.session);
    res.render('index.ejs', {message: 'Hello, world'})
})

app.get('/login', (req, res) => {
    // console.log(req.session);
    
    res.render('login.ejs', {message: 'Hello, world'})
})
app.get('/register', (req, res) => {
    // console.log(req.session);

    res.render('register.ejs', {user: {}})
})

app.post('/register', async (req, res) => {
    const user = await prisma.user.create({
        data: {
            email: req.body.email,
            passwordHash: req.body.password,
            firstname: 'Test',
            lastname: 'Test'
        }
    })
    res.render('register.ejs', {user: user})
})

app.post('/login', (req, res, next) => {
    passport.authenticate('local', function(err, user){
        if(err)
            return next(err)
        if(!user)
            return res.send('Укажите пароль')
        req.logIn(user, function(err){
            if(err)
                return next(err)
            return res.redirect('/admin')
        })
    })(req, res, next)
})

const authCheck = (req, res, next)=> {
    if(req.isAuthenticated()){
        next()
    } else {
        console.log('не пущу')
        return res.redirect('/login')
    }
}

app.get('/admin', authCheck, (req, res) => {
    res.send('Admin page')
})

app.get('/logout', (req, res) => {
    console.log("Выход!");
    req.logout(function(err) {
        if(err)
            return next(err)
        res.redirect('/')
    })
})

app.listen(PORT, () => {
    console.log(`>>> Server started on port: ${PORT}`);
})