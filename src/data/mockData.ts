export interface Bin {
  id: string;
  lat: number;
  lng: number;
  fillLevel: number; // 0-100
  lastCollected: string;
  assignedWorker: string;
  predictedFullTime: string;
  location: string;
}

export interface Worker {
  id: string;
  name: string;
  status: "available" | "on-duty" | "offline";
  avatar: string;
  tasksCompleted: number;
  efficiency: number;
  currentRoute?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  priority: "high" | "medium" | "low";
  timestamp: string;
  read: boolean;
  type: "overflow" | "maintenance" | "system" | "ai-alert";
}

export const bins: Bin[] = [
  { id: "B001", lat: 40.7128, lng: -74.006, fillLevel: 92, lastCollected: "2h ago", assignedWorker: "Alex Chen", predictedFullTime: "30min", location: "Main St & 5th Ave" },
  { id: "B002", lat: 40.7148, lng: -74.002, fillLevel: 45, lastCollected: "4h ago", assignedWorker: "Maria Santos", predictedFullTime: "6h", location: "Park Ave & 12th St" },
  { id: "B003", lat: 40.7108, lng: -74.008, fillLevel: 15, lastCollected: "1h ago", assignedWorker: "James Wilson", predictedFullTime: "18h", location: "Broadway & 3rd Ave" },
  { id: "B004", lat: 40.7168, lng: -74.004, fillLevel: 78, lastCollected: "5h ago", assignedWorker: "Alex Chen", predictedFullTime: "2h", location: "Liberty St & Church" },
  { id: "B005", lat: 40.7098, lng: -74.010, fillLevel: 88, lastCollected: "3h ago", assignedWorker: "Sarah Kim", predictedFullTime: "45min", location: "Fulton St & Gold" },
  { id: "B006", lat: 40.7138, lng: -74.000, fillLevel: 32, lastCollected: "30min ago", assignedWorker: "Maria Santos", predictedFullTime: "12h", location: "Water St & Pine" },
  { id: "B007", lat: 40.7158, lng: -74.012, fillLevel: 67, lastCollected: "6h ago", assignedWorker: "James Wilson", predictedFullTime: "4h", location: "Chambers St & West" },
  { id: "B008", lat: 40.7118, lng: -73.998, fillLevel: 5, lastCollected: "20min ago", assignedWorker: "Sarah Kim", predictedFullTime: "24h", location: "Pearl St & Hanover" },
];

export const workers: Worker[] = [
  { id: "W001", name: "Alex Chen", status: "on-duty", avatar: "AC", tasksCompleted: 23, efficiency: 94, currentRoute: "Downtown East" },
  { id: "W002", name: "Maria Santos", status: "available", avatar: "MS", tasksCompleted: 18, efficiency: 89 },
  { id: "W003", name: "James Wilson", status: "on-duty", avatar: "JW", tasksCompleted: 21, efficiency: 91, currentRoute: "Midtown West" },
  { id: "W004", name: "Sarah Kim", status: "offline", avatar: "SK", tasksCompleted: 15, efficiency: 87 },
  { id: "W005", name: "David Park", status: "available", avatar: "DP", tasksCompleted: 27, efficiency: 96 },
];

export const notifications: Notification[] = [
  { id: "N001", title: "Bin Overflow Alert", message: "Bin B001 at Main St is at 92% capacity. Immediate collection needed.", priority: "high", timestamp: "2 min ago", read: false, type: "overflow" },
  { id: "N002", title: "AI Route Optimization", message: "Suggested route saves 23 min for Downtown East sector.", priority: "medium", timestamp: "15 min ago", read: false, type: "ai-alert" },
  { id: "N003", title: "Maintenance Required", message: "Bin B005 sensor malfunction detected. Technician required.", priority: "high", timestamp: "30 min ago", read: false, type: "maintenance" },
  { id: "N004", title: "Peak Prediction", message: "AI predicts 40% increase in waste generation tomorrow due to city event.", priority: "medium", timestamp: "1h ago", read: true, type: "ai-alert" },
  { id: "N005", title: "System Update", message: "Fleet tracking module updated successfully.", priority: "low", timestamp: "2h ago", read: true, type: "system" },
  { id: "N006", title: "Worker Shift Change", message: "Night shift begins at 22:00. 3 workers scheduled.", priority: "low", timestamp: "3h ago", read: true, type: "system" },
];

export const collectionTrends = [
  { hour: "00:00", collections: 2, predicted: 3 },
  { hour: "04:00", collections: 1, predicted: 2 },
  { hour: "08:00", collections: 12, predicted: 14 },
  { hour: "12:00", collections: 18, predicted: 16 },
  { hour: "16:00", collections: 15, predicted: 17 },
  { hour: "20:00", collections: 8, predicted: 9 },
  { hour: "Now", collections: 6, predicted: 7 },
];

export const wasteByArea = [
  { area: "Downtown", waste: 340, capacity: 500 },
  { area: "Midtown", waste: 280, capacity: 450 },
  { area: "Uptown", waste: 190, capacity: 400 },
  { area: "East Side", waste: 220, capacity: 350 },
  { area: "West Side", waste: 160, capacity: 300 },
];

export const fillPredictions = [
  { time: "+1h", bins: 3 },
  { time: "+3h", bins: 5 },
  { time: "+6h", bins: 8 },
  { time: "+12h", bins: 12 },
  { time: "+24h", bins: 18 },
];
