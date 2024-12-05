import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import {
  WrapperContentProfile,
  WrapperHeader,
  WrapperInput,
  WrapperLabel,
  WrapperUploadFile,
} from "./style";
import InputForm from "../../InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../service/UserService";
import { useMutationHooks } from "../../hooks/useMutationHooks";
import { Button, msessage } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "../../utils";
import { isError } from "react-query";
import * as Message from "../../components/Message/Message";
const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");
  const mutation = useMutationHooks((data) => {
    const { id, access_token, ...rests } = data;
    UserService.updateUser(id, rests);
  });
  const dispatch = useDispatch();

  useEffect(() => {
    setName(user?.name);
    setEmail(user?.email);
    setPhone(user?.phone);
    setAddress(user?.address);
    setAvatar(user?.avatar);
  }, [user]);

  // const handleGetDetailsUser = async (id, token) => {
  //     const res = await UserService.getDetailsUser(id, token)
  //     dispatch(UserService.updateUser({ ...res?.data, access_token: token}))
  // }

  const handleOnchangeName = () => {
    // setName()
  };
  const handleOnchangeEmail = (value) => {
    setEmail(value);
  };
  const handleOnchangePhone = (value) => {
    setPhone(value);
  };
  const handleOnchangeAddress = (value) => {
    setAddress(value);
  };
  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setAvatar(file.preview);
  };

  const handleUpdate = () => {
    mutation.mutate({
      id: user?.id,
      name,
      email,
      phone,
      address,
      avatar,
      access_token: user?.access_token,
    });
  };

  return (
    <div style={{ width: "100%", margin: "0 auto " }}>
      <WrapperHeader>Thông tin người dùng</WrapperHeader>
      <WrapperContentProfile>
        <WrapperInput>
          <WrapperLabel>Tên</WrapperLabel>
          <InputForm
            style={{ width: "100%" }}
            value={name}
            onChange={handleOnchangeName}
          />
          {/* <ButtonComponent
                    onClick = {handleUpdate}
                    size ={20}
                    styleButton ={{
                        height: '30px',
                        width: '30%',
                        border:'1px solid rgb(26, 148, 255)',
                        margin: '26px 0 25px',
                        padding: '4px 6px'
                    }}
                    styleTextButton ={{color: 'rgb(26, 148, 255)', fontSize:'16px', fontWeight:'700'}} 
                    textButton={'Cập nhật'}>
                    </ButtonComponent>  */}
        </WrapperInput>
        <WrapperInput>
          <WrapperLabel>Email</WrapperLabel>
          <InputForm
            style={{ width: "60%" }}
            value={email}
            onChange={handleOnchangeEmail}
          />
          <ButtonComponent
            onClick={handleUpdate}
            size={20}
            styleButton={{
              height: "30px",
              width: "30%",
              border: "1px solid rgb(26, 148, 255)",
              margin: "26px 0 25px",
              padding: "4px 6px",
            }}
            styleTextButton={{
              color: "rgb(26, 148, 255)",
              fontSize: "16px",
              fontWeight: "700",
            }}
            textButton={"Cập nhật"}
          ></ButtonComponent>
        </WrapperInput>
        <WrapperInput>
          <WrapperLabel>SĐT</WrapperLabel>
          <InputForm
            style={{ width: "60%" }}
            value={phone}
            onChange={handleOnchangePhone}
          />
          <ButtonComponent
            onClick={handleUpdate}
            size={20}
            styleButton={{
              height: "30px",
              width: "30%",
              border: "1px solid rgb(26, 148, 255)",
              margin: "26px 0 25px",
              padding: "4px 6px",
            }}
            styleTextButton={{
              color: "rgb(26, 148, 255)",
              fontSize: "16px",
              fontWeight: "700",
            }}
            textButton={"Cập nhật"}
          ></ButtonComponent>
        </WrapperInput>
        <WrapperInput>
          <WrapperLabel>Địa Chỉ</WrapperLabel>
          <InputForm
            style={{ width: "60%" }}
            value={address}
            onChange={handleOnchangeAddress}
          />
          <ButtonComponent
            onClick={handleUpdate}
            size={20}
            styleButton={{
              height: "30px",
              width: "30%",
              border: "1px solid rgb(26, 148, 255)",
              margin: "26px 0 25px",
              padding: "4px 6px",
            }}
            styleTextButton={{
              color: "rgb(26, 148, 255)",
              fontSize: "16px",
              fontWeight: "700",
            }}
            textButton={"Cập nhật"}
          ></ButtonComponent>
        </WrapperInput>
        <WrapperInput>
          <WrapperLabel>Hình Ảnh</WrapperLabel>
          <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </WrapperUploadFile>
          {avatar && (
            <img
              src={avatar}
              style={{
                height: "60px",
                width: "60px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
              alt="avatar"
            />
          )}
          {/* <InputForm style={{ width:'60%' }} value={avatar} onChange = {handleOnchangeAvatar}/> */}
          <ButtonComponent
            onClick={handleUpdate}
            size={20}
            styleButton={{
              height: "30px",
              width: "30%",
              border: "1px solid rgb(26, 148, 255)",
              margin: "26px 0 25px",
              padding: "4px 6px",
            }}
            styleTextButton={{
              color: "rgb(26, 148, 255)",
              fontSize: "16px",
              fontWeight: "700",
            }}
            textButton={"Cập nhật"}
          ></ButtonComponent>
        </WrapperInput>
      </WrapperContentProfile>
    </div>
  );
};
export default ProfilePage;
