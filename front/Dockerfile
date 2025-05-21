FROM node:20-alpine AS build

# Utiliser un utilisateur non-root pour éviter les problèmes de permissions
USER node
WORKDIR /home/node/app

# Configurer npm pour utiliser moins de mémoire
ENV NODE_OPTIONS="--max-old-space-size=2048"

# Copier les fichiers package.json en tant qu'utilisateur node
COPY --chown=node:node package*.json ./

# Créer et utiliser un volume pour le cache npm
RUN mkdir -p /home/node/.npm
ENV NPM_CONFIG_CACHE=/home/node/.npm

# Installer les dépendances
RUN npm ci --quiet

# Copier les sources avec les bonnes permissions
COPY --chown=node:node . .

# Ensure environment variables are available during build
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL:-http://localhost:9080}

# Supprimer tsconfig.node.json pour éviter les problèmes de référence
RUN cp tsconfig.json tsconfig.backup.json && \
    echo '{ "compilerOptions": { "target": "ES2020", "useDefineForClassFields": true, "lib": ["ES2020", "DOM", "DOM.Iterable"], "module": "ESNext", "skipLibCheck": true, "moduleResolution": "bundler", "allowImportingTsExtensions": true, "resolveJsonModule": true, "isolatedModules": true, "noEmit": true, "jsx": "react-jsx", "strict": true, "baseUrl": ".", "paths": { "@/*": ["src/*"] } }, "include": ["src"] }' > tsconfig.json

# Construire l'application avec journalisation détaillée
RUN echo "Node version: $(node -v)" && \
    echo "NPM version: $(npm -v)" && \
    VITE_LOG_LEVEL=info npm run build || { echo "Build failed with exit code $?"; exit 1; }

# Production image
FROM nginx:alpine

COPY --from=build /home/node/app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 