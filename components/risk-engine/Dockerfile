FROM python:3.12-slim

# Install dependencies
RUN apt-get update && \
    apt-get install -y git wget && \
    apt-get install libgomp1 && \
    apt-get clean

# Set timezone to UTC
ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Set the working directory
WORKDIR /app

# Copy requirements and install them
COPY requirements.txt requirements.txt
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Healthcheck
HEALTHCHECK --interval=3m --timeout=10s --retries=sadsad3 \
  CMD wget --no-verbose http://localhost:5001/api/risk/health || exit 1

# Run the application

EXPOSE 5001

CMD ["python3", "app.py"]

# CMD ["bash", "-c", "uvicorn app:app --host 0.0.0.0 --port 5001"]