import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { addresses } = req.body;
  
  if (!addresses || !Array.isArray(addresses)) {
    return res.status(400).json({ error: 'addresses array is required' });
  }

  const KAKAO_API_KEY = process.env.VITE_KAKAO_REST_API_KEY || process.env.KAKAO_REST_API_KEY;
  
  if (!KAKAO_API_KEY) {
    return res.status(500).json({ error: 'Server configuration error: Kakao API key is missing' });
  }

  try {
    const results = await Promise.all(
      addresses.map(async (item: any) => {
        const query = encodeURIComponent(item.address);
        const response = await fetch(`https://dapi.kakao.com/v2/local/search/address.json?query=${query}`, {
          headers: {
            Authorization: `KakaoAK ${KAKAO_API_KEY}`,
          },
        });
        const data = await response.json();
        
        if (data.documents && data.documents.length > 0) {
          return {
            ...item,
            lat: parseFloat(data.documents[0].y),
            lng: parseFloat(data.documents[0].x),
            geocoded: true
          };
        }
        
        return { ...item, geocoded: false };
      })
    );

    res.status(200).json({ results });
  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({ error: 'Failed to geocode addresses' });
  }
}
