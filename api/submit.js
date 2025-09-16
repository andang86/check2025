import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 생성
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  // 1. POST 요청이 맞는지 확인
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'POST 요청만 허용됩니다.' });
  }

  try {
    // 2. (⭐핵심 수정) req.body가 비어있는지 먼저 확인하는 안전장치 추가
    if (!req.body) {
      return res.status(400).json({ message: '전송된 데이터가 없습니다.' });
    }
    
    // 3. req.body에서 데이터 추출
    const { chapterName, checklistData } = req.body;

    // 4. Supabase에 데이터 삽입
    const { error } = await supabase
      .from('submissions') // Supabase에 만든 테이블 이름
      .insert([
        { 
          chapterName: chapterName, 
          checklistData: checklistData 
        }
      ]);

    // 5. Supabase에서 에러가 발생했는지 확인
    if (error) {
      // Supabase 에러를 로그에 기록하여 Vercel에서 확인할 수 있도록 함
      console.error('Supabase Error:', error);
      throw new Error(error.message);
    }

    // 6. 성공 응답 전송
    return res.status(200).json({ message: '성공적으로 제출되었습니다.' });

  } catch (error) {
    // 7. 예상치 못한 다른 에러 처리
    console.error('Server Error:', error);
    return res.status(500).json({ message: '서버 내부 오류가 발생했습니다.', error: error.message });
  }
}
