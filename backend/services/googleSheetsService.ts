import { google, sheets_v4 } from 'googleapis';

let sheetsClient: sheets_v4.Sheets | null = null;

const getSheetsClient = (): sheets_v4.Sheets => {
  if (sheetsClient) {
    return sheetsClient;
  }

  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    throw new Error(
      'Google Sheets credentials are missing. Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY.'
    );
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  sheetsClient = google.sheets({ version: 'v4', auth });
  return sheetsClient;
};

export interface VyaparSheetLeadPayload {
  fullName: string;
  mobile: string;
  businessType: string;
  device: string;
  language: string;
  upgradeTimeline: string;
  submittedAt: string;
}

export const appendVyaparLeadToSheet = async (payload: VyaparSheetLeadPayload) => {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const configuredSheetName = process.env.GOOGLE_SHEETS_VYAPAR_SHEET_NAME || 'Vyapar Leads';

  if (!spreadsheetId) {
    throw new Error(
      'Spreadsheet configuration missing. Set GOOGLE_SHEETS_SPREADSHEET_ID in backend environment.'
    );
  }

  const sheets = getSheetsClient();
  const spreadsheetMeta = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: 'sheets(properties(title))'
  });
  const sheetTitles = (spreadsheetMeta.data.sheets || [])
    .map((sheet) => sheet.properties?.title)
    .filter((title): title is string => Boolean(title));
  const targetSheetTitle = sheetTitles.includes(configuredSheetName)
    ? configuredSheetName
    : sheetTitles[0];

  if (!targetSheetTitle) {
    throw new Error('No worksheets found in target spreadsheet.');
  }

  const escapedSheetName = targetSheetTitle.replace(/'/g, "''");
  const range = `'${escapedSheetName}'!A:G`;

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [
        [
          payload.submittedAt,
          payload.fullName,
          payload.mobile,
          payload.businessType,
          payload.device,
          payload.language,
          payload.upgradeTimeline
        ]
      ]
    }
  });
};
