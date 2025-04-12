#!/bin/bash

# Set variables
RESOURCE_GROUP="weybre-rg"
APP_SERVICE_PLAN="weybre-plan"
APP_NAME="weybre"
LOCATION="eastus"
GITHUB_REPO="MohdAatifSiddi/Perplexica"
DEPLOYMENT_TOKEN="5cb22a4abb9e87e45a67e481c84a0958a9c96240475a7d7a583658b30b5d1c9d06-f27c7693-5502-4986-bd4e-97d026b7395801e06200ff28051e"

# Create resource group if it doesn't exist
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create App Service plan
az appservice plan create \
    --name $APP_SERVICE_PLAN \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --sku B1 \
    --is-linux

# Create web app
az webapp create \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --plan $APP_SERVICE_PLAN \
    --runtime "NODE:20"

# Configure deployment from GitHub
az webapp deployment github-actions add \
    --repo $GITHUB_REPO \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --branch main \
    --token $DEPLOYMENT_TOKEN

# Configure Node.js version
az webapp config set \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --linux-fx-version "NODE|20"

# Configure startup command
az webapp config set \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --startup-file "yarn start"

# Enable health check
az webapp config appsettings set \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --settings WEBSITE_HEALTHCHECK_MAXPINGFAILURES=10 WEBSITE_HEALTHCHECK_MAXUNHEALTHYWORKERPERCENT=50

# Set environment variables
az webapp config appsettings set \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --settings CUSTOM_OPENAI_API_KEY="5BjV2gm9Ry0tVt9ID7gBynw8Ee6Ewm56zALIirWB36AV0BzXIJ9rJQQJ99BDACHYHv6XJ3w3AAAAACOGVYIm" \
    CUSTOM_OPENAI_API_URL="https://mekot-m98ufofa-eastus2.openai.azure.com" \
    CUSTOM_OPENAI_MODEL_NAME="gpt-4.5-preview" \
    SEARXNG_API_URL="http://20.65.200.13"

# Enable Always On
az webapp config set \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --always-on true

# Get the publish profile
echo "Getting publish profile..."
PUBLISH_PROFILE=$(az webapp deployment list-publishing-profiles \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --xml)

echo "Deployment completed! Your app is available at: https://$APP_NAME.azurewebsites.net"
echo ""
echo "IMPORTANT: Add these secrets to your GitHub repository:"
echo "1. AZURE_WEBAPP_PUBLISH_PROFILE: $PUBLISH_PROFILE"
echo "2. CUSTOM_OPENAI_API_KEY: 5BjV2gm9Ry0tVt9ID7gBynw8Ee6Ewm56zALIirWB36AV0BzXIJ9rJQQJ99BDACHYHv6XJ3w3AAAAACOGVYIm"
echo "3. CUSTOM_OPENAI_API_URL: https://mekot-m98ufofa-eastus2.openai.azure.com"
echo "4. CUSTOM_OPENAI_MODEL_NAME: gpt-4.5-preview"
echo "5. AZURE_WEBAPP_DEPLOYMENT_TOKEN: $DEPLOYMENT_TOKEN" 