import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  // 비밀번호 인증은 그대로 유지
  if (req.body.password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { data, error } = await supabase
    .from('submissions') // 테이블 이름
    .select('*'); // 모든 데이터 조회

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
}
