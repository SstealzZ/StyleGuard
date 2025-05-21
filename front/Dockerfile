FROM node:20-alpine AS build

WORKDIR /app

# Installer les dépendances
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit --progress=false

# Installer terser explicitement (nécessaire pour la minification)
RUN npm install terser --no-save

# Copier les sources
COPY . .

# Configurer l'API URL
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL:-http://localhost:9080}

# Build direct sans TypeScript check et avec une seule commande simple
RUN npx vite build --mode production

# Production image
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 