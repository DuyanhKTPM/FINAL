import { Badge, Col, Popover } from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { resetUser } from "../../redux/slides/userSlide";
import { searchProduct } from "../../redux/slides/productSlide";
import {
  WrapperHeader,
  WrapperTextHeader,
  WrapperHeaderAccount,
  WrapperTextHeaderSmall,
  WrapperContentPopup,
  WrapperHeaderMap,
} from "./Style";
import ButtonSearch from "../ButtonSearch/ButtonSearch";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { FaMapLocationDot } from "react-icons/fa6";
import * as UserService from "../../service/UserService";

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setUserName(user?.name);
    setUserAvatar(user?.avatar);
  }, [user?.name, user?.avatar]);

  if (user?.role === "User") {
    isHiddenSearch = false;
    isHiddenCart = false;
  } else {
    isHiddenSearch = true;
    isHiddenCart = true;
  }

  const handleNavigateLogin = () => navigate("/sign-in");
  const handleNavigateHome = () => navigate("/");
  const handleNavigateMap = () => navigate("/map");

  const handleLogout = async () => {
    await UserService.logoutUser(user?.access_token);
    dispatch(resetUser());
  };

  const onSearch = (e) => {
    dispatch(searchProduct(e.target.value));
  };

  const content = (
    <div>
      <WrapperContentPopup onClick={() => handleClickNavigate("profile")}>
        Thông tin tài khoản
      </WrapperContentPopup>
      {user?.role == "User" && (
        <WrapperContentPopup onClick={() => handleClickNavigate("order")}>
          Đơn hàng của tôi
        </WrapperContentPopup>
      )}
      {user?.role == "Admin" && (
        <WrapperContentPopup onClick={() => handleClickNavigate("admin")}>
          Quản lý hệ thống
        </WrapperContentPopup>
      )}
      {user?.role == "Retailer" && (
        <WrapperContentPopup onClick={() => handleClickNavigate("retailer")}>
          Quản lý sản phẩm
        </WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={() => handleClickNavigate("logout")}>
        Đăng xuất
      </WrapperContentPopup>
    </div>
  );

  const handleClickNavigate = (type) => {
    switch (type) {
      case "profile":
        navigate("/profile-user");
        break;
      case "admin":
        navigate("/system/admin");
        break;
      case "retailer":
        navigate("/system/retailer");
        break;
      case "order":
        navigate("/my-order", {
          state: {
            id: user?.id,
            token: user?.access_token,
          },
        });
        break;
      case "logout":
        navigate("/sign-in");
        handleLogout();
        break;
      default:
        break;
    }
    setIsOpenPopup(false);
  };

  return (
    <div>
      <WrapperHeader
        style={{
          justifyContent:
            isHiddenSearch && isHiddenCart ? "space-between" : "unset",
        }}
      >
        <Col span={5} style={{ display: "flex", alignItems: "center" }}>
          <div
            onClick={handleNavigateHome}
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <div style={styles.logoCircle}>
              <span style={styles.logoSymbol}>N</span>
            </div>
            <WrapperTextHeader
              style={{
                fontSize: "20px",
                textAlign: "center",
                color: "#fff",
                marginLeft: "10px",
              }}
            >
              Nông Nghiệp Xanh
            </WrapperTextHeader>
          </div>
        </Col>
        {!isHiddenSearch && (
          <Col span={10}>
            <ButtonSearch
              placeholder="Nhập Tên Sản Phẩm"
              textButton="Tìm Kiếm"
              bordered={false}
              onChange={onSearch}
            />
          </Col>
        )}
        <Col
          span={5}
          style={{ display: "flex", gap: "20px", alignItems: "center" }}
        >
          <WrapperHeaderMap>
            <div onClick={handleNavigateMap}>
              <FaMapLocationDot
                style={{ fontSize: "28px", marginRight: "20px" }}
              />
            </div>
          </WrapperHeaderMap>
          <WrapperHeaderAccount>
            {userAvatar ? (
              <img src={userAvatar} alt="avatar" style={styles.avatar} />
            ) : (
              <UserOutlined style={{ fontSize: "30px" }} />
            )}
            {user?.name ? (
              <Popover content={content} trigger="click">
                <div
                  style={{ color: "black" }}
                  onClick={() => setIsOpenPopup((prev) => !prev)}
                >
                  {userName}
                </div>
              </Popover>
            ) : (
              <div onClick={handleNavigateLogin} style={{ cursor: "pointer" }}>
                <WrapperTextHeaderSmall style={{ fontSize: "15px" }}>
                  Đăng Nhập/Đăng Ký
                </WrapperTextHeaderSmall>
              </div>
            )}
          </WrapperHeaderAccount>
          {!isHiddenCart && (
            <div
              onClick={() => navigate("/order")}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Badge count={order?.orderItems?.length} size="small">
                <ShoppingCartOutlined
                  style={{ fontSize: "30px", color: "#fff" }}
                />
              </Badge>
              <WrapperTextHeaderSmall
                style={{ fontSize: "18px", color: "#fff" }}
              >
                Giỏ Hàng
              </WrapperTextHeaderSmall>
            </div>
          )}
          <div style={{ cursor: "pointer" }}>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSelDsjt-uxKZAM7aLOG51o98M6RJUOgVpxgw1tOwek6A_rzNg/viewform?embedded=true"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <WrapperTextHeaderSmall style={{ fontSize: "18px" }}>
                Góp Ý
              </WrapperTextHeaderSmall>
            </a>
          </div>
          <div
            style={{
              fontSize: "18px",
              color: "#fff",
              whiteSpace: "nowrap",
            }}
          >
            Tư Vấn
            <b style={{ display: "block" }}>0764857605</b>
          </div>
        </Col>
      </WrapperHeader>
    </div>
  );
};

const styles = {
  logoCircle: {
    backgroundColor: "#fff",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoSymbol: {
    color: "#2cba4b",
    fontSize: "20px",
    fontWeight: "bold",
    fontFamily: "Arial, sans-serif",
  },
  avatar: {
    height: "30px",
    width: "30px",
    borderRadius: "50%",
    objectFit: "cover",
  },
};

export default HeaderComponent;
