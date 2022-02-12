import React, { ChangeEvent, ChangeEventHandler } from "react";
import { Controller } from "react-hook-form";
import { Form } from "react-bootstrap";
import { CheckBoxControlledProps } from "@GlobalTypes";
const { Group, Check } = Form;

const CheckBoxControlled: React.FunctionComponent<CheckBoxControlledProps> = ({
  label,
  name,
  control,
  defaultValue,
}) => {
  return (
    <div className="input-group has-label">
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => (
          <div className="form-check">
            <label className="form-check-label">
              <input
                className="form-check-input"
                type="checkbox"
                checked={value}
                onChange={(e: any) => onChange(e.target.checked)}
              />
              {label}
            </label>
          </div>
        )}
      />
    </div>
  );
};

export default CheckBoxControlled;
