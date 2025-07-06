import { Building, Complex, Floor, Room, TechnicalRoom, Equipment, Facility } from '../types/building';

export const buildingService = {
  getComplexStructure: (): Complex => {
    const buildings: Building[] = [
      {
        id: 'building-a',
        name: 'Budynek A',
        code: 'A',
        type: 'office',
        description: 'Główny budynek biurowy',
        totalArea: 2500,
        floors: generateFloors('A', 5),
        technicalRooms: [
          {
            id: 'tech-a-1',
            name: 'Rozdzielnia główna A',
            type: 'electrical',
            location: 'Parter, pomieszczenie techniczne',
            equipment: generateElectricalEquipment('A'),
            lastInspection: '2024-01-15',
            nextInspection: '2024-07-15'
          },
          {
            id: 'tech-a-2',
            name: 'Centrala HVAC A',
            type: 'hvac',
            location: 'Dach budynku A',
            equipment: generateHVACEquipment('A'),
            lastInspection: '2024-01-10',
            nextInspection: '2024-04-10'
          }
        ]
      },
      {
        id: 'building-b',
        name: 'Budynek B',
        code: 'B',
        type: 'office',
        description: 'Budynek biurowy z salami konferencyjnymi',
        totalArea: 2200,
        floors: generateFloors('B', 5),
        technicalRooms: [
          {
            id: 'tech-b-1',
            name: 'Rozdzielnia główna B',
            type: 'electrical',
            location: 'Parter, pomieszczenie techniczne',
            equipment: generateElectricalEquipment('B'),
            lastInspection: '2024-01-20',
            nextInspection: '2024-07-20'
          }
        ]
      },
      {
        id: 'building-c',
        name: 'Budynek C',
        code: 'C',
        type: 'office',
        description: 'Budynek z centrum danych',
        totalArea: 2000,
        floors: generateFloors('C', 5),
        technicalRooms: [
          {
            id: 'tech-c-1',
            name: 'Centrum danych',
            type: 'server',
            location: 'Parter, sala serwerowa',
            equipment: generateServerEquipment('C'),
            lastInspection: '2024-01-25',
            nextInspection: '2024-02-25'
          }
        ]
      },
      {
        id: 'building-d',
        name: 'Budynek D',
        code: 'D',
        type: 'office',
        description: 'Budynek administracyjny',
        totalArea: 1800,
        floors: generateFloors('D', 5),
        technicalRooms: []
      },
      {
        id: 'building-e-compensa',
        name: 'Budynek E Compensa',
        code: 'E-COMP',
        type: 'office',
        description: 'Budynek dedykowany dla Compensa',
        totalArea: 3000,
        floors: generateFloors('E-COMP', 5),
        technicalRooms: [
          {
            id: 'tech-e-comp-1',
            name: 'Rozdzielnia E Compensa',
            type: 'electrical',
            location: 'Parter, pomieszczenie techniczne',
            equipment: generateElectricalEquipment('E-COMP'),
            lastInspection: '2024-01-12',
            nextInspection: '2024-07-12'
          }
        ]
      },
      {
        id: 'building-e-bayer',
        name: 'Budynek E Bayer',
        code: 'E-BAY',
        type: 'office',
        description: 'Budynek dedykowany dla Bayer',
        totalArea: 2800,
        floors: generateFloors('E-BAY', 5),
        technicalRooms: [
          {
            id: 'tech-e-bay-1',
            name: 'Rozdzielnia E Bayer',
            type: 'electrical',
            location: 'Parter, pomieszczenie techniczne',
            equipment: generateElectricalEquipment('E-BAY'),
            lastInspection: '2024-01-18',
            nextInspection: '2024-07-18'
          }
        ]
      },
      {
        id: 'garage-1',
        name: 'Garaż -1',
        code: 'G-1',
        type: 'garage',
        description: 'Pierwszy poziom podziemny parkingu',
        totalArea: 1500,
        floors: [
          {
            id: 'garage-1-floor',
            number: -1,
            name: 'Poziom -1',
            area: 1500,
            rooms: [],
            facilities: generateGarageFacilities('G-1')
          }
        ],
        technicalRooms: [
          {
            id: 'tech-g1-1',
            name: 'Rozdzielnia garażu -1',
            type: 'electrical',
            location: 'Garaż -1, pomieszczenie techniczne',
            equipment: generateGarageEquipment('G-1'),
            lastInspection: '2024-01-08',
            nextInspection: '2024-07-08'
          }
        ]
      },
      {
        id: 'garage-2',
        name: 'Garaż -2',
        code: 'G-2',
        type: 'garage',
        description: 'Drugi poziom podziemny parkingu',
        totalArea: 1500,
        floors: [
          {
            id: 'garage-2-floor',
            number: -2,
            name: 'Poziom -2',
            area: 1500,
            rooms: [],
            facilities: generateGarageFacilities('G-2')
          }
        ],
        technicalRooms: [
          {
            id: 'tech-g2-1',
            name: 'Rozdzielnia garażu -2',
            type: 'electrical',
            location: 'Garaż -2, pomieszczenie techniczne',
            equipment: generateGarageEquipment('G-2'),
            lastInspection: '2024-01-05',
            nextInspection: '2024-07-05'
          }
        ]
      }
    ];

    const totalArea = buildings.reduce((sum, building) => sum + building.totalArea, 0);
    const totalFloors = buildings.reduce((sum, building) => sum + building.floors.length, 0);
    const totalRooms = buildings.reduce((sum, building) => 
      sum + building.floors.reduce((floorSum, floor) => floorSum + floor.rooms.length, 0), 0
    );

    return {
      buildings,
      totalArea,
      totalFloors,
      totalRooms,
      parkingSpaces: 300 // 150 miejsc na każdym poziomie garażu
    };
  },

  getBuildingById: (buildingId: string): Building | null => {
    const complex = buildingService.getComplexStructure();
    return complex.buildings.find(building => building.id === buildingId) || null;
  },

  getLocationsList: (): string[] => {
    const complex = buildingService.getComplexStructure();
    const locations: string[] = [];

    complex.buildings.forEach(building => {
      if (building.type === 'garage') {
        locations.push(building.name);
      } else {
        building.floors.forEach(floor => {
          locations.push(`${building.name} - ${floor.name}`);
          floor.rooms.forEach(room => {
            if (room.type === 'technical' || room.type === 'meeting') {
              locations.push(`${building.name} - ${floor.name} - ${room.name}`);
            }
          });
        });
        // Dodaj pomieszczenia techniczne
        building.technicalRooms.forEach(techRoom => {
          locations.push(`${building.name} - ${techRoom.name}`);
        });
      }
    });

    return locations.sort();
  }
};

function generateFloors(buildingCode: string, floorCount: number): Floor[] {
  const floors: Floor[] = [];
  
  for (let i = 0; i < floorCount; i++) {
    const floorNumber = i;
    const floorName = i === 0 ? 'Parter' : `${i} piętro`;
    
    floors.push({
      id: `${buildingCode.toLowerCase()}-floor-${i}`,
      number: floorNumber,
      name: floorName,
      area: 500,
      rooms: generateRooms(buildingCode, i),
      facilities: generateFloorFacilities(buildingCode, i)
    });
  }
  
  return floors;
}

function generateRooms(buildingCode: string, floorNumber: number): Room[] {
  const rooms: Room[] = [];
  const roomsPerFloor = floorNumber === 0 ? 8 : 12; // Parter ma mniej pokoi (recepcja, hol)
  
  for (let i = 1; i <= roomsPerFloor; i++) {
    const roomNumber = `${buildingCode}${floorNumber}${i.toString().padStart(2, '0')}`;
    let roomType: Room['type'] = 'office';
    let roomName = `Biuro ${roomNumber}`;
    
    if (floorNumber === 0) {
      if (i === 1) {
        roomType = 'meeting';
        roomName = 'Recepcja';
      } else if (i === 2) {
        roomType = 'meeting';
        roomName = 'Sala konferencyjna';
      } else if (i === 8) {
        roomType = 'technical';
        roomName = 'Pomieszczenie techniczne';
      }
    }
    
    if (i === roomsPerFloor - 1) {
      roomType = 'kitchen';
      roomName = 'Kuchnia';
    } else if (i === roomsPerFloor) {
      roomType = 'bathroom';
      roomName = 'Łazienka';
    }
    
    rooms.push({
      id: `room-${roomNumber.toLowerCase()}`,
      number: roomNumber,
      name: roomName,
      area: roomType === 'office' ? 25 : roomType === 'meeting' ? 50 : 15,
      type: roomType,
      occupancy: roomType === 'office' ? 4 : roomType === 'meeting' ? 12 : 0,
      equipment: generateRoomEquipment(roomType)
    });
  }
  
  return rooms;
}

function generateRoomEquipment(roomType: Room['type']): Equipment[] {
  const equipment: Equipment[] = [];
  const baseDate = new Date('2023-01-01');
  
  switch (roomType) {
    case 'office':
      equipment.push(
        {
          id: `eq-${Date.now()}-1`,
          name: 'Klimatyzator',
          type: 'HVAC',
          manufacturer: 'Daikin',
          model: 'FTXS25K',
          serialNumber: `SN${Math.random().toString(36).substr(2, 8)}`,
          installationDate: baseDate.toISOString(),
          warrantyExpiry: new Date(baseDate.getTime() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString(),
          lastMaintenance: '2024-01-15',
          nextMaintenance: '2024-07-15',
          status: 'operational'
        },
        {
          id: `eq-${Date.now()}-2`,
          name: 'Oświetlenie LED',
          type: 'Electrical',
          manufacturer: 'Philips',
          model: 'CoreLine LED',
          serialNumber: `SN${Math.random().toString(36).substr(2, 8)}`,
          installationDate: baseDate.toISOString(),
          warrantyExpiry: new Date(baseDate.getTime() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString(),
          lastMaintenance: '2024-01-10',
          nextMaintenance: '2024-07-10',
          status: 'operational'
        }
      );
      break;
    case 'meeting':
      equipment.push(
        {
          id: `eq-${Date.now()}-3`,
          name: 'Projektor',
          type: 'AV',
          manufacturer: 'Epson',
          model: 'EB-2250U',
          serialNumber: `SN${Math.random().toString(36).substr(2, 8)}`,
          installationDate: baseDate.toISOString(),
          warrantyExpiry: new Date(baseDate.getTime() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString(),
          lastMaintenance: '2024-01-20',
          nextMaintenance: '2024-04-20',
          status: 'operational'
        }
      );
      break;
  }
  
  return equipment;
}

function generateFloorFacilities(buildingCode: string, floorNumber: number): Facility[] {
  return [
    {
      id: `facility-${buildingCode.toLowerCase()}-${floorNumber}-elevator`,
      name: 'Winda',
      type: 'elevator',
      location: `${buildingCode} - ${floorNumber === 0 ? 'Parter' : `${floorNumber} piętro`}`,
      status: 'operational',
      lastInspection: '2024-01-15',
      nextInspection: '2024-07-15'
    },
    {
      id: `facility-${buildingCode.toLowerCase()}-${floorNumber}-stairs`,
      name: 'Klatka schodowa',
      type: 'stairs',
      location: `${buildingCode} - ${floorNumber === 0 ? 'Parter' : `${floorNumber} piętro`}`,
      status: 'operational',
      lastInspection: '2024-01-10',
      nextInspection: '2024-07-10'
    },
    {
      id: `facility-${buildingCode.toLowerCase()}-${floorNumber}-exit`,
      name: 'Wyjście ewakuacyjne',
      type: 'emergency_exit',
      location: `${buildingCode} - ${floorNumber === 0 ? 'Parter' : `${floorNumber} piętro`}`,
      status: 'operational',
      lastInspection: '2024-01-05',
      nextInspection: '2024-07-05'
    }
  ];
}

function generateGarageFacilities(garageCode: string): Facility[] {
  return [
    {
      id: `facility-${garageCode.toLowerCase()}-ventilation`,
      name: 'System wentylacji',
      type: 'emergency_exit',
      location: garageCode,
      status: 'operational',
      lastInspection: '2024-01-12',
      nextInspection: '2024-07-12'
    },
    {
      id: `facility-${garageCode.toLowerCase()}-lighting`,
      name: 'Oświetlenie awaryjne',
      type: 'emergency_exit',
      location: garageCode,
      status: 'operational',
      lastInspection: '2024-01-08',
      nextInspection: '2024-07-08'
    }
  ];
}

function generateElectricalEquipment(buildingCode: string): Equipment[] {
  return [
    {
      id: `eq-electrical-${buildingCode.toLowerCase()}-1`,
      name: 'Rozdzielnica główna',
      type: 'Electrical',
      manufacturer: 'Schneider Electric',
      model: 'Prisma Plus P',
      serialNumber: `SN${Math.random().toString(36).substr(2, 8)}`,
      installationDate: '2023-01-01',
      warrantyExpiry: '2028-01-01',
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-07-15',
      status: 'operational'
    },
    {
      id: `eq-electrical-${buildingCode.toLowerCase()}-2`,
      name: 'UPS',
      type: 'Electrical',
      manufacturer: 'APC',
      model: 'Smart-UPS 3000',
      serialNumber: `SN${Math.random().toString(36).substr(2, 8)}`,
      installationDate: '2023-01-01',
      warrantyExpiry: '2026-01-01',
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-04-10',
      status: 'operational'
    }
  ];
}

function generateHVACEquipment(buildingCode: string): Equipment[] {
  return [
    {
      id: `eq-hvac-${buildingCode.toLowerCase()}-1`,
      name: 'Centrala wentylacyjna',
      type: 'HVAC',
      manufacturer: 'Systemair',
      model: 'TOPVEX SR03',
      serialNumber: `SN${Math.random().toString(36).substr(2, 8)}`,
      installationDate: '2023-01-01',
      warrantyExpiry: '2028-01-01',
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-04-10',
      status: 'operational'
    },
    {
      id: `eq-hvac-${buildingCode.toLowerCase()}-2`,
      name: 'Chiller',
      type: 'HVAC',
      manufacturer: 'Carrier',
      model: '30XA1002',
      serialNumber: `SN${Math.random().toString(36).substr(2, 8)}`,
      installationDate: '2023-01-01',
      warrantyExpiry: '2030-01-01',
      lastMaintenance: '2024-01-05',
      nextMaintenance: '2024-04-05',
      status: 'operational'
    }
  ];
}

function generateServerEquipment(buildingCode: string): Equipment[] {
  return [
    {
      id: `eq-server-${buildingCode.toLowerCase()}-1`,
      name: 'Serwer główny',
      type: 'IT',
      manufacturer: 'Dell',
      model: 'PowerEdge R750',
      serialNumber: `SN${Math.random().toString(36).substr(2, 8)}`,
      installationDate: '2023-06-01',
      warrantyExpiry: '2026-06-01',
      lastMaintenance: '2024-01-25',
      nextMaintenance: '2024-02-25',
      status: 'operational'
    },
    {
      id: `eq-server-${buildingCode.toLowerCase()}-2`,
      name: 'Switch sieciowy',
      type: 'Network',
      manufacturer: 'Cisco',
      model: 'Catalyst 9300',
      serialNumber: `SN${Math.random().toString(36).substr(2, 8)}`,
      installationDate: '2023-06-01',
      warrantyExpiry: '2028-06-01',
      lastMaintenance: '2024-01-20',
      nextMaintenance: '2024-07-20',
      status: 'operational'
    }
  ];
}

function generateGarageEquipment(garageCode: string): Equipment[] {
  return [
    {
      id: `eq-garage-${garageCode.toLowerCase()}-1`,
      name: 'System wentylacji garażu',
      type: 'HVAC',
      manufacturer: 'Systemair',
      model: 'DVNI 315',
      serialNumber: `SN${Math.random().toString(36).substr(2, 8)}`,
      installationDate: '2023-01-01',
      warrantyExpiry: '2026-01-01',
      lastMaintenance: '2024-01-08',
      nextMaintenance: '2024-07-08',
      status: 'operational'
    },
    {
      id: `eq-garage-${garageCode.toLowerCase()}-2`,
      name: 'Oświetlenie LED garażu',
      type: 'Electrical',
      manufacturer: 'Osram',
      model: 'SubstiTUBE Advanced',
      serialNumber: `SN${Math.random().toString(36).substr(2, 8)}`,
      installationDate: '2023-01-01',
      warrantyExpiry: '2028-01-01',
      lastMaintenance: '2024-01-05',
      nextMaintenance: '2024-07-05',
      status: 'operational'
    }
  ];
}