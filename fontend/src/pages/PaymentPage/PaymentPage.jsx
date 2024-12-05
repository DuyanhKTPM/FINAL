import React, { useEffect, useMemo, useState } from "react";
import { WrapperInfo, WrapperLeft, WrapperRight } from "./style";
import { Form, Radio, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { convertPrice } from "../../utils";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponents from "../../components/InputComponents/InputComponents";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import * as UserService from "../../service/UserService";
import * as OrderService from "../../service/OrderService";
import * as PaymentService from "../../service/PaymentService";
import { updateUser } from "../../redux/slides/userSlide";
import { useNavigate } from "react-router";
import { removeAllOrder } from "../../redux/slides/orderSlide";
import { PayPalButton } from "react-paypal-button-v2";
import * as Message from "../../components/Message/Message";

const PaymentPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const [isModalUpdateInfo, setIsModalUpdateInfo] = useState(false);
  const [payment, setPayment] = useState("later_money");
  const [delivery, setDelivery] = useState("fast");
  const [sdkReady, setSdkReady] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [stateUserDetails, setStateUserDetails] = useState({
    phone: "",
    address: "",
    city: "",
  });
  const [form] = Form.useForm();

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
  }, [isModalUpdateInfo, stateUserDetails, user]);

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
  }, [priceMemo, order]);
  const totalPriceMemo = useMemo(() => {
    return Number(priceMemo) - Number(discountMemo) + Number(deliveryPrice);
  }, [priceMemo, discountMemo, deliveryPrice]);

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, { ...rests }, token);
    return res;
  });
  const mutationAddOrder = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = OrderService.createOrder({ ...rests }, token);
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

  const handleAddOrder = () => {
    if (payment && delivery) {
      const groupedOrders = order?.orderItemsSelected.reduce((acc, item) => {
        const { retailerId } = item;
        if (!acc[retailerId]) {
          acc[retailerId] = [];
        }
        acc[retailerId].push(item);
        return acc;
      }, {});

      const promises = Object.entries(groupedOrders).map(
        ([retailerId, items]) => {
          const retailerName = items[0]?.retailerName;
          const itemsPrice = items.reduce(
            (total, cur) => total + cur.price * cur.amount,
            0
          );
          const discount = items.reduce(
            (total, cur) => total + (cur.discount || 0) * cur.amount,
            0
          );
          const deliveryFee =
            itemsPrice >= 200000 && itemsPrice < 500000
              ? 10000
              : itemsPrice >= 500000
              ? 0
              : 20000;
          const totalPrice = itemsPrice - discount + deliveryFee;

          return mutationAddOrder.mutateAsync({
            token: user?.access_token,
            orderItems: items,
            fullName: user?.name,
            address: user?.address,
            phone: user?.phone,
            city: user?.city,
            shippingMethod: delivery,
            paymentMethod: payment,
            itemsPrice,
            shippingPrice: deliveryFee,
            totalPrice,
            isPaid: false,
            user: user?.id,
            email: user?.email,
            retailerName,
            retailerId,
          });
        }
      );

      Promise.all(promises)
        .then(() => {
          const productsOrdered = order?.orderItemsSelected.map(
            (item) => item.product
          );
          dispatch(removeAllOrder({ listCheck: productsOrdered }));
          Message.success("Đặt hàng thành công");
          navigate("/ordersuccess", {
            state: {
              delivery,
              payment,
              orders: order?.orderItemsSelected,
              totalPrice: totalPriceMemo,
            },
          });
        })
        .catch(() => {
          message.error("Có lỗi xảy ra trong quá trình đặt hàng.");
        });
    } else {
      message.error("Vui lòng chọn phương thức giao & nhận");
    }
  };

  const handleChangeAddress = () => {
    setIsModalUpdateInfo(true);
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
  const handleDelivery = (e) => setDelivery(e.target.value);
  const handlePayment = (e) => setPayment(e.target.value);

  const addPaypalScript = async () => {
    const { data } = await PaymentService.getConfig();
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.type = `https://sandbox.paypal.com/sdk/js?client-id=${data}`;
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };
  useEffect(() => {
    if (!window.paypal) {
      addPaypalScript();
    } else {
      setSdkReady(true);
    }
  }, []);

  const onSuccessPaypal = () => {
    if (payment && delivery) {
      const groupedOrders = order?.orderItemsSelected.reduce((acc, item) => {
        const { retailerId } = item;
        if (!acc[retailerId]) {
          acc[retailerId] = [];
        }
        acc[retailerId].push(item);
        return acc;
      }, {});

      const promises = Object.entries(groupedOrders).map(
        ([retailerId, items]) => {
          const retailerName = items[0]?.retailerName;
          const itemsPrice = items.reduce(
            (total, cur) => total + cur.price * cur.amount,
            0
          );
          const discount = items.reduce(
            (total, cur) => total + (cur.discount || 0) * cur.amount,
            0
          );
          const deliveryFee =
            itemsPrice >= 200000 && itemsPrice < 500000
              ? 10000
              : itemsPrice >= 500000
              ? 0
              : 20000;
          const totalPrice = itemsPrice - discount + deliveryFee;

          return mutationAddOrder.mutateAsync({
            token: user?.access_token,
            orderItems: items,
            fullName: user?.name,
            address: user?.address,
            phone: user?.phone,
            city: user?.city,
            shippingMethod: delivery,
            paymentMethod: payment,
            itemsPrice,
            shippingPrice: deliveryFee,
            totalPrice,
            isPaid: true,
            user: user?.id,
            email: user?.email,
            retailerName,
            retailerId,
          });
        }
      );

      Promise.all(promises)
        .then(() => {
          const productsOrdered = order?.orderItemsSelected.map(
            (item) => item.product
          );
          dispatch(removeAllOrder({ listCheck: productsOrdered }));
          Message.success("Đặt hàng thành công");
          navigate("/ordersuccess", {
            state: {
              delivery,
              payment,
              orders: order?.orderItemsSelected,
              totalPrice: totalPriceMemo,
            },
          });
        })
        .catch(() => {
          message.error("Có lỗi xảy ra trong quá trình đặt hàng.");
        });
    } else {
      message.error("Vui lòng chọn phương thức giao & nhận");
    }
  };

  return (
    <div
      className="container"
      style={{ background: "#f5f5fa", width: "100%", height: "100vh" }}
    >
      <div style={{ height: "100%", width: "80%", margin: "0 auto" }}>
        <h2>Phương thức thanh toán</h2>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <WrapperLeft>
            <label style={{ fontSize: "16px", fontWeight: "bold" }}>
              Chọn phương thức giao hàng
            </label>
            <WrapperInfo>
              <div>
                <Radio.Group onChange={handleDelivery} value={delivery}>
                  <Radio value="fast">
                    {" "}
                    <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                      FAST
                    </span>
                    Giao hàng nhanh
                  </Radio>
                  <Radio value="gojek">
                    {" "}
                    <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                      GO_JEK
                    </span>
                    Giao hàng tiết kiệm
                  </Radio>
                </Radio.Group>
              </div>
            </WrapperInfo>
            <label style={{ fontSize: "16px", fontWeight: "bold" }}>
              Chọn phương thức thanh toán
            </label>
            <WrapperInfo>
              <div>
                <Radio.Group onChange={handlePayment} value={payment}>
                  <Radio value="later_money">Thanh toán khi nhận hàng</Radio>
                  <Radio value="paypal">Thanh toán bằng paypal</Radio>
                </Radio.Group>
              </div>
            </WrapperInfo>
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
              <WrapperInfo style={{ width: "100%" }}>
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

              <WrapperInfo style={{ width: "100%" }}>
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
                <br />
                <br />
                <div
                  style={{
                    width: "100%",
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
              </WrapperInfo>
            </div>
            {payment === "paypal" ? (
              <PayPalButton
                amount={totalPriceMemo / 25000} // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                onSuccess={onSuccessPaypal}
                onError={() => {
                  alert("Error");
                }}
              />
            ) : (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <ButtonComponent
                  onClick={() => handleAddOrder()}
                  size={40}
                  styleButton={{
                    width: "100%",
                    marginTop: "20px",
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
            )}
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
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Address"
              name="address"
              rules={[
                { required: true, message: "Please input address user!" },
              ]}
            >
              <InputComponents
                value={stateUserDetails.address}
                onChange={handleOnChangeDetails}
                name="address"
              />
            </Form.Item>

            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Please input phone user!" }]}
            >
              <InputComponents
                value={stateUserDetails.phone}
                onChange={handleOnChangeDetails}
                name="phone"
              />
            </Form.Item>

            <Form.Item
              label="City"
              name="city"
              rules={[
                { required: true, message: "Please input city of user!" },
              ]}
            >
              <InputComponents
                value={stateUserDetails.city}
                onChange={handleOnChangeDetails}
                name="city"
              />
            </Form.Item>
          </Form>
        </div>
      </ModalComponent>
    </div>
  );
};

export default PaymentPage;
