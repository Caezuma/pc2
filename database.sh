#!/bin/bash

# Comando para rodar o Docker Compose
echo "Iniciando Docker Compose..."
docker-compose up -d --build --force-recreate

# Aguardar alguns segundos para garantir que o PostgreSQL esteja pronto
sleep 10

# Comando para conectar-se ao PostgreSQL e executar o schema.sql
echo "Conectando ao PostgreSQL e executando o schema.sql..."

# Ler o conteúdo do arquivo schema.sql
schemaSql=$(cat ./GameUno/database/schema.sql)

# Executar o script SQL dentro do contêiner PostgreSQL
docker exec -i $(docker-compose ps -q db) psql -U console-log -d console_log -c "$schemaSql"

echo "Setup concluído."
