install:
	sh install.sh

start:
	docker-compose -f Docker/docker-compose.dev.yml -p motor-m up

stop:
	docker-compose -f Docker/docker-compose.dev.yml down
