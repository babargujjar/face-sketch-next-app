"use client";
import { useState } from "react";
import { useDrag } from "react-dnd";
import { ElementType } from "../lib/types";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

export default function Sidebar({ categories, onReset }) {
  const [activeTab, setActiveTab] = useState(ElementType.Face);

  return (
    <aside className="w-72 bg-[#111827] text-white flex flex-col h-full shadow-2xl border-r border-gray-800">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-b-lg">
        <h2 className="text-xl font-bold">Sketch Builder</h2>
        <p className="text-sm text-slate-200 opacity-75">
          Drag elements to canvas
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-[#1f2937] px-4 py-2 border-b border-gray-700">
        <nav className="flex space-x-2 pb-2 overflow-x-auto scrollbar-custom scrollbar-thin scrollbar-thumb-gray-700">
          {categories.map((category) => (
            <button
              key={category.type}
              onClick={() => setActiveTab(category.type)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                activeTab === category.type
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                  : "bg-gray-800 text-slate-300 hover:bg-gray-700"
              )}
            >
              {category.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-custom p-4 scrollbar-thin scrollbar-thumb-gray-700">
        {categories.map((category) => (
          <div
            key={category.type}
            className={cn(
              "grid grid-cols-2 gap-4",
              activeTab !== category.type && "hidden"
            )}
          >
            {category.elements.map((element) => (
              <ElementItem key={element.id} element={element} />
            ))}
          </div>
        ))}
      </div>

      {/* Reset */}
      <div className="px-4 py-3 bg-[#1f2937] border-t border-gray-700">
        <Button
          className="w-full cursor-pointer bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:brightness-110 transition-all shadow-lg"
          onClick={onReset}
        >
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
        "bg-[#1e293b] border border-gray-700 rounded-lg p-2 shadow-md hover:shadow-lg transition-transform cursor-grab flex flex-col items-center",
        isDragging ? "opacity-40" : "opacity-100"
      )}
      data-element={element.type}
      data-type={element.subtype}
    >
      <div className="border border-red-900 bg-gray-50 rounded-xl">
        <img
          src={element.src.src}
          alt={element.label}
          className="w-full h-20 object-contain mb-1 rounded"
        />
      </div>
      <span className="text-xs text-slate-300">{element.label}</span>
    </div>
  );
}
