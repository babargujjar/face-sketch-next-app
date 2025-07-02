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
      <header className="bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-500 px-6 py-4 ">
        <div className="max-w-6xl mx-auto w-full flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">Sketch → Face</h1>
          <Link href="/">
            <Button variant="outline">Home</Button>
          </Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files[0];
            setFile(f);
            setPreview(URL.createObjectURL(f));
            setMatch(null);
            setGenUrl(null);
          }}
        />
        {preview && <img src={preview} width={256} height={256} />}
        <Button onClick={compare} disabled={!file || loading}>
          {loading ? <Loader2 className="animate-spin" /> : "Find Similar"}
        </Button>
        {match && (
          <div className="flex gap-4">
            <img src={match.url} width={256} height={256} />
            <p className={match.sim >= TH ? "text-green-600" : "text-red-600"}>
              {match.sim >= TH ? "Matched" : "Closest"}:{" "}
              {(match.sim * 100).toFixed(2)}%
            </p>
          </div>
        )}
        {match && match.sim < TH && (
          <Button onClick={generate}>Generate This Sketch</Button>
        )}
        {genUrl && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">AI Generated Result:</h2>
            <img
              src={genUrl}
              alt="Generated"
              width={512}
              height={512}
              className="mt-2 rounded shadow-lg border border-gray-300"
            />
          </div>
        )}
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
}