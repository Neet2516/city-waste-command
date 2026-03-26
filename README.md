# Waste Management System - Admin Dashboard

A comprehensive React-based admin dashboard for monitoring and managing municipal waste collection systems in real-time.

## 🎯 Features

### 📊 Dashboard
- **Real-time Statistics**: Live bin status counts, active drivers, and system performance metrics
- **Interactive Charts**: Pie charts for status distribution and line charts for collection trends
- **Auto-refresh**: Updates every 20 seconds for real-time monitoring

### 🗑️ Bin Management
- **Complete Inventory**: View all waste bins with detailed information
- **Advanced Filtering**: Filter by ward, status, or search by bin ID
- **Status Updates**: Real-time bin status updates with optimistic UI updates
- **Sortable Table**: Organize bins by any column for efficient management

### 🗺️ Map View
- **Interactive Map**: Visual representation of all bins across the city
- **Status-based Coloring**: Color-coded markers (Green=Empty, Yellow=Filling, Red=Full)
- **Ward Filtering**: Focus on specific administrative areas
- **Real-time Data**: Live updates reflected on the map

### 🔧 Ward Management
- **Ward Organization**: View bins by administrative wards
- **Geographic Filtering**: Filter bins by specific wards for focused management
- **Ward Statistics**: Ward-specific bin counts and status distribution

### 🔄 Real-time Features
- **Auto-refresh**: 20-second intervals for live data updates
- **Optimistic Updates**: Immediate UI feedback for status changes
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Smooth loading animations and states

## 🛠️ Tech Stack

- **Frontend**: React.js with functional components and hooks
- **State Management**: Context API with custom hooks
- **Styling**: Tailwind CSS with Shadcn UI components
- **Charts**: Recharts for data visualization
- **Maps**: React-Leaflet for interactive mapping
- **Routing**: React Router for navigation
- **API**: Axios for HTTP requests with interceptors
- **Build Tool**: Vite for fast development and building

## 🚀 Quick Start

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd city-waste-command
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment setup**
Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=https://waste-management-cmup.onrender.com
```

4. **Start development server**
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Sidebar.tsx     # Navigation sidebar
│   └── ui/            # Shadcn UI components
├── pages/              # Main page components
│   ├── Dashboard.tsx   # Dashboard page
│   ├── Bins.tsx       # Bin management page
│   └── Map.tsx        # Map view page
├── services/           # API service layer
│   ├── api.js         # Axios configuration
│   ├── binService.js  # Bin-related API calls
│   ├── statsService.js # Statistics API calls
│   └── wardService.js # Ward-related API calls
├── context/            # State management
│   └── WasteManagementContext.js
├── data/              # Mock data (for development)
└── lib/               # Utility functions
```

## 🌐 API Integration

The dashboard integrates with the following backend APIs:

### Endpoints Used

1. **GET /bins** - Fetch all bins
2. **GET /bins?ward={wardId}** - Filter bins by ward
3. **PATCH /bins/{binId}** - Update bin status
4. **GET /stats** - Get dashboard statistics
5. **GET /wards** - Get all wards

### API Response Formats

**Bin Object:**
```json
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
```

**Stats Object:**
```json
{
  "totalBins": number,
  "fullBins": number,
  "fillingBins": number,
  "emptyBins": number,
  "activeDrivers": number
}
```

## 🎨 UI Features

### Status Color Coding
- **🟢 Empty**: Ready for use (Green - #10b981)
- **🟡 Filling**: Monitoring required (Yellow - #f59e0b)
- **🔴 Full**: Immediate attention needed (Red - #ef4444)

### Responsive Design
- **Mobile-first**: Fully responsive design
- **Sidebar**: Collapsible sidebar for mobile devices
- **Grid Layouts**: Adaptive grid systems for different screen sizes
- **Touch-friendly**: Optimized for touch interactions

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and semantic HTML
- **High Contrast**: Good color contrast ratios
- **Focus Management**: Proper focus indicators

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API base URL | Required |
| `REACT_APP_REFRESH_INTERVAL` | Auto-refresh interval (ms) | 20000 |

### Build Configuration

The project uses Vite for building with the following key configurations:

- **Development Server**: Port 5173 with hot reload
- **Production Build**: Optimized with Terser minification
- **Source Maps**: Disabled in production for performance
- **Code Splitting**: Route-based lazy loading

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Drag dist folder to Netlify dashboard
```

### GitHub Pages
```bash
npm run build
# Configure GitHub Actions or manual deployment
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## 📊 Performance Features

### Optimization Strategies
- **Code Splitting**: Route-based lazy loading
- **Memoization**: Optimized re-renders with useMemo and useCallback
- **Debouncing**: Search input debouncing to reduce API calls
- **Caching**: Strategic caching for frequently accessed data
- **Bundle Analysis**: Built-in bundle size analysis

### Real-time Updates
- **Auto-refresh**: 20-second intervals for live data
- **Optimistic Updates**: Immediate UI feedback
- **Error Recovery**: Graceful error handling and recovery
- **Loading States**: Smooth loading animations

## 🧪 Testing

The project includes basic testing setup with Vitest:

```bash
npm test          # Run tests
npm run test:watch # Watch mode
```

## 📈 Monitoring & Analytics

### Built-in Monitoring
- **Error Tracking**: Console logging and error boundaries
- **Performance Metrics**: Core Web Vitals tracking ready
- **Uptime Monitoring**: Health check endpoints available

### Integration Ready
- **Sentry**: Error tracking integration
- **Google Analytics**: Analytics integration
- **Custom Metrics**: Performance monitoring hooks

## 🔒 Security

### Frontend Security
- **CSP Headers**: Content Security Policy ready
- **HTTPS**: Enforced in production
- **Input Validation**: Client-side validation with server-side backup
- **Rate Limiting**: API rate limiting considerations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 Documentation

- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Step-by-step deployment instructions

## 🐛 Troubleshooting

### Common Issues

**Environment Variables Not Loading**
- Ensure variables are prefixed with `REACT_APP_`
- Restart development server after changes

**Build Failures**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run typecheck`

**API Connection Issues**
- Verify `REACT_APP_API_URL` is correct
- Check CORS settings on backend
- Test API endpoints independently

## 📞 Support

For support and questions:
1. Check the troubleshooting section
2. Review browser developer console
3. Verify environment configuration
4. Test with fresh clone and install

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏗️ Architecture

### State Management
- **Context API**: Global state management
- **Custom Hooks**: Reusable state logic
- **Optimistic Updates**: Immediate UI feedback
- **Error Boundaries**: Graceful error handling

### Data Flow
```
API → Services → Context → Components → UI
```

### Component Architecture
- **Atomic Design**: Component hierarchy from atoms to pages
- **Reusability**: Highly reusable components
- **Separation of Concerns**: Clear separation between logic and presentation
- **Type Safety**: TypeScript for type safety

---

**Built with ❤️ for efficient waste management**