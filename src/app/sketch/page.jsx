"use client"
import React, { useState, useCallback } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Canvas from "../components/Canvas";
import { ElementType } from "../lib/types";
import { categories } from "../../../public/assets/elements";
import { useToast } from "../hooks/use-toast";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function page() {
  const [canvasElements, setCanvasElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const { toast } = useToast();

  /**
   * Add a new element to the canvas
   * @param {Object} element - The element to add
   * @param {Object} position - The position to place the element
   */
  const handleAddElement = useCallback((element, position) => {
    const newElement = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      type: element.type,
      subtype: element.subtype,
      src: element.src,
      position: {
        x: position.x - getInitialSize(element.type).width / 2,
        y: position.y - getInitialSize(element.type).height / 2
      },
      size: getInitialSize(element.type),
      zIndex: getZIndexForType(element.type)
    };
    
    setCanvasElements(prev => [...prev, newElement]);
  }, []);

  /**
   * Update an existing element on the canvas
   * @param {Object} updatedElement - The updated element data
   */
  const handleUpdateElement = useCallback((updatedElement) => {
    setCanvasElements(prev => 
      prev.map(element => 
        element.id === updatedElement.id ? updatedElement : element
      )
    );
  }, []);

  /**
   * Delete an element from the canvas
   * @param {string} elementId - The ID of the element to delete
   */
  const handleDeleteElement = useCallback((elementId) => {
    setCanvasElements(prev => prev.filter(element => element.id !== elementId));
    setSelectedElement(null);
    
    toast({
      title: "Element Deleted",
      description: "The element has been removed from the canvas.",
    });
  }, [toast]);

  /**
   * Select an element on the canvas
   * @param {Object|null} element - The element to select, or null to deselect
   */
  const handleSelectElement = useCallback((element) => {
    setSelectedElement(element);
  }, []);

  /**
   * Clear all elements from the canvas
   */
  const handleReset = useCallback(() => {
    setCanvasElements([]);
    setSelectedElement(null);
    toast({
      title: "Canvas Reset",
      description: "All elements have been removed from the canvas.",
    });
  }, [toast]);

  /**
   * Export the current state as a JSON file
   */
  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(canvasElements, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'face-sketch.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Export successful",
      description: "Your sketch has been exported as JSON.",
    });
  }, [canvasElements, toast]);

  /**
   * Import data from a JSON file
   * Note: Actual implementation is in the Header component
   */
  const handleImport = useCallback(() => {
    // Actual import functionality is in the Header component
  }, []);

  /**
   * Save the canvas as a PNG image file
   */
  const handleSave = useCallback(() => {
    if (canvasElements.length === 0) {
      toast({
        title: "Nothing to save",
        description: "Add some elements to the canvas first.",
        variant: "destructive",
      });
      return;
    }
    
    // Create a temporary canvas for rendering
    const tempCanvas = document.createElement('canvas');
    const canvasWidth = 800;
    const canvasHeight = 600;
    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;
    const ctx = tempCanvas.getContext('2d');
    
    if (!ctx) {
      toast({
        title: "Save failed",
        description: "Could not create canvas context.",
        variant: "destructive",
      });
      return;
    }
    
    // Set white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Sort elements by z-index
    const sortedElements = [...canvasElements].sort((a, b) => a.zIndex - b.zIndex);
    
    // Load and draw each element
    const loadPromises = sortedElements.map(element => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(
            img,
            element.position.x,
            element.position.y,
            element.size.width,
            element.size.height
          );
          resolve();
        };
        img.onerror = () => {
          console.error(`Failed to load image: ${element.src}`);
          resolve();
        };
        img.src = element.src;
      });
    });
    
    Promise.all(loadPromises).then(() => {
      // Create download link
      const imageDataURL = tempCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'face-sketch.png';
      link.href = imageDataURL;
      link.click();
      
      toast({
        title: "Save successful",
        description: "Your sketch has been saved as a PNG image.",
      });
    });
  }, [canvasElements, toast]);

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
        <Sidebar 
          categories={categories} 
          onReset={handleReset}
        />
        
        <Canvas 
          elements={canvasElements}
          onAddElement={handleAddElement}
          onUpdateElement={handleUpdateElement}
          onDeleteElement={handleDeleteElement}
          onSelectElement={handleSelectElement}
        />
      </div>
    </div>
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
      return { width: 60, height: 40 };
    case ElementType.Mouth:
      return { width: 80, height: 40 };
    case ElementType.Hair:
      return { width: 180, height: 120 };
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
      return 5;
    case ElementType.Eyes:
      return 3;
    case ElementType.Nose:
      return 2;
    case ElementType.Mouth:
      return 4;
    default:
      return 1;
  }
}