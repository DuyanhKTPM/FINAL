import React, { useEffect, useMemo, useState } from "react";
import {
  WrapperCountOrder,
  WrapperInputNumber,
  WrapperInfo,
  WrapperItemOrder,
  WrapperLeft,
  WrapperListOrder,
  WrapperPriceDiscount,
  WrapperRight,
  WrapperStyleHeader,
} from "./style";
import { PlusOutlined, DeleteOutlined, MinusOutlined } from "@ant-design/icons";
import { Checkbox, Form, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseAmount,
  increaseAmount,
  removeAllOrder,
  updateAmount,
  removeOrder,
  selectedOrder,
} from "../../redux/slides/orderSlide";
import { convertPrice } from "../../utils";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponents from "../../components/InputComponents/InputComponents";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import * as UserService from "../../service/UserService";
import { updateUser } from "../../redux/slides/userSlide";
import { useNavigate } from "react-router";
import StepsComponent from "../../components/StepsComponent/StepsComponent";

const OrderPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const [isModalUpdateInfo, setIsModalUpdateInfo] = useState(false);
  const [listCheck, setListCheck] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [stateUserDetails, setStateUserDetails] = useState({
    phone: "",
    address: "",
    city: "",
  });
  const [form] = Form.useForm();
  const onChange = (e) => {
    if (listCheck.includes(e.target.value)) {
      const newListCheck = listCheck.filter((item) => item !== e.target.value);
      setListCheck(newListCheck);
    } else {
      setListCheck([...listCheck, e.target.value]);
    }
  };
  const onChangeAmount = (idProduct, value) => {
    if (value > 0) {
      dispatch(updateAmount({ idProduct, value }));
    }
  };

  useEffect(() => {
    dispatch(selectedOrder({ listCheck }));
  }, [listCheck]);

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (isModalUpdateInfo) {
      setStateUserDetails({
        ...stateUserDetails,
        address: user?.address,
        phone: user?.phone,
        city: user?.city,
      });
    }
  }, [isModalUpdateInfo]);
  console.log("us", user);
  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [order]);
  const discountMemo = useMemo(() => {
    const result = order?.orderItemsSelected.reduce((total, cur) => {
      return total + (cur.discount || 0) * cur.amount;
    }, 0);
    if (Number(result)) {
      return result;
    } else {
      return 0;
    }
  }, [order]);
  const deliveryPrice = useMemo(() => {
    if (priceMemo >= 200000 && priceMemo < 500000) {
      return 10000;
    } else if (priceMemo >= 500000 || order?.orderItemsSelected.length === 0) {
      return 0;
    } else {
      return 20000;
    }
  }, [priceMemo]);
  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) - Number(discountMemo) + Number(deliveryPrice);
  }, [priceMemo, discountMemo, deliveryPrice]);
  const handleChangeCount = (type, idProduct, limited) => {
    if (type === "increase") {
      if (!limited) {
        dispatch(increaseAmount({ idProduct }));
      }
    } else {
      if (!limited) dispatch(decreaseAmount({ idProduct }));
    }
  };

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrder({ idProduct }));
  };
  const handleDeleteAllOrder = () => {
    if (listCheck.length > 0) {
      dispatch(removeAllOrder({ listCheck }));
    }
  };
  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) {
      const newListCheck = [];
      order?.orderItems?.forEach((item) => {
        newListCheck.push(item?.product);
      });
      setListCheck(newListCheck);
    } else {
      setListCheck([]);
    }
  };

  const handleAddCart = () => {
    if (!order?.orderItemsSelected?.length) {
      message.error("Vui lòng chọn sản phẩm");
    } else if (!user?.phone || !user?.address || !user?.name || !user?.city) {
      setIsModalUpdateInfo(true);
    } else {
      navigate("/payment");
    }
  };
  const handleChangeAddress = () => {
    setIsModalUpdateInfo(true);
  };
  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, { ...rests }, token);
    return res;
  });
  const handleUpdateInfo = () => {
    const { address, phone, city } = stateUserDetails;
    if (address && phone && city) {
      mutationUpdate.mutate(
        { id: user?.id, token: user?.access_token, ...stateUserDetails },
        {
          onSuccess: () => {
            dispatch(updateUser({ ...user, address, phone, city }));
            setIsModalUpdateInfo(false);
          },
        }
      );
    }
  };
  const handleCancelUpdate = () => {
    setStateUserDetails({
      address: "",
      phone: "",
      city: "",
    });
    form.resetFields();
    setIsModalUpdateInfo(false);
  };
  const handleOnChangeDetails = (e) => {
    setStateUserDetails((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const itemsDelivery = [
    {
      title: "20.000VND",
      description: "Dưới 200.000VND",
    },
    {
      title: "10.000VND",
      description: "Từ 200.000VND dưới 500.000VND",
    },
    {
      title: "0VND",
      description: "Trên 500.000VND",
    },
  ];

  return (
    <div style={{ background: "#f5f5fa", width: "100%", height: "100vh" }}>
      <div style={{ height: "100%", width: "100%", margin: "0 auto" }}>
        <h2>Giỏ hàng</h2>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <WrapperLeft>
            <WrapperStyleHeader>
              <StepsComponent
                items={itemsDelivery}
                current={
                  deliveryPrice === 10000 ? 1 : deliveryPrice === 20000 ? 0 : 2
                }
              />
            </WrapperStyleHeader>
            <WrapperStyleHeader>
              <span
                style={{
                  width: "50%",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Checkbox
                  onChange={handleOnchangeCheckAll}
                  checked={listCheck.length === order.orderItems.length}
                ></Checkbox>
                <span style={{ fontSize: "15px" }}>
                  Chọn cả {order?.orderItems?.length} sản phẩm
                </span>
              </span>
              <div
                style={{
                  flex: "1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: "15px" }}>Đơn giá</span>
                <span style={{ fontSize: "15px" }}>Số lượng</span>
                <span style={{ fontSize: "15px" }}>Thành tiền</span>
                <DeleteOutlined
                  style={{ cursor: "pointer" }}
                  onClick={handleDeleteAllOrder}
                />
              </div>
            </WrapperStyleHeader>
            <WrapperListOrder>
              {order?.orderItems?.map((order) => {
                return (
                  <WrapperItemOrder>
                    <div
                      style={{
                        width: "50%",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Checkbox
                        onChange={onChange}
                        value={order?.product}
                        checked={listCheck.includes(order?.product)}
                      ></Checkbox>
                      <img
                        src={order?.image}
                        style={{
                          width: "77px",
                          height: "79px",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          width: "50%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontSize: "13px",
                        }}
                      >
                        {order?.name}
                      </div>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>
                        <span style={{ fontSize: "13px", color: "#242424" }}>
                          {convertPrice(order?.price)}
                        </span>
                        <WrapperPriceDiscount>
                          {/* Phần thnêm vào giá giảm */}
                          {/* {order?.discount} */}
                        </WrapperPriceDiscount>
                      </span>
                      <WrapperCountOrder>
                        <button
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleChangeCount(
                              "decrease",
                              order?.product,
                              order?.amount === 1
                            )
                          }
                        >
                          <MinusOutlined
                            style={{ color: "#000", fontSize: "10px" }}
                          />
                        </button>
                        <WrapperInputNumber
                          onChange={(value) =>
                            onChangeAmount(order?.product, value)
                          }
                          value={order?.amount}
                          size="small"
                          min={1}
                          max={order?.countInStock}
                        />
                        <button
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleChangeCount(
                              "increase",
                              order?.product,
                              order?.amount === order?.countInStock
                            )
                          }
                        >
                          <PlusOutlined
                            style={{ color: "#000", fontSize: "10px" }}
                          />
                        </button>
                      </WrapperCountOrder>
                      <span
                        style={{
                          color: "rbg(255, 66, 78)",
                          fontSize: "13px",
                          fontWeight: "500",
                        }}
                      >
                        {convertPrice(order?.price * order?.amount)}
                      </span>
                      <DeleteOutlined
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteOrder(order?.product)}
                      />
                    </div>
                  </WrapperItemOrder>
                );
              })}
            </WrapperListOrder>
          </WrapperLeft>
          <WrapperRight>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "16px" }}>Phiếu tổng tiền</span>
                <span
                  style={{
                    color: "#000",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                ></span>
              </div>
              <WrapperInfo>
                <div style={{ fontSize: "13px" }}>
                  <span>Địa chỉ: </span>
                  <span
                    style={{ fontWeight: "bold" }}
                  >{`${user.address} - ${user.city}`}</span>
                  <span
                    onClick={handleChangeAddress}
                    style={{ color: "blue", cursor: "pointer" }}
                  >
                    {" "}
                    Thay đổi
                  </span>
                </div>
              </WrapperInfo>

              <WrapperInfo>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "14px",
                  }}
                >
                  <span>Tạm tính</span>
                  <span style={{ color: "#000", fontWeight: "bold" }}>
                    {convertPrice(priceMemo)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "14px",
                  }}
                >
                  <span>Giảm giá</span>
                  <span style={{ color: "#000", fontWeight: "bold" }}>
                    {discountMemo}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "14px",
                  }}
                >
                  <span>Vận chuyển</span>
                  <span style={{ color: "#000", fontWeight: "bold" }}>
                    {convertPrice(deliveryPrice)}
                  </span>
                </div>
              </WrapperInfo>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: "14px",
                }}
              >
                <span>Thành tiền</span>
                <span
                  style={{
                    color: "#000",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  {convertPrice(totalPriceMemo)}
                </span>
              </div>
            </div>
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <ButtonComponent
                onClick={() => handleAddCart()}
                size={40}
                styleButton={{
                  padding: "10px 20px",
                  backgroundColor: "#61c148",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
                textButton={"Mua hàng"}
              ></ButtonComponent>
            </div>
          </WrapperRight>
        </div>
      </div>
      <ModalComponent
        forceRender
        title="Cập nhật thông tin giao hàng"
        open={isModalUpdateInfo}
        onCancel={handleCancelUpdate}
        onOk={handleUpdateInfo}
      >
        <div>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 20 }}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <InputComponents
                value={stateUserDetails.address}
                onChange={handleOnChangeDetails}
                name="address"
              />
            </Form.Item>

            <Form.Item
              label="Thành phố"
              name="city"
              rules={[{ required: true, message: "Vui lòng nhập thành phố!" }]}
            >
              <InputComponents
                value={stateUserDetails.city}
                onChange={handleOnChangeDetails}
                name="city"
              />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Nhập số điện thoại nhận hàng!" },
              ]}
            >
              <InputComponents
                value={stateUserDetails.phone}
                onChange={handleOnChangeDetails}
                name="phone"
              />
            </Form.Item>
          </Form>
        </div>
      </ModalComponent>
    </div>
  );
};

export default OrderPage;
