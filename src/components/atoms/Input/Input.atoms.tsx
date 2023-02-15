// #region IMPORTS
import React, { useMemo } from "react";
import { useToggle } from "usehooks-ts";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
// #endregion IMPORTS

// #region PROPS
type Size = "narrow" | "tiny";
type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  label: string;
  sizes?: Size;
  description?: string;
  error?: string;
  touched?: boolean;
};
// #endregion PROPS

// #region MAIN COMPONENT
export default function Input({
  className,
  disabled,
  sizes,
  value,
  label,
  id,
  placeholder,
  description,
  type,
  error,
  touched,
  ...props
}: InputProps) {
  const [isPasswordType, togglePasswordType] = useToggle(type === "password");

  const sizeInputStyleMap = useMemo(() => {
    if (sizes === "narrow") return "px-3 py-2 text-sm";
    else if (sizes === "tiny") return "px-2 py-1 text-xs";
    return "p-3";
  }, [sizes]);

  const sizeLabelStyleMap = useMemo(() => {
    if (sizes === "narrow") return "text-sm";
    else if (sizes === "tiny") return "text-xs";
    return "text-base";
  }, [sizes]);

  const typeMap = useMemo(() => {
    if (type === "password") {
      if (isPasswordType) return "password";
      else return "text";
    }
    return type;
  }, [isPasswordType, type]);

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className={`capitalize font-medium text-info-400 ${sizeLabelStyleMap}`}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={typeMap}
          placeholder={placeholder || `Fill your ${label} here...`}
          className={`peer placeholder:font-normal w-full rounded-md flex-row justify-start items-center inline-flex border border-info-200 hover:border-opacity-50
        outline-none focus:ring focus:ring-primary-400 focus:border-primary-400 focus:ring-opacity-10
        hover:ring hover:ring-primary-500 hover:border-primary-500 hover:ring-opacity-10
        ${disabled ? "bg-info-50 text-marine-light" : "font-bold text-info-500"}
        ${value && "border-opacity-100"}
        ${sizeInputStyleMap}
        ${className}`}
          {...props}
        />
        {type === "password" && (
          <button
            className="absolute z-10 top-1/2 -translate-y-1/2 right-2 p-2 rounded-md bg-info-100 hover:bg-info-200 text-info-400"
            onClick={(e) => {
              e.preventDefault();
              togglePasswordType();
            }}
          >
            {isPasswordType ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
        )}
      </div>
      {description && <p className="text-info-400 font-light">{description}</p>}
      {touched && error && <p className="text-error-500">{error}</p>}
    </div>
  );
}
// #endregion MAIN COMPONENT
