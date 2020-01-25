FROM node:latest as build-stage

# Install vue app
WORKDIR /vue
COPY client ./
RUN npm install
RUN npm run build

# Install express app
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY index.js ./

# Production stage
FROM node:latest as production-stage
WORKDIR /app
COPY --from=build-stage /app ./
COPY --from=build-stage /vue/dist ./dist

# Run app
EXPOSE 80
CMD [ "node", "index.js" ]