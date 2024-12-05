const cookieParser = require('cookie-parser')

const Comment = require("../models/Comment")


const createComment = (newComment) => {
    return new Promise(async (resolve, reject) => {
        const { productId, userId, text, rating } = newComment
        try {

            const createdComment = await Comment.create({
                productId, userId, text, rating
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
const getComments = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const comments = await Comment.find({
                productId: id
            })
            if (comments === null) {
                resolve({
                    status: 'ERR',
                    message: 'The comments is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: ' SUCCESS',
                data: comments
            })

        } catch (e) {
            reject(e)
        }
    })
}
const deleteComment = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkComment = await Store.findOne({
                _id: id
            })
            if (checkComment === null) {
                resolve({
                    status: 'OK',
                    message: 'The comment is not defined'
                })
            }
            await Store.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Đã xóa bình luận thành công',
            })
        } catch (e) {
            reject(e)
        }
    })
}
module.exports = {
    createComment,
    getComments,
    deleteComment,
}