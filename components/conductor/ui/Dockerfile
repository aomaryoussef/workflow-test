# Docker uses platform specific configs during build
# https://docs.docker.com/engine/reference/builder/#automatic-platform-args-in-the-global-scope
ARG BUILD_PLATFORM="linux/amd64"

FROM --platform=${BUILD_PLATFORM} node:lts-alpine3.20 AS builder

WORKDIR /app
RUN apk update && apk add --no-cache openssh git curl
RUN git clone https://github.com/Netflix/conductor.git
WORKDIR /app/conductor/ui
# RUN yarn config set network-timeout 600000 -g
RUN npm install --ignore-scripts
RUN npm run build

WORKDIR /app/oathkeeper
RUN curl --proto "=https" --tlsv1.2 -sSf -L https://github.com/ory/oathkeeper/releases/download/v0.40.7/oathkeeper_0.40.7-linux_arm64.tar.gz > oathkeeper_0.40.7-linux_arm64.tar.gz
RUN tar -xvf oathkeeper_0.40.7-linux_arm64.tar.gz

FROM --platform=${BUILD_PLATFORM} nginx:1.25-alpine3.18 AS runner
RUN addgroup -S nonroot \
    && adduser -S appuser -G nonroot

RUN mkdir -p /etc/config/oathkeeper

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/conductor/ui/build .
COPY --from=builder /app/oathkeeper/oathkeeper /usr/local/bin/oathkeeper
COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /app
# Startup script(s)
COPY startup.sh /app
COPY oathkeeper.yml /etc/config/oathkeeper
COPY oathkeeper-access-rules.yml.tmpl /etc/config/oathkeeper
RUN chmod +x /app/startup.sh
RUN chmod +x /usr/local/bin/oathkeeper

RUN chown -R appuser:nonroot /etc/config/oathkeeper
RUN chown -R appuser:nonroot /app
## Give proper permissions for running nginx as non-root user
## See: https://forums.docker.com/t/running-nginx-official-image-as-non-root/135759/7
RUN mkdir -p /var/cache/nginx/client_temp && \
        mkdir -p /var/cache/nginx/proxy_temp && \
        mkdir -p /var/cache/nginx/fastcgi_temp && \
        mkdir -p /var/cache/nginx/uwsgi_temp && \
        mkdir -p /var/cache/nginx/scgi_temp && \
        chown -R appuser:nonroot /var/cache/nginx && \
        chown -R appuser:nonroot /etc/nginx/ && \
        chmod -R 755 /etc/nginx/ && \
        chown -R appuser:nonroot /var/log/nginx
RUN mkdir -p /etc/nginx/ssl/ && \
    chown -R appuser:nonroot /etc/nginx/ssl/ && \
    chmod -R 755 /etc/nginx/ssl/
RUN touch /var/run/nginx.pid && \
        chown -R appuser:nonroot /var/run/nginx.pid /run/nginx.pid

EXPOSE 7075

USER appuser

CMD [ "/app/startup.sh" ]
ENTRYPOINT [ "/bin/sh" ]