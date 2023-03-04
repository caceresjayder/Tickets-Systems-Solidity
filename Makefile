app:
	docker compose run app

compile:
	docker compose run compile

.PHONY: test
test:
	docker compose run test

