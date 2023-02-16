// #region IMPORTS
import { motion } from "framer-motion";
import React from "react";
// #endregion IMPORTS

// #region MAIN COMPONENT
export default function AnimationTemplate({
  children,
}: React.PropsWithChildren) {
  return (
    <motion.div
      initial={{ filter: "blur(100px)", opacity: 0 }}
      animate={{ filter: "blur(0px)", opacity: 1 }}
      exit={{ filter: "blur(100px)", opacity: 0 }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}
// #endregion MAIN COMPONENT
