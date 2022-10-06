import { useEffect, useState } from 'react';
import styled from 'styled-components';

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 1.2rem;
  input[type="checkbox"] {
    height: 24px;
    margin: 2px;
  }
`;

type CheckboxProps = {
  checked: boolean;
  label?: string;
  onChange?: (checked: boolean) => void;
}
const Checkbox = (props: CheckboxProps) => {
  const [checked, setChecked] = useState(props.checked);

  useEffect(() => {
    props.onChange?.(checked);
  }, [checked]);

  return <CheckboxContainer onClick={(e) => {
    e.stopPropagation();
    setChecked(!checked);
    }}>
    <input readOnly type="checkbox" checked={checked}/>
    {props.label && <label>{props.label}</label>}
  </CheckboxContainer>;
}

export default Checkbox;
