export interface Building {
  id: string;
  name: string;
  code: string;
  floors: Floor[];
  type: 'office' | 'garage';
  description: string;
  totalArea: number;
  technicalRooms: TechnicalRoom[];
}

export interface Floor {
  id: string;
  number: number;
  name: string;
  area: number;
  rooms: Room[];
  facilities: Facility[];
}

export interface Room {
  id: string;
  number: string;
  name: string;
  area: number;
  type: 'office' | 'meeting' | 'technical' | 'storage' | 'bathroom' | 'kitchen';
  occupancy: number;
  equipment: Equipment[];
}

export interface TechnicalRoom {
  id: string;
  name: string;
  type: 'electrical' | 'hvac' | 'server' | 'storage';
  location: string;
  equipment: Equipment[];
  lastInspection: string;
  nextInspection: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  installationDate: string;
  warrantyExpiry: string;
  lastMaintenance: string;
  nextMaintenance: string;
  status: 'operational' | 'maintenance' | 'broken' | 'decommissioned';
}

export interface Facility {
  id: string;
  name: string;
  type: 'elevator' | 'stairs' | 'emergency_exit' | 'fire_extinguisher' | 'first_aid';
  location: string;
  status: 'operational' | 'maintenance' | 'broken';
  lastInspection: string;
  nextInspection: string;
}

export interface Complex {
  buildings: Building[];
  totalArea: number;
  totalFloors: number;
  totalRooms: number;
  parkingSpaces: number;
}