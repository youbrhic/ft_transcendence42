.PHONY: all clean fclean

# Paths
COMPOSE_FILE=docker-compose.yml
FRONTEND_DIR=Frontend
BACKEND_DIR=backend
NODE_DIR_FRONT=Frontend/node_modules
NODE_DIR_BACK=backend/node_modules

all:
	docker compose -f $(COMPOSE_FILE) up --build 

logs_backend:
	docker-compose -f $(COMPOSE_FILE) logs backend

logs_frontend:
	docker-compose -f $(COMPOSE_FILE) logs frontend

logs_nginx:
	docker-compose -f $(COMPOSE_FILE) logs nginx

logs_grafana:
	docker-compose -f $(COMPOSE_FILE) logs grafana

clean:
	docker compose -f $(COMPOSE_FILE) down --remove-orphans

fclean: clean
	@echo "🧹 Removing volumes..."
	docker volume prune -f
	@echo "🗑️ Removing all images built by docker-compose..."
	docker compose -f $(COMPOSE_FILE) down --rmi all --volumes --remove-orphans
	@echo "🧼 Cleaning node_modules..."
	echo "🗑️  Removing Frontend node_modules..."; \
	rm -rf $(NODE_DIR_FRONT) $(NODE_DIR_BACK); \

re: fclean all
# docker stop srcs-nginx_exporter-1