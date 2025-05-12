"use client";
import React, { useState, useCallback } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Canvas from "./components/Canvas";
import { ElementType } from "./lib/types";
import { categories } from "./../../public/assets/elements";
import { toPng } from "html-to-image";
import { useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toast, Toaster } from "sonner";

export default function page() {
  const canvasRef = useRef(null);
  const [canvasElements, setCanvasElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
    const [history, setHistory] = useState([]);
     const [redoStack, setRedoStack] = useState([]);

 
  const handleAddElement = useCallback((element, position) => {
    const newElement = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      type: element.type,
      subtype: element.subtype,
      src: element.src,
      position: {
        x: position.x - getInitialSize(element.type).width / 2,
        y: position.y - getInitialSize(element.type).height / 2,
      },
      size: getInitialSize(element.type),
      zIndex: getZIndexForType(element.type),
    };

    // Functional update to ensure consistent history snapshot
    setCanvasElements((prevCanvasElements) => {
      const updatedElements = [...prevCanvasElements, newElement];

      // ✅ Push previous state to history
      setHistory((prevHistory) => [
        ...prevHistory,
        JSON.parse(JSON.stringify(prevCanvasElements)),
      ]);

      return updatedElements;
    });
  }, []);
  
  
  const handleUpdateElement = (updatedElement) => {
    setCanvasElements((prevElements) => {
      setHistory((prevHistory) => [
        ...prevHistory,
        JSON.parse(JSON.stringify(prevElements)),
      ]);

      const newElements = prevElements.map((el) =>
        el.id === updatedElement.id ? updatedElement : el
      );

      return newElements;
    });
  };
  
  const handleDeleteElement = (idToDelete) => {
    setCanvasElements((prevElements) => {
      setHistory((prevHistory) => [
        ...prevHistory,
        JSON.parse(JSON.stringify(prevElements)),
      ]);
  
      const updatedElements = prevElements.filter(
        (element) => element.id !== idToDelete
      );
      toast.success("Element Deleted", {
        description: "The element has been removed from the canvas.",
      });
  
      return updatedElements;
    });
  };
  

  const handleSelectElement = useCallback((element) => {
    setSelectedElement(element);
  }, []);

  /**
   * Clear all elements from the canvas
   */
  const handleReset = useCallback(() => {
    setCanvasElements([]);
    setSelectedElement(null);
    toast.info("Canvas Reset", {
      description: "All elements have been removed from the canvas.",
    });
  }, []);

  /**
   * Export the current state as a JSON file
   */
  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(canvasElements, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = "face-sketch.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    toast.success("Export successful", {
      description: "Your sketch has been exported as JSON.",
    });
  }, [canvasElements]);

  const handleImport = useCallback(() => {
    // Actual import functionality is in the Header component
  }, []);
  

  // const handleSave = useCallback(() => {
  //   if (canvasElements.length === 0) {
  //     toast.error("Nothing to save", {
  //       description: "Add some elements to the canvas first.",
  //     });
  //     return;
  //   }

  //   // Create a temporary canvas with fixed dimensions (or use your preferred size)
  //   const tempCanvas = document.createElement("canvas");
  //   const canvasWidth = 800; // Adjust to your canvas size
  //   const canvasHeight = 600; // Adjust to your canvas size
  //   tempCanvas.width = canvasWidth;
  //   tempCanvas.height = canvasHeight;
  //   const ctx = tempCanvas.getContext("2d");

  //   if (!ctx) {
  //     toast.error("Save failed", {
  //       description: "Could not create canvas context.",
  //     });
  //     return;
  //   }

  //   // Set white background
  //   ctx.fillStyle = "#ffffff";
  //   ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  //   // Sort elements by z-index (same as your rendering logic)
  //   const sortedElements = [...canvasElements].sort(
  //     (a, b) => a.zIndex - b.zIndex
  //   );

  //   // Draw each element in z-index order
  //   const loadPromises = sortedElements.map((element) => {
  //     return new Promise((resolve) => {
  //       const img = new Image();
  //       img.crossOrigin = "Anonymous"; // Important for some external images
  //       img.onload = () => {
  //         ctx.drawImage(
  //           img,
  //           element.position.x,
  //           element.position.y,
  //           element.size.width,
  //           element.size.height
  //         );
  //         resolve();
  //       };
  //       img.onerror = () => {
  //         console.error(`Failed to load image: ${element.src}`);
  //         // Draw a placeholder rectangle if image fails to load
  //         ctx.fillStyle = "#ff0000";
  //         ctx.fillRect(
  //           element.position.x,
  //           element.position.y,
  //           element.size.width,
  //           element.size.height
  //         );
  //         resolve();
  //       };
  //       img.src = element.src.src || element.src;
  //     });
  //   });

  //   Promise.all(loadPromises).then(() => {
  //     // Create download link
  //     const imageDataURL = tempCanvas.toDataURL("image/png");
  //     const link = document.createElement("a");
  //     link.download = "face-sketch.png";
  //     link.href = imageDataURL;
  //     link.click();

  //     toast.success("Save successful", {
  //       description: "Your sketch has been saved as a PNG image.",
  //     });
  //   });
  // }, [canvasElements]);

  const handleSave = () => {
    const canvasArea = document.getElementById("canvas-container");
    if (!canvasArea) return;

    toPng(canvasArea, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "exported-canvas.png";
        link.href = dataUrl;
        link.click();
        toast.success("Save successfull", {
          description: "Your sketch has been saved as a PNG image.",
        });
      })
      .catch((error) => {
        console.error("Save Error:", error);
      });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen overflow-hidden bg-gray-50 text-gray-800">
        <Header
          onReset={handleReset}
          onExport={handleExport}
          onImport={handleImport}
          onSave={handleSave}
        />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar categories={categories} onReset={handleReset} />

          <Canvas
            redoStack={redoStack}
            setRedoStack={setRedoStack}
            history={history}
            setHistory={setHistory}
            ref={canvasRef}
            elements={canvasElements}
            setElements={setCanvasElements}
            onAddElement={handleAddElement}
            onUpdateElement={handleUpdateElement}
            onDeleteElement={handleDeleteElement}
            onSelectElement={handleSelectElement}
          />
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </DndProvider>
  );
}

/**
 * Get initial size for an element based on its type
 * @param {string} type - The element type
 * @returns {Object} The width and height
 */
function getInitialSize(type) {
  switch (type) {
    case ElementType.Face:
      return { width: 200, height: 240 };
    case ElementType.Eyes:
      return { width: 100, height: 40 };
    case ElementType.Nose:
      return { width: 50, height: 40 };
    case ElementType.Mouth:
      return { width: 80, height: 40 };
    case ElementType.Hair:
      return { width: 150, height: 120 };
    case ElementType.Mutch:
      return { width: 80, height: 40 };
    case ElementType.Ear:
      return { width: 40, height: 80 };
    case ElementType.Eyebrow:
      return { width: 100, height: 30 };
    default:
      return { width: 100, height: 100 };
  }
}

/**
 * Get z-index for an element based on its type
 * @param {string} type - The element type
 * @returns {number} The z-index value
 */
function getZIndexForType(type) {
  switch (type) {
    case ElementType.Face:
      return 1;
    case ElementType.Hair:
      return 3;
    case ElementType.Eyes:
      return 4;
    case ElementType.Nose:
      return 4;
    case ElementType.Mouth:
      return 4;
    case ElementType.Mutch:
      return 3;
    case ElementType.Ear:
      return 2;
    case ElementType.Eyebrow:
      return 3;
    default:
      return 1;
  }
}
