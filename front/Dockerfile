FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Ensure environment variables are available during build
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL:-http://localhost:9080}

# Contourner TypeScript et exécuter directement Vite
RUN npx vite build

# Production image
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 