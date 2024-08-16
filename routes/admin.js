const Router = require("express").Router;
const router = new Router();

const PostsController = require('../controllers/posts-controller')
const AdminController = require('../controllers/admin-controller')

router.get('/', (req, res) => {
    res.render('admin.ejs')
})

router.get('/create', (req, res) => {
    res.render('create.ejs')
})

router.post('/create', PostsController.createPost)

module.exports = router