import axios from "axios"
export const axiosJWT = axios.create()

export const createComment = async (data, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/comment/createComment`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}
export const getDetailsProductComments = async (id) => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/comment/get-comments/${id}`)
    return res.data

}
export const deleteComment = async (id, access_token) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/comment/delete-comment/${id}`, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}
export const updateComment = async (id, access_token, data) => {
    const res = await axiosJWT.put(`${process.env.REACT_APP_API_URL}/comment/update-comment/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`,
        }
    })
    return res.data
}