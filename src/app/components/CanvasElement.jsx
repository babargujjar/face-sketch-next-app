import React from 'react';
import ResizeHandle from './ResizeHandle';
import { Button } from '../components/ui/button';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { HotKeys } from 'react-hotkeys';


export default function CanvasElement({
  element,
  onDragStart,
  onResizeStart,
  onUpdateElement,
  onDeleteElement,
  isSelected,
  onSelectElement,
  selected,
}) {
  const handleResize = (action) => {
    if (!onUpdateElement) return;

    const scaleFactor = action === "increase" ? 1.1 : 0.9;

    const updatedElement = {
      ...element,
      size: {
        width: Math.max(20, Math.round(element.size.width * scaleFactor)),
        height: Math.max(20, Math.round(element.size.height * scaleFactor)),
      },
    };

    onUpdateElement(updatedElement);
  };

  return (
    <div
      className={`canvas-element absolute cursor-move ${
        selected ? "ring-2 ring-primary" : "border-transparent"
      }`}
      style={{
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        zIndex: element.zIndex,
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onDragStart(element, e);
        onSelectElement?.(element.id);
      }}
    >
      <img
        src={element.src.src}
        alt={`${element.subtype} ${element.type}`}
        className="w-full h-full object-contain"
        draggable={false}
      />

      {selected && (
        <>
          {/* Controls Toolbar */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex bg-white rounded-md shadow-md z-50">
            {/* Decrease Size Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                handleResize("decrease");
              }}
            >
              <Minus className="h-4 w-4" />
            </Button>

            {/* Increase Size Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                handleResize("increase");
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>

            {/* Delete Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                if (onDeleteElement) {
                  onDeleteElement(element.id);
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Resize Handles */}
          <ResizeHandle
            position="top-right"
            onMouseDown={(e) => onResizeStart(element, "top-right", e)}
          />
          <ResizeHandle
            position="bottom-right"
            onMouseDown={(e) => onResizeStart(element, "bottom-right", e)}
          />
          <ResizeHandle
            position="bottom-left"
            onMouseDown={(e) => onResizeStart(element, "bottom-left", e)}
          />
          <ResizeHandle
            position="top-left"
            onMouseDown={(e) => onResizeStart(element, "top-left", e)}
          />
        </>
      )}
    </div>
  );
}