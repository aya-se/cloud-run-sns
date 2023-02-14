FROM python:3.9.12
RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install --no-cache-dir -r  requirements.txt
EXPOSE 8080
WORKDIR /api
COPY ./api ./api
CMD ["uvicorn", "api.main:app", "--reload", "--host", "0.0.0.0", "--port", "8080"]