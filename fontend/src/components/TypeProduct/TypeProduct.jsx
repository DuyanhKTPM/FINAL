import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./style.css";
const TypeProduct = ({ name }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy đường dẫn hiện tại

  const handleNavigateType = (type) => {
    navigate(
      `/product/${type
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        ?.replace(/ /g, "_")}`,
      { state: type }
    );
  };

  const isActive = location.state === name;

  return (
    <div
      className={`type-product ${isActive ? "active" : ""}`}
      onClick={() => handleNavigateType(name)}
    >
      {name}
    </div>

  );
};

export default TypeProduct;
