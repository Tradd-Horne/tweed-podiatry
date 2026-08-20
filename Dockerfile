# Two stages: build the static export with Node, then ship only the HTML on nginx.
# The production image has no Node in it at all — nothing to keep patched, and it starts
# instantly because there is no application, only files.

FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/out /usr/share/nginx/html
