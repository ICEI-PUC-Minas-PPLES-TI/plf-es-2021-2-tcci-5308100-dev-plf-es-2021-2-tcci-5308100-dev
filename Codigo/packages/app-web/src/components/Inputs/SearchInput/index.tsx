import React from "react";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

const SearchInput: React.FunctionComponent<SearchInputProps> = ({
  placeholder,
  ...props
}) => {
  return (
    <input
      {...props}
      type="text"
      className="form-control rounded-lg bg-grey border-0"
      placeholder={placeholder || "Pesquisar"}
      style={{ width: 300, marginRight: 16 }}
    />
  );
};

export default SearchInput;
