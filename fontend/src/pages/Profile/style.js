import { Upload } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled.h1`
    color: #000;
    display: flex;
    align-items: center;
    justify-content:center;
    font-size:30px;
`

export const WrapperContentProfile = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    width:60%;
    margin: 0 auto;
    padding: 20px;
    border-radius: 20px;
    
`

export const WrapperLabel = styled.label`
    color:#000;
    font-size: 12px;
    line-height: 18px;
    font-weight: 700;
    width:10%;
`

export const WrapperInput = styled.div`
    display: flex;
    align-items: center;
    gap: 25px;
`
export const WrapperUploadFile = styled(Upload)`
    & .ant-upload.ant-upload-select.ant-upload-select-picture-card{
        width: 60px;
        height: 60px;
        border-radius: 50%;
    }
    & .ant-upload-list-item-container{
        display:none;
    }
`