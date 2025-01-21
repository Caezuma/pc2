# Comando para rodar o Docker Compose
Write-Host "Iniciando Docker Compose..."
docker-compose up -d --build --force-recreate

# Aguardar alguns segundos para garantir que o PostgreSQL esteja pronto
Start-Sleep -Seconds 10

# Comando para conectar-se ao PostgreSQL e executar o schema.sql
Write-Host "Conectando ao PostgreSQL e executando o schema.sql..."

# Ler o conteúdo do arquivo schema.sql
$schemaSql = Get-Content ./GameUno/config/schema.sql

# Executar o script SQL dentro do contêiner PostgreSQL
docker exec -i $(docker-compose ps -q db) psql -U console-log -d console_log -c "$schemaSql"

Write-Host "Setup concluído."
