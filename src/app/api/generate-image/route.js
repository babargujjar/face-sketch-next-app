// // app/api/generate-image/route.js
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const form = await req.formData();
//     const file = form.get("file");

//     if (!file) throw new Error("No file provided");

//     const buffer = await file.arrayBuffer();
//     const base64Image = Buffer.from(buffer).toString("base64");

//     // Send request to Replicate API
//     // const replicateRes = await fetch("https://api.replicate.com/v1/predictions", {
//     //   method: "POST",
//     //   headers: {
//     //     Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
//     //     "Content-Type": "application/json",
//     //   },
//     //   body: JSON.stringify({
//     //     version: "9dcd6d78e7c6560c340d916fe32e9f24aabfa331e5cce95fe31f77fb03121426", // 🛠️ Use your model's full version ID
//     //     input: {
//     //       image: `data:image/png;base64,${base64Image}`,
//     //       prompt: "Generate a realistic human face from this sketch",
//     //       temperature: 0.2,
//     //       top_p: 1,
//     //       max_tokens: 1024,
//     //     },
//     //   }),
//     // });
//     const replicateRes = await fetch("https://api.replicate.com/v1/predictions", {
//         method: "POST",
//         headers: {
//           Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           version: "db21e45fb64c4bb3b8f964dd5f12a5d6e8a1ec81fb2ae0e01a6e4b3a0e3b90d2", // Stable Diffusion v1.5
//           input: {
//             prompt: "realistic human face sketch to photo",
//             image: `data:image/png;base64,${base64Image}`,
//           },
//         }),
//       });
      

//     const replicateJson = await replicateRes.json();
//     console.log("Replicate JSON response:", replicateJson);

//     // Check if API call failed
//     if (replicateJson.error) {
//       throw new Error(replicateJson.error);
//     }

//     const statusUrl = replicateJson?.urls?.get;

//     if (!statusUrl) {
//       throw new Error("Invalid Replicate response: status URL not found");
//     }
//     // Poll for result
//     let result = null;
//     let start = Date.now();
//     let timeout = 30000; // 30 seconds timeout

//     while (true) {
//       const statusRes = await fetch(statusUrl, {
//         headers: {
//           Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
//         },
//       });

//       const statusJson = await statusRes.json();

//       if (statusJson.status === "succeeded") {
//         result = statusJson.output;
//         break;
//       }

//       if (statusJson.status === "failed") {
//         throw new Error("Image generation failed.");
//       }

//       if (Date.now() - start > timeout) {
//         throw new Error("Generation timed out. Please try again.");
//       }

//       await new Promise((r) => setTimeout(r, 1500)); // wait before polling again
//     }

//     // Output is an array of image URLs
//     return NextResponse.json({ url: result[0] }); // send first image only

//   } catch (err) {
//     console.error("AI error:", err);
//     return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
//   }
// }
// app/api/generate-image/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file) throw new Error("No file provided");

    const buffer = await file.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");

    // 🔁 Request to Replicate
    const res = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "3a14a915b013decb6ab672115c8bced7c088df86c2ddd0a89433717b9ec7d927", // 🔁 Replace with actual version
        input: {
          image: `data:image/png;base64,${base64Image}`,
          prompt: "Generate a realistic face from this sketch",
          temperature: 0.2,
          top_p: 1,
          max_tokens: 1024,
        },
      }),
    });

    const json = await res.json();
    console.log("🔍 Replicate raw response:", json);

    if (json.error) {
        console.error("❌ Replicate API error:", json.error);
        throw new Error("Replicate API Error: " + json.error);
      }
      
      if (json.output && Array.isArray(json.output)) {
        return NextResponse.json({ url: json.output[0] });
      }

    // ✅ Case 2: Asynchronous - requires polling
    if (json.urls?.get) {
      const statusUrl = json.urls.get;

      let result = null;
      let start = Date.now();
      const timeout = 30000;

      while (true) {
        const statusRes = await fetch(statusUrl, {
          headers: {
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          },
        });

        const statusJson = await statusRes.json();

        if (statusJson.status === "succeeded") {
          result = statusJson.output;
          break;
        }

        if (statusJson.status === "failed") {
          throw new Error("Image generation failed.");
        }

        if (Date.now() - start > timeout) {
          throw new Error("Generation timed out.");
        }

        await new Promise((r) => setTimeout(r, 1500));
      }

      return NextResponse.json({ url: result[0] });
    }

    // ❌ Unexpected structure
    console.error("❌ Unexpected structure from Replicate:", json);
    throw new Error("Unexpected Replicate response structure");

  } catch (err) {
    console.error("🔥 API Error:", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
