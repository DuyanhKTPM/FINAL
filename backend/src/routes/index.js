const UserRouter = require('./UserRouter')
const ProductRouter = require('./ProductRouter')
const OrderRouter = require('./OrderRouter')
const PaymentRouter = require('./PaymentRouter')
const StoreRouter = require('./StoreRouter')
const CommentRoutes = require('./CommentRoutes')

const routes = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/product', ProductRouter)
    app.use('/api/order', OrderRouter)
    app.use('/api/store', StoreRouter)
    app.use('/api/payment', PaymentRouter)
    app.use('/api/store', StoreRouter)
    app.use('/api/comment', CommentRoutes)
}

module.exports = routes