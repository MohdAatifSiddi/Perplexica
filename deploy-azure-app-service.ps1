# Set variables
$RESOURCE_GROUP = "weybre-rg"
$APP_SERVICE_PLAN = "weybre-plan"
$APP_NAME = "weybre"
$LOCATION = "eastus"
$GITHUB_REPO = "MohdAatifSiddi/Perplexica"  # Your GitHub repository
$DEPLOYMENT_TOKEN = "5cb22a4abb9e87e45a67e481c84a0958a9c96240475a7d7a583658b30b5d1c9d06-f27c7693-5502-4986-bd4e-97d026b7395801e06200ff28051e"

# Create resource group if it doesn't exist
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create App Service plan
az appservice plan create `
    --name $APP_SERVICE_PLAN `
    --resource-group $RESOURCE_GROUP `
    --location $LOCATION `
    --sku B1 `
    --is-linux

# Create web app
az webapp create `
    --name $APP_NAME `
    --resource-group $RESOURCE_GROUP `
    --plan $APP_SERVICE_PLAN `
    --runtime "NODE:20-lts"

# Configure deployment from GitHub
az webapp deployment github-actions add `
    --repo $GITHUB_REPO `
    --resource-group $RESOURCE_GROUP `
    --name $APP_NAME `
    --branch main `
    --login-with-github `
    --token $DEPLOYMENT_TOKEN

# Configure Node.js version
az webapp config set `
    --name $APP_NAME `
    --resource-group $RESOURCE_GROUP `
    --linux-fx-version "NODE|20-lts"

# Configure startup command
az webapp config set `
    --name $APP_NAME `
    --resource-group $RESOURCE_GROUP `
    --startup-file "yarn start"

# Enable health check
az webapp config set `
    --name $APP_NAME `
    --resource-group $RESOURCE_GROUP `
    --health-check-path "/api/health"

# Get the publish profile
Write-Host "Getting publish profile..."
$PUBLISH_PROFILE = az webapp deployment list-publishing-profiles `
    --name $APP_NAME `
    --resource-group $RESOURCE_GROUP `
    --xml

Write-Host "Deployment completed! Your app is available at: https://$APP_NAME.azurewebsites.net"
Write-Host ""
Write-Host "IMPORTANT: Add these secrets to your GitHub repository:"
Write-Host "1. AZURE_WEBAPP_PUBLISH_PROFILE: $PUBLISH_PROFILE"
Write-Host "2. CUSTOM_OPENAI_API_KEY: 5BjV2gm9Ry0tVt9ID7gBynw8Ee6Ewm56zALIirWB36AV0BzXIJ9rJQQJ99BDACHYHv6XJ3w3AAAAACOGVYIm"
Write-Host "3. CUSTOM_OPENAI_API_URL: https://mekot-m98ufofa-eastus2.openai.azure.com"
Write-Host "4. CUSTOM_OPENAI_MODEL_NAME: gpt-4.5-preview"
Write-Host "5. AZURE_WEBAPP_DEPLOYMENT_TOKEN: $DEPLOYMENT_TOKEN" 