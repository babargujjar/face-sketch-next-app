import React from 'react';

/**
 * @param {Object} props
 * @param {'top-right'|'bottom-right'|'bottom-left'|'top-left'} props.position
 * @param {function} props.onMouseDown
 */
export default function ResizeHandle({ position, onMouseDown }) {
  /**
   * Gets the CSS position properties based on the resize handle position
   * @returns {Object} CSS style properties
   */
  const getPosition = () => {
    switch (position) {
      case 'top-right':
        return { top: -5, right: -5 };
      case 'bottom-right':
        return { bottom: -5, right: -5 };
      case 'bottom-left':
        return { bottom: -5, left: -5 };
      case 'top-left':
        return { top: -5, left: -5 };
    }
  };

  return (
    <div
      className="resize-handle w-3 h-3 bg-primary absolute rounded-full cursor-pointer"
      style={getPosition()}
      onMouseDown={(e) => {
        e.stopPropagation();
        onMouseDown(e);
      }}
    />
  );
}