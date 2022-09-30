import React from "react";
import styled from "styled-components";

// const SwitchContainer = styled.div`
// `;
const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
  font-size: 1.4rem;
  .switch {
    margin: 0 1rem;
    position: relative;
    display: inline-block;
    width: 60px;
    height: 30px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: 0.4rem;
    bottom: 0.4rem;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  input:checked + .slider {
    background-color: #2196f3;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196f3;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }

  /* Rounded sliders */
  .slider.round {
    border-radius: 30px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
`;
type SwitchProps = {
  checked: boolean;
  setChecked: (e: any) => void;
  trueText?: string;
  falseText?: string;
};
const Switch = (props: SwitchProps) => {
  return (
    <SwitchContainer>
      {props.falseText}
      <label className="switch">
        <input type="checkbox" checked={props.checked} onChange={() => props.setChecked(!props.checked)} />
        <span className="slider round"></span>
      </label>
      {props.trueText}
    </SwitchContainer>
  );
};

export default Switch;
