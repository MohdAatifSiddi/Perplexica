# 🚀 Weybre AI - An AI-powered search engine 🔎

[![Azure Container Apps](https://img.shields.io/badge/Azure-Container%20Apps-blue)](https://azure.microsoft.com/en-us/products/container-apps)
[![SearxNG](https://img.shields.io/badge/SearxNG-Metasearch-green)](https://github.com/searxng/searxng)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)](https://www.postgresql.org/)

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Deployment](#deployment)
- [Configuration](#configuration)
- [Contributing](#contributing)

## Overview

Weybre AI is an open-source AI-powered search engine that combines the power of large language models with web search capabilities. It uses SearxNG for metasearch and Azure OpenAI for intelligent responses.

## Features

- **AI-Powered Search**: Get intelligent, context-aware answers to your queries
- **Multiple Search Modes**: Web, academic, video, and image search capabilities
- **Privacy-Focused**: Uses SearxNG to protect your privacy while searching
- **Customizable**: Configure different models and search engines
- **Azure Integration**: Seamlessly deployed on Azure with containerized architecture

## Architecture

Weybre AI consists of the following components:

1. **Frontend**: Next.js application for the user interface
2. **Backend**: Node.js API handling search and AI processing
3. **SearxNG**: Metasearch engine for web searches
4. **PostgreSQL**: Database for storing chat history and user data
5. **Azure OpenAI**: For generating intelligent responses

## Deployment

### Prerequisites

- Azure CLI
- Docker
- Azure subscription

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/weybre-ai.git
   cd weybre-ai
   ```

2. Configure your settings in `config.toml`:
   ```toml
   [MODELS.CUSTOM_OPENAI]
   API_URL = "https://your-azure-openai-endpoint.openai.azure.com"
   API_KEY = "your-azure-openai-api-key"
   MODEL_NAME = "gpt-4.5-preview"
   ```

3. Deploy to Azure:
   ```bash
   chmod +x deploy-azure.sh
   ./deploy-azure.sh
   ```

## Configuration

### config.toml

The main configuration file contains settings for:

- Model configurations (OpenAI, Azure OpenAI, etc.)
- API endpoints
- General settings

Example configuration:
```toml
[GENERAL]
SIMILARITY_MEASURE = "cosine"
KEEP_ALIVE = "true"

[MODELS.CUSTOM_OPENAI]
API_URL = "https://your-azure-openai-endpoint.openai.azure.com"
API_KEY = "your-azure-openai-api-key"
MODEL_NAME = "gpt-4.5-preview"

[API_ENDPOINTS]
SEARXNG = "http://searxng:8080"
```

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `SEARXNG_API_URL`: SearxNG API endpoint
- `NODE_ENV`: Environment (production/development)

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
