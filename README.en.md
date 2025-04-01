# Open JLPT

Open JLPT is an open-source platform for learning and practicing for the Japanese Language Proficiency Test (JLPT). This project aims to help learners prepare for JLPT exams by providing comprehensive learning resources and practice tools.

## Features

- Multiple practice modes: vocabulary, grammar, reading comprehension, and listening
- Comprehensive content covering N5 to N1 levels
- Personalized learning plans and progress tracking
- Responsive interface design supporting multiple devices

## Project Structure

The project uses a monorepo architecture and consists of the following main parts:

- `client`: Frontend application built with Vue 3 and Vite
- `server`: Backend service built with Elysia + Bun.js
- `models`: Shared data models
- `shared`: Utilities and functionalities shared between client and server

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PNPM (v8 or higher recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/open-jlpt.git
cd open-jlpt

# Install dependencies
pnpm install
```

### Development

```bash
# Start the development server
pnpm -F @root/client dev

# Start the backend service
pnpm -F @root/server dev
```

### Build and Deployment

```bash
# Build the frontend application
pnpm -F @root/client build

# Build the backend application
pnpm -F @root/server build
```

## Contributing

Contributions are welcome! Please participate in the project development by submitting issues or pull requests.

## License

This project is licensed under the ISC License.
