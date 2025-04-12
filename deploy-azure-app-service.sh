#!/bin/bash

# Set variables
RESOURCE_GROUP="perplexica-rg"
APP_SERVICE_PLAN="perplexica-plan"
APP_NAME="perplexica"
LOCATION="eastus"
GITHUB_REPO="your-repo/perplexica"  # Update this with your GitHub repository

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
    --runtime "NODE:20-lts"

# Configure deployment from GitHub
az webapp deployment github-actions add \
    --repo $GITHUB_REPO \
    --resource-group $RESOURCE_GROUP \
    --name $APP_NAME \
    --branch main \
    --login-with-github

# Configure Node.js version
az webapp config set \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --linux-fx-version "NODE|20-lts"

# Configure startup command
az webapp config set \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --startup-file "yarn start"

# Enable health check
az webapp config set \
    --name $APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --health-check-path "/api/health"

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
echo "2. CUSTOM_OPENAI_API_KEY: Your OpenAI API key"
echo "3. CUSTOM_OPENAI_API_URL: Your OpenAI API URL"
echo "4. CUSTOM_OPENAI_MODEL_NAME: Your OpenAI model name" 