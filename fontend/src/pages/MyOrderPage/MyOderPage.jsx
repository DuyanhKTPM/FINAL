import React, { useEffect } from "react";
import Loading from "../../components/LoadingComponent/Loading";
import { useQuery } from "@tanstack/react-query";
import * as OrderService from "../../service/OrderService";
import { useSelector } from "react-redux";
import { convertPrice } from "../../utils";
import {
  WrapperItemOrder,
  WrapperListOrder,
  WrapperHeaderItem,
  WrapperFooterItem,
  WrapperContainer,
  WrapperStatus,
} from "./style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useLocation, useNavigate } from "react-router-dom";
import * as Message from "../../components/Message/Message";
import { useMutationHooks } from "../../hooks/useMutationHooks";

const MyOrderPage = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(state?.id, state?.token);
    return res.data;
  };
  const user = useSelector((state) => state.user);

  const queryOrder = useQuery({
    queryKey: ["orders"],
    queryFn: fetchMyOrder,
    enabled: !!state?.id && !!state?.token,
  });
  const { data } = queryOrder;

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: {
        token: state?.token,
      },
    });
  };

  const mutation = useMutationHooks((data) => {
    const { id, token, orderItems, userId } = data;
    const res = OrderService.cancelOrder(id, token, orderItems, userId);
    return res;
  });

  const handleCancelOrder = (order) => {
    mutation.mutate(
      {
        id: order._id,
        token: state?.token,
        orderItems: order?.orderItems,
        userId: user.id,
      },
      {
        onSuccess: () => {
          queryOrder.refetch();
        },
      }
    );
  };
  const {
    isLoading: isLoadingCancel,
    isSuccess: isSuccessCancel,
    isError: isErrorCancle,
    data: dataCancel,
  } = mutation;

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === "OK") {
      Message.success();
    } else if (isSuccessCancel && dataCancel?.status === "ERR") {
      Message.error(dataCancel?.Message);
    } else if (isErrorCancle) {
      Message.error();
    }
  }, [isErrorCancle, isSuccessCancel]);

  const renderProduct = (data) => {
    return data?.map((order) => {
      return (
        <WrapperHeaderItem key={order?._id}>
          <img
            src={order?.image}
            style={{
              width: "70px",
              height: "70px",
              objectFit: "cover",
              border: "1px solid rgb(238, 238, 238)",
              padding: "2px",
            }}
          />
          <div
            style={{
              width: "50%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              marginLeft: "10px",
              fontSize: "20px",
            }}
          >
            {order?.name}
          </div>
          <span
            style={{
              fontSize: "20px",
            }}
          >
            Số lượng: {order?.amount}
          </span>

          <span
            style={{
              paddingLeft: "50px",
              fontSize: "20px",
            }}
          ></span>
          <span
            style={{ fontSize: "13px", color: "#242424", marginLeft: "auto" }}
          >
            <span style={{ fontSize: "20px" }}>
              Sản phẩm {convertPrice(order?.price)}
            </span>
          </span>
        </WrapperHeaderItem>
      );
    });
  };
  console.log("check data :", data);
  return (
    <WrapperContainer>
      <div style={{ height: "100%", width: "100%", margin: "0 auto" }}>
        <h4 style={{ fontSize: "20px" }}>Đơn hàng của tôi</h4>
        <WrapperListOrder>
          {data?.map((order) => {
            return (
              <WrapperItemOrder key={order?._id}>
                <WrapperStatus>
                  <span
                    style={{
                      fontSize: "30px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                      textAlign: "center",
                    }}
                  >
                    Trạng thái
                  </span>
                  <div>
                    <span
                      style={{ color: "rgb(255, 66, 78)", fontSize: "20px" }}
                    >
                      Giao hàng:{" "}
                    </span>
                    <span
                      style={{
                        color: "rgb(90, 32, 193)",
                        fontWeight: "bold",
                        fontSize: "15px",
                      }}
                    >{`${
                      order.isDelivered ? "Đã giao hàng" : "Chưa giao hàng"
                    }`}</span>
                  </div>
                  <div>
                    <span
                      style={{ color: "rgb(255, 66, 78)", fontSize: "20px" }}
                    >
                      Thanh toán:{" "}
                    </span>
                    <span
                      style={{
                        color: "rgb(90, 32, 193)",
                        fontWeight: "bold",
                        fontSize: "15px",
                      }}
                    >{`${
                      order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"
                    }`}</span>
                  </div>
                </WrapperStatus>
                {renderProduct(order?.orderItems)}

                <WrapperFooterItem>
                  <div>
                    <div style={{ fontSize: "20px", marginBottom: "5px" }}>
                      Tổng tiền sản phẩm:{" "}
                      {convertPrice(order?.totalPrice - order?.shippingPrice)}
                    </div>
                    <div style={{ fontSize: "20px", marginBottom: "5px" }}>
                      Phí vận chuyển: {convertPrice(order?.shippingPrice)}
                    </div>
                    <span
                      style={{ color: "rgb(255, 66, 78)", fontSize: "20px" }}
                    >
                      Tổng tiền:{" "}
                    </span>
                    <span
                      style={{
                        fontSize: "20px",
                        color: "rgb(56, 56, 61)",
                        fontWeight: 700,
                      }}
                    >
                      {convertPrice(order?.totalPrice)}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {order && !order.isDelivered && (
                      <ButtonComponent
                        onClick={() => handleCancelOrder(order)}
                        size={40}
                        styleButton={{
                          padding: "10px 20px",
                          backgroundColor: "red",
                          color: "#fff",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                        textButton={"Hủy đơn hàng"}
                      />
                    )}

                    <ButtonComponent
                      onClick={() => handleDetailsOrder(order?._id)}
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
                      textButton={"Xem chi tiết"}
                    ></ButtonComponent>
                  </div>
                </WrapperFooterItem>
              </WrapperItemOrder>
            );
          })}
        </WrapperListOrder>
      </div>
    </WrapperContainer>
  );
};

export default MyOrderPage;
