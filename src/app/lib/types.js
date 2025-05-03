// ElementType enum replacement in JavaScript
export const ElementType = {
  Face: 'face',
  Eyes: 'eyes',
  Nose: 'nose',
  Mouth: 'mouth',
  Hair: 'hair'
};

// Other types defined as JSDoc comments for reference
/**
 * @typedef {Object} FacialElement
 * @property {string} id
 * @property {string} type - One of the ElementType values
 * @property {string} subtype
 * @property {string} src
 * @property {string} label
 */

/**
 * @typedef {Object} ElementCategory
 * @property {string} type - One of the ElementType values
 * @property {string} label
 * @property {Array<FacialElement>} elements
 */

/**
 * @typedef {Object} CanvasElementData
 * @property {string} id
 * @property {string} type - One of the ElementType values
 * @property {string} subtype
 * @property {string} src
 * @property {Object} position
 * @property {number} position.x
 * @property {number} position.y
 * @property {Object} size
 * @property {number} size.width
 * @property {number} size.height
 * @property {number} zIndex
 */

/**
 * @typedef {'top-right'|'bottom-right'|'bottom-left'|'top-left'} ResizeDirection
 */

/**
 * @typedef {Object} CanvasState
 * @property {Array<CanvasElementData>} elements
 * @property {boolean} isDragging
 * @property {boolean} isResizing
 * @property {CanvasElementData|null} currentElement
 * @property {ResizeDirection|''} resizeDirection
 */