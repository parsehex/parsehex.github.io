# Development

## Local Development Setup

If you want to run the project locally:

### Prerequisites

- Node.js (recommended: latest LTS version)
- Git

### Installation Steps

1. **Clone the repo**:

   ```bash
   git clone https://github.com/ProjectDepot/Gallery
   cd Gallery
   ```

2. **Set up environment variables**:

   - Copy `.env.example` to `.env`
   - Set your GitHub username: `VITE_GITHUB_ACTOR=your_username`

   ::: info Note
   When deployed via GitHub Actions, the workflow handles the configuration automatically.
   :::

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Fetch initial data** for your GitHub profile:

   ```bash
   npm run fetch-data
   ```

5. **Start the development server**:

   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run fetch-data` - Fetch GitHub repository data
- `npm run lint` - Run ESLint
- `npm run docs:dev` - Start the documentation server
- `npm run docs:build` - Build the documentation
- `npm run docs:preview` - Preview the documentation build

## Project Structure

```text
├── src/                    # Main application source
│   ├── components/         # Vue components
│   ├── stores/            # Pinia stores
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── docs/                  # Documentation (VitePress)
├── scripts/               # Build and data fetching scripts
├── public/                # Static assets
└── config.*.json          # Configuration files
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the [MIT License](https://github.com/ProjectDepot/Gallery/blob/main/LICENSE).
