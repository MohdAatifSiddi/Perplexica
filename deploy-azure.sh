#!/bin/bash

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "Azure CLI is not installed. Please install it first."
    exit 1
fi

# Login to Azure
az login

# Set variables
RESOURCE_GROUP="perplexica-rg"
LOCATION="eastus"
ENVIRONMENT="perplexica-env"
CONTAINER_APP="perplexica"
KEY_VAULT="perplexica-kv"

# Create resource group
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create Azure Container Apps environment
az containerapp env create \
  --name $ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

# Create Key Vault
az keyvault create \
  --name $KEY_VAULT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

# Store secrets in Key Vault
az keyvault secret set \
  --vault-name $KEY_VAULT \
  --name "custom-openai-api-key" \
  --value "$CUSTOM_OPENAI_API_KEY"

az keyvault secret set \
  --vault-name $KEY_VAULT \
  --name "custom-openai-api-url" \
  --value "$CUSTOM_OPENAI_API_URL"

az keyvault secret set \
  --vault-name $KEY_VAULT \
  --name "custom-openai-model-name" \
  --value "$CUSTOM_OPENAI_MODEL_NAME"

# Create a storage account for Searxng configuration
az storage account create \
  --name "${RESOURCE_GROUP}storage" \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Standard_LRS

# Create a file share for Searxng configuration
az storage share create \
  --name "searxng-config" \
  --account-name "${RESOURCE_GROUP}storage"

# Upload Searxng configuration
az storage file upload \
  --share-name "searxng-config" \
  --source "./searxng/settings.yml" \
  --account-name "${RESOURCE_GROUP}storage"

# Deploy Container App
az containerapp create \
  --name $CONTAINER_APP \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT \
  --yaml azure-container-apps.yaml

# Get the URL
az containerapp show \
  --name $CONTAINER_APP \
  --resource-group $RESOURCE_GROUP \
  --query "properties.configuration.ingress.fqdn" \
  --output tsv

echo "Deployment completed!" 