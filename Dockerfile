FROM node:lts
WORKDIR /app
RUN apt-get update && apt-get install -y graphicsmagick && rm -rf /var/lib/apt/lists
COPY package*.json ./
RUN npm ci
CMD node .
COPY . .