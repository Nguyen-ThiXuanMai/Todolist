import React from "react";
import styled from "styled-components";

const Button = styled.button`
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: row;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-flex-wrap: nowrap;
  -ms-flex-wrap: nowrap;
  flex-wrap: nowrap;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-align-content: stretch;
  -ms-flex-line-pack: stretch;
  align-content: stretch;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;

  background-color: #0f3460;
  border-radius: 6px;
  border: 1px solid #0f3460;
  width: 32px;
  height: 32px;
  cursor: pointer;

  :hover {
    background-color: #224c80;
    border: 1px solid #224c80;
    transition: all 0.4s ease;
  }
`;

function ButtonComponent(props) {
  return <Button {...props}>{props.children}</Button>;
}

export default ButtonComponent;
