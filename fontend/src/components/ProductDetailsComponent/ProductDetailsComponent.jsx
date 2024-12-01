import { Col, Row, Image } from "antd";
import { Rate } from "antd";

import React, { useState } from "react";
// import imageProductSmall from '../../assets/images/2.webp'
import {
  WrapperInputNumber,
  WrapperPriceProduct,
  WrapperPriceTextProduct,
  WrapperQualityProduct,
  WrapperStyleNameProduct,
  WrapperStyleText,
} from "./style";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import * as ProductService from "../../service/ProductService";
import { useQuery } from "@tanstack/react-query";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { addOrder } from "../../redux/slides/orderSlide";
import { convertPrice } from "../../utils";
import * as Message from "../../components/Message/Message";

const ProductDetailsComponent = ({ idProduct }) => {
  const [numProduct, setNumProduct] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const onChange = (value) => {
    setNumProduct(Number(value));
  };

  const fetchGetDetailsProduct = async () => {
    // const id = context?.queryKey && context?.queryKey[0]
    // if(id){
    const res = await ProductService.getDetailsProduct(idProduct);
    return res.data;
    // }
  };

  const handleChangeCount = (type) => {
    if (type === "increase") {
      // Kiểm tra nếu số lượng hiện tại nhỏ hơn số lượng trong kho
      if (numProduct < productDetails?.countInStock) {
        setNumProduct(numProduct + 1);
      } else {
        Message.warning(
          "Số lượng sản phẩm không được vượt quá số lượng trong kho!"
        );
      }
    } else {
      // Đảm bảo số lượng không giảm xuống dưới 1
      if (numProduct > 1) {
        setNumProduct(numProduct - 1);
      } else {
        Message.warning("Số lượng sản phẩm phải ít nhất là 1!");
      }
    }
  };

  const { data: productDetails } = useQuery({
    queryKey: ["product-details", idProduct],
    queryFn: () => fetchGetDetailsProduct(idProduct),
    enabled: !!idProduct,
  });
  console.log("productDetails", productDetails);
  const handleAddOrderProduct = () => {
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname });
    } else {
      dispatch(
        addOrder({
          orderItem: {
            name: productDetails?.name,
            amount: numProduct,
            image: productDetails?.image,
            price: productDetails?.price,
            product: productDetails?._id,
            dicount: productDetails?.discount,
            countInStock: productDetails?.countInStock,
            retailerName: productDetails?.retailerName,
            retailerId: productDetails?.retailerId,
          },
        })
      );
      Message.success("Thêm sản phẩm vào giỏ hàng thành công!");
    }
  };
  return (
    <div
      style={{
        marginLeft: "120px",
        marginRight: "120px",
        paddingBottom: "40px",
      }}
    >
      <Row style={{ background: "#fff", borderRadius: "8px", padding: "15px" }}>
        <Col
          span={10}
          style={{ borderRight: "1px solid #aaa", paddingRight: "8px" }}
        >
          <Image
            src={productDetails?.image}
            alt="image product"
            preview="false"
          />
          {/* <div>
                <Image src= {imageProductSmall} alt="image small" preview ="false"/>
                <Image src= {imageProductSmall} alt="image small" preview ="false"/>
                <Image src= {imageProductSmall} alt="image small" preview ="false"/>
                <Image src= {imageProductSmall} alt="image small" preview ="false"/>
            </div> */}
        </Col>

        <Col span={14} style={{ paddingLeft: "10px" }}>
          <WrapperStyleNameProduct>
            {productDetails?.name}
          </WrapperStyleNameProduct>

          <div>
            <Rate
              allowHalf
              defaultValue={productDetails?.rating}
              value={productDetails?.rating}
            />
            <WrapperStyleText>
              {" "}
              || {productDetails?.countInStock}
            </WrapperStyleText>
          </div>
          <WrapperPriceProduct>
            <WrapperPriceTextProduct>
              <span>Giá: </span>
              {convertPrice(productDetails?.price)}
            </WrapperPriceTextProduct>
          </WrapperPriceProduct>
          {/* <WrapperAddressProduct>
                <span>Địa chỉ: </span>
                <span className='addres' >{user.address}</span>
                <span className='change-address'>Đổi Địa chỉ</span>
              </WrapperAddressProduct> */}
          <div
            style={{
              margin: "5px 0 15px",
              borderTop: "1px solid #aaa",
              borderBottom: "1px solid #aaa",
              padding: "10px 0",
            }}
          >
            <div style={{ marginBottom: "10px", fontSize: "18px" }}>
              Số Lượng:{" "}
            </div>
            <WrapperQualityProduct>
              <button
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                <MinusOutlined
                  style={{ color: "#000", fontSize: "20px" }}
                  onClick={() => handleChangeCount("decrease")}
                />
              </button>
              <WrapperInputNumber
                value={numProduct}
                defaultValue={1}
                onChange={onChange}
              ></WrapperInputNumber>
              <button
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                <PlusOutlined
                  style={{ color: "#000", fontSize: "20px" }}
                  onClick={() => handleChangeCount("increase")}
                />
              </button>
            </WrapperQualityProduct>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <ButtonComponent
              size={20}
              styleButton={{
                backgroundColor: "rgb(97, 193, 72)",
                width: "100%",
                height: "50px",
              }}
              styleTextButton={{
                color: "#fff",
                fontWeight: "bold",
              }}
              onClick={handleAddOrderProduct}
              textButton={"Thêm vào giỏ hàng"}
            ></ButtonComponent>
          </div>
        </Col>
      </Row>
      <Row
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          marginTop: "10px",
          padding: "10px",
        }}
      >
        <div style={{ width: "100%" }}>
          <span
            style={{
              fontSize: "20px",
              display: "flex",
              marginBottom: "10px",
              color: "#556B2F",
            }}
          >
            <b>TÊN CỬA HÀNG</b>
            <div
              style={{ color: "green", marginLeft: "20px", fontWeight: "700" }}
            >
              {productDetails?.retailerName}
            </div>
          </span>
          <span
            style={{
              fontSize: "20px",
              display: "flex",
              borderTop: "2px solid #ccc",
              paddingTop: "15px",
              color: "#556B2F",
            }}
          >
            <b> ĐIỂM NỖI BẬC</b>
          </span>
        </div>
        <div
          style={{
            fontSize: "300%",
            display: "flex",
            color: "blue",
            justifyContent: "center",
            marginBottom: "20px",
            fontFamily: "self",
          }}
        >
          <span
            style={{
              color: "green",
              paddingTop: "10px",
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
            }}
          >
            {productDetails?.name}
          </span>
        </div>

        <div style={{ width: "100%", borderTop: "2px solid #ccc" }}>
          <b style={{ color: "#556B2F", fontSize: "20px" }}>MÔ TẢ SẢN PHẨM: </b>
          <p style={{ fontSize: "20px" }}>{productDetails?.description}</p>
          <div style={{ textAlign: "center" }}>
            <Image
              style={{
                border: "1px solid #00FF00",
                width: "300px",
                borderRadius: "50%",
              }}
              src={productDetails?.image}
              alt="image product"
              preview={false}
            />
          </div>
        </div>
        <div
          style={{
            width: "100%",
            borderTop: "2px solid #ccc",
            marginTop: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <b style={{ fontSize: "20px", color: "#556B2F" }}>Xuất xứ:</b>
            <span
              style={{ marginLeft: "10px", fontSize: "18px", marginTop: "5px" }}
            >
              {productDetails?.origin}
            </span>
          </div>
        </div>

        <div
          style={{
            width: "100%",
            borderTop: "2px solid #ccc",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <b style={{ fontSize: "20px", color: "#556B2F", display: "flex" }}>
              Công dụng:
            </b>
            <span
              style={{
                marginLeft: "10px",
                fontSize: "18px",
                marginTop: "5px",
                display: "flex",
              }}
            >
              {productDetails?.uses}
            </span>
          </div>
        </div>
        {/* -------------------------------- */}

        <div
          style={{
            width: "100%",
            borderTop: "2px solid #ccc",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <b style={{ fontSize: "20px", color: "#556B2F" }}>
              Cảnh báo an toàn:
            </b>
            <span
              style={{ marginLeft: "10px", fontSize: "18px", marginTop: "5px" }}
            >
              {productDetails?.report}
            </span>
          </div>
        </div>

        <div
          style={{
            width: "100%",
            borderTop: "2px solid #ccc",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <b style={{ fontSize: "20px", color: "#556B2F" }}>Cách bảo quản:</b>
            <span
              style={{ marginLeft: "10px", fontSize: "18px", marginTop: "5px" }}
            >
              {productDetails?.preserve}
            </span>
          </div>
        </div>
      </Row>
    </div>
  );
};

export default ProductDetailsComponent;
