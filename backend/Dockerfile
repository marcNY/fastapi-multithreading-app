# Dockerfile

FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy project files
COPY . /app

# Install Poetry
RUN pip install poetry

# Install dependencies
RUN poetry config virtualenvs.create false
RUN poetry install

# Expose port
EXPOSE 8000

# Start the app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]