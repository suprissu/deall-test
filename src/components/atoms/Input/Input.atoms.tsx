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
  label?: string;
  sizes?: Size;
  description?: string;
  error?: string;
  touched?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

type PasswordTypeButtonProps = {
  isPasswordType: boolean;
  onTypeChange: React.MouseEventHandler<HTMLButtonElement>;
};
// #endregion PROPS

function PasswordTypeButton({
  isPasswordType,
  onTypeChange,
}: PasswordTypeButtonProps) {
  return (
    <button
      className="absolute z-10 top-1/2 -translate-y-1/2 right-2 p-2 rounded-md bg-info-100 hover:bg-info-200 text-info-400"
      onClick={onTypeChange}
    >
      {isPasswordType ? <AiFillEyeInvisible /> : <AiFillEye />}
    </button>
  );
}

// #region MAIN COMPONENT
const Input = (
  {
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
    rightIcon,
    leftIcon,
    ...props
  }: InputProps,
  ref: React.ForwardedRef<HTMLInputElement>
) => {
  const [isPasswordType, togglePasswordType] = useToggle(type === "password");

  const sizeInputStyleMap = useMemo(() => {
    if (sizes === "narrow") return "p-2 text-sm";
    else if (sizes === "tiny") return "px-2 py-1 text-xs";
    return "px-3 py-2";
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
      {label && (
        <label
          htmlFor={id}
          className={`capitalize font-medium text-info-400 ${sizeLabelStyleMap}`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={id}
          name={id}
          type={typeMap}
          value={value}
          placeholder={placeholder || `Fill your ${label} here...`}
          className={`peer placeholder:font-normal w-full rounded-md flex-row justify-start items-center inline-flex border border-info-200 hover:border-opacity-50
        outline-none focus:ring focus:ring-primary-400 focus:border-primary-400 focus:ring-opacity-10
        hover:ring hover:ring-primary-500 hover:border-primary-500 hover:ring-opacity-10
        ${disabled ? "bg-info-50 text-marine-light" : "font-bold text-info-500"}
        ${value && "border-opacity-100"}
        ${sizeInputStyleMap}
        ${leftIcon && "pl-10"}
        ${rightIcon && "pr-10"}
        ${className}`}
          {...props}
        />
        {leftIcon && (
          <div className="absolute z-10 top-1/2 -translate-y-1/2 left-2  p-1 text-info-400">
            {leftIcon}
          </div>
        )}
        {rightIcon ? (
          <div className="absolute z-10 top-1/2 -translate-y-1/2 right-2  p-1 text-info-400">
            {rightIcon}
          </div>
        ) : (
          type === "password" && (
            <PasswordTypeButton
              isPasswordType={isPasswordType}
              onTypeChange={(e) => {
                e.preventDefault();
                togglePasswordType();
              }}
            />
          )
        )}
      </div>
      {description && <p className="text-info-400 font-light">{description}</p>}
      {touched && error && <p className="text-error-500">{error}</p>}
    </div>
  );
};
// #endregion MAIN COMPONENT

export default React.forwardRef(Input);
