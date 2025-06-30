"use client";
import { useState } from "react";
import { useDrag } from "react-dnd";
import { ElementType } from "../lib/types";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

export default function Sidebar({ categories, onReset }) {
  const [activeTab, setActiveTab] = useState(ElementType.Face);

  return (
    <aside className="max-w-72 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden">
      <div className="p-4 bg-cover bg-center"
  style={{ backgroundImage: "url('/assets/svgs/bg2.jpg')" }}>
        <h2 className="text-lg font-semibold text-white">Facial Elements</h2>
        <p className="text-sm text-white">Drag elements to the canvas</p>
      </div>

      {/* Tabs */}
      <div className=" px-2 py-1 bg-gray-50">
        <nav className="flex space-x-1 overflow-x-auto scrollbar-custom">
          {categories.map((category) => (
            <button
              key={category.type}
              onClick={() => setActiveTab(category.type)}
              className={cn(
                "px-3 py-2 cursor-pointer text-sm rounded-md transition-all my-2",
                activeTab === category.type
                  ? "bg-green-600 text-white font-medium shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              {category.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-custom ">
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

      {/* Reset Button */}
      <div className="p-1 cursor-pointer bg-green-600">
        <Button variant="destructive" className="w-full text-white cursor-pointer" onClick={onReset}>
          Reset Canvas
        </Button>
      </div>
    </aside>
  );
}

function ElementItem({ element }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "facial-element",
    item: element,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={cn(
        "element-item bg-white drop-shadow-[0_4px_6px_rgba(34,197,94,0.3)] border border-gray-200 rounded-md p-2 shadow-sm flex flex-col items-center cursor-grab hover:shadow-lg transition-transform",
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
