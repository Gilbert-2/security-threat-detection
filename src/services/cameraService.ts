import api from "./api";

export interface Camera {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline" | "maintenance";
  lastPing: string;
}

export interface CameraSummary {
  total: number;
  online: number;
  offline: number;
  maintenance: number;
}

// Mock cameras data - this would come from the backend
const mockCameras: Camera[] = [
  { id: "cam-1", name: "Main Entrance Camera", location: "Main Entrance", status: "online", lastPing: new Date().toISOString() },
  { id: "cam-2", name: "Lobby Camera 2", location: "Main Lobby", status: "online", lastPing: new Date().toISOString() },
  { id: "cam-3", name: "Emergency Exit B", location: "East Wing", status: "online", lastPing: new Date().toISOString() },
  { id: "cam-4", name: "Hallway Camera 4", location: "North Hallway", status: "offline", lastPing: new Date().toISOString() },
  { id: "cam-5", name: "Parking Level 2 Camera", location: "Parking Garage", status: "maintenance", lastPing: new Date().toISOString() },
  { id: "cam-6", name: "Office Area Camera 3", location: "Office Floor 3", status: "online", lastPing: new Date().toISOString() },
];

export const cameraService = {
  // Get all cameras
  getCameras: async (): Promise<Camera[]> => {
    // const response = await api.get<Camera[]>("/cameras");
    // return response.data;
    
    return Promise.resolve(mockCameras);
  },

  // Get camera by ID
  getCameraById: async (id: string): Promise<Camera | undefined> => {
    // const response = await api.get<Camera>(`/cameras/${id}`);
    // return response.data;
    
    return Promise.resolve(mockCameras.find(cam => cam.id === id));
  },

  // Get camera by name
  getCameraByName: async (name: string): Promise<Camera | undefined> => {
    // const response = await api.get<Camera[]>(`/cameras?name=${encodeURIComponent(name)}`);
    // return response.data[0] || undefined;
    
    return Promise.resolve(mockCameras.find(cam => cam.name === name));
  },

  // Get camera status summary
  getCameraSummary: async (): Promise<CameraSummary> => {
    // const response = await api.get<CameraSummary>("/cameras/summary");
    // return response.data;
    
    const online = mockCameras.filter(cam => cam.status === "online").length;
    const offline = mockCameras.filter(cam => cam.status === "offline").length;
    const maintenance = mockCameras.filter(cam => cam.status === "maintenance").length;
    
    return Promise.resolve({
      total: mockCameras.length,
      online,
      offline,
      maintenance
    });
  },

  // Update camera status
  updateCameraStatus: async (id: string, status: Camera["status"]): Promise<Camera> => {
    // const response = await api.put<Camera>(`/cameras/${id}/status`, { status });
    // return response.data;
    
    return Promise.resolve({
      id,
      name: `Camera ${id}`,
      location: "Unknown",
      status,
      lastPing: new Date().toISOString()
    });
  }
};
