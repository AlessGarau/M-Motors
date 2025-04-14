# M-Motors

## Initialize DB

python3 manage.py migrate

## Create bucket

mc alias set local <http://localhost:9000> minioadmin minioadmin
mc mb local/my-local-bucket
mc anonymous set public local/my-local-bucket

## Create .env files 

### In the client folder

```
VITE_API_URL="http://localhost:8001/api/"
```

### In the api folder

```
MINIO_ENDPOINT_URL=http://motor-m-db-minio:9000
```

## Run with docker compose
In the projects root folder:

```
docker compose -f Docker/docker-compose.dev.yml -p motor-m up -d
```

## Run the AI

To run the AI, you need to have ollama installed, as well as the llama3.2:1B model running locally.

```
ollama pull llama3.2:1b
ollama start 
```

The api server needs to run locally and not in the docker container. 
Please stop the api container and use the following command to run the server locally:

```
python3 manage.py runserver
```
