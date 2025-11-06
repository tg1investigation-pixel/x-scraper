# Backend API Implementation Guide

This document provides a detailed guide for implementing the backend API that the mobile app expects.

## Technology Stack Recommendations

- **Node.js + Express** (Recommended)
- **Python + Flask/FastAPI**
- **PHP + Laravel**
- **Java + Spring Boot**
- **.NET Core**

## Database Setup

The backend should connect to a MySQL database. Ensure proper indexing on search columns for performance:
- `DIAL`, `DIAL2`, `DIAL3`, `DIAL4` columns for phone searches
- `NAME` columns for name searches
- Vehicle-related columns (plate numbers, VIN, etc.)

## API Endpoints

### 1. Authentication Endpoint

**POST** `/api/auth/login`

**Request Body:**
```json
{
  "username": "police_officer",
  "password": "secure_password"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "police_officer",
    "name": "Officer Name",
    "role": "investigator"
  }
}
```

**Error Response (401):**
```json
{
  "message": "Invalid credentials"
}
```

**Implementation Example (Node.js/Express):**
```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  // Find user in database
  const user = await db.query(
    'SELECT * FROM users WHERE username = ?',
    [username]
  );

  if (!user || user.length === 0) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Verify password
  const isValid = await bcrypt.compare(password, user[0].password_hash);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user[0].id, username: user[0].username },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: user[0].id,
      username: user[0].username,
      name: user[0].name,
      role: user[0].role
    }
  });
});
```

### 2. People Search Endpoint

**POST** `/api/search/people`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "query": "01234567890",
  "searchType": "phone"
}
```
or
```json
{
  "query": "John Doe",
  "searchType": "name"
}
```

**Success Response (200):**
```json
{
  "results": [
    {
      "id": 1,
      "NAME": "John Doe",
      "DIAL": "01234567890",
      "DIAL2": "01123456789",
      "ADDRESS": "123 Main St",
      "table_name": "suspects"
    },
    {
      "id": 5,
      "NAME": "John Doe",
      "DIAL": "01234567890",
      "ADDRESS": "456 Oak Ave",
      "table_name": "witnesses"
    }
  ],
  "total": 2
}
```

**Implementation Example (Node.js/Express):**
```javascript
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

app.post('/api/search/people', authenticateToken, async (req, res) => {
  const { query, searchType } = req.body;

  if (!query || !searchType) {
    return res.status(400).json({ message: 'Query and searchType required' });
  }

  const results = [];
  const searchPattern = `%${query.trim()}%`;

  try {
    // Get all table names from database
    const [tables] = await db.query('SHOW TABLES');
    
    for (const tableRow of tables) {
      const tableName = Object.values(tableRow)[0];
      
      // Skip system tables
      if (tableName.startsWith('information_schema') || 
          tableName.startsWith('mysql') || 
          tableName.startsWith('performance_schema')) {
        continue;
      }

      try {
        // Get column names for this table
        const [columns] = await db.query(
          `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
           WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
          [tableName]
        );

        const columnNames = columns.map(col => col.COLUMN_NAME);
        let sqlQuery = '';
        let params = [];

        if (searchType === 'phone') {
          // Check if phone columns exist
          const phoneColumns = ['DIAL', 'DIAL2', 'DIAL3', 'DIAL4']
            .filter(col => columnNames.includes(col));
          
          if (phoneColumns.length === 0) continue;

          // Build WHERE clause for phone search
          const conditions = phoneColumns.map(col => `${col} LIKE ?`).join(' OR ');
          sqlQuery = `SELECT *, ? as table_name FROM \`${tableName}\` WHERE ${conditions}`;
          params = [tableName, ...phoneColumns.map(() => searchPattern)];
        } else if (searchType === 'name') {
          // Check if NAME column exists
          if (!columnNames.includes('NAME')) continue;

          sqlQuery = `SELECT *, ? as table_name FROM \`${tableName}\` WHERE NAME LIKE ? COLLATE utf8mb4_general_ci`;
          params = [tableName, searchPattern];
        }

        if (sqlQuery) {
          const [rows] = await db.query(sqlQuery, params);
          results.push(...rows);
        }
      } catch (tableError) {
        // Log error but continue with other tables
        console.error(`Error searching table ${tableName}:`, tableError);
        continue;
      }
    }

    // Remove duplicates based on a unique identifier if needed
    // Deduplication logic here if required

    res.json({
      results,
      total: results.length
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Search failed. Please try again.' });
  }
});
```

### 3. Vehicle Search Endpoint

**POST** `/api/search/vehicles`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "query": "ABC-123"
}
```

**Success Response (200):**
```json
{
  "results": [
    {
      "id": 1,
      "PLATE_NUMBER": "ABC-123",
      "VEHICLE_TYPE": "Sedan",
      "COLOR": "Black",
      "OWNER_NAME": "John Doe",
      "table_name": "vehicles"
    }
  ],
  "total": 1
}
```

**Implementation Example:**
```javascript
app.post('/api/search/vehicles', authenticateToken, async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ message: 'Query required' });
  }

  const results = [];
  const searchPattern = `%${query.trim()}%`;

  try {
    // Get all table names
    const [tables] = await db.query('SHOW TABLES');

    // Define potential vehicle-related columns
    const vehicleColumns = ['PLATE_NUMBER', 'PLATE', 'VIN', 'VEHICLE_ID', 
                           'LICENSE_PLATE', 'REGISTRATION'];

    for (const tableRow of tables) {
      const tableName = Object.values(tableRow)[0];
      
      // Skip system tables
      if (tableName.startsWith('information_schema') || 
          tableName.startsWith('mysql')) {
        continue;
      }

      try {
        // Get column names
        const [columns] = await db.query(
          `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
           WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
          [tableName]
        );

        const columnNames = columns.map(col => col.COLUMN_NAME);
        
        // Find matching vehicle columns
        const matchingColumns = vehicleColumns.filter(col => 
          columnNames.includes(col)
        );

        if (matchingColumns.length === 0) continue;

        // Build search query
        const conditions = matchingColumns.map(col => 
          `${col} LIKE ? COLLATE utf8mb4_general_ci`
        ).join(' OR ');

        const sqlQuery = `SELECT *, ? as table_name FROM \`${tableName}\` WHERE ${conditions}`;
        const params = [tableName, ...matchingColumns.map(() => searchPattern)];

        const [rows] = await db.query(sqlQuery, params);
        results.push(...rows);
      } catch (tableError) {
        console.error(`Error searching table ${tableName}:`, tableError);
        continue;
      }
    }

    res.json({
      results,
      total: results.length
    });

  } catch (error) {
    console.error('Vehicle search error:', error);
    res.status(500).json({ message: 'Vehicle search failed. Please try again.' });
  }
});
```

## CORS Configuration

Enable CORS for your mobile app:

**Express.js Example:**
```javascript
const cors = require('cors');

app.use(cors({
  origin: '*', // In production, specify your app's origin
  credentials: true
}));
```

## Security Best Practices

1. **Use HTTPS in production**
2. **Implement rate limiting** to prevent abuse
3. **Validate and sanitize all inputs**
4. **Use prepared statements** to prevent SQL injection
5. **Set appropriate token expiration times**
6. **Log all search queries** for audit purposes
7. **Implement IP whitelisting** if possible
8. **Encrypt sensitive data** at rest

## Performance Optimization

1. **Add database indexes** on search columns:
   ```sql
   CREATE INDEX idx_dial ON table_name(DIAL);
   CREATE INDEX idx_dial2 ON table_name(DIAL2);
   CREATE INDEX idx_name ON table_name(NAME);
   ```

2. **Implement pagination** for large result sets
3. **Use connection pooling**
4. **Cache frequently accessed data**
5. **Limit concurrent searches per user**

## Error Handling

Always return consistent error formats:
```json
{
  "message": "Descriptive error message"
}
```

Use appropriate HTTP status codes:
- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (valid token but insufficient permissions)
- `500`: Internal Server Error

## Testing

Test all endpoints using tools like:
- Postman
- curl
- HTTPie

Example curl command:
```bash
curl -X POST http://localhost:3000/api/search/people \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"query":"John","searchType":"name"}'
```
