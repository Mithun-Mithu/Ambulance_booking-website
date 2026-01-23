# 🚑 Emergency Ambulance Booking System

A full-stack web application for emergency ambulance booking with real-time updates.

## Features

- 🏥 **Real-time Ambulance Tracking**: Live updates via WebSocket
- 📱 **Responsive Design**: Works on all devices
- 🚨 **Emergency Calls**: Direct emergency contact
- 📋 **Booking System**: Complete booking workflow
- 🔄 **Live Updates**: Real-time ambulance status updates

## Tech Stack

- **Backend**: Node.js, Express.js, WebSocket
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Database**: In-memory (for demo)

## Project Structure

```
ambulance-booking/
├── ambulance-backend.js    # Main server file
├── package.json           # Dependencies and scripts
├── public/               # Frontend files
│   ├── index.html       # Main HTML page
│   ├── styles.css       # CSS styles
│   └── script.js        # Frontend JavaScript
└── README.md            # This file
```

## Installation & Setup

1. **Clone or download the project**
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

## API Endpoints

- `GET /api/ambulances` - Get all ambulances
- `GET /api/ambulances/:id` - Get specific ambulance
- `GET /api/ambulances/status/available` - Get available ambulances
- `GET /api/hospitals` - Get hospitals
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get all bookings
- `PUT /api/bookings/:id/status` - Update booking status

## WebSocket Events

- `ambulance_update` - Real-time ambulance status updates

## Usage

1. Open the application in your browser
2. View available ambulances
3. Fill out the booking form
4. Submit to book an ambulance
5. Track your booking in real-time

## Development

For development with auto-restart:
```bash
npm run dev
```

## License

ISC License