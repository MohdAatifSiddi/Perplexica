#!/bin/bash

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "Azure CLI is not installed. Please install it first."
    exit 1
fi

# Login to Azure
az login

# Set variables
RESOURCE_GROUP="weybre-ai-rg"
LOCATION="eastus"
APP_NAME="weybre-ai"
DB_NAME="weybreaidb"
DB_USER="weybreaiadmin"
DB_PASSWORD=$(openssl rand -base64 32)

# Create resource group
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create Azure Container Registry
az acr create --resource-group $RESOURCE_GROUP --name $APP_NAME --sku Basic

# Login to ACR
az acr login --name $APP_NAME

# Build and push Docker images
docker-compose -f docker-compose.azure.yml build
docker-compose -f docker-compose.azure.yml push

# Create Azure Database for PostgreSQL
az postgres flexible-server create \
    --name $DB_NAME \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --admin-user $DB_USER \
    --admin-password $DB_PASSWORD \
    --sku-name Standard_B1ms \
    --version 15

# Create Azure Container Apps environment
az containerapp env create \
    --name $APP_NAME-env \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION

# Deploy Weybre AI
az containerapp create \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --environment $APP_NAME-env \
    --image $APP_NAME.azurecr.io/weybre-ai:latest \
    --target-port 3000 \
    --ingress external \
    --env-vars \
        DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_NAME.postgres.database.azure.com:5432/postgres" \
        SEARXNG_API_URL="http://searxng:8080"

# Deploy SearxNG
az containerapp create \
    --name searxng \
    --resource-group $RESOURCE_GROUP \
    --environment $APP_NAME-env \
    --image searxng/searxng:latest \
    --target-port 8080 \
    --ingress internal \
    --env-vars \
        INSTANCE_NAME="Weybre AI Search" \
        SEARXNG_BASE_URL="http://localhost:8080"

echo "Deployment completed!"
echo "Database connection string: postgresql://$DB_USER:$DB_PASSWORD@$DB_NAME.postgres.database.azure.com:5432/postgres" 