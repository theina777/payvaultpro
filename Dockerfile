# 1. Build the React Web UI
FROM node:20 as frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. Build the C++ Backend API
FROM alpine:latest as backend-builder
RUN apk add --no-cache g++ make
WORKDIR /app
COPY server/ ./
RUN g++ main.cpp -o payvault -O3 -std=c++17

# 3. Final Production Container
FROM alpine:latest
RUN apk add --no-cache libstdc++
WORKDIR /opt/render/project/src
COPY --from=backend-builder /app/payvault ./server/payvault
COPY --from=frontend-builder /app/dist ./dist

# Render automatically requires exposing port
EXPOSE 3000

# Execute the native C++ API and serve Web GUI
WORKDIR /opt/render/project/src/server
CMD ["./payvault"]
