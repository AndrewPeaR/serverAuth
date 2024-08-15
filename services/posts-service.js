const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();



class PostsService {
    async createPost(postInfo){
        const newPost = await prisma.Posts.create({
            data: {        
                title: postInfo.title,
                description: postInfo.description
                author_id: postInfo.
                author       
                slug         
                sanitizedHtml
            }
        })
    }
}