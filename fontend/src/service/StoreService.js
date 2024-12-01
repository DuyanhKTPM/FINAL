import axios from "axios"

export const axiosJWT = axios.create()

export const getAllStore = async (search, limit) => {
    let res = {}
    if (search?.length > 0) {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/store/get-all?filter=name&filter=${search}&limit=${limit}`)
    } else {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/store/get-all?limit=${limit}`)
    }
    return res.data
}

export const getDetailsStore = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/store/get-details/${id}`)
    return res.data
}

export const createStore = async (data) => {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/store/create`, data)
    return res.data

}

export const updateStore = async (id, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/store/update/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}
export const deleteStore = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/store/delete/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}
export const deleteManyStore = async (data, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/store/deleteMany-store/`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}
export const getAllStoreRetailer = async (userId, search, limit) => {
    let res = {}
    if (search?.length > 0) {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/store/get-all-retailer?userId=${userId}&filter=name&filter=${search}&limit=${limit}`)
    } else {
        res = await axios.get(`${process.env.REACT_APP_API_URL}/store/get-all-retailer?userId=${userId}&limit=${limit}`)
    }
    return res.data
}