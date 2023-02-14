// #region IMPORTS
import React from "react";
// #endregion IMPORTS

// #region PROPS
const styleMapping = (
  disabled?: boolean
): Record<string, Record<string, string>> => ({
  solid: {
    primary: `text-white text-xs active:bg-primary-700 ${
      disabled
        ? "bg-primary-50 text-primary-200"
        : "bg-primary-500 hover:shadow-md hover:shadow-primary-100 hover:bg-primary-600"
    }`,
    secondary: `text-white text-xs active:bg-secondary-700 ${
      disabled
        ? "bg-secondary-50 text-secondary-200"
        : "bg-secondary-500 hover:shadow-md hover:shadow-secondary-100 hover:bg-secondary-600"
    }`,
    error: `text-white text-xs active:bg-error-700 ${
      disabled
        ? "bg-error-50 text-error-200"
        : "bg-error-500 hover:shadow-md hover:shadow-error-100 hover:bg-error-600"
    }`,
    success: `text-white text-xs active:bg-success-700 ${
      disabled
        ? "bg-success-50 text-success-200"
        : "bg-success-500 hover:shadow-md hover:shadow-success-100 hover:bg-success-600"
    }`,
    warning: `text-white text-xs active:bg-warning-700 ${
      disabled
        ? "bg-warning-50 text-warning-200"
        : "bg-warning-500 hover:shadow-md hover:shadow-warning-100 hover:bg-warning-600"
    }`,
    info: `text-black text-xs active:bg-info-400 ${
      disabled
        ? "bg-info-50 text-info-200"
        : "bg-info-200 hover:shadow-md hover:shadow-info-50 hover:bg-info-300"
    }`,
  },
  outline: {
    primary: `border ${
      disabled ? "text-primary-100 border-primary-100" : "hover:bg-primary-100"
    }`,
    secondary: `border ${
      disabled
        ? "text-secondary-100 border-secondary-100"
        : "hover:bg-secondary-100"
    }`,
    error: `border ${
      disabled ? "text-error-100 border-error-100" : "hover:bg-error-100"
    }`,
    success: `border ${
      disabled ? "text-success-100 border-success-100" : "hover:bg-success-100"
    }`,
    warning: `border ${
      disabled ? "text-warning-100 border-warning-100" : "hover:bg-warning-100"
    }`,
    info: `border ${
      disabled ? "text-info-100 border-info-100" : "hover:bg-info-100"
    }`,
  },
  basic: {
    primary: `${
      disabled ? "text-primary-100" : "text-primary-500 hover:bg-primary-100"
    }`,
    secondary: `${
      disabled
        ? "text-secondary-100"
        : "text-secondary-500 hover:bg-secondary-100"
    }`,
    error: `${
      disabled ? "text-error-100" : "text-error-500 hover:bg-error-100"
    }`,
    success: `${
      disabled ? "text-success-100" : "text-success-500 hover:bg-success-100"
    }`,
    warning: `${
      disabled ? "text-warning-100" : "text-warning-500 hover:bg-warning-100"
    }`,
    info: `${disabled ? "text-info-100" : "text-info-500 hover:bg-info-100"}`,
  },
});

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variants?: "primary" | "secondary" | "error" | "success" | "warning" | "info";
  types?: "solid" | "outline" | "basic";
  rounded?: boolean;
  icon?: JSX.Element;
};
// #endregion PROPS

// #region MAIN COMPONENT
export default function Button({
  children,
  variants = "primary",
  types = "solid",
  rounded,
  icon,
  disabled,
  className,
  ...props
}: React.PropsWithChildren<ButtonProps>) {
  return (
    <button
      {...props}
      className={`
    'capitalize text-sm transition-all flex items-center justify-center gap-2'
    ${icon && !children ? "w-10 h-10" : "px-4 py-2"}
    ${styleMapping(disabled)[types][variants]}
    ${rounded ? "rounded-full" : "rounded"}
    ${disabled && "cursor-not-allowed"}
    ${className}
    `}
    >
      {icon}
      {children}
    </button>
  );
}
// #region MAIN COMPONENT
