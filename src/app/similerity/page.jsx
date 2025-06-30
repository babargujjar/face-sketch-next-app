"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { ssim } from "ssim.js";
import Link from "next/link";
import { supabase } from '../lib/supabaseClient'

const page = () => {
  const [sketchFile, setSketchFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [similarity, setSimilarity] = useState(null);
  const [urls, setUrls] = useState([]);

  
    useEffect(() => {
      async function fetchImages() {
        const { data: files, error: listError } = await supabase.storage
          .from("images")
          .list("");
  
        if (listError) {
          console.error("Error listing files:", listError);
          return;
        }
  
        const tempUrls = files.map((file) => {
          const { data: publicUrlData, error: urlError } = supabase.storage
            .from("images")
            .getPublicUrl(file.name);
  
          if (urlError) {
            console.error("Error getting URL for", file.name, urlError);
            return null;
          }
  
          console.log("File:", file.name, "URL:", publicUrlData.publicUrl);
          return publicUrlData.publicUrl;
        });
  
        setUrls(tempUrls.filter(Boolean));
      }
  
      fetchImages();
    }, []);
console.log('urls', urls)
  
  

  const uploadImage = async (file) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, file);

    if (error) {
      console.error("Upload failed:", error.message);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("images")
      .getPublicUrl(fileName);

    return urlData?.publicUrl || null;
  };

  const handleClick = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const uploadedUrl = await uploadImage(file);
      if (uploadedUrl) {
        alert("Image uploaded!\n" + uploadedUrl);
      } else {
        alert("Upload failed!");
      }
    };

    input.click();
  };

  const getImageData = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          const targetWidth = 512;
          const targetHeight = 512;

          canvas.width = targetWidth;
          canvas.height = targetHeight;

          ctx.fillStyle = "transparent";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          const scaleWidth = targetWidth / img.width;
          const scaleHeight = targetHeight / img.height;

          const scale = Math.max(scaleWidth, scaleHeight);

          const newWidth = img.width * scale;
          const newHeight = img.height * scale;

          const offsetX = (canvas.width - newWidth) / 2;
          const offsetY = (canvas.height - newHeight) / 2;

          ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);

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
      <header className="bg-green-600 shadow-md  px-6 py-3 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold text-white">Face Sketch App</h1>
        </Link>
        <Button
          className="cursor-pointer hover:outline"
          variant="outline"
          size="sm"
          onClick={handleClick}
        >
          upload image
        </Button>
      </header>
      <div className="p-6">
        <div className="flex justify-evenly gap-4 mb-6">
          {/* Sketch Upload */}
          <div className="flex flex-col w-full items-center">
            <label className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer">
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
            <div className=" rounded-md shadow-lg shadow-gray-400 w-[300px] mt-5 h-[300px] flex justify-center items-center">
              {sketchFile && (
                <div className="relative mt-2">
                  <button
                    className="absolute cursor-pointer top-0 right-0 text-white bg-red-600 rounded-full w-6 h-6 text-sm"
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
            <div className="shadow-lg shadow-gray-400 rounded-md w-[300px] mt-5 h-[300px] flex justify-center items-center">
              {imageFile && (
                <div className="relative mt-2">
                  <button
                    className="absolute cursor-pointer top-0 right-0 text-white bg-red-600 rounded-full w-6 h-6 text-sm"
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
          </div>

          {/* Find Matches */}
          <div className="flex w-full flex-col items-center">
            <button
              onClick={handleCompare}
              disabled={!sketchFile || !imageFile}
              className={`${
                !sketchFile || !imageFile
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 cursor-pointer "
              } text-white px-4 py-2 rounded `}
            >
              Find Matches
            </button>
            <div className="shadow-lg shadow-gray-400 rounded-md w-full mt-5 h-[150px] flex justify-center items-center">
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
    </div>
  );
};

export default page;
