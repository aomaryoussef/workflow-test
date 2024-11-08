#!/usr/bin/env sh
set -eu

envsubst '${CONDUCTOR_BASE_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf \
  && nginx -g 'daemon off;'