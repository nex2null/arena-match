FROM node:latest as build-stage

# Install client application
WORKDIR /client
COPY client ./
RUN npm install
RUN npm run build

# Install server application
WORKDIR /server
COPY server ./
RUN npm ci --only=production

# Production stage
FROM node:latest as production-stage
WORKDIR /app
COPY --from=build-stage /server ./
COPY --from=build-stage /client/dist ./dist

# Run app
EXPOSE 80
CMD [ "node", "main.js" ]