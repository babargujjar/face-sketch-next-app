import React, { useRef, useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import CanvasElement from './CanvasElement';
import { Button } from '../components/ui/button';
import { Minus, Plus } from 'lucide-react';

/**
 * @param {Object} props
 * @param {Array} props.elements - The canvas elements
 * @param {function} props.onAddElement - Callback for adding a new element
 * @param {function} props.onUpdateElement - Callback for updating an element
 * @param {function} props.onDeleteElement - Callback for deleting an element
 * @param {function} props.onSelectElement - Callback for selecting an element
 */
export default function Canvas({ref, elements, onAddElement, onUpdateElement, onDeleteElement, onSelectElement }) {
  // DOM reference for drop target
  const canvasNodeRef = useRef(null);
  
  // UI state
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [currentElement, setCurrentElement] = useState(null);
  const [resizeDirection, setResizeDirection] = useState('');
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [elementStartData, setElementStartData] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });

  // React DND drop setup
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'facial-element',
    drop: (item, monitor) => {
      const canvasNode = canvasNodeRef.current;
      if (canvasNode) {
        const canvasRect = canvasNode.getBoundingClientRect();
        const dropPosition = monitor.getClientOffset();
        
        if (dropPosition) {
          // Calculate position relative to canvas
          const x = (dropPosition.x - canvasRect.left) / scale;
          const y = (dropPosition.y - canvasRect.top) / scale;
          onAddElement(item, { x, y });
        }
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  /**
   * Handle the start of dragging an element
   * @param {Object} element - The element being dragged
   * @param {Event} event - The mouse event
   */
  const handleDragStart = (element, event) => {
    event.preventDefault();
    setIsDragging(true);
    setCurrentElement(element);
    setStartPoint({ x: event.clientX, y: event.clientY });
    setElementStartData({
      x: element.position.x,
      y: element.position.y,
      width: element.size.width,
      height: element.size.height
    });
    onSelectElement(element);
  };

  /**
   * Handle the start of resizing an element
   * @param {Object} element - The element being resized
   * @param {string} direction - The resize direction
   * @param {Event} event - The mouse event
   */
  const handleResizeStart = (element, direction, event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsResizing(true);
    setCurrentElement(element);
    setResizeDirection(direction);
    setStartPoint({ x: event.clientX, y: event.clientY });
    setElementStartData({
      x: element.position.x,
      y: element.position.y,
      width: element.size.width,
      height: element.size.height
    });
    onSelectElement(element);
  };

  /**
   * Handle mouse movement for dragging or resizing
   * @param {MouseEvent} event - The mouse event
   */
  const handleMouseMove = (event) => {
    if (isDragging && currentElement) {
      const dx = (event.clientX - startPoint.x) / scale;
      const dy = (event.clientY - startPoint.y) / scale;
      
      const updatedElement = {
        ...currentElement,
        position: {
          x: elementStartData.x + dx,
          y: elementStartData.y + dy
        }
      };
      
      onUpdateElement(updatedElement);
    } else if (isResizing && currentElement) {
      const dx = (event.clientX - startPoint.x) / scale;
      const dy = (event.clientY - startPoint.y) / scale;
      
      let updatedElement = { ...currentElement };
      
      switch (resizeDirection) {
        case "top-right":
          updatedElement = {
            ...updatedElement,
            position: {
              ...updatedElement.position,
              y: elementStartData.y + dy,
            },
            size: {
              width: Math.max(20, elementStartData.width + dx),
              height: Math.max(20, elementStartData.height - dy),
            },
          };
          break;
        case "bottom-right":
          updatedElement = {
            ...updatedElement,
            size: {
              width: Math.max(20, elementStartData.width + dx),
              height: Math.max(20, elementStartData.height + dy),
            },
          };
          break;
        case "bottom-left":
          updatedElement = {
            ...updatedElement,
            position: {
              ...updatedElement.position,
              x: elementStartData.x + dx,
            },
            size: {
              width: Math.max(20, elementStartData.width - dx),
              height: Math.max(20, elementStartData.height + dy),
            },
          };
          break;
        case "top-left":
          updatedElement = {
            ...updatedElement,
            position: {
              x: elementStartData.x + dx,
              y: elementStartData.y + dy,
            },
            size: {
              width: Math.max(20, elementStartData.width - dx),
              height: Math.max(20, elementStartData.height - dy),
            },
          };
          break;
      }
      
      onUpdateElement(updatedElement);
    }
  };

  /**
   * Handle mouse up to end dragging or resizing
   */
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    // Keep the current element selected
    setResizeDirection('');
  };

  // Add event listeners for mouse move and up
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, currentElement, startPoint, elementStartData, scale]);

  // Zoom functions
  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  return (
    <div ref={ref} className="flex-1 flex flex-col">
      <div className="p-4 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Drag elements onto canvas and position them
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={zoomOut}
            disabled={scale <= 0.5}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={zoomIn}
            disabled={scale >= 2}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        id="canvas-container"
        onClick={() => onSelectElement(null)}
        className="flex-1 bg-white p-4 overflow-hidden relative"
      >
        <div
          ref={(node) => {
            drop(node);
            canvasNodeRef.current = node;
          }}
          className={`canvas-container w-full h-full bg-gray-50 border border-gray-200 rounded-md relative overflow-hidden ${
            isOver ? "border-primary border-2" : ""
          }`}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "center center",
            transition: "transform 0.2s ease",
          }}
        >
          {elements.map((element) => (
            <CanvasElement
              key={element.id}
              element={element}
              onDragStart={handleDragStart}
              onResizeStart={handleResizeStart}
              onUpdateElement={onUpdateElement}
              onDeleteElement={onDeleteElement}
              isSelected={currentElement?.id === element.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}