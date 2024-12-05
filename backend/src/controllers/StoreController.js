const cookieParser = require('cookie-parser')

const StoreService = require('../services/StoreService');


const createStore = async (req, res) => {
    try {
        const { name, x, y, retailerId } = req.body
        if (!name) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input name is required'
            })
        } else if (!retailerId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input Y is required'
            })
        }
        else if (!x) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input X is required'
            })
        } else if (!y) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The input Y is required'
            })
        }
        const response = await StoreService.createStore(req.body)
        return res.status(201).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}


const updateStore = async (req, res) => {
    try {
        const StoreId = req.params.id
        const data = req.body
        if (!StoreId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The StoreId is required'
            })
        }

        const response = await StoreService.updateStore(StoreId, data)
        return res.status(201).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }

}

const deleteStore = async (req, res) => {
    try {
        const storeId = req.params.id
        if (!storeId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The storeId is required'
            })
        }

        const response = await StoreService.deleteStore(storeId)
        return res.status(201).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}
const deleteManyStore = async (req, res) => {
    console.log('req', req.body)
    try {
        const ids = req.body.ids
        if (!ids) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The storeIds is required'
            })
        }

        const response = await StoreService.deleteManyStore(ids)
        return res.status(201).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }

}

const getAllStore = async (req, res) => {
    try {
        const { limit, page, sort, filter } = req.query

        const response = await StoreService.getAllStore(
            Number(limit) || 8,
            Number(page) || 0,
            sort,
            filter
        )
        return res.status(201).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}
const getAllStoreRetailer = async (req, res) => {
    try {
        const { limit, page, sort, filter, userId } = req.query
        const response = await StoreService.getAllStoreRetailer(
            Number(limit) || 8,
            Number(page) || 0,
            sort,
            filter,
            userId
        )
        return res.status(201).json(response)
    } catch (e) {
        return res.status(500).json({
            message: e
        })
    }
}

const getDetailsStore = async (req, res) => {
    try {
        const storeId = req.params.id;
        if (!storeId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'storeId là bắt buộc'
            });
        }

        const response = await StoreService.getDetailsStore(storeId);
        return res.status(200).json(response); // Trả về mã 200 thay vì 201
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            status: 'ERR',
            message: 'Đã xảy ra lỗi hệ thống, vui lòng thử lại sau'
        });
    }
}


module.exports = {
    createStore,
    updateStore,
    deleteStore,
    getAllStore,
    deleteManyStore,
    getDetailsStore,
    getAllStoreRetailer
};
