FROM node:21.5.0-alpine3.19 AS builder

WORKDIR /app
RUN apk add --no-cache openssh git yarn
RUN git clone https://github.com/Netflix/conductor.git

WORKDIR /app/conductor/ui
RUN yarn config set network-timeout 600000 -g
RUN yarn install && yarn build

FROM nginx:1.25-alpine3.18 AS runner

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/conductor/ui/build .
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

WORKDIR /app
COPY startup.sh ./
RUN chmod +x /app/startup.sh

HEALTHCHECK --interval=60s --timeout=30s --retries=10 CMD curl -I -XGET http://localhost:3000 || exit 1

EXPOSE 3000

CMD [ "/app/startup.sh" ]
ENTRYPOINT [ "/bin/sh" ]
