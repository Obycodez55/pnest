# PNest CLI

An extension of the standard NestJS CLI that adds plugin management and project templates.

## Features

- **Command Passthrough**: All standard NestJS CLI commands work through PNest CLI
- **Plugin Management**: Add, list, and remove plugins
- **Project Templates**: Create projects from specialized templates

## Installation

```bash
npm install -g @pnest/cli
```

## Usage

```bash
# Create a new project
pnest new my-project

# Add a plugin
pnest plugin add logger

# Create from template
pnest template rest-api
```

## Available Plugins

- **logger**: Logging integration (Winston, Pino)
- **auth**: Authentication providers (JWT, OAuth2, Basic)
- **email**: Email integration (Brevo, SendGrid, Nodemailer)
- **upload**: File upload (AWS S3, Local)
- **config**: Environment configuration

## License

MIT
