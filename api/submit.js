import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  const { chapterName, checklistData } = req.body;

  const { error } = await supabase
    .from('submissions') // 테이블 이름
    .insert([{ chapterName, checklistData }]); // 저장할 데이터

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ message: 'Success' });
}
