import YTDlpWrap from "yt-dlp-wrap-plus";
import { RequestDownload } from "./types/model";
import path from "path/win32";
import logger from "./config/logs";

const ytdlp = new YTDlpWrap("/usr/bin/yt-dlp");

const buildName = async (url: string): Promise<string> => {
  const title = await ytdlp.execPromise([
    url,
    "--no-playlist",
    "--print",
    "title",
    "--no-download",
  ]);

  return title
    .trim()
    .replace(/[^\w\s-]/gi, "")
    .trim();
};

const buildOutputPath = (safeName: string, format: string): string => path.resolve("downloads", `${safeName}.${format}`); 

const execDownload = async ({ url, format }: RequestDownload, {safeName, outputPath}: { safeName: string, outputPath: string }) => {

  await new Promise<void>((resolve, reject) => {
    ytdlp
      .exec([
        url,
        "--no-playlist",
        "-x",
        "--audio-format",
        format ?? "mp3",
        "--audio-quality",
        "0",
        "-o",
        outputPath,
      ])
      .on("progress", (progress) => {
        logger.info(`${progress.percent}% - ${progress.currentSpeed}`);
      })
      .on("error", reject)
      .on("close", () => resolve());
  });
};

export default {
  ytdlp,
  buildName,
  buildOutputPath,
  execDownload,
};
