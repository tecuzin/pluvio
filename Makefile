.PHONY: help minikube-setup minikube-dev minikube-clean docker-build docker-run docker-compose-up docker-compose-down install-docker

help: ## Affiche l'aide
	@echo "Commandes disponibles:"
	@echo ""
	@echo "Installation:"
	@echo "  make install-docker    - Aide à installer Docker/HyperKit sur macOS"
	@echo ""
	@echo "Minikube:"
	@echo "  make minikube-setup    - Configure et déploie l'application dans Minikube (production)"
	@echo "  make minikube-dev      - Déploie l'application en mode développement dans Minikube"
	@echo "  make minikube-clean    - Nettoie les déploiements Minikube"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build      - Construit les images Docker"
	@echo "  make docker-run        - Lance l'application en production avec Docker"
	@echo "  make docker-compose-up - Lance avec docker-compose (développement)"
	@echo "  make docker-compose-down - Arrête docker-compose"

minikube-setup: ## Configure et déploie dans Minikube
	@chmod +x scripts/minikube-setup.sh
	@./scripts/minikube-setup.sh

minikube-dev: ## Déploie en mode développement dans Minikube
	@chmod +x scripts/minikube-dev.sh
	@./scripts/minikube-dev.sh

minikube-clean: ## Nettoie les déploiements Minikube
	@chmod +x scripts/minikube-clean.sh
	@./scripts/minikube-clean.sh

docker-build: ## Construit les images Docker
	docker build -t pluvio:latest -f Dockerfile .
	docker build -t pluvio-dev:latest -f Dockerfile.dev .

docker-run: ## Lance l'application en production
	docker run -d -p 8080:80 --name pluvio pluvio:latest

docker-compose-up: ## Lance avec docker-compose
	docker-compose up -d pluvio-dev

docker-compose-down: ## Arrête docker-compose
	docker-compose down

install-docker: ## Aide à installer Docker/HyperKit sur macOS
	@chmod +x scripts/install-docker-macos.sh
	@./scripts/install-docker-macos.sh
