# Feedback Collection Platform

A full-stack web application built with the MERN stack that allows businesses to create feedback forms and collect responses from customers.

## 🚀 Features

### Admin/Business Features
- **User Authentication**: Secure registration and login with JWT
- **Form Creation**: Create feedback forms with 3-5 customizable questions
- **Question Types**: Support for text input and multiple-choice questions
- **Form Management**: View, edit, and delete forms
- **Public Sharing**: Generate shareable public URLs for forms
- **Response Analytics**: View all responses in tabular format with basic summaries
- **Data Export**: Export responses as CSV files
- **Dashboard**: Centralized management of all forms and responses

### Customer/User Features
- **Public Access**: Submit feedback without requiring registration
- **Responsive UI**: Mobile-friendly form submission experience
- **Form Validation**: Client and server-side validation for better UX

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **json2csv** - CSV export functionality

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

## 📁 Project Structure

```
feedback-platform/
├── server/                 # Backend application
│   ├── models/            # Database models
│   │   ├── User.js        # Admin user model
│   │   ├── Form.js        # Feedback form model
│   │   └── Response.js    # Form response model
│   ├── routes/            # API routes
│   │   ├── auth.js        # Authentication routes
│   │   └── forms.js       # Form management routes
│   ├── middleware/        # Custom middleware
│   │   └── auth.js        # JWT authentication middleware
│   ├── package.json       # Backend dependencies
│   ├── server.js          # Main server file
│   └── .env               # Environment variables
├── client/                # Frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context for state management
│   │   ├── utils/         # Utility functions and API calls
│   │   ├── App.js         # Main app component
│   │   ├── index.js       # Entry point
│   │   └── index.css      # Global styles
│   ├── public/
│   └── package.json       # Frontend dependencies
└── README.md              # Project documentation
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd feedback-platform
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/feedback-platform
   JWT_SECRET=your_jwt_secret_key_here_make_it_very_secure
   NODE_ENV=development
   ```

4. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start MongoDB**
   - If using local MongoDB: `mongod`
   - If using MongoDB Atlas: Ensure your connection string is correct in `.env`

2. **Start the Backend Server**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on `http://localhost:5000`

3. **Start the Frontend Application**
   ```bash
   cd client
   npm start
   ```
   Application will open on `http://localhost:3000`

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new admin user
- `POST /api/auth/login` - Login admin user

### Forms Management (Protected)
- `POST /api/forms` - Create new form
- `GET /api/forms` - Get all forms for authenticated user
- `GET /api/forms/:id` - Get specific form details
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form
- `GET /api/forms/:id/responses` - Get form responses
- `GET /api/forms/:id/export` - Export responses as CSV

### Public Form Access
- `GET /api/forms/public/:publicUrl` - Get public form
- `POST /api/forms/public/:publicUrl/submit` - Submit form response

## 🏗️ Design Decisions

### Database Schema Design
1. **User Model**: Simple admin-only authentication with email/password
2. **Form Model**: Flexible schema supporting different question types with embedded questions array
3. **Response Model**: Stores answers with question context for easy reporting

### Authentication Strategy
- JWT-based authentication for admin users
- Public forms accessible without authentication
- Token stored in localStorage with automatic request header injection

### Frontend Architecture
- React Context API for global state management (user authentication)
- Component-based architecture for reusability
- Custom hooks for API calls and state management
- Responsive design with mobile-first approach

### API Design
- RESTful API structure
- Separate public and protected routes
- Comprehensive error handling and validation
- CORS enabled for cross-origin requests

### Form Sharing Strategy
- Each form gets a unique public URL using form ID
- Public URLs don't expose internal database IDs
- Forms can be deactivated without breaking existing URLs

## 🔧 Key Features Implementation

### Form Builder
- Dynamic question addition/removal (3-5 questions limit)
- Support for text and multiple-choice question types
- Real-time validation for question requirements
- Option management for multiple-choice questions

### Response Collection
- IP address tracking for basic analytics
- Timestamp recording for all submissions
- Flexible answer storage supporting different data types
- Form validation on both client and server side

### Data Export
- CSV export with proper formatting
- Dynamic column generation based on form questions
- Handles multiple-choice answers properly (comma-separated)
- Download triggered client-side with proper filename

### Analytics Dashboard
- Response count summaries
- Percentage calculations for multiple-choice questions
- Visual progress bars for option popularity
- Tabular view of all responses with sorting

## 🎨 UI/UX Considerations

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Intuitive Navigation**: Clear user flow from form creation to response analysis
- **Form Builder UX**: Easy drag-and-drop-like experience for question management
- **Public Form Experience**: Clean, distraction-free submission interface
- **Loading States**: Proper feedback during async operations
- **Error Handling**: User-friendly error messages and validation feedback

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token expiration (7 days)
- Input validation and sanitization
- CORS configuration
- Protected routes with authentication middleware
- SQL injection prevention through Mongoose

## 🚀 Deployment Considerations

### Environment Setup
- Separate environment configurations for development/production
- MongoDB Atlas connection for production
- Environment-specific JWT secrets
- CORS origins configuration

### Production Optimizations
- React build optimization
- Static file serving from Express
- MongoDB connection pooling
- Error logging and monitoring setup

## 🔮 Future Enhancements

1. **Advanced Question Types**
   - Rating scales, file uploads, date pickers
   - Conditional logic (show/hide questions based on answers)

2. **Enhanced Analytics**
   - Charts and graphs for response visualization
   - Response filtering and search
   - Export to different formats (PDF, Excel)

3. **Form Customization**
   - Custom themes and branding
   - Form templates and duplicating
   - Custom thank you pages

4. **User Management**
   - Team collaboration features
   - Role-based permissions
   - Form sharing between users

5. **Integration Features**
   - Webhook notifications
   - API for third-party integrations
   - Email notifications for new responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email [vishnushukla.work@outlook.com] or create an issue in the GitHub repository.

---

Built with ❤️ by VISHNU using the MERN stack
