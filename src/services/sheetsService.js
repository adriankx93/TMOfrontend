getCurrentMonthData: async () => {
  const now = new Date();
  const monthIndex = now.getMonth();
  const year = now.getFullYear();
  const expectedMonthName = CONFIG.monthNames[monthIndex];

  console.log(`[Sheets API] Szukam arkusza zawierającego "${expectedMonthName}" i rok ${year}...`);

  const allSheets = await sheetsService.getAvailableSheets();
  let sheetName = allSheets.find(name =>
    name.toLowerCase().includes(expectedMonthName.toLowerCase()) &&
    name.includes(year.toString())
  );
  if (!sheetName) {
    sheetName = allSheets.find(name =>
      name.toLowerCase().includes(expectedMonthName.toLowerCase())
    );
  }
  if (!sheetName) {
    throw new Error(`Nie znaleziono arkusza "${expectedMonthName} ${year}". Sprawdzone arkusze: ${allSheets.join(", ")}`);
  }

  console.log(`[Sheets API] Używam arkusza "${sheetName}"`);

  const [techniciansData, datesData, shiftsData] = await sheetsService.getMultipleRanges(
    sheetName,
    [CONFIG.ranges.technicians, CONFIG.ranges.dates, CONFIG.ranges.shifts]
  );

  console.log("=== TechniciansData ===", JSON.stringify(techniciansData, null, 2));
  console.log("=== DatesData ===", JSON.stringify(datesData, null, 2));
  console.log("=== ShiftsData ===", JSON.stringify(shiftsData, null, 2));

  return {
    month: monthIndex,
    year,
    sheetName,
    raw: {
      techniciansData,
      datesData,
      shiftsData
    }
  };
},
