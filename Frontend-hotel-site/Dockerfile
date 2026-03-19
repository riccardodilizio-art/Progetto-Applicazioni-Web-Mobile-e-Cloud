
# --- FASE 1: Build ---
FROM node:20-alpine AS build

WORKDIR /app

# Copia package files e installa dipendenze
COPY package.json package-lock.json ./
RUN npm ci

# Copia il resto del codice e builda
COPY . .
RUN npm run build

# --- FASE 2: Serve con Nginx ---
FROM nginx:alpine

# Rimuovi la config default di Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia la nostra config custom
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia i file buildati dalla fase 1
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
