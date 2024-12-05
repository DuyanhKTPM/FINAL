const cookieParser = require('cookie-parser')

const Comment = require("../models/Comment")


const createComment = (newComment) => {
    return new Promise(async (resolve, reject) => {
        const { productId,text, rating } = newComment
        try {

            const createdComment = await Comment.create({
                productId,text, rating
            })
            if (createdComment) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdComment
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    createComment,

}