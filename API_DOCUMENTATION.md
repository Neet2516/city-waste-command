# Waste Management System - API Documentation

## Overview

This document provides comprehensive API documentation for the Waste Management System Admin Dashboard. All endpoints are hosted at `https://waste-management-cmup.onrender.com`.

## Base URL

```
https://waste-management-cmup.onrender.com
```

## Authentication

No authentication required for the provided endpoints.

## Endpoints

### 1. Get All Bins

**Endpoint:** `GET /bins`

**Description:** Fetch all waste bins in the system with their current status and metadata.

**Response Format:**
```json
[
  {
    "_id": "string",
    "id": "string",
    "wardId": number,
    "lat": number,
    "lng": number,
    "status": "Full" | "Filling" | "Empty",
    "category": "plastic" | "organic" | "metal",
    "lastUpdated": "ISO date"
  }
]
```

**Usage in UI:**
- **Bin Management Page**: Display all bins in a sortable table
- **Map View**: Plot bins on interactive map with status-based coloring
- **Dashboard**: Calculate statistics (total bins, status distribution)

**Example Response:**
```json
[
  {
    "_id": "64a1b2c3d4e5f6a7b8c9d0e1",
    "id": "BIN-001",
    "wardId": 1,
    "lat": 40.7128,
    "lng": -74.0060,
    "status": "Full",
    "category": "plastic",
    "lastUpdated": "2024-06-15T10:30:00.000Z"
  }
]
```

---

### 2. Get Bins by Ward

**Endpoint:** `GET /bins?ward={wardId}`

**Description:** Filter bins by specific ward ID to view only bins within that administrative area.

**Parameters:**
- `ward` (query parameter): Ward ID number

**Response Format:** Same as Get All Bins, but filtered by ward

**Usage in UI:**
- **Bin Management Page**: Ward-specific filtering in dropdown
- **Map View**: Focus map on specific ward when selected
- **Ward Management**: Show bins assigned to each ward

**Example Request:**
```
GET /bins?ward=5
```

**Example Response:**
```json
[
  {
    "_id": "64a1b2c3d4e5f6a7b8c9d0e2",
    "id": "BIN-002",
    "wardId": 5,
    "lat": 40.7135,
    "lng": -74.0050,
    "status": "Empty",
    "category": "organic",
    "lastUpdated": "2024-06-15T09:15:00.000Z"
  }
]
```

---

### 3. Update Bin Status

**Endpoint:** `PATCH /bins/{binId}`

**Description:** Update the status of a specific bin after collection or maintenance.

**Request Body:**
```json
{
  "status": "Empty" | "Full" | "Filling"
}
```

**Parameters:**
- `binId` (path parameter): The unique identifier of the bin

**Response Format:**
```json
{
  "message": "Bin status updated successfully",
  "bin": {
    "_id": "string",
    "id": "string",
    "wardId": number,
    "lat": number,
    "lng": number,
    "status": "string",
    "category": "string",
    "lastUpdated": "ISO date"
  }
}
```

**Usage in UI:**
- **Bin Management Page**: Status update buttons in table rows
- **Optimistic Updates**: Immediately update UI while request processes
- **Real-time Sync**: Refresh dashboard stats after successful update

**Example Request:**
```json
PATCH /bins/64a1b2c3d4e5f6a7b8c9d0e1
{
  "status": "Empty"
}
```

**Example Response:**
```json
{
  "message": "Bin status updated successfully",
  "bin": {
    "_id": "64a1b2c3d4e5f6a7b8c9d0e1",
    "id": "BIN-001",
    "wardId": 1,
    "lat": 40.7128,
    "lng": -74.0060,
    "status": "Empty",
    "category": "plastic",
    "lastUpdated": "2024-06-15T10:45:00.000Z"
  }
}
```

---

### 4. Dashboard Statistics

**Endpoint:** `GET /stats`

**Description:** Get aggregated statistics for the dashboard including bin counts by status and active drivers.

**Response Format:**
```json
{
  "totalBins": number,
  "fullBins": number,
  "fillingBins": number,
  "emptyBins": number,
  "activeDrivers": number
}
```

**Usage in UI:**
- **Dashboard Page**: Display key metrics in summary cards
- **Real-time Updates**: Auto-refresh every 20 seconds
- **Performance Monitoring**: Track system efficiency

**Example Response:**
```json
{
  "totalBins": 1247,
  "fullBins": 38,
  "fillingBins": 121,
  "emptyBins": 1088,
  "activeDrivers": 12
}
```

---

### 5. Get Wards

**Endpoint:** `GET /wards`

**Description:** Fetch all administrative wards for filtering and organizational purposes.

**Response Format:**
```json
[
  {
    "id": number,
    "name": "string"
  }
]
```

**Usage in UI:**
- **Bin Management Page**: Ward filter dropdown
- **Map View**: Ward selection for focused viewing
- **Ward Management**: Display ward information

**Example Response:**
```json
[
  {
    "id": 1,
    "name": "Downtown"
  },
  {
    "id": 2,
    "name": "Midtown"
  },
  {
    "id": 3,
    "name": "Uptown"
  }
]
```

---

## Status Color Mapping

The frontend uses consistent color coding for bin statuses:

| Status | Color | Hex Code | UI Usage |
|--------|-------|----------|----------|
| Empty | Green | #10b981 | Available capacity |
| Filling | Yellow | #f59e0b | Monitoring required |
| Full | Red | #ef4444 | Immediate attention needed |

## Error Handling

### Common Error Responses

**404 Not Found:**
```json
{
  "error": "Bin not found",
  "message": "No bin found with ID: {binId}"
}
```

**400 Bad Request:**
```json
{
  "error": "Invalid status",
  "message": "Status must be one of: Empty, Filling, Full"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Server error",
  "message": "An unexpected error occurred"
}
```

## Frontend-Backend Data Flow

### 1. Initial Load
```
Frontend → GET /stats → Backend
Frontend → GET /bins → Backend  
Frontend → GET /wards → Backend
```

### 2. User Interactions
```
User filters by ward → GET /bins?ward=5 → Backend
User updates bin status → PATCH /bins/{id} → Backend
```

### 3. Real-time Updates
```
Auto-refresh every 20s → GET /stats, GET /bins → Backend
```

## Performance Considerations

- **Caching**: Implement client-side caching for ward data (rarely changes)
- **Pagination**: Consider implementing pagination for bins endpoint if dataset grows large
- **Debouncing**: Apply debouncing to search inputs to reduce API calls
- **Optimistic Updates**: Use optimistic UI updates for status changes to improve perceived performance

## Security Notes

- All endpoints are currently public (no authentication)
- Consider implementing API rate limiting in production
- Input validation should be handled server-side
- Use HTTPS for all requests (enforced by base URL)

## Integration Guidelines

### Axios Configuration
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://waste-management-cmup.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  }
});
```

### Error Handling Pattern
```javascript
try {
  const response = await api.get('/bins');
  // Handle success
} catch (error) {
  if (error.response?.status === 404) {
    // Handle not found
  } else {
    // Handle other errors
  }
}
```

### Status Update Pattern
```javascript
// Optimistic update
setBins(prev => prev.map(bin => 
  bin._id === binId ? { ...bin, status: newStatus } : bin
));

try {
  await api.patch(`/bins/${binId}`, { status: newStatus });
  // Success - update complete
} catch (error) {
  // Revert optimistic update
  setBins(prev => prev.map(bin => 
    bin._id === binId ? { ...bin, status: originalStatus } : bin
  ));
}