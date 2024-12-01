import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    orderItems: [],
    orderItemsSelected: [],
    shippingAddress: {},
    paymentMethod: '',
    shippingMethod: '',
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
    user: '',
    isPaid: false,
    paidAt: '',
    isDelivered: false,
    deliveredAt: '',
}

export const orderSlide = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addOrder: (state, action) => {
            const { orderItem } = action.payload;
            // Tìm sản phẩm trong orderItems
            const itemOrder = state.orderItems.find((item) => item.product === orderItem.product)

            if (itemOrder) {
                // Cập nhật số lượng của sản phẩm
                itemOrder.amount += orderItem.amount; // Thay đổi số lượng ở đây
            } else {
                // Nếu không tìm thấy, thêm sản phẩm mới
                state.orderItems.push(orderItem);
            }
        },
        increaseAmount: (state, action) => {
            const { idProduct } = action.payload;
            const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct)
            const itemOrderSelected = state?.orderItemsSelected?.find((item) => item?.product === idProduct)
            itemOrder.amount++;
            if (itemOrderSelected) {
                itemOrderSelected.amount++;
            }
        },
        decreaseAmount: (state, action) => {
            const { idProduct } = action.payload;
            const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct)
            const itemOrderSelected = state?.orderItemsSelected?.find((item) => item?.product === idProduct)
            itemOrder.amount--;
            if (itemOrderSelected) {
                itemOrderSelected.amount--;
            }
        },
        updateAmount: (state, action) => {
            const { idProduct, value } = action.payload;
            const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct);
            const itemOrderSelected = state?.orderItemsSelected?.find((item) => item?.product === idProduct);
            if (itemOrder) {
                itemOrder.amount = value;
            }
            if (itemOrderSelected) {
                itemOrderSelected.amount = value;
            }
        },
        removeOrder: (state, action) => {
            const { idProduct } = action.payload;
            const itemOrder = state?.orderItems?.filter((item) => item?.product !== idProduct);
            const itemOrderSelected = state?.orderItems?.filter((item) => item?.product !== idProduct);

            state.orderItems = itemOrder
            if (itemOrderSelected) {
                state.orderItemsSelected = itemOrder
            }
        },
        removeAllOrder: (state, action) => {
            const { listCheck } = action.payload;const itemOrders = state?.orderItems?.filter((item) => !listCheck.includes(item.product));
            const itemOrderSelected = state?.orderItems?.filter((item) => !listCheck.includes(item.product));

            state.orderItems = itemOrders
            if (itemOrderSelected) {
                state.orderItemsSelected = itemOrders
            }
        },
        selectedOrder: (state, action) => {
            const { listCheck } = action.payload
            const orderSelected = []
            state.orderItems.forEach((order) => {
                if (listCheck.includes(order.product)) {
                    orderSelected.push(order)
                }
            })
            state.orderItemsSelected = orderSelected
        }
    }
})

export const { addOrder, removeOrder, increaseAmount, decreaseAmount, updateAmount, removeAllOrder, selectedOrder } = orderSlide.actions;

export default orderSlide.reducer;