import { getRandomColor } from "@utils/index";
import React from "react";
import { MultiSelect } from "react-multi-select-component";
import styled from "styled-components";

const SelectorContainer = styled.div`
  margin-top: 1rem;
  font-size: 1.6rem;
`;
const ItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
type ColorType = {
  color: string;
};
const ColorBox = styled.span<ColorType>`
  background-color: ${(props) => props.color};
  width: 16px;
  height: 16px;
  margin-right: 0.8rem;
`;

interface IItemRenderer {
  checked: boolean;
  option: any;
  disabled?: boolean;
  onClick: any;
}

const ItemRenderer = ({ checked, option, onClick, disabled }: IItemRenderer) => (
  <ItemContainer className={`item-renderer ${disabled && "disabled"}`}>
    <input type="checkbox" onChange={onClick} checked={checked} tabIndex={-1} disabled={disabled} />
    <ColorBox color={option.color} />
    <span>{option.label}</span>
  </ItemContainer>
);

type ISelector = {
  options: any[];
  selected: any[];
  setSelected: any;
};
const Selector = (props: ISelector) => {
  // const [selected, setSelected] = useState([]);
  return (
    <SelectorContainer>
      <MultiSelect
        options={props.options}
        value={props.selected}
        onChange={(values: any[]) => {
          const colorMapping = values.map((values) => {
            if (!values.color || values.color === "none") return { ...values, color: getRandomColor() };
            else return values;
          });
          props.setSelected(colorMapping);
        }}
        labelledBy="Select"
        hasSelectAll={false}
        isCreatable={true}
        filterOptions={(options, filter) => {
          if (!filter) return options;
          const re = new RegExp(filter, "i");
          return options.filter(({ label }) => label && label.match(re));
        }}
        ItemRenderer={(itemProps: any) => <ItemRenderer {...itemProps} />}
      />
    </SelectorContainer>
  );
};
export default Selector;
