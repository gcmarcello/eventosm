
# flyctl deploy --dockerfile ./apps/nest/Dockerfile --config ./apps/nest/fly.toml --ignorefile .dockerignore

FROM node:20-alpine AS base
RUN apk add --update \
    bash \
    lcms2-dev \
    libpng-dev \
    gcc \
    g++ \
    make \
    autoconf \
    automake \
  && rm -rf /var/cache/apk/*


FROM base AS builder
    WORKDIR /app
    
    ENV APP_NAME=nest
    
    RUN apk add --no-cache libc6-compat
    RUN apk update

    RUN npm install -g turbo

    COPY . .

    RUN turbo prune --scope=nest --docker


FROM base as installer
    WORKDIR /app
    ENV APP_NAME=nest
    
    RUN npm install -g pnpm
    RUN npm install -g turbo

    COPY .gitignore .gitignore
    COPY --from=builder /app/out/json/ .
    COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
    COPY --from=builder /app/out/full/ .
    RUN pnpm install
    
    COPY turbo.json turbo.json

    RUN turbo run build --filter=nest...
    
FROM base AS runner
    WORKDIR /app
    ENV APP_NAME=nest
    
    RUN npm install -g pnpm

    COPY --from=installer /app .

    CMD pnpm --filter nest start --max-old-space-size=256