FROM node:20

RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk-bridge2.0-0 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libatspi2.0-0 \
    libgtk-3-0 \
    libxshmfence1
    
WORKDIR /app
COPY package*.json ./
COPY .env ./
RUN npm i
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["sh", "-c", "BODY_SIZE_LIMIT=Infinity PROTOCOL_HEADER=x-forwarded-proto HOST_HEADER=x-forwarded-host node build/index.js"]
