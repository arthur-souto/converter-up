# converter-up

A simple REST API that receives a YouTube (or any yt-dlp-supported) URL and returns the audio file as an MP3 download. Built with Node.js, Express, TypeScript, and yt-dlp.

## How it works

1. Client sends a `POST /download` request with a URL.
2. The server uses `yt-dlp` to fetch the video title and download the audio.
3. The MP3 file is streamed back to the client, then deleted from the server.

## API

### `POST /download`

**Request body (JSON):**

```json
{
  "url": "https://www.youtube.com/watch?v=...",
  "format": "mp3"
}
```

| Field    | Type   | Required | Default | Examples                  |
|----------|--------|----------|---------|---------------------------|
| `url`    | string | yes      | —       | —                         |
| `format` | string | no       | `mp3`   | `mp3`, `mp4`, `m4a`, `wav`, `opus`, `webm` |

**Response:** binary audio file (`Content-Disposition: attachment`).

**Error responses:**

| Status | Reason              |
|--------|---------------------|
| 400    | `url` not provided  |
| 500    | Download/conversion failed |

## Running locally (Docker — recommended)

```bash
# Build the image
docker build -t mp3-up .

# Run the container
docker run -p 3000:3000 mp3-up
```

The API will be available at `http://localhost:3000`.

## Running locally (without Docker)

**Prerequisites:**

- Node.js 22+
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) installed and on `PATH`
- [ffmpeg](https://ffmpeg.org/) installed and on `PATH`
- Python 3 (required by yt-dlp)

```bash
# Install yt-dlp (Linux/macOS)
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
    -o /usr/local/bin/yt-dlp && \
    chmod +x /usr/local/bin/yt-dlp

# Install dependencies
npm install

# Development mode (auto-reload)
npm run dev

# Production build
npm run build && npm start
```

## Environment variables

Create a `.env` file in the project root:

```env
PORT=3000
```

| Variable | Default | Description        |
|----------|---------|--------------------|
| `PORT`   | `3000`  | Port the server listens on |

## Project structure

```
mp3-up/
├── src/
│   ├── app.ts           # Express server and routes
│   ├── ytdlp.ts         # yt-dlp wrapper (download logic)
│   ├── enviroments.ts   # Environment variable loader
│   ├── config/
│   │   └── logs.ts      # Winston logger config
│   └── types/
│       └── model.ts     # TypeScript interfaces
├── downloads/           # Temporary download directory (auto-created)
├── logs/                # Log files (app.log, error.log)
├── Dockerfile
├── tsconfig.json
└── package.json
```

## Dependencies

| Package             | Purpose                                      |
|---------------------|----------------------------------------------|
| `express`           | HTTP server                                  |
| `yt-dlp-wrap-plus`  | Node.js wrapper around the `yt-dlp` binary   |
| `winston`           | Structured logging                           |
| `dotenv`            | Load environment variables from `.env`       |
| `cors`              | Cross-origin request handling                |
| `typescript`        | Type safety                                  |
| `ts-node-dev`       | Dev server with hot-reload                   |

### System dependencies (installed in Docker)

| Tool      | Purpose                                        |
|-----------|------------------------------------------------|
| `yt-dlp`  | Downloads video/audio from YouTube and others  |
| `ffmpeg`  | Converts downloaded audio to MP3               |
| `python3` | Runtime required by `yt-dlp`                   |
