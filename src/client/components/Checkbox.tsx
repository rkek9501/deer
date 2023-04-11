import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 1.2rem;
  height: 20px;
  input[type="checkbox"] {
    height: 24px;
    margin: 0 !important;
    padding: 0;
  }
  label {
    padding-left: 4px;
  }
`;

type CheckboxProps = {
  checked: boolean;
  label?: string;
  onChange?: (checked: boolean) => void;
};

const Checkbox = (props: CheckboxProps) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = () => {
      const v = Boolean(ref.current?.checked);
      props.onChange?.(!v);
    };
    ref.current?.addEventListener("change", handler);
    return () => ref.current?.removeEventListener("change", handler);
  }, []);

  const onClickContainer = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      const v = Boolean(ref.current?.checked);
      props.onChange?.(!v);
    },
    [ref]
  );

  return (
    <CheckboxContainer onClick={onClickContainer}>
      <input readOnly ref={ref} type="checkbox" checked={props.checked} />
      {props.label && <label>{props.label}</label>}
    </CheckboxContainer>
  );
};

export default Checkbox;
