import { google } from 'googleapis';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { chapterName, checklistData } = req.body;

    const auth = new google.auth.GoogleAuth({ /* ... 이전과 동일한 인증 정보 ... */ });
    const sheets = google.sheets({ version: 'v4', auth });

    const timestamp = new Date().toLocaleString("ko-KR");
    // 데이터를 하나의 JSON 문자열로 저장하여 열 개수 문제 방지
    const row = [timestamp, chapterName, JSON.stringify(checklistData)];

    await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Sheet1!A1',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [row] },
    });

    res.status(200).json({ message: 'Success' });
}
