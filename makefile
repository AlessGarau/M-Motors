install:
	docker-compose -f Docker/docker-compose.dev.yml -p motor-m up --build --no-start

start:
	docker-compose -f Docker/docker-compose.dev.yml -p motor-m up

stop:
	docker-compose -f Docker/docker-compose.dev.yml down
