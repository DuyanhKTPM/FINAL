const cookieParser = require('cookie-parser')

const ProductService = require('../services/ProductService');


const createProduct = async (req, res) => {
    try {
        const { name, image, type, price, countInStock, rating, description, discount
            , origin, uses, report, preserve, retailerName, retailerId } = req.body

        console.log('req.bodysssssssssssssssssssss', req.body)

        if (!name) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input name is required'
            })
        } else if (!image) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input image is required'
            })
        } else if (!type) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input type is required'
            })
        } else if (!price) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input price is required'
            })
        } else if (!description) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input price is required'
            })
        }
        else if (!countInStock) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input cit is required'
            })
        } else if (!rating) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input rating is required'
            })
        } else if (!uses) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input rating is required'
            })
        } else if (!origin) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input rating is required'
            })
        } else if (!report) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input rating is required'
            })
        } else if (!preserve) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input rating is required'
            })
        } else if (!retailerName) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The retailerName is required'
            })
        } else if (!retailerId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The retailerId is required'
            })
        }
        // else if (!discount) {
        //     return res.status(400).json({
        //         status: 'ERR',
        //         message: 'The discount is required'
        //     })
        // }

        const response = await ProductService.createProduct(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}


const updateProduct = async (req, res) => {
    try {
        const ProductId = req.params.id
        const data = req.body
        if (!ProductId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The ProductId is required'
            })
        }
        const response = await ProductService.updateProduct(ProductId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }

}

const getDetailsProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!productId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'ProductId là bắt buộc'
            });
        }

        const response = await ProductService.getDetailsProduct(productId);
        return res.status(200).json(response);
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: 'ERR',
            message: 'Đã xảy ra lỗi hệ thống, vui lòng thử lại sau'
        });
    }
}


const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id
        if (!productId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }

        const response = await ProductService.deleteProduct(productId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }

}
const deleteManyProduct = async (req, res) => {
    console.log('req', req.body)
    try {
        const ids = req.body.ids
        if (!ids) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The productId is required'
            })
        }

        const response = await ProductService.deleteManyProduct(ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }

}

const getAllProduct = async (req, res) => {
    try {
        const { limit, page, sort, filter } = req.query
        const response = await ProductService.getAllProduct(
            Number(limit) || 8,
            Number(page) || 0,
            sort,
            filter
        )
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}
const getAllProductRetailer = async (req, res) => {
    try {
        const { limit, page, sort, filter, userId } = req.query

        const response = await ProductService.getAllProductRetailer(
            Number(limit) || 8,
            Number(page) || 0,
            sort,
            filter,
            userId
        )
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}
const getAllType = async (req, res) => {
    try {
        const response = await ProductService.getAllType()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }

}
module.exports = {
    createProduct,
    updateProduct,
    getDetailsProduct,
    deleteProduct,
    getAllProduct,
    getAllProductRetailer,
    deleteManyProduct,
    getAllType,
};
