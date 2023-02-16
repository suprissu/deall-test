// #region IMPORTS
import React from "react";
import { motion } from "framer-motion";
import { RxReload } from "react-icons/rx";
// #endregion IMPORTS

// #region MAIN COMPONENT
export default function Loader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed z-50 p-4 rounded-xl bg-info-200 bg-opacity-50 top-4 left-1/2 -translate-1/2"
    >
      <RxReload className="w-6 h-6 animate-spin text-info-500" />
    </motion.div>
  );
}
// #endregion MAIN COMPONENT
