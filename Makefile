.PHONY: empty
empty:

.PHONY: run
run:
	docker-compose up

.PHONY: build
build:
	docker-compose build --no-cache

.PHONY: backup-firebase
backup-firebase:
	docker-compose exec firebase firebase emulators:export /var/local/firebase/export_data --project demo-local

# デフォルトの GCP リソース ロケーションの設定をしないとfirebase initでコケる
# firebase login --no-localhost
# firebase init --interactive