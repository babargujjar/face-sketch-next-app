"use client";
import React, { useState, useRef } from "react";
import { ssim } from "ssim.js";
import Header from "../components/Header";
import Link from "next/link";

const page = () => {
  const [sketchFile, setSketchFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [similarity, setSimilarity] = useState(null);

  // const getImageData = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       const img = new Image();
  //       img.onload = () => {
  //         const canvas = document.createElement("canvas");
  //         const ctx = canvas.getContext("2d");

  //         canvas.width = img.width;
  //         canvas.height = img.height;

  //         ctx.drawImage(img, 0, 0);
  //         const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  //         resolve(imageData);
  //       };
  //       img.onerror = reject;
  //       img.src = event.target.result;
  //     };
  //     reader.onerror = reject;
  //     reader.readAsDataURL(file);
  //   });
  // };

  const getImageData = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Resize both images to the same fixed size
          const targetWidth = 512; // You can set any fixed size that works for your case
          const targetHeight = 512; // Same as above for height

          canvas.width = targetWidth;
          canvas.height = targetHeight;

          // Fill the canvas with a transparent background (or white)
          ctx.fillStyle = "transparent";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Scale the image to fit the target width and height while maintaining aspect ratio
          const scaleWidth = targetWidth / img.width;
          const scaleHeight = targetHeight / img.height;

          const scale = Math.max(scaleWidth, scaleHeight); // Use the larger scale factor

          const newWidth = img.width * scale;
          const newHeight = img.height * scale;

          // Center the image inside the canvas
          const offsetX = (canvas.width - newWidth) / 2;
          const offsetY = (canvas.height - newHeight) / 2;

          ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);

          // Get the image data from the canvas
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          resolve(imageData);
        };
        img.onerror = reject;
        img.src = event.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleCompare = async () => {
    if (!sketchFile || !imageFile) return;

    const [sketchData, imageData] = await Promise.all([
      getImageData(sketchFile),
      getImageData(imageFile),
    ]);
    console.log("Sketch:", sketchData.data.length);
    console.log("Image:", imageData.data.length);

    try {
      const result = ssim(sketchData, imageData);
      const percent = result?.mssim ? (result.mssim * 100).toFixed(2) : "0.00";
      setSimilarity(percent);
    } catch (error) {
      console.error("Comparison failed:", error);
      setSimilarity("0.00");
    }
  };

  return (
    <div className="">
      <header className="bg-white shadow-md border-b px-6 py-3 rounded-md flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold text-indigo-600">
            Face Sketch App
          </h1>
        </Link>
      </header>
      <div className="p-6">
        <div className="flex justify-evenly gap-4 mb-6">
          {/* Sketch Upload */}
          <div className="flex flex-col w-full items-center">
            <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
              Import Sketch
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  setSketchFile(e.target.files[0]);
                  setSimilarity(null);
                }}
              />
            </label>
            {sketchFile && (
              <div className="relative mt-2">
                <button
                  className="absolute top-0 right-0 text-white bg-red-600 rounded-full w-6 h-6 text-sm"
                  onClick={() => {
                    setSketchFile(null);
                    setSimilarity(null);
                  }}
                >
                  ❌
                </button>
                <img
                  src={URL.createObjectURL(sketchFile)}
                  alt="Sketch"
                  className="w-72 h-72 object-cover rounded shadow"
                />
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div className="flex w-full flex-col items-center">
            <label className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer">
              Import Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  setImageFile(e.target.files[0]);
                  setSimilarity(null);
                }}
              />
            </label>
            {imageFile && (
              <div className="relative mt-2">
                <button
                  className="absolute top-0 right-0 text-white bg-red-600 rounded-full w-6 h-6 text-sm"
                  onClick={() => {
                    setImageFile(null);
                    setSimilarity(null);
                  }}
                >
                  ❌
                </button>
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Image"
                  className="w-72 h-72 object-cover rounded shadow"
                />
              </div>
            )}
          </div>

          {/* Find Matches */}
          <div className="flex w-full flex-col items-center">
            <button
              onClick={handleCompare}
              disabled={!sketchFile || !imageFile}
              className={`${
                !sketchFile || !imageFile
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              } text-white px-4 py-2 rounded`}
            >
              Find Matches
            </button>

            {similarity && (
              <div className="mt-4">
                <table className="border border-gray-300 rounded w-full text-center">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2">Sketch</th>
                      <th className="border px-4 py-2">Image</th>
                      <th className="border px-4 py-2">Similarity %</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-4 py-2">Uploaded</td>
                      <td className="border px-4 py-2">Uploaded</td>
                      <td className="border px-4 py-2 text-green-600 font-semibold">
                        {similarity}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
