export interface FacialElement {
  id: string;
  type: ElementType;
  subtype: string;
  src: string;
  label: string;
}

export enum ElementType {
  Face = 'face',
  Eyes = 'eyes',
  Nose = 'nose',
  Mouth = 'mouth',
  Hair = 'hair',
}

export interface ElementCategory {
  type: ElementType;
  label: string;
  elements: FacialElement[];
}

export interface CanvasElementData {
  id: string;
  type: ElementType;
  subtype: string;
  src: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

export type ResizeDirection = 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';

export interface CanvasState {
  elements: CanvasElementData[];
  isDragging: boolean;
  isResizing: boolean;
  currentElement: CanvasElementData | null;
  resizeDirection: ResizeDirection | '';
}
