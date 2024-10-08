require('dotenv').config()
const sqlite3 = require('sqlite3')
const express = require('express')
const session = require('express-session')
const sqliteStoreFactory = require('express-session-sqlite').default
const passport = require('passport')
const cors = require('cors')
const router = require('./routes/routes')
const path = require('path')


const app = express()
const PORT = process.env.PORT || 3001

app.engine('ejs', require('ejs-mate'))
app.set('views', path.join(__dirname, 'views'))
app.set('view-engine', 'ejs')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')));

const SqliteStore = sqliteStoreFactory(session)
app.use(session({
    secret: process.env.SESSION_SECRET,
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

require('./config/passport-config')
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
    if(req.user?.email)
        res.render('pages/index.ejs', {user: req.user.email})
    else
        res.render('pages/index.ejs', {user: 'Авторизуйтесь'})
})

app.use('/', router)

app.listen(PORT, () => {
    console.log(`>>> Server started on port: ${PORT}`);
})