// "use client";
// import React, { useEffect, useState } from "react";
// import { Button } from "../components/ui/button";
// import { ssim } from "ssim.js";
// import Link from "next/link";
// import { supabase } from '../lib/supabaseClient'

// const page = () => {
//   const [sketchFile, setSketchFile] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [similarity, setSimilarity] = useState(null);
//   const [urls, setUrls] = useState([]);

  
//     useEffect(() => {
//       async function fetchImages() {
//         const { data: files, error: listError } = await supabase.storage
//           .from("images")
//           .list("");
  
//         if (listError) {
//           console.error("Error listing files:", listError);
//           return;
//         }
  
//         const tempUrls = files.map((file) => {
//           const { data: publicUrlData, error: urlError } = supabase.storage
//             .from("images")
//             .getPublicUrl(file.name);
  
//           if (urlError) {
//             console.error("Error getting URL for", file.name, urlError);
//             return null;
//           }
  
//           console.log("File:", file.name, "URL:", publicUrlData.publicUrl);
//           return publicUrlData.publicUrl;
//         });
  
//         setUrls(tempUrls.filter(Boolean));
//       }
  
//       fetchImages();
//     }, []);
// console.log('urls', urls)
  
  

//   const uploadImage = async (file) => {
//     const fileName = `${Date.now()}-${file.name}`;
//     const { data, error } = await supabase.storage
//       .from("images")
//       .upload(fileName, file);

//     if (error) {
//       console.error("Upload failed:", error.message);
//       return null;
//     }

//     const { data: urlData } = supabase.storage
//       .from("images")
//       .getPublicUrl(fileName);

//     return urlData?.publicUrl || null;
//   };

//   const handleClick = async () => {
//     const input = document.createElement("input");
//     input.type = "file";
//     input.accept = "image/*";

//     input.onchange = async (event) => {
//       const file = event.target.files[0];
//       if (!file) return;

//       const uploadedUrl = await uploadImage(file);
//       if (uploadedUrl) {
//         alert("Image uploaded!\n" + uploadedUrl);
//       } else {
//         alert("Upload failed!");
//       }
//     };

//     input.click();
//   };

//   const getImageData = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         const img = new Image();
//         img.onload = () => {
//           const canvas = document.createElement("canvas");
//           const ctx = canvas.getContext("2d");

//           const targetWidth = 512;
//           const targetHeight = 512;

//           canvas.width = targetWidth;
//           canvas.height = targetHeight;

//           ctx.fillStyle = "transparent";
//           ctx.fillRect(0, 0, canvas.width, canvas.height);

//           const scaleWidth = targetWidth / img.width;
//           const scaleHeight = targetHeight / img.height;

//           const scale = Math.max(scaleWidth, scaleHeight);

//           const newWidth = img.width * scale;
//           const newHeight = img.height * scale;

//           const offsetX = (canvas.width - newWidth) / 2;
//           const offsetY = (canvas.height - newHeight) / 2;

//           ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);

//           const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//           resolve(imageData);
//         };
//         img.onerror = reject;
//         img.src = event.target.result;
//       };
//       reader.onerror = reject;
//       reader.readAsDataURL(file);
//     });
//   };

//   const handleCompare = async () => {
//     if (!sketchFile || !imageFile) return;

//     const [sketchData, imageData] = await Promise.all([
//       getImageData(sketchFile),
//       getImageData(imageFile),
//     ]);
//     console.log("Sketch:", sketchData.data.length);
//     console.log("Image:", imageData.data.length);

//     try {
//       const result = ssim(sketchData, imageData);
//       const percent = result?.mssim ? (result.mssim * 100).toFixed(2) : "0.00";
//       setSimilarity(percent);
//     } catch (error) {
//       console.error("Comparison failed:", error);
//       setSimilarity("0.00");
//     }
//   };

//   return (
//     <div className="">
//       <header className="bg-green-600 shadow-md  px-6 py-3 flex justify-between items-center">
//         <Link href="/">
//           <h1 className="text-2xl font-bold text-white">Face Sketch App</h1>
//         </Link>
//         <Button
//           className="cursor-pointer hover:outline"
//           variant="outline"
//           size="sm"
//           onClick={handleClick}
//         >
//           upload image
//         </Button>
//       </header>
//       <div className="p-6">
//         <div className="flex justify-evenly gap-4 mb-6">
//           {/* Sketch Upload */}
//           <div className="flex flex-col w-full items-center">
//             <label className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer">
//               Import Sketch
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={(e) => {
//                   setSketchFile(e.target.files[0]);
//                   setSimilarity(null);
//                 }}
//               />
//             </label>
//             <div className=" rounded-md shadow-lg shadow-gray-400 w-[300px] mt-5 h-[300px] flex justify-center items-center">
//               {sketchFile && (
//                 <div className="relative mt-2">
//                   <button
//                     className="absolute cursor-pointer top-0 right-0 text-white bg-red-600 rounded-full w-6 h-6 text-sm"
//                     onClick={() => {
//                       setSketchFile(null);
//                       setSimilarity(null);
//                     }}
//                   >
//                     ❌
//                   </button>
//                   <img
//                     src={URL.createObjectURL(sketchFile)}
//                     alt="Sketch"
//                     className="w-72 h-72 object-cover rounded shadow"
//                   />
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Image Upload */}
//           <div className="flex w-full flex-col items-center">
//             <label className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer">
//               Import Image
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={(e) => {
//                   setImageFile(e.target.files[0]);
//                   setSimilarity(null);
//                 }}
//               />
//             </label>
//             <div className="shadow-lg shadow-gray-400 rounded-md w-[300px] mt-5 h-[300px] flex justify-center items-center">
//               {imageFile && (
//                 <div className="relative mt-2">
//                   <button
//                     className="absolute cursor-pointer top-0 right-0 text-white bg-red-600 rounded-full w-6 h-6 text-sm"
//                     onClick={() => {
//                       setImageFile(null);
//                       setSimilarity(null);
//                     }}
//                   >
//                     ❌
//                   </button>
//                   <img
//                     src={URL.createObjectURL(imageFile)}
//                     alt="Image"
//                     className="w-72 h-72 object-cover rounded shadow"
//                   />
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Find Matches */}
//           <div className="flex w-full flex-col items-center">
//             <button
//               onClick={handleCompare}
//               disabled={!sketchFile || !imageFile}
//               className={`${
//                 !sketchFile || !imageFile
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-purple-600 hover:bg-purple-700 cursor-pointer "
//               } text-white px-4 py-2 rounded `}
//             >
//               Find Matches
//             </button>
//             <div className="shadow-lg shadow-gray-400 rounded-md w-full mt-5 h-[150px] flex justify-center items-center">
//               {similarity && (
//                 <div className="mt-4">
//                   <table className="border border-gray-300 rounded w-full text-center">
//                     <thead>
//                       <tr className="bg-gray-100">
//                         <th className="border px-4 py-2">Sketch</th>
//                         <th className="border px-4 py-2">Image</th>
//                         <th className="border px-4 py-2">Similarity %</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr>
//                         <td className="border px-4 py-2">Uploaded</td>
//                         <td className="border px-4 py-2">Uploaded</td>
//                         <td className="border px-4 py-2 text-green-600 font-semibold">
//                           {similarity}%
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default page;





"use client";
import React, { useState, useEffect } from "react";
import { ssim } from "ssim.js";
import { Button } from "../components/ui/button";
import { Toaster, toast } from "sonner";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function Page() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [match, setMatch] = useState(null);
  const [genUrl, setGenUrl] = useState(null);
  const TH = 0.85;

  useEffect(() => {
    supabase.storage.from("images").list()
      .then(({ data, error }) => {
        if (error) return toast.error(error.message);
        setUrls(data.map(f => supabase
          .storage
          .from("images")
          .getPublicUrl(f.name).data.publicUrl
        ));
      });
  }, []);

  const getImgData = f => new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement("canvas");
        c.width = c.height = 512;
        const ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0, 512, 512);
        res(ctx.getImageData(0,0,512,512));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(f);
  });

  const compare = async () => {
    if (!file) return toast.error("Upload first");
    setLoading(true);
    const sk = await getImgData(file);
    let best = { sim: 0, url: null };

    await Promise.all(urls.map(async u => {
      const b = await fetch(u).then(r=>r.blob());
      const imgFile = new File([b], "x.png", { type: b.type });
      const d = await getImgData(imgFile);
      const { mssim } = ssim(sk, d);
      if (mssim > best.sim) best = { sim: mssim, url: u };
    }));

    setMatch(best);
    if (best.sim >= TH) toast.success("Match found!");
    else toast("No high match. Best is " + (best.sim*100).toFixed(2)+"%");
    setLoading(false);
  };

  const generate = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/generate-image", { method: "POST", body: fd });
      const js = await res.json();
      if (js.url) setGenUrl(js.url), toast.success("Generated!");
      else toast.error(js.error);
    } catch (e) {
      toast.error(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 px-6 py-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Sketch → Face</h1>
        <Link href="/"><Button variant="outline">Home</Button></Link>
      </header>
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <input type="file" accept="image/*" onChange={e => {
          const f = e.target.files[0];
          setFile(f); setPreview(URL.createObjectURL(f)); setMatch(null); setGenUrl(null);
        }} />
        {preview && <img src={preview} width={256} height={256} />}
        <Button onClick={compare} disabled={!file || loading}>
          {loading ? <Loader2 className="animate-spin"/> : "Find Similar"}
        </Button>
        {match && (
          <div className="flex gap-4">
            <img src={match.url} width={256} height={256} />
            <p className={match.sim >= TH ? "text-green-600" : "text-red-600"}>
              {match.sim>=TH ? "Matched" : "Closest"}: {(match.sim*100).toFixed(2)}%
            </p>
          </div>
        )}
        {match && match.sim < TH && (
          <Button onClick={generate}>Generate This Sketch</Button>
        )}
        {genUrl && (
          <div>
            <h2 className="mt-4 text-xl">AI Generated Result:</h2>
            <img src={genUrl} width={512} height={512} />
          </div>
        )}
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
}
