import React, { useEffect, useId } from 'react';
import { motion } from 'framer-motion';

export default function Popup({ children, closeCb, noBlur }) {
  const escPressHandler = (event) => {
    if (event.key === 'Escape') {
      closeCb();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', escPressHandler);
    return () => {
      window.removeEventListener('keydown', escPressHandler);
    };
  }, []);

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.6,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        scale: 0.6,
      }}
      transition={{
        type: 'tween',
        duration: 0.2,
      }}
      className={`absolute inset-0 z-10 flex items-center justify-center ${!noBlur && 'backdrop-blur-xs'} p-3`}
      onClick={closeCb}
    >
      {React.Children.map(children, (child) => React.cloneElement(child))}
    </motion.div>
  );
}
