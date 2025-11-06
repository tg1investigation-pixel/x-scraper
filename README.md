# Police Search Engine Mobile App

A comprehensive React Native mobile application built with Expo Go, designed to serve as the official search engine for the Investigation Unit of the First Settlement Police Department.

## Features

### 1. User Authentication
- Secure login system with token-based authentication
- Session management using Expo SecureStore
- Automatic token expiration handling

### 2. People Search
- **Phone Number Search**: Queries ALL tables in the MySQL database across columns named `DIAL`, `DIAL2`, `DIAL3`, `DIAL4`
- **Name Search**: Queries ALL tables for columns named `NAME`
- Partial and case-insensitive matching for improved usability

### 3. Vehicle Search
- Search vehicles by plate number or other identifiers
- Flexible search logic that adapts to your database schema
- Query appropriate tables and columns related to vehicle data

### 4. Modern UI/UX
- Professional, formal design consistent with police department branding
- High contrast color palette for readability
- Polished Anva-like aesthetic with smooth animations
- Loading indicators during data fetching
- Responsive design for all screen sizes

### 5. Search Results Display
- Full row display of matched records
- Scrollable list with detailed information
- Tap records for detailed view
- Clear empty state feedback

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app installed on your mobile device ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

## Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd D:\Scrapers\X
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure the API endpoint**:
   - Open `services/api.js`
   - Update the `API_BASE_URL` constant with your backend server URL:
     ```javascript
     const API_BASE_URL = __DEV__ 
       ? 'http://your-local-ip:3000/api' // Development URL (use your computer's IP for physical device)
       : 'https://your-production-api.com/api'; // Production URL
     ```
   - For physical device testing, use your computer's local IP address (e.g., `http://192.168.1.100:3000/api`)

4. **Start the Expo development server**:
   ```bash
   npm start
   ```
   or
   ```bash
   expo start
   ```

5. **Run on your device**:
   - Scan the QR code with the Expo Go app (iOS Camera app or Android Expo Go app)
   - The app will load on your device

## Backend API Requirements

Your backend API should implement the following endpoints:

### Authentication
- **POST** `/api/auth/login`
  - Request body: `{ username: string, password: string }`
  - Response: `{ token: string, user: object }`

### People Search
- **POST** `/api/search/people`
  - Request body: `{ query: string, searchType: 'phone' | 'name' }`
  - Response: `{ results: Array<object>, total: number }`
  - Each result should include a `table_name` field indicating the source table

### Vehicle Search
- **POST** `/api/search/vehicles`
  - Request body: `{ query: string }`
  - Response: `{ results: Array<object>, total: number }`

### Record Details (Optional)
- **GET** `/api/records/:id?type=people|vehicle`
  - Response: `{ ...recordFields }`

### Authentication Headers
All authenticated requests should include:
```
Authorization: Bearer <token>
```

## Backend Implementation Example

Here's an example backend structure using Node.js/Express and MySQL:

```javascript
// Example backend search logic for people
app.post('/api/search/people', authenticateToken, async (req, res) => {
  const { query, searchType } = req.body;
  const results = [];

  // Get all table names from database
  const tables = await db.query('SHOW TABLES');
  
  for (const table of tables) {
    const tableName = Object.values(table)[0];
    
    if (searchType === 'phone') {
      // Search in DIAL, DIAL2, DIAL3, DIAL4 columns
      const rows = await db.query(
        `SELECT *, ? as table_name FROM ${tableName} 
         WHERE DIAL LIKE ? OR DIAL2 LIKE ? OR DIAL3 LIKE ? OR DIAL4 LIKE ?`,
        [tableName, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]
      );
      results.push(...rows);
    } else if (searchType === 'name') {
      // Search in NAME column
      const rows = await db.query(
        `SELECT *, ? as table_name FROM ${tableName} WHERE NAME LIKE ?`,
        [tableName, `%${query}%`]
      );
      results.push(...rows);
    }
  }

  res.json({ results, total: results.length });
});
```

## Project Structure

```
├── App.js                 # Main app component with navigation
├── app.json              # Expo configuration
├── package.json          # Dependencies
├── babel.config.js       # Babel configuration
├── config/
│   └── constants.js      # App constants and colors
├── services/
│   └── api.js            # API service layer
├── screens/
│   ├── LoginScreen.js           # Authentication screen
│   ├── HomeScreen.js            # Main navigation screen
│   ├── PeopleSearchScreen.js    # People search interface
│   ├── VehicleSearchScreen.js   # Vehicle search interface
│   ├── SearchResultsScreen.js   # Results display
│   └── DetailScreen.js          # Record detail view
└── assets/               # Images and icons (create these)
```

## Color Scheme

The app uses a professional dark color palette:
- Primary: `#1a1a2e` (Dark Navy)
- Secondary: `#16213e` (Navy Blue)
- Accent: `#2d3561` (Medium Blue)
- Light: `#0f3460` (Lighter Blue)

## Security Features

- Secure token storage using Expo SecureStore (encrypted storage)
- Automatic token cleanup on 401 errors
- Input validation and sanitization
- Error handling with user-friendly messages

## Troubleshooting

### Network Connection Issues
- Ensure your device and computer are on the same network
- Use your computer's local IP address instead of `localhost`
- Check firewall settings

### Module Not Found Errors
- Run `npm install` again
- Clear Expo cache: `expo start -c`
- Delete `node_modules` and reinstall

### API Connection Issues
- Verify the API_BASE_URL in `services/api.js`
- Check that your backend server is running
- Ensure CORS is properly configured on your backend

## Development Notes

- The app is optimized for mobile devices (iOS and Android)
- All searches are performed server-side for security
- Results are displayed in a user-friendly format
- The app handles network errors gracefully

## License

This project is for official use by the First Settlement Police Department Investigation Unit.

## Support

For issues or questions, contact the development team.

