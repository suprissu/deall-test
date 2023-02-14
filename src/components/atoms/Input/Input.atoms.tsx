// #region IMPORTS
import React from "react";
// #endregion IMPORTS

// #region PROPS
type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;
// #endregion PROPS

// #region MAIN COMPONENT
export default function Input({}: InputProps) {
  return <input />;
}
// #endregion MAIN COMPONENT
