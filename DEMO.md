# Demo Data & Testing Guide

## Sample Admin Account
Use these credentials to test the admin functionality:

**Email:** admin@demo.com  
**Password:** demo123

*Note: You'll need to register this account first when you run the application.*

## Sample Forms

### 1. Customer Satisfaction Survey
**Title:** Customer Satisfaction Survey  
**Description:** Help us improve our service by sharing your experience  

**Questions:**
1. **How would you rate our service overall?** (Multiple Choice)
   - Excellent
   - Good
   - Average
   - Poor
   - Very Poor

2. **What did you like most about our service?** (Text)

3. **How likely are you to recommend us to others?** (Multiple Choice)
   - Very Likely
   - Likely
   - Neutral
   - Unlikely
   - Very Unlikely

4. **Any additional feedback or suggestions?** (Text)

### 2. Product Feedback Form
**Title:** Product Feedback Collection  
**Description:** Share your thoughts about our new product  

**Questions:**
1. **Which product did you purchase?** (Multiple Choice)
   - Product A
   - Product B
   - Product C
   - Other

2. **How easy was it to use the product?** (Multiple Choice)
   - Very Easy
   - Easy
   - Moderate
   - Difficult
   - Very Difficult

3. **What features would you like to see improved?** (Text)

## Testing Scenarios

### Admin Workflow
1. Register/Login as admin
2. Create a new form with different question types
3. Copy the public form URL
4. View responses (initially empty)
5. Export CSV (should show "no responses" message)

### Public User Workflow
1. Open the public form URL (without logging in)
2. Fill out and submit the form
3. Verify success message
4. Try submitting again with different responses

### Response Management
1. Go back to admin dashboard
2. View the form responses
3. Check the response summary for multiple-choice questions
4. Export responses as CSV
5. Verify CSV contains all submitted data

## API Testing with curl

### Register Admin
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Demo Admin",
    "email": "admin@demo.com",
    "password": "demo123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@demo.com",
    "password": "demo123"
  }'
```

### Create Form (replace TOKEN with JWT from login)
```bash
curl -X POST http://localhost:5000/api/forms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title": "Test Survey",
    "description": "A test survey",
    "questions": [
      {
        "text": "How satisfied are you?",
        "type": "multiple-choice",
        "options": ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied"],
        "required": true
      },
      {
        "text": "Any comments?",
        "type": "text",
        "required": false
      }
    ]
  }'
```

### Submit Response (replace PUBLIC_URL with actual form ID)
```bash
curl -X POST http://localhost:5000/api/forms/public/PUBLIC_URL/submit \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      {
        "questionId": "QUESTION_ID_1",
        "questionText": "How satisfied are you?",
        "answer": "Very Satisfied"
      },
      {
        "questionId": "QUESTION_ID_2",
        "questionText": "Any comments?",
        "answer": "Great service!"
      }
    ]
  }'
```

## Database Verification

If you have MongoDB installed locally, you can verify data:

```bash
# Connect to MongoDB
mongo

# Switch to the database
use feedback-platform

# View collections
show collections

# View users
db.users.find().pretty()

# View forms
db.forms.find().pretty()

# View responses
db.responses.find().pretty()
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running: `mongod`
   - Check the connection string in `server/.env`
   - For Windows: Start MongoDB service or use MongoDB Compass

2. **Port Already in Use**
   - Frontend (3000): Kill process with `npx kill-port 3000`
   - Backend (5000): Kill process with `npx kill-port 5000`

3. **CORS Errors**
   - Ensure the backend is running before starting frontend
   - Check that proxy is set in `client/package.json`

4. **JWT Errors**
   - Make sure JWT_SECRET is set in `server/.env`
   - Clear localStorage in browser if getting auth errors

5. **Form Submission Errors**
   - Check network tab for API errors
   - Verify form ID in URL is correct
   - Ensure all required fields are filled

### Development Tips

1. **Hot Reloading**: Both frontend and backend support hot reloading
2. **Database GUI**: Use MongoDB Compass for easier database management
3. **API Testing**: Use Postman or Insomnia for API testing
4. **Browser Dev Tools**: Use React Developer Tools extension
5. **Logging**: Check browser console and terminal for error messages
