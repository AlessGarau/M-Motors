# M-Motors

## Initialize DB

python3 manage.py migrate

## Run locally

python3 manage.py runserver


## Create bucket

mc alias set local http://localhost:9000 minioadmin minioadmin
mc mb local/my-local-bucket
mc anonymous set public local/my-local-bucket