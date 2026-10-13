import { list } from '@vercel/blob';

// Devolve a lista de produtos salva pelo painel. Se ainda não existir, devolve null
// e o site usa o arquivo data/produtos.json como lista inicial.
export default async function handler(req, res) {
  try {
    const { blobs } = await list({ prefix: 'config/produtos.json', limit: 1 });
    if (!blobs.length) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json({ produtos: null });
    }
    const r = await fetch(blobs[0].url + '?t=' + Date.now());
    const data = await r.json();
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ produtos: Array.isArray(data.produtos) ? data.produtos : null });
  } catch (e) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ produtos: null });
  }
}
