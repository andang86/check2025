import { google } from 'googleapis';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    // 환경 변수에서 관리자 비밀번호 가져오기
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const { password } = req.body;

    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const auth = new google.auth.GoogleAuth({ /* ... 이전과 동일한 인증 정보 ... */ });
    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Sheet1',
    });

    const rows = response.data.values || [];
    // 첫 행(헤더)은 건너뛰고 데이터 가공
    const data = rows.slice(1).map(row => ({
        timestamp: row[0],
        chapterName: row[1],
        checklistData: JSON.parse(row[2] || '{}'), // JSON 문자열을 객체로 변환
    }));

    res.status(200).json(data);
}
