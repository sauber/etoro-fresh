function displayAsciiTable(data: Record<string, string>[]): void {
  const columns = Object.keys(data[0]);

  // Calculate column widths
  const columnWidths: Record<string, number> = {};
  columns.forEach((column) => {
    const maxWidth = Math.max(...data.map((row) => row[column].length));
    columnWidths[column] = Math.max(column.length, maxWidth);
  });

  // Display header
  let table = '';
  columns.forEach((column) => {
    table += column.padEnd(columnWidths[column] + 2) + ' | ';
  });
  console.log(table);

  // Display data
  data.forEach((row) => {
    table = '';
    columns.forEach((column) => {
      const cell = row[column].replace(/(?:\r\n|\r|\n)/g, '\n');
      table += cell.padEnd(columnWidths[column] + 2) + ' | ';
    });
    console.log(table);
  });
}

// Example usage
const data = [
  { Name: 'John Doe', Age: '30', Address: '123 Main St\nApt 4' },
  { Name: 'Jane Smith', Age: '25', Address: '456 Oak St' },
];

displayAsciiTable(data);
