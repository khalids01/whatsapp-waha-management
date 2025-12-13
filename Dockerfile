# -------------------------------
# Base image
# -------------------------------
FROM node:24-bookworm-slim

WORKDIR /app

# -------------------------------
# System dependencies (Prisma)
# -------------------------------
RUN apt-get update && apt-get install -y \
    openssl \
    libssl3 \
    libc6 \
    libgcc-s1 \
    libstdc++6 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# -------------------------------
# Install dependencies
# -------------------------------
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# -------------------------------
# Copy source
# -------------------------------
COPY . .

# -------------------------------
# Prisma client
# -------------------------------
RUN npx prisma generate

# -------------------------------
# Build Next.js
# -------------------------------
RUN npm run build

# -------------------------------
# Non-root user
# -------------------------------
RUN useradd -ms /bin/bash -u 10001 appuser

USER appuser

# -------------------------------
# Runtime
# -------------------------------
ENV NODE_ENV=production
EXPOSE 3003

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
