import { InputNumber } from "antd";
import styled from "styled-components";

export const WrapperStyleNameProduct = styled.h1`
color: rgb(36 , 36, 36);
font-size: 34px;
font-weight: 800;
line-height: 32px;
work-break: break-word;

`
export const WrapperStyleText = styled.span`
font-size: 20px;
line-height: 24px;
color: #000;
`
export const WrapperPriceProduct = styled.div`
background: rgb(250,250,250);
border-radius: 4px;
color: red;
`
export const WrapperPriceTextProduct = styled.h1`
font-weight: 500;
line-height: 40px;
margin-right: 8px;
font-size: 32px;
padding:10px;
margin-top: 10px;
`
export const WrapperAddressProduct = styled.div`
span.address {
text-decoration: underline;
font-size: 15px;
line-height: 24px;
font-weight: 500;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
};
span.change-address{
font-size: 16px;
line-height: 24px;
font-weight: 500;
color: rgb(11,116,229)
}
`

export const WrapperQualityProduct = styled.div`
`

export const WrapperInputNumber = styled(InputNumber)`
    .ant-input-number-input{
        text-align:center;
    };
    .ant-input-number-handler-wrap{
        
        display:none !important;
    }

`
