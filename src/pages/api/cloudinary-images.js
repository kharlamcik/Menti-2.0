import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { max_results = 30, next_cursor } = req.query;

    console.log('📡 Запрос к Cloudinary...'); // для отладки

    const result = await cloudinary.api.resources({
      resource_type: 'image',
      type: 'upload',
      max_results: parseInt(max_results),
      next_cursor: next_cursor || undefined,
      // prefix: 'quiz/',   // ← раскомментируй, если хочешь показывать только из папки quiz
    });

    console.log(`✅ Найдено изображений: ${result.resources?.length || 0}`);

    return res.status(200).json({
      resources: result.resources || [],
      next_cursor: result.next_cursor || null,
    });
  } catch (error) {
    console.error('❌ Cloudinary API Error:', error);
    return res.status(500).json({
      error: 'Не удалось загрузить изображения из Cloudinary'
    });
  }
}