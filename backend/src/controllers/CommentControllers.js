
const CommentService = require('../services/CommentServices')


const createComment = async (req, res) => {
    try {
        const { productId, userId, text, rating } = req.body
        if (!productId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Sản phẩm không tồn tại'
            })
        } else if (!userId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Chưa đănng nhập'
            })
        }
        else if (!rating) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Chọn số sao'
            })
        }
        else if (!text) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Nhập đánh giá'
            })
        }
        const response = await CommentService.createComment(req.body)

        return res.status(201).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}
const getComments = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!productId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'ProductId là bắt buộc'
            });
        }

        const response = await CommentService.getComments(productId);
        return res.status(200).json(response); // Trả về mã 200 thay vì 201
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: 'ERR',
            message: 'Đã xảy ra lỗi hệ thống, vui lòng thử lại sau'
        });
    }
}
const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id
        if (!commentId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The commentId is required'
            })
        }
        const response = await CommentService.deleteComment(commentId)
        return res.status(201).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}
module.exports = {
    createComment,
    getComments,
    deleteComment,
}