
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!file) throw new Error("No file provided");

    const buffer = await file.arrayBuffer();
    const imageDataUrl = `data:image/png;base64,${Buffer.from(buffer).toString(
      "base64"
    )}`;

    const resp = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version:
          "b0a59442583d6a8946e4766836f11b8d3fc516fe847c22cf11309c5f0a792111", // replace with your latest Flux Canny Pro version
        input: {
          control_image: imageDataUrl, // <-- key name must be exactly this
          prompt:
            "Generate a photorealistic human face based on the sketch. Preserve structure and make the face natural. White background.",
          image_resolution: "512",
          detect_resolution: "512",
          low_threshold: 100,
          high_threshold: 200,
          num_samples: 1,
          ddim_steps: 30,
          guidance_scale: 9,
        },
      }),
    });

    const json = await resp.json();
    console.log("🧠 Replicate response:", json);
    if (json.error || !json.urls?.get)
      throw new Error(json.error || "Status URL missing");

    const statusUrl = json.urls.get;
    let result = null;
    let start = Date.now();
    const timeout = 60000;

    while (true) {
      const statusRes = await fetch(statusUrl, {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        },
      });

      const statusJson = await statusRes.json();
      console.log("⏳ Polling status:", statusJson.status);

      if (statusJson.status === "succeeded") {
        console.log("✅ Output result:", statusJson.output);
        result = statusJson.output;
        break;
      }

      if (statusJson.status === "failed") {
        throw new Error("Image generation failed.");
      }

      if (Date.now() - start > timeout) {
        throw new Error("Timed out");
      }

      await new Promise((r) => setTimeout(r, 1500));
    }
    

    return NextResponse.json({
      url: Array.isArray(result) ? result[0] : result,
    });


  } catch (err) {
    console.error("❌ API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
