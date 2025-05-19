
// Alert severity levels
export enum AlertSeverity {
  CRITICAL = "CRITICAL",
  HIGH = "HIGH",
  MEDIUM = "MEDIUM",
  LOW = "LOW"
}

// Alert status options
export enum AlertStatus {
  NEW = "NEW",
  ACKNOWLEDGED = "ACKNOWLEDGED",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED", 
  FALSE_ALARM = "FALSE_ALARM"
}

// Location type options
export enum LocationType {
  PERIMETER = "PERIMETER",
  BUILDING = "BUILDING",
  FLOOR = "FLOOR",
  ROOM = "ROOM",
  OTHER = "OTHER"
}

// Location details interface
export interface LocationDetails {
  building?: string;
  floor?: string;
  room?: string;
  zone?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Alert interface
export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;
  createdAt: Date;
  updatedAt: Date;
  locationType: LocationType;
  locationName: string;
  locationDetails?: LocationDetails;
  frameId?: string;
  cameraId?: string;
}
