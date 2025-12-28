# ---- Build Shef frontend ----
FROM node:20-alpine AS build_shef
WORKDIR /app
COPY shef-frontend/package*.json ./
RUN npm ci
COPY shef-frontend ./
ARG VITE_API_PREFIX=/shef-api
ENV VITE_API_PREFIX=$VITE_API_PREFIX
RUN npm run build

# ---- Final Nginx image serving both frontends ----
FROM nginx:1.27-alpine AS web
# static
RUN rm -rf /usr/share/nginx/html/*
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# landing
COPY web-root /usr/share/nginx/html/root

# shef dist
COPY --from=build_shef /app/dist /usr/share/nginx/html/shef

# premium static
COPY premium-frontend /usr/share/nginx/html/premium
