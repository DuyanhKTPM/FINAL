const cookieParser = require('cookie-parser')

const Store = require('../models/StoreModel')

const createStore = (newStore) => {
    return new Promise(async (resolve, reject) => {
        const { name, x, y, retailerId } = newStore
        try {
            const checkStore = await Store.findOne({
                name: name
            })
            if (checkStore !== null) {
                resolve({
                    status: 'ERR',
                    message: 'The name of store is already'
                })
            }

            const createdStore = await Store.create({
                name, x, y, retailerId
            })
            if (createdStore) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createdStore
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsStore = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const store = await Store.findOne({
                _id: id
            })
            if (store === null) {
                resolve({
                    status: 'ERR',
                    message: 'The store is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: ' SUCCESS',
                data: store
            })

        } catch (e) {
            reject(e)
        }
    })
}

const updateStore = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkStore = await Store.findOne({ _id: id });
            if (checkStore === null) {
                resolve({
                    status: 'ERR',
                    message: 'The Store is not defined'
                });
            }
            const updatedStore = await Store.findByIdAndUpdate(id, data, { new: true });
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedStore
            });
        } catch (e) {
            reject(e);
        }
    });
}

const getAllStoreRetailer = (limit, page, sort, filter, userId) => {
    return new Promise(async (resolve, reject) => {
        try {

            const totalStore = await Store.countDocuments({ retailerId: userId });

            let query = { retailerId: userId };

            if (filter) {
                const [label, value] = filter;
                query[label] = { '$regex': value, '$options': 'i' };
            }

            let storeQuery = Store.find(query)
                .limit(limit)
                .skip(page * limit);

            if (sort) {
                const sortField = sort[1];
                const sortOrder = sort[0];
                storeQuery = storeQuery.sort({ [sortField]: sortOrder });
            }

            const allStores = await storeQuery;

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allStores,
                total: totalStore,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalStore / limit)
            });
        } catch (e) {
            reject(e);
        }
    });
};

const deleteStore = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkStore = await Store.findOne({
                _id: id
            })
            if (checkStore === null) {
                resolve({
                    status: 'OK',
                    message: 'The store is not defined'
                })
            }
            await Store.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: 'Delete store SUCCESS',

            })

        } catch (e) {
            reject(e)
        }
    })
}
const deleteManyStore = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Store.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete store SUCCESS',

            })

        } catch (e) {
            reject(e)
        }
    })
}

const getAllStore = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            
            const totalStore = await Store.countDocuments()
            if (filter) {
                const label = filter[0];
                const allObjectFilter = await Store.find({ [label]: { '$regex': filter[1] } }).limit(limit).skip(page * limit)
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: allObjectFilter,
                    total: totalStore,
                    pageCurrent: Number(page + 1),   // Trang hiện tại, tính từ 1
                    totalPage: Math.ceil(totalStore / limit)
                });
            }
            if (sort) {
                const objectSort = {}
                objectSort[sort[1]] = sort[0]
                const allStoreSort = await Store.find().limit(limit).skip(page * limit).sort(objectSort)
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: allStoreSort,
                    total: totalStore,
                    pageCurrent: Number(page + 1),   // Trang hiện tại, tính từ 1
                    totalPage: Math.ceil(totalStore / limit)
                });
            }
            const allStore = await Store.find().limit(limit).skip(page * limit)
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: allStore,
                total: totalStore,
                pageCurrent: Number(page + 1),   // Trang hiện tại, tính từ 1
                totalPage: Math.ceil(totalStore / limit)
            });

        } catch (e) {
            reject(e);
        }
    });
}





module.exports = {
    createStore,
    updateStore,
    deleteStore,
    getAllStore,
    getDetailsStore,
    deleteManyStore,
    getAllStoreRetailer,
}