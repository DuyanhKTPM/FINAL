import { Col, Row, Image, Modal } from "antd";
import { Rate, Form, Input } from "antd";

import InputComponents from "../../components/InputComponents/InputComponents";
import React, { useState, useEffect } from "react";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MinusOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { addOrder } from "../../redux/slides/orderSlide";
import { convertPrice } from "../../utils";
import * as Message from "../../components/Message/Message";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import * as CommentService from "../../service/CommentService";
import ModalComponent from "../ModalComponent/ModalComponent";

const ProductDetailsComponent = ({ idProduct }) => {
  const [numProduct, setNumProduct] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  const [rate, setRate] = useState(0);
  // const [isModal, setIsModal] = useState(false);
  // const [commentToEdit, setCommentToEdit] = useState(null);
  const [averageRating, setAverageRating] = useState(4);
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const queryClient = useQueryClient();
  const onChange = (value) => {
    setNumProduct(Number(value));
  };
  const inittial = () => ({
    text: "",
    rating: "",
    productId: "",
  });
  const [stateComments, setStateComments] = useState(inittial());
  const fetchGetDetailsProduct = async () => {
    const res = await ProductService.getDetailsProduct(idProduct);
    return res.data;
  };
  const fetchGetDetailsProductComments = async () => {
    const res = await CommentService.getDetailsProductComments(idProduct);
    return res.data;
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
  const handleOnChange = (e) => {
    setStateComments((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  }
  const mutation = useMutationHooks((data) => {
    const { productId, userId, text, rating } = data;
    const res = CommentService.createComment(data)
    return res;
  })
  const mutationDelete = useMutationHooks((data) => {
    const { id, token } = data;
    const res = CommentService.deleteComment(data);
    return res;
  });
  const mutationUpdate = useMutationHooks((data) => {
    const { id, token } = data;
    const res = CommentService.updateComment(data);
    return res;
  });
  const { data, isSuccess, isError } = mutationDelete
  const { data: dataDelete, isSuccess: isSuccessDelete, isError: isErrorDelete } = mutationDelete
  // const { data: dataUpdate, isSuccess: isSuccessUpdate, isError: isErrorUpdate } = mutationUpdate


  const handleAddComment = () => {
    if (!user.id) {
      navigate('/sign-in');
      Message.warning('Vui lòng đăng nhập!');
    } else {
      const commentText = `${user.name}: ${stateComments.text}`;

      mutation.mutate({
        productId: idProduct,
        userId: user.id,
        text: commentText,  // Gửi tên người dùng vào trước bình luận
        rating: rate,
      }, {
        onSuccess: () => {
          queryClient.invalidateQueries(["comment", idProduct]);
          setStateComments(inittial());
          setRate(0);
        },
        onError: () => {
          Message.error("Có lỗi xảy ra khi thêm bình luận!");
        },
      });
    }
  };

  const handleDeleteComment = (commentId) => {
    mutationDelete.mutate({
      id: commentId,
      token: user?.access_token
    },
      {
        onSettled: () => {
          comments.refetch();
        },
      }
    )
  }
  const handleUpdateComment = (commentId) => {
    mutationUpdate.mutate({
      id: commentId,
      token: user?.access_token
    },
      {
        onSettled: () => {
          comments.refetch();
        },
      }
    );
  };

  const { data: productDetails } = useQuery({
    queryKey: ["product-details", idProduct],
    queryFn: () => fetchGetDetailsProduct(idProduct),
    enabled: !!idProduct,
  });

  const { data: comments } = useQuery({
    queryKey: ["comment", idProduct],
    queryFn: () => fetchGetDetailsProductComments(idProduct),
    enabled: !!idProduct,
  });


  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      Message.success();
    } else if (isError) {
      Message.error();
    }
  }, [isSuccess, isError, data?.status]);
  useEffect(() => {
    if (isSuccessDelete && dataDelete?.status === "OK") {
      Message.success();
    } else if (isErrorDelete) {
      Message.error();
    }
  }, [isSuccessDelete, isErrorDelete, dataDelete?.status]);
  useEffect(() => {
    if (comments?.length > 0) {
      const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
      const average = totalRating / comments.length;
      setAverageRating(average);
    }
  }, [comments]);


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
  // const handleEditComment = () => {
  //   setIsModal(true)
  // };
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
              value={averageRating}
            />
            <WrapperStyleText>
              {" "}
              || Số lượng tồn kho {productDetails?.countInStock}
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
              display: "flex",
              color: "green",
              paddingTop: "10px",
              justifyContent: "center",
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
      <Row
        style={{
          width: "100%",
          borderTop: "2px solid #ccc",
          marginTop: "20px",
          paddingTop: "20px",
          background: "#ffff",
          padding: "15px",
        }}
      >
        <div style={{ width: "100%" }}>
          <h3 style={{ fontSize: '20px', color: "#556B2F" }}>Bình luận và đánh giá sản phẩm</h3>
          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: '18px' }}>Bình luận</p>
            <Form
              name="basic"
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 20 }}
              autoComplete="on"
              form={form}
            >
              <Form.Item label="Bình luận">
                <TextArea rows={4}
                  placeholder="Nhập đánh giá về sản phẩm!!!"
                  value={stateComments?.text}
                  onChange={handleOnChange}
                  name="text"
                />
              </Form.Item>
            </Form>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontSize: '18px' }}>Đánh giá: </label>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{
                    cursor: "pointer",
                    color: star <= rate ? "gold" : "gray",
                    fontSize: "20px",
                  }}
                  onClick={() => setRate(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <ButtonComponent
              textButton="Gửi bình luận"
              onClick={handleAddComment}
              styleButton={{
                backgroundColor: "#007bff",
                color: "#fff",
                padding: "10px 20px",
              }}
              size={18}
            />
          </div>

          <h4 style={{ fontSize: '20px', color: "#556B2F", marginBottom: "10px" }}>
            Đánh giá từ người dùng đã trải nghiệm
          </h4>
          {comments?.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #ccc",
                  padding: "10px 0",
                  marginBottom: "10px",
                  width: "100%"
                }}
              >
                <p style={{ margin: "0", fontSize: "16px" }}>
                  <span style={{ color: "gold", width: "80px" }}>
                    {Array.from({ length: comment.rating }, (_, i) => "★").join(
                      ""
                    )}
                  </span>
                  {comment.text}
                </p>
                <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
                  {(user?.role === "Admin" || (user?.role === "Retailer" && productDetails?.retailerId === user?.id)
                    || user?.id === comment.userId
                  ) && (
                      <div style={{ fontSize: "16px", color: "red", cursor: "pointer", padding: "0 5px" }}>
                        <DeleteOutlined
                          onClick={() => handleDeleteComment(comment._id)}
                        />
                      </div>
                    )}
                  {/* {user?.id === comment.userId && (
                    <div style={{ fontSize: "16px", color: "blue", cursor: "pointer", padding: "0 5px" }}>
                      <EditOutlined
                        onClick={handleEditComment}
                      />
                    </div>
                  )} */}
                </div>
              </div>
            ))
          ) : (
            <p>Chưa có bình luận nào.</p>
          )}
        </div>
      </Row>
      {/* <ModalComponent
        title="Sửa bình luận"
        open={isModal}
        onCancel={() => setIsModal(false)}
        onOk={() => handleUpdateComment(commentToEdit._id)} // Gọi hàm cập nhật khi nhấn "OK"
      >
        <TextArea
          rows={4}
          value={comments?.text} // Hiển thị nội dung bình luận hiện tại
          onChange={handleOnChange}
        />
      </ModalComponent> */}

    </div>
  );
};

export default ProductDetailsComponent;
