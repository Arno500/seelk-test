import React from "react";
import PropTypes from "prop-types";

import Select, { components } from "react-select";

import { Observer } from "mobx-react";
import { useStore } from "../../store";

import { getFormattedRate } from "../../utils";

import "./styles.scss";

const CustomSelect = ({
  placeholder,
  selectedFiat,
  onChange,
  getOptions,
  className,
  value
}) => {
  // We need the store to query rates
  const store = useStore();
  const Option = props => {
    const rate = store.Assets.getRateForAsset(
      props.data.asset_id,
      selectedFiat
    );
    // We then format that rate and add the currency
    const currencyString =
      selectedFiat && selectedFiat !== ""
        ? getFormattedRate(rate, selectedFiat)
        : "";
    // Small fix to remove onMouseMove and onMouseHover and improve performances
    // eslint-disable-next-line no-unused-vars
    const { onMouseMove, onMouseOver, ...newInnerProps } = props.innerProps;

    return (
      <components.Option
        {...props}
        innerProps={newInnerProps}
        className="selectOption"
      >
        {props.label}
        {selectedFiat && (
          <span className="currencyValue">{currencyString}</span>
        )}
      </components.Option>
    );
  };
  Option.propTypes = {
    label: PropTypes.string,
    data: PropTypes.object,
    innerProps: PropTypes.object
  };
  return (
    <Observer>
      {() => (
        <Select
          options={store.Assets[getOptions]}
          components={{ Option }}
          isLoading={store.Assets.fetchingData}
          isSearchable
          placeholder={placeholder}
          value={
            value !== ""
              ? store.Assets.getCryptos.find(elm => elm.value === value)
              : value
          }
          getOptionValue={elm => elm.asset_id}
          onChange={elm => onChange(elm !== null ? elm.asset_id : elm)}
          className={className}
          isClearable
        ></Select>
      )}
    </Observer>
  );
};

CustomSelect.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  selectedFiat: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  getOptions: PropTypes.string.isRequired,
  value: PropTypes.any
};

export default CustomSelect;
