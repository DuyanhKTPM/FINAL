const cookieParser = require('cookie-parser')
const JwtService = require('../services/JwtService')
const OrderService = require('../services/OrderService')

const createOrder = async (req, res) => {
    try {
        const { paymentMethod, shippingMethod, itemsPrice, shippingPrice, totalPrice, fullName,
            address, city, phone, retailerName, retailerId } = req.body
        if (!paymentMethod) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The paymentMethod is required'
            })
        } else if (!shippingMethod) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The shippingMethod is required'
            })
        } else if (!itemsPrice) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The itemsPrice is required'
            })
            // } else if (!shippingPrice) {
            //     return res.status(400).json({
            //         status: 'ERR',
            //         message: 'The shippingPrice is required'
            //     })
        } else if (!totalPrice) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The totalPrice is required'
            })
        } else if (!fullName || !address || !city || !phone || !retailerName || !retailerId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The information is required'
            })
        }
        const response = await OrderService.createOrder(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const updateOrder = async (req, res) => {
    try {
        const data = req.body.order
        const orderId = req.body.data._id
        // const id = req.body
        // const data = req.body
        if (!orderId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Sản phẩm không tồn tại'
            })
        }
        const response = await OrderService.updateOrder(orderId, data)

        return res.status(201).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }

}


const getOrderRetailer = async (req, res) => {
    try {
        const retailerId = req.params.id;
        if (!retailerId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'userId là bắt buộc'
            });
        }

        const response = await OrderService.getOrderRetailer(retailerId);
        return res.status(200).json(response); // Trả về mã 200 thay vì 201
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: 'ERR',
            message: 'Đã xảy ra lỗi hệ thống, vui lòng thử lại sau'
        });
    }
}


const getOrderDetails = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'userId là bắt buộc'
            });
        }

        const response = await OrderService.getOrderDetails(userId);
        return res.status(200).json(response); // Trả về mã 200 thay vì 201
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: 'ERR',
            message: 'Đã xảy ra lỗi hệ thống, vui lòng thử lại sau'
        });
    }
}

const getDetailsOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!orderId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'userId là bắt buộc'
            });
        }

        const response = await OrderService.getDetailsOrder(orderId);
        return res.status(200).json(response); // Trả về mã 200 thay vì 201
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: 'ERR',
            message: 'Đã xảy ra lỗi hệ thống, vui lòng thử lại sau'
        });
    }
}

const cancelOrderDetails = async (req, res) => {
    try {
        const data = req.body.orderItems
        const orderId = req.body.orderId

        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The orderId is required'
            })
        }

        const response = await OrderService.cancelOrderDetails(orderId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const getAllOrder = async (req, res) => {
    try {
        const data = await OrderService.getAllOrder()
        return res.status(200).json(data)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id
        if (!orderId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The orderId is required'
            })
        }

        const response = await OrderService.deleteOrder(orderId)
        return res.status(201).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }

}
const deleteManyOrder = async (req, res) => {
    try {
        const ids = req.body.ids
        if (!ids) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The orderId is required'
            })
        }

        const response = await OrderService.deleteManyOrder(ids)
        return res.status(201).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }

}

module.exports = {
    createOrder,
    getOrderDetails,
    getDetailsOrder,
    cancelOrderDetails,
    getAllOrder,
    getOrderRetailer,
    updateOrder,
    deleteOrder,
    deleteManyOrder,
}
