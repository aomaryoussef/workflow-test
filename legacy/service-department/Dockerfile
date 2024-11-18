FROM sanicframework/sanic:3.11-latest
WORKDIR /app

COPY . .

RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN pip install -r requirements.web.txt

# Install curl
RUN apk --no-cache add curl

EXPOSE 1337

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD curl --fail http://localhost:1337/health || exit 1

CMD ["python", "app.py"]