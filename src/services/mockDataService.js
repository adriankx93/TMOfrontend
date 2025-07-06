// Mock data service to simulate backend responses
export const mockDataService = {
  // Mock tasks data
  tasks: [
    {
      _id: "1",
      title: "Naprawa oświetlenia LED w hali A",
      description: "Wymiana uszkodzonych żarówek LED w sekcji 3",
      priority: "Wysoki",
      status: "assigned",
      assignedTo: "tech1",
      location: "Hala A",
      shift: "Dzienna",
      category: "Elektryka",
      estimatedDuration: 60,
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: "2",
      title: "Kontrola systemu wentylacji",
      description: "Sprawdzenie działania klimatyzacji w biurze",
      priority: "Średni",
      status: "in_progress",
      assignedTo: "tech2",
      location: "Biuro administracyjne",
      shift: "Dzienna",
      category: "HVAC",
      estimatedDuration: 45,
      createdAt: new Date().toISOString(),
      progress: 30
    },
    {
      _id: "3",
      title: "Wymiana filtrów powietrza",
      description: "Rutynowa wymiana filtrów w systemie HVAC",
      priority: "Niski",
      status: "pool",
      location: "Dach budynku B",
      shift: "Nocna",
      category: "HVAC",
      estimatedDuration: 90,
      createdAt: new Date().toISOString()
    }
  ],

  // Mock technicians data
  technicians: [
    {
      _id: "tech1",
      firstName: "Jan",
      lastName: "Kowalski",
      email: "jan.kowalski@orange.pl",
      phone: "+48 123 456 789",
      specialization: "Elektryka",
      shift: "Dzienna",
      status: "active",
      employeeId: "EMP001",
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      currentLocation: "Hala A"
    },
    {
      _id: "tech2",
      firstName: "Anna",
      lastName: "Nowak",
      email: "anna.nowak@orange.pl",
      phone: "+48 987 654 321",
      specialization: "HVAC",
      shift: "Dzienna",
      status: "active",
      employeeId: "EMP002",
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      currentLocation: "Biuro administracyjne"
    },
    {
      _id: "tech3",
      firstName: "Piotr",
      lastName: "Wiśniewski",
      email: "piotr.wisniewski@orange.pl",
      phone: "+48 555 666 777",
      specialization: "Mechanika",
      shift: "Nocna",
      status: "active",
      employeeId: "EMP003",
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      currentLocation: "Magazyn A"
    }
  ],

  // Generate unique ID
  generateId: () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  },

  // Simulate API delay
  delay: (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))
};