# Contributing to Weybre AI

Thank you for your interest in contributing to Weybre AI! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and considerate of others.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/weybre-ai.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install`
5. Make your changes
6. Test your changes
7. Commit your changes: `git commit -m "Description of your changes"`
8. Push to your fork: `git push origin feature/your-feature-name`
9. Create a Pull Request

## Development Setup

1. Copy `sample.config.toml` to `config.toml` and update with your configuration
2. Start the development server: `npm run dev`
3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `src/app/` - Next.js app directory
- `src/components/` - React components
- `src/lib/` - Core library code
- `src/styles/` - CSS and styling
- `public/` - Static assets

## Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Use async/await for asynchronous code
- Handle errors appropriately

## Testing

- Write tests for new features
- Ensure all tests pass before submitting a PR
- Update tests when modifying existing features

## Documentation

- Update documentation when adding new features
- Keep README.md up to date
- Document any breaking changes

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the documentation if needed
3. Ensure the PR description clearly describes the problem and solution
4. Include relevant tests
5. The PR will be reviewed by maintainers

## License

By contributing to Weybre AI, you agree that your contributions will be licensed under the project's license.
