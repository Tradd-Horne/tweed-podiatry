# The site is built on a development machine and the HTML is committed, so production is
# nginx and nothing else.
#
# Why not build here: this droplet runs ~24 containers on 1 vCPU and 2GB. `npm ci` alone took
# over five minutes, and `next build` needs more memory than npm ci does. A static site has no
# reason to be compiled on the server that serves it.
#
# After changing the site: `npm run build` locally, commit `out/`, then redeploy.

FROM nginx:1.27-alpine
COPY out /usr/share/nginx/html
