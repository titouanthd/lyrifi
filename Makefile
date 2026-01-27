install:
	npm install

dev:
	npm run dev

build:
	npm run build

lint:
	npm run lint

test:
	npm run test

db-up:
	docker compose up -d

db-down:
	docker compose down

db-logs:
	docker compose logs -f

db-seed:
	npm run db:seed
