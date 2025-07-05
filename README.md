# Issues & Insights Tracker

A full-stack web application for tracking issues and generating insights, built with React.js frontend, Django backend, and PostgreSQL database. Features a comprehensive JSON configuration system that allows switching between live API and mock data modes.

## 🚀 Features

### Core Functionality
- **Authentication**: Email/password + Google OAuth integration
- **Role-Based Access Control**: Admin, Maintainer, Reporter roles with different permissions
- **Issue Management**: Full CRUD operations with file uploads, markdown support
- **Real-time Updates**: WebSocket integration for live issue updates
- **Analytics Dashboard**: Charts and statistics for issue tracking
- **Background Jobs**: Automated data aggregation with Celery
- **API Documentation**: Auto-generated OpenAPI/Swagger docs

### Advanced Features
- **JSON Configuration System**: Complete control over app behavior via config.json
- **Mock Data Mode**: Switch between live API and mock data for development/testing
- **Live Configuration Editor**: Edit settings in real-time with visual interface
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **File Upload**: Support for attachments with preview capabilities
- **Comments System**: Threaded discussions on issues
- **Search & Filtering**: Advanced filtering and search capabilities

## 🏗️ Architecture

### Frontend (React.js)
- **Framework**: React 18 with functional components and hooks
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Query for server state, Context API for app state
- **Routing**: React Router v6 with protected routes
- **Forms**: React Hook Form with validation
- **Charts**: Chart.js with React wrapper
- **WebSocket**: Native WebSocket API for real-time updates

### Backend (Django)
- **Framework**: Django 4.2 with Django REST Framework
- **Database**: PostgreSQL 15+ with optimized queries
- **Authentication**: OAuth2 with JWT tokens
- **Background Jobs**: Celery with Redis broker
- **WebSocket**: Django Channels for real-time features
- **File Storage**: Local storage with S3-compatible option
- **API Docs**: Auto-generated OpenAPI documentation

### Infrastructure
- **Containerization**: Docker with multi-service compose setup
- **Database**: PostgreSQL with connection pooling
- **Cache**: Redis for sessions and background jobs
- **Web Server**: Nginx for production deployment
- **Monitoring**: Structured logging with optional OpenTelemetry

## 🛠️ Configuration System

The application features a powerful JSON configuration system that allows complete control over the frontend behavior:

### Configuration File (`public/config.json`)

\`\`\`json
{
  "app": {
    "title": "Issues & Insights Tracker",
    "theme": {
      "primaryColor": "#3b82f6",
      "secondaryColor": "#6b7280"
    }
  },
  "api": {
    "baseUrl": "http://localhost:8000",
    "endpoints": { ... }
  },
  "features": {
    "realTimeUpdates": true,
    "fileUpload": true,
    "darkMode": true
  },
  "mockData": {
    "enabled": true,
    "users": [...],
    "issues": [...],
    "analytics": {...}
  }
}
\`\`\`

### Mock Data Mode

When `mockData.enabled` is set to `true`, the application will:
- Use predefined mock data instead of API calls
- Simulate API delays and responses
- Persist changes to localStorage
- Allow full CRUD operations on mock data

To disable mock mode and use the real backend:
1. Set `mockData.enabled` to `false` in config.json, OR
2. Comment out the config.json file URL in the code, OR
3. Use the built-in configuration editor

### Live Configuration Editor

Access the configuration editor by clicking the settings icon in the bottom-right corner:
- **Visual Interface**: Edit common settings with form controls
- **Theme Editor**: Live color picker for theme customization
- **Feature Toggles**: Enable/disable features with checkboxes
- **Raw JSON Editor**: Direct JSON editing with syntax validation
- **Import/Export**: Save and load configuration files

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Using Docker (Recommended)

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd issues-tracker
   \`\`\`

2. **Start all services**
   \`\`\`bash
   docker-compose up -d --build
   \`\`\`

3. **Run database migrations**
   \`\`\`bash
   docker-compose exec backend python manage.py migrate
   \`\`\`

4. **Create a superuser**
   \`\`\`bash
   docker-compose exec backend python manage.py createsuperuser
   \`\`\`

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Admin Panel: http://localhost:8000/admin
   - API Docs: http://localhost:8000/api/docs

### Local Development

#### Backend Setup
\`\`\`bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/issues_tracker
export REDIS_URL=redis://localhost:6379/0
export SECRET_KEY=your-secret-key

# Run migrations and start server
python manage.py migrate
python manage.py runserver
\`\`\`

#### Frontend Setup
\`\`\`bash
cd frontend
npm install
npm start
\`\`\`

#### Background Workers
\`\`\`bash
# In separate terminals
celery -A issues_tracker worker --loglevel=info
celery -A issues_tracker beat --loglevel=info
\`\`\`

## 🧪 Testing

### Backend Tests
\`\`\`bash
cd backend
pytest --cov=. --cov-report=html
\`\`\`

### Frontend Tests
\`\`\`bash
cd frontend
npm test
npm run test:coverage
\`\`\`

### E2E Tests
\`\`\`bash
cd frontend
npx playwright test
\`\`\`

## 📊 Demo Credentials

When using mock data mode, you can login with:

- **Admin**: admin@example.com / admin123
- **Maintainer**: maintainer@example.com / maintainer123
- **Reporter**: reporter@example.com / reporter123

## 🔧 Environment Variables

### Backend
\`\`\`env
DEBUG=1
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:pass@host:port/dbname
REDIS_URL=redis://host:port/db
GOOGLE_OAUTH2_CLIENT_ID=your-google-client-id
GOOGLE_OAUTH2_CLIENT_SECRET=your-google-client-secret
\`\`\`

### Frontend
\`\`\`env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000
REACT_APP_OAUTH_CLIENT_ID=your-oauth-client-id
REACT_APP_OAUTH_CLIENT_SECRET=your-oauth-client-secret
\`\`\`

## 🚀 Deployment

### Production Deployment

1. **Update environment variables** for production
2. **Build and deploy with Docker Compose**
   \`\`\`bash
   docker-compose -f docker-compose.prod.yml up -d --build
   \`\`\`

### Cloud Deployment Options

- **Fly.io**: Use provided fly.toml configuration
- **Railway**: Connect GitHub repo and deploy
- **Render**: Use Docker deployment option
- **AWS/GCP/Azure**: Deploy with container services

## 📈 Monitoring & Observability

- **Structured Logging**: JSON formatted logs with correlation IDs
- **Health Checks**: Built-in health check endpoints
- **Metrics**: Optional Prometheus metrics collection
- **Error Tracking**: Comprehensive error handling and reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the API documentation at `/api/docs`

## 🔄 Configuration Management

### Switching Between Mock and Live Data

**Method 1: Configuration File**
Edit `public/config.json` and set `mockData.enabled` to `true` or `false`

**Method 2: Configuration Editor**
Use the visual editor accessible via the settings button

**Method 3: Environment Override**
Set `REACT_APP_MOCK_MODE=true` to force mock mode

**Method 4: Comment Out Config**
Comment out the config.json loading in the code to fall back to environment variables

### Customizing Mock Data


The mock data persists to localStorage, so changes are maintained across sessions.
