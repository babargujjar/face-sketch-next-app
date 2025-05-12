import React, { forwardRef, useRef, useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import CanvasElement from "./CanvasElement";
import { Button } from "../components/ui/button";
import { Minus, Plus } from "lucide-react";
import { HotKeys } from "react-hotkeys";

const Canvas = forwardRef(function Canvas(
  {
    elements,
    setElements,
    onAddElement,
    onUpdateElement,
    onDeleteElement,
    onSelectElement,
    history,
    setHistory,
    redoStack,
    setRedoStack,
  },
  ref
) {
  const canvasNodeRef = useRef(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [currentElement, setCurrentElement] = useState(null);
  const [resizeDirection, setResizeDirection] = useState("");
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [selectedId, setSelectedId] = useState(null);

  const selectedElementId = useRef(null);
  const [elementStartData, setElementStartData] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });


  const [{ isOver }, drop] = useDrop(() => ({
    accept: "facial-element",
    drop: (item, monitor) => {
      const canvasNode = canvasNodeRef.current;
      if (canvasNode) {
        const canvasRect = canvasNode.getBoundingClientRect();
        const dropPosition = monitor.getClientOffset();
        if (dropPosition) {
          const x = (dropPosition.x - canvasRect.left) / scale;
          const y = (dropPosition.y - canvasRect.top) / scale;
          saveToHistory();
          onAddElement(item, { x, y });
        }
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const saveToHistory = () => {
    setHistory((prev) => [...prev, JSON.parse(JSON.stringify(elements))]);
  };

  const handleDragStart = (element, event) => {
    event.preventDefault();
    saveToHistory();
    setIsDragging(true);
    setCurrentElement(element);
    setStartPoint({ x: event.clientX, y: event.clientY });
    setElementStartData({
      x: element.position.x,
      y: element.position.y,
      width: element.size.width,
      height: element.size.height,
    });
    onSelectElement(element);
  };

  const handleResizeStart = (element, direction, event) => {
    event.preventDefault();
    event.stopPropagation();
    saveToHistory();
    setIsResizing(true);
    setCurrentElement(element);
    setResizeDirection(direction);
    setStartPoint({ x: event.clientX, y: event.clientY });
    setElementStartData({
      x: element.position.x,
      y: element.position.y,
      width: element.size.width,
      height: element.size.height,
    });
    onSelectElement(element);
  };

  const handleMouseMove = (event) => {
    if (isDragging && currentElement) {
      const dx = (event.clientX - startPoint.x) / scale;
      const dy = (event.clientY - startPoint.y) / scale;
      const updatedElement = {
        ...currentElement,
        position: {
          x: elementStartData.x + dx,
          y: elementStartData.y + dy,
        },
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

  const handleElementClick = (element) => {
    setSelectedElement(element);
    selectedElementId.current = element.id;
    console.log("Selected element:", element.id);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection("");
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDragging,
    isResizing,
    currentElement,
    startPoint,
    elementStartData,
    scale,
  ]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [elements, history]);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.1, 2));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5));

  useEffect(() => {
    if (onSelectElement) {
      onUpdateElement(onSelectElement);
    }
  }, [onSelectElement]);

  const keyMap = {
    UNDO: "ctrl+z",
    REDO: "ctrl+y",
    DELETE: ["del", "backspace"],
    MOVE_LEFT: "left",
    MOVE_RIGHT: "right",
    MOVE_UP: "up",
    MOVE_DOWN: "down",
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const previous = history[history.length - 1];
      setRedoStack((prevRedoStack) => [
        ...prevRedoStack,
        JSON.parse(JSON.stringify(elements)),
      ]);
      setHistory((prevHistory) => prevHistory.slice(0, -1));
      setElements(JSON.parse(JSON.stringify(previous))); // Deep clone
    }
  };

  const handleRedo = () => {
    console.log("redo");
    setRedoStack((prevRedoStack) => {
      if (prevRedoStack.length === 0) return prevRedoStack;

      const next = prevRedoStack[prevRedoStack.length - 1];
      setHistory((h) => [...h, JSON.parse(JSON.stringify(elements))]);
      setElements(JSON.parse(JSON.stringify(next)));
      return prevRedoStack.slice(0, -1);
    });
  };
  
  const handleDelete = () => {
    console.log("Deleting element with id:", selectedId);

    if (!selectedId) return;

    setElements((prevElements) => {
      const index = prevElements.findIndex((el) => el.id === selectedId);
      if (index === -1) {
        console.warn("Element to delete not found!");
        return prevElements;
      }

      const newHistory = JSON.parse(JSON.stringify(prevElements));
      setHistory((h) => [...h, newHistory]);
      setRedoStack([]);

      const updatedElements = [...prevElements];
      updatedElements.splice(index, 1);

      selectedElementId.current = null;

      return updatedElements;
    });
  };

  const moveElement = (dx, dy) => {
    console.log("Moving element with id:", selectedId);

    if (!selectedId) return;

    setElements((prevElements) => {
      const index = prevElements.findIndex((el) => el.id === selectedId);
      if (index === -1) {
        console.warn("Element to move not found!");
        return prevElements;
      }

      const newHistory = JSON.parse(JSON.stringify(prevElements));
      setHistory((h) => [...h, newHistory]);
      setRedoStack([]);

      const updatedElements = [...prevElements];
      updatedElements[index] = {
        ...updatedElements[index],
        position: {
          x: updatedElements[index].position.x + dx,
          y: updatedElements[index].position.y + dy,
        },
      };

      return updatedElements;
    });
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
      e.preventDefault();
      handleUndo();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
      e.preventDefault();
      handleRedo();
    } else if (e.key === "Delete") {
      e.preventDefault();
      handleDelete();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      moveElement(-5, 0);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      moveElement(5, 0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveElement(0, -5);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      moveElement(0, 5);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [elements, history, redoStack]);

  const handlers = {
    UNDO: handleUndo,
    REDO: handleRedo,
    DELETE: handleDelete,
    MOVE_LEFT: () => moveElement(-5, 0),
    MOVE_RIGHT: () => moveElement(5, 0),
    MOVE_UP: () => moveElement(0, -5),
    MOVE_DOWN: () => moveElement(0, 5),
  };


  return (
    <HotKeys
      keyMap={keyMap}
      handlers={handlers}
      allowChanges={true}
      focused={"true"}
      className="flex-1 flex flex-col"
      tabIndex={0}
    >
      <div ref={ref} className="flex-1 flex flex-col">
        <div className="p-4 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Drag elements onto canvas and position them (Undo: Ctrl+Z)
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
                selected={currentElement?.id === element.id}
                onClick={() => handleElementClick(element)}
                isSelected={selectedElement?.id === element.id}
                onSelectElement={setSelectedId}
              />
            ))}
          </div>
        </div>
      </div>
    </HotKeys>
  );
});

export default Canvas;
