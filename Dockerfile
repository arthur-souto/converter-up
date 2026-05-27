FROM node:22-slim

# instala dependências do sistema
RUN apt-get update && apt-get install -y \
    ffmpeg \
    curl \
    python3 \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# instala o yt-dlp
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
    -o /usr/local/bin/yt-dlp && \
    chmod +x /usr/local/bin/yt-dlp

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# cria a pasta de downloads
RUN mkdir -p downloads logs

EXPOSE 3000

CMD ["npm", "start"]