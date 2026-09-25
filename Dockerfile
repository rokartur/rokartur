FROM node:24-slim AS build
COPY --from=oven/bun:1.4.0 /usr/local/bin/bun /usr/local/bin/bun
# The prerender preview server binds localhost as ::1 in a build container, then gets fetched on 127.0.0.1.
ENV NODE_OPTIONS=--dns-result-order=ipv4first
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM nginx:alpine
COPY --from=build /app/dist/client /usr/share/nginx/html
RUN echo 'server { listen 80; root /usr/share/nginx/html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
