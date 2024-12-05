import React from "react";
import {
  StyleNameProduct,
  WrapperCardStyle,
  WrapperDiscountText,
  WrapperPriceText,
  WrapperReportText,
  WrapperStyleText,
} from "./Style";
import { StarFilled } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { convertPrice } from "../../utils";

const CardComponent = (props) => {
  const {
    countInStock,
    image,
    name,
    price,
    rating,
    selled,
    discount,
    id,
    retailerName,
  } = props;
  const navigate = useNavigate();

  const handleGetDetailsProduct = (id) => {
    navigate(`/product-details/${id}`);
  };
  return (
    <WrapperCardStyle
      hoverable
      style={{ width: "200px" }}
      cover={<img alt="example" src={image} />}
      onClick={() => countInStock !== 0 && handleGetDetailsProduct(id)} // Kiểm tra countInStock trước khi điều hướng
      disabled={countInStock === 0} // Disabled khi sản phẩm hết hàng
    >
      <StyleNameProduct>{name}</StyleNameProduct>
      <WrapperReportText>
        <span style={{ marginRight: "4px" }}>
          <span>{rating} </span>
          {/* <StarFilled style={{ fontSize: "10px", color: "yellow" }} /> */}
        </span>
        <WrapperStyleText> | Đã bán {selled || 0}</WrapperStyleText>
      </WrapperReportText>
      <h2>{retailerName}</h2>
      <WrapperPriceText>
        <span style={{ marginRight: "10px" }}> {convertPrice(price)} </span>
        {/* <WrapperDiscountText>{discount || 5}%</WrapperDiscountText> */}
      </WrapperPriceText>
    </WrapperCardStyle>
  );
};

export default CardComponent;
