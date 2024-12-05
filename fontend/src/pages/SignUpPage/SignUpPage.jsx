import React, { useEffect } from "react";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
} from "../SignInPage/style";
import InputForm from "../../InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router";
import * as UserService from "../../service/UserService";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import * as Message from "../../components/Message/Message";
import { Input, Radio, Space, message } from "antd";

const SignUpPage = () => {
  const navigate = useNavigate();
  const handleNavigateSignIn = () => {
    navigate("/sign-in");
  };
  const handleSignUp = () => {
    mutation.mutate({
      name,
      email,
      phone,
      password,
      confirmPassword,
      role,
    });
  };
  const mutation = useMutationHooks((data) => UserService.createUser(data));
  const { data, isSuccess, isError } = mutation;
  const [role, setRole] = useState("User");
  const onChange = (e) => {
    setRole(e.target.value);
  };
  console.log("murrrrrrrrrr", mutation);
  useEffect(() => {
    if (isError) {
      Message.error(mutation?.error?.response?.data?.message);
    } else if (isError) {
      Message.error(message.message);
    } else if (isSuccess) {
      navigate("/sign-in");
      Message.success("Đăng ký thành công");
    }
  }, [isSuccess, isError, mutation?.error?.response?.data?.message]);

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleOnchangeName = (value) => {
    setName(value);
  };
  const handleOnchangeEmail = (value) => {
    setEmail(value);
  };
  const handleOnchangePhone = (value) => {
    setPhone(value);
  };
  const handleOnchangePassword = (value) => {
    setPassword(value);
  };
  const handleOnchangeConfirmPassword = (value) => {
    setConfirmPassword(value);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ccc",
        height: "85vh",
      }}
    >
      <div
        style={{
          width: "800px",
          height: "470px",
          borderRadius: "6px",
          background: "#fff",
          display: "flex",
        }}
      >
        <WrapperContainerLeft>
          <h1
            style={{
              display: "flex",
              justifyContent: "center",
              color: "#2cba4b",
            }}
          >
            Xin Chào
          </h1>
          <p style={{ fontSize: "15px" }}> Đăng Nhập hoặc Đăng Ký</p>
          <InputForm
            style={{ marginBottom: "10px" }}
            placeholder="Tên Đăng Nhập"
            value={name}
            onChange={handleOnchangeName}
          />
          <InputForm
            placeholder="Địa Chi Email"
            style={{ marginBottom: "10px" }}
            value={email}
            onChange={handleOnchangeEmail}
          />
          <InputForm
            placeholder="Số Điện Thoại"
            style={{ marginBottom: "10px" }}
            value={phone}
            onChange={handleOnchangePhone}
          />
          <div style={{ position: "relative" }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                zIndex: 10,
                position: "absolute",
                top: "4px",
                right: "8px",
              }}
            >
              {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <InputForm
              placeholder="Nhập Mật Khẩu"
              type={isShowPassword ? "text" : "password"}
              value={password}
              onChange={handleOnchangePassword}
            />
          </div>
          <div style={{ position: "relative" }}>
            <span
              onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
              style={{
                zIndex: 10,
                position: "absolute",
                top: "4px",
                right: "8px",
              }}
            >
              {isShowConfirmPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <InputForm
              placeholder="Nhập Lại Mật Khẩu"
              type={isShowConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleOnchangeConfirmPassword}
            />
          </div>
          <Radio.Group onChange={onChange} value={role}>
            <Space direction="vertical" style={{ paddingTop: "8px" }}>
              <Radio value={"User"}>Khách Hàng</Radio>
              <Radio value={"Retailer"}>Chủ Cửa Hàng</Radio>
            </Space>
          </Radio.Group>
          {data?.status === "ERR" && (
            <span style={{ color: "red" }}> {data?.message}</span>
          )}
          <ButtonComponent
            disabled={
              !name.length ||
              !email.length ||
              !phone.length ||
              !password.length ||
              !confirmPassword.length
            }
            onClick={handleSignUp}
            size={40}
            styleButton={{
              backgroundColor: "rgb(97 193 72)",
              margin: "26px 0 10px",
              width: "100%",
            }}
            styleTextButton={{ color: "#blue" }}
            textButton={"Đăng Ký"}
          ></ButtonComponent>
          <p style={{ fontSize: "20px", marginTop: "5px" }}>
            {" "}
            Bạn đã có tài khoản{" "}
            <WrapperTextLight onClick={handleNavigateSignIn}>
              Đăng Nhập
            </WrapperTextLight>
          </p>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <div style={styles.logoCircle}>
            <span style={styles.logoSymbol}>N</span>
          </div>
          <h2 style={{ color: "#2cba4b" }}> NÔNG NGHIỆP XANH</h2>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

const styles = {
  logoCircle: {
    backgroundColor: "#fff",
    borderRadius: "50%",
    width: "150Px",
    height: "150px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoSymbol: {
    color: "#2cba4b",
    fontSize: "50px",
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
export default SignUpPage;
