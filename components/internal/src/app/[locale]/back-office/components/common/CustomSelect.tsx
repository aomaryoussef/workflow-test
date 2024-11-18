"use client";

import { Select, SelectProps } from "antd";
import { FC, useMemo } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface CustomSelectProps extends SelectProps {}

/** A custom select component that sets the `min-width` of the select based on the width of the longest option. */
export const CustomSelect: FC<CustomSelectProps> = (props) => {
  const optionsMinLength = useMemo(() => {
    if (!props.options) return undefined;

    const longestLabelLength = props.options.reduce((curLength, option) => {
      if (!option.label) return curLength;

      const label = String(option.label);
      return Math.max(label.length, curLength);
    }, 0);

    return Math.min(longestLabelLength, 50); // Ensure the min width doesn't exceed 50 characters
  }, [props.options]);

  return (
    <Select
      {...props}
      // Set the width of the select to the width of the longest option. `ch` is relative to the width of the "0" (zero) character.
      style={{ minWidth: `${optionsMinLength}ch` }}
    />
  );
};
