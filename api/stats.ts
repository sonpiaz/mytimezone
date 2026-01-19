import { kv } from '@vercel/kv';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const today = new Date().toISOString().split('T')[0];
  const key = `visitors:${today}`;
  
  try {
    if (request.method === 'POST') {
      const count = await kv.incr(key);
      await kv.expire(key, 60 * 60 * 24 * 7);
      await kv.incr('visitors:total');
      
      return new Response(JSON.stringify({ today: count }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // GET - just read
    const count = (await kv.get<number>(key)) || 0;
    return new Response(JSON.stringify({ today: count }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ today: 0 }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
