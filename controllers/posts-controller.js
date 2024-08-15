const postService = require('../services/posts-service')

class PostController {
    async createPost(req, res, next) {
        try {
            const newPost = await postService.createPost(req.body)
        } catch(err) {
            next(err)
        }
    }
}

module.exports = new PostController()