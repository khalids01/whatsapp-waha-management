# WAHA Dockerfile (WhatsApp HTTP API)
FROM devlikeapro/waha:latest

# The app listens on 3000 *inside* the container
EXPOSE 3000

# Persist sessions & media
# VOLUME ["/app/.sessions", "/app/.media"]

# Healthcheck runs *inside* the container → use 3000
# HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
# CMD curl -f http://localhost:3000/health || exit 1

# Do NOT add CMD/ENTRYPOINT — the base image starts WAHA itself
