FROM node:18-alpine as build

WORKDIR /app

# Récupération des arguments de construction
ARG VITE_API_URL

# Définition des variables d'environnement
ENV VITE_API_URL=${VITE_API_URL:-http://localhost:9080}
ENV NODE_ENV=production

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances (incluant les devDependencies nécessaires pour le build)
RUN npm install --include=dev

# Copie des fichiers de configuration avant le code source
COPY vite.config.ts tsconfig*.json ./

# Copie du code source
COPY . .

# Construction de l'application
RUN npm run build

# Étape 2: Servir l'application avec Nginx
FROM nginx:alpine

# Copie des fichiers de build depuis l'étape de build
COPY --from=build /app/dist /usr/share/nginx/html

# Copie de la configuration nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposition du port
EXPOSE 80

# Démarrage de Nginx
CMD ["nginx", "-g", "daemon off;"] 