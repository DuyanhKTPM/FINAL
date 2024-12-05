import React from 'react'
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent'
import { useNavigate, useParams } from 'react-router'


const ProductDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  return (
    <div style={{ width: '100%', height: '100%', background: '#efefef' }}>
      <div style={{ width: '100%', height: '100%', background: '#e7dee2', margin: '0 auto' }}>
        <p style={{ fontSize: '18px', fontWeight: "bold", marginTop: "0", padding: "10px" }}
        >
          <span style={{ cursor: 'pointer' }} onClick={() => { navigate('/') }}>Trang chủ</span> - <u>Chi tiết sản phẩm</u>
        </p>
        <ProductDetailsComponent idProduct={id} />
      </div>
    </div>

  )
}

export default ProductDetailsPage