# StyleGuard

StyleGuard is a comprehensive style checking and enforcement tool designed to maintain code quality and consistency across projects.

## Project Structure

```
StyleGuard/
├── api/            # Python backend API
└── front/          # TypeScript frontend application
```

## Backend (API)

The backend is built with Python using FastAPI framework.

### Setup

```bash
cd api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

### Database Setup

```bash
python create_tables.py
```

### Running the API

```bash
python main.py
```

The API will be available at `http://localhost:8000` by default.

## Frontend

The frontend is built with TypeScript, likely using a modern framework like React or Vue.

### Setup

```bash
cd front
npm install
```

### Running the Frontend

```bash
npm run dev
```

The development server will be available at `http://localhost:5173` by default.

### Building for Production

```bash
npm run build
```

## Features

- Code style checking and enforcement
- Automated style fixing capabilities
- Project-specific style rule configuration
- Integration with popular IDEs and CI/CD pipelines

## Development

### Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'add: feature - new feature description'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 