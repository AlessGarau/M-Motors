# M-Motors

## Initialize DB

python3 manage.py migrate

## Run locally

python3 manage.py runserver

## Create bucket

mc alias set local <http://localhost:9000> minioadmin minioadmin
mc mb local/my-local-bucket
mc anonymous set public local/my-local-bucket

## Api

### 1. Get List of Cars

- `GET /api/cars/`
- Filters: `service_type`
- Example: `GET /api/cars/?service_type=Rental`

### 2. Retrieve a Single Car

- `GET /api/cars/{id}/`

### 3. Create a Car

- `POST /api/cars/`
- JSON Body:

  ```json
  {
    "brand": "Renault",
    "service_type": "SALE",
    "model": "Clio",
    "year": 2020,
    "kilometers": 15000,
    "price": 18000
  }
  ```

### 4. Update a Car

- `PUT /api/cars/{id}/`

### 5. Partially Update a Car

- `PATCH /api/cars/{id}/`

### 6. Delete a Car

- `DELETE /api/cars/{id}/`

## docs

- <https://django-filter.readthedocs.io/en/stable/guide/usage.html>
