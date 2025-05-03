"use client"
import { useState } from "react";
import { useDrag } from "react-dnd";
import { ElementCategory, ElementType, FacialElement } from "../lib/types";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";


export default function Sidebar({ categories, onReset }) {
  const [activeTab, setActiveTab] = useState(ElementType.Face);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700">Facial Elements</h2>
        <p className="text-sm text-gray-500">Drag elements to the canvas</p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {/* Category tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-y-auto space-x-1 p-2" aria-label="Categories">
            {categories.map((category) => (
              <button
                key={category.type}
                onClick={() => setActiveTab(category.type)}
                className={cn(
                  "p-2 text-sm rounded-md flex-1",
                  activeTab === category.type
                    ? "text-primary bg-indigo-50 font-medium"
                    : "text-gray-500 hover:bg-gray-100"
                )}
              >
                {category.label}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Category content */}
        {categories.map((category) => (
          <div
            key={category.type}
            className={cn(
              "p-3 grid grid-cols-2 gap-3",
              activeTab !== category.type && "hidden"
            )}
          >
            {category.elements.map((element) => (
              <ElementItem key={element.id} element={element} />
            ))}
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t border-gray-200">
        <Button 
          variant="destructive" 
          className="w-full" 
          onClick={onReset}
        >
          Reset Canvas
        </Button>
      </div>
    </aside>
  );
}


function ElementItem({ element }) {
  console.log('element', element)
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'facial-element',
    item: element,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={cn(
        "element-item bg-white border border-gray-200 rounded-md p-2 shadow-sm flex flex-col items-center cursor-grab hover:shadow-md transition-transform",
        isDragging ? "opacity-50" : "opacity-100"
      )}
      data-element={element.type}
      data-type={element.subtype}
    >
      <img 
        src={element.src.src} 
        alt={`${element.subtype} ${element.type}`} 
        className="w-full h-20 object-contain rounded mb-1" 
      />
      <span className="text-xs text-gray-600">{element.label}</span>
    </div>
  );
}
