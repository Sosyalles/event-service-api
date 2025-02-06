#!/bin/bash

# Make the script executable
chmod +x commit-changes.sh

# Add and commit configuration files
git add .env.* jest.config.js tsconfig.json
git commit -m "config: update environment and TypeScript configurations"

# Add and commit type definitions
git add src/types/*
git commit -m "types: update DTOs and model interfaces"

# Add and commit models
git add src/models/*
git commit -m "models: implement Sequelize models with associations"

# Add and commit repositories
git add src/repositories/*
git commit -m "repos: implement repository layer with CRUD operations"

# Add and commit services
git add src/services/*
git commit -m "services: implement business logic layer"

# Add and commit controllers
git add src/controllers/*
git commit -m "controllers: implement REST API endpoints"

# Add and commit routes
git add src/routes/*
git commit -m "routes: update API routes with swagger documentation"

# Add and commit middlewares
git add src/middlewares/*
git commit -m "middleware: implement auth, validation, and error handling"

# Add and commit utils
git add src/utils/*
git commit -m "utils: add helper functions and error handling"

# Add and commit validations
git add src/validations/*
git commit -m "validation: implement request validation schemas"

# Add and commit tests
git add src/__tests__/unit/models/*
git commit -m "test(models): add unit tests for database models"

git add src/__tests__/unit/repositories/*
git commit -m "test(repos): add unit tests for repositories"

git add src/__tests__/unit/services/*
git commit -m "test(services): add unit tests for service layer"

git add src/__tests__/unit/controllers/*
git commit -m "test(controllers): add unit tests for API endpoints"

git add src/__tests__/helpers/*
git commit -m "test(helpers): add test utilities and mock data"

# Add and commit documentation
git add README.md LICENSE
git commit -m "docs: update project documentation and license"

# Add any remaining files
git add .
git commit -m "chore: add remaining project files"

echo "All changes have been committed successfully!" 