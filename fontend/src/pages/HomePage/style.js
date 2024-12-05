import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";

export const WrapperTypeProduct = styled.div`
display: flex;
align-items: center;
gap: 24px;
justify-content: flex-start;
height: 44px;
font-size:20px;
color: rgb(54, 170, 0);

`
export const WrapperButtonMore = styled(ButtonComponent)`
    &:hover {
        color: #fff;
        background: rgb(13,92,182);
        span {
            color: #fff;
        }
    }
    width: 100%;
    text-align: center;
     cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointers'}
`
export const WrapperProducts = styled.div`
  display: flex;
  gap: 14px;
  margin-top: 20px;
  justify-content: center;
  flex-wrap: wrap;
  @media (max-width: 768px) { /* Mobile */
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
    justify-content:center;

  }

  @media (min-width: 769px) and (max-width: 1024px) { /* Tablet */
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 15px;
    justify-content: center,

  }

  @media (min-width: 1025px) { /* Laptop */
    display:flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 20px;
    justify-content: center;

  }
`
