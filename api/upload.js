import { put } from '@vercel/blob';
import { timingSafeEqual } from 'node:crypto';

function senhaOk(valor) {
  const a = Buffer.from(String(valor || ''));
  const b = Buffer.from(process.env.ADMIN_PASSWORD || '');
  return b.length > 0 && a.length === b.length && timingSafeEqual(a, b);
}

// Recebe a foto já reduzida pelo painel (JPEG) e guarda no Blob.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });
  if (!senhaOk(req.headers['x-admin-password'])) return res.status(401).json({ erro: 'Senha incorreta' });

  const corpo = req.body;
  if (!Buffer.isBuffer(corpo) || corpo.length === 0 || corpo.length > 4 * 1024 * 1024) {
    return res.status(400).json({ erro: 'Foto inválida ou grande demais' });
  }
  const nome = String((req.query && req.query.nome) || 'produto')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'produto';

  try {
    const blob = await put('produtos/' + nome + '.jpg', corpo, {
      access: 'public',
      addRandomSuffix: true,
      contentType: 'image/jpeg'
    });
    return res.status(200).json({ url: blob.url });
  } catch (e) {
    return res.status(500).json({ erro: 'Não foi possível enviar a foto.' });
  }
}
