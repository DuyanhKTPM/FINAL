
const CommentService = require('../services/CommentServices')


const createComment = async (req, res) => {
    try {
        const {productId,text,rating} = req.body
        if (!productId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Sản phẩm không tồn tại'
            })
        }
       else if (! rating) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Chọn số sao'
            })
        }
        else if ( !text) {
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
module.exports = {
    createComment,

}