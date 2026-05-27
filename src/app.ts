import express from "express";
import enviroments from "./environments";
import logger from "./config/logs";
import fs from "fs";
import { RequestDownload } from "./types/model";
import ytdlp from "./ytdlp"

const app = express();
app.use(express.json());
app.use(express.static("static"));

if (!fs.existsSync("downloads")) {
  fs.mkdirSync("downloads");
}

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "static" });
})

app.get("/download", async (req, res) => {
  const { url, format } = req.query as unknown as RequestDownload;

  if (!url) {
    logger.error("URL is required", { error: "URL is required" });
    return res.status(400).json({ error: "URL is required" });
  }

  const audioFormat = format || `mp3`;

  logger.info(`Received download request for URL: ${url}`, { url });

  try {
    const safeName = await ytdlp.buildName(url)
    const outputPath = ytdlp.buildOutputPath(safeName, audioFormat);
    await ytdlp.execDownload({url, format: audioFormat}, {safeName, outputPath})
   
    res.download(outputPath, `${safeName}.${audioFormat}`, (err) => {
      fs.unlink(outputPath, () => {});
      if (err) logger.error("Error send client:", { error: err.message });
    });
  } catch (err: any) {
    logger.error("Erro:", { error: err.message });
    res.status(500).json({ error: err.message });
  }
});


app.post("/download", async (req, res) => {
  const { url, format } = req.body as RequestDownload;

  if (!url) {
    logger.error("URL is required", { error: "URL is required" });
    return res.status(400).json({ error: "URL is required" });
  }

  const audioFormat = format || `mp3`;

  logger.info(`Received download request for URL: ${url}`, { url });

  try {
    const safeName = await ytdlp.buildName(url)
    const outputPath = ytdlp.buildOutputPath(safeName, audioFormat);
    await ytdlp.execDownload({url, format: audioFormat}, {safeName, outputPath})
   
    res.download(outputPath, `${safeName}.${audioFormat}`, (err) => {
      fs.unlink(outputPath, () => {});
      if (err) logger.error("Error send client:", { error: err.message });
    });
  } catch (err: any) {
    logger.error("Erro:", { error: err.message });
    res.status(500).json({ error: err.message });
  }
});

app.listen(enviroments.port, () => {
  logger.info(`Server is running on port ${enviroments.port}`, {
    running: true,
  });
});
