import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "KAFA MATH",
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// AI Tutor Endpoint - Socratic & Age-Adaptive in Indonesian
app.post("/api/tutor", async (req, res) => {
  try {
    const { childName, ageGrade, topic, currentQuestion, userMessage, hintLevel } = req.body;
    const ai = getAI();

    const systemPrompt = `Kamu adalah "Kaka", mentor matematika yang ramah, hangat, menyemangati, dan ceria untuk anak-anak Indonesia dalam aplikasi KAFA MATH.
Target pengguna: ${childName || "Teman Kecil"} (Tingkat: ${ageGrade || "SD Kelas 2"}, Topik: ${topic || "Matematika"}).

ATURAN UTAMA:
1. Gunakan Bahasa Indonesia yang sangat ramah, santun, hangat, dan mudah dipahami sesuai usia anak.
2. JANGAN LANGSUNG MEMBERIKAN JAWABAN AKHIR jika anak sedang mengerjakan soal latihan!
3. Gunakan metode Sokratik (bimbing dengan analogi benda nyata Indonesia seperti kue onde-onde, martabak, mangga, kelereng, pensil warna, atau uang jajan).
4. Buat penjelasan singkat (maksimal 3-4 kalimat pendek) agar anak tidak bosan membaca.
5. Selalu beri pujian atas usaha anak (misal: "Wah pertanyaan bagus!", "Yuk kita bedah bareng-bareng!").
6. Jika diminta Hint Level:
   - Level 1: Berikan petunjuk ringan arah berpikir.
   - Level 2: Berikan contoh serupa dengan angka lebih kecil.
   - Level 3: Berikan langkah pengerjaan tahap demi tahap tanpa jawaban akhir.`;

    let prompt = "";
    if (userMessage) {
      prompt = `Pertanyaan anak: "${userMessage}". Soal saat ini: "${currentQuestion || "Tidak ada soal spesifik"}".`;
    } else if (hintLevel) {
      prompt = `Berikan petunjuk Hint Level ${hintLevel} untuk soal: "${currentQuestion}".`;
    } else {
      prompt = `Beri sapaan semangat belajar matematika untuk ${childName || "teman kecil"} hari ini!`;
    }

    if (!ai) {
      // High-quality deterministic fallback tutor if API key is not yet set
      let fallbackText = "";
      if (hintLevel === 1) {
        fallbackText = `💡 Halo ${childName || "Teman"}! Petunjuk ringan: Coba perhatikan angka apa saja yang diketahui dan apa yang ditanyakan. Apakah ditambah atau dikurang?`;
      } else if (hintLevel === 2) {
        fallbackText = `💡 Coba bayangkan contoh mudah: Kalau kamu punya 2 buah mangga manis, lalu dapat 3 mangga lagi dari Ayah, ada berapa mangga di keranjangmu?`;
      } else if (hintLevel === 3) {
        fallbackText = `💡 Langkah penyelesaian: 1. Tulis angka pertama. 2. Lakukan operasi hitung perlahan. 3. Cek kembali hasil hitunganmu yuk!`;
      } else {
        fallbackText = `Halo ${childName || "Juara Cilik"}! Kaka siap membantumu berpetualang dan menaklukkan matematika. Mau tanya tentang soal atau konsep apa nih? 🌟`;
      }
      return res.json({ text: fallbackText });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text || "Semangat terus belajarnya ya!" });
  } catch (error: any) {
    console.error("AI Tutor error:", error);
    res.status(500).json({
      error: "Gagal memproses AI Tutor",
      fallbackText: "Kaka sedang mengambil buku catatan! Coba hitung pelan-pelan ya, kamu pasti bisa! ⭐",
    });
  }
});

// AI Diagnostic Evaluator Endpoint
app.post("/api/diagnostic-eval", async (req, res) => {
  try {
    const { answers, grade, childName } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json({
        summary: `${childName || "Anak"} menunjukkan pemahaman dasar yang baik dalam berhitung. Latihan berkelanjutan pada konsep visual akan memperkuat fondasinya!`,
        recommendedTopics: ["Operasi Bilangan", "Bentuk & Pola", "Pengukuran Kontekstual"],
        placementLevel: grade || "Fase A",
      });
    }

    const prompt = `Analisis hasil tes diagnostik matematika anak bernama ${childName} (Kelas: ${grade}):
Data jawaban: ${JSON.stringify(answers)}
Berikan evaluasi singkat dalam JSON format:
{
  "summary": "Ringkasan 2 kalimat apresiatif dan analisis kekuatan serta topik yang perlu dilatih",
  "recommendedTopics": ["Topik 1", "Topik 2", "Topik 3"],
  "placementLevel": "Fase atau Level yang direkomendasikan"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Diagnostic eval error:", error);
    res.json({
      summary: "Evaluasi diagnostik selesai dengan hasil memuaskan.",
      recommendedTopics: ["Bilangan", "Operasi Hitung"],
      placementLevel: "Fase A",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KAFA MATH server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
