/**
 * Google Sheets Exporter
 * Exports data to Google Sheets
 */

export class GoogleSheetsExporter {
  constructor() {
    this.spreadsheetId = process.env.REACT_APP_GOOGLE_SHEETS_ID;
    this.apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  }

  /**
   * Format data for Google Sheets
   */
  formatData(results, query, params) {
    const headers = [
      'Business Name',
      'Phone',
      'Website',
      'Email', 
      'Address',
      'Latitude',
      'Longitude',
      'Place ID',
      'Search Query',
      'Export Date',
    ];

    const rows = results.map((result) => [
      result.name || '',
      result.phone || 'N/A',
      result.website || 'N/A',
      result.email || 'N/A', 
      result.address || '',
      result.lat || '',
      result.lng || '',
      result.place_id || '',
      query || '',
      new Date().toLocaleString(),
    ]);

    return [headers, ...rows];
  }

  /**
   * Create new Google Sheet and append data
   */
  async exportToGoogleSheets(results, query, params) {
    try {
      // Check if spreadsheet ID is set
      if (!this.spreadsheetId) {
        return this.exportAsCSV(results, query);
      }

      const data = this.formatData(results, query, params);

      // Use Google Sheets API to append data
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Sheet1!A1:append?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: data,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to append to Google Sheet');
      }

      // Open the spreadsheet
      window.open(
        `https://docs.google.com/spreadsheets/d/${this.spreadsheetId}`,
        '_blank'
      );
    } catch (error) {
      console.warn('Google Sheets API export failed, falling back to CSV:', error);
      return this.exportAsCSV(results, query);
    }
  }

  /**
   * Export as CSV file (fallback)
   */
  exportAsCSV(results, query) {
    const data = this.formatData(results, query, {});
    
    // Convert to CSV
    const csv = data
      .map((row) =>
        row.map((cell) => {
          // Escape quotes and wrap in quotes if contains comma
          const escaped = String(cell || '')
            .replace(/"/g, '""');
          return escaped.includes(',') ? `"${escaped}"` : escaped;
        }).join(',')
      )
      .join('\n');

    // Create blob
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    // Generate filename
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `places_export_${query.replace(/\s+/g, '_')}_${timestamp}.csv`;

    // Download
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Success message
    console.log(`✓ Exported ${results.length} results to ${filename}`);
  }

  /**
   * Export as Excel file (XLSX)
   */
  async exportAsExcel(results, query) {
    const data = this.formatData(results, query, {});

    // Create workbook data
    const worksheet = this.createWorksheet(data);
    const filename = `places_export_${query.replace(/\s+/g, '_')}_${
      new Date().toISOString().slice(0, 10)
    }.xlsx`;

    // For now, fall back to CSV
    // In production, use a library like SheetJS
    this.exportAsCSV(results, query);
  }

  /**
   * Create worksheet data structure
   */
  createWorksheet(data) {
    return {
      name: 'Places Data',
      data: data,
      columns: [
        { header: 'Business Name', width: 30 },
        { header: 'Phone', width: 20 },
        { header: 'Website', width: 35 },
        { header: 'Address', width: 40 },
        { header: 'Latitude', width: 15 },
        { header: 'Longitude', width: 15 },
        { header: 'Place ID', width: 30 },
        { header: 'Search Query', width: 25 },
        { header: 'Export Date', width: 20 },
      ],
    };
  }
}

/**
 * Export helper function for quick CSV export
 */
export function quickExportCSV(results, filename = 'export.csv') {
  const exporter = new GoogleSheetsExporter();
  const data = exporter.formatData(results, '', {});

  const csv = data
    .map((row) =>
      row.map((cell) => {
        const escaped = String(cell || '').replace(/"/g, '""');
        return escaped.includes(',') ? `"${escaped}"` : escaped;
      }).join(',')
    )
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Copy to clipboard
 */
export function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  } else {
    return new Promise((resolve, reject) => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();

      try {
        document.execCommand('copy');
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(textarea);
      }
    });
  }
}
