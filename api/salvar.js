import { put } from '@vercel/blob';
import { timingSafeEqual } from 'node:crypto';

function senhaOk(valor) {
  const a = Buffer.from(String(valor || ''));
  const b = Buffer.from(process.env.ADMIN_PASSWORD || '');
  return b.length > 0 && a.length === b.length && timingSafeEqual(a, b);
}

function texto(v, max) {
  return String(v == null ? '' : v).trim().slice(0, max);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });
  if (!senhaOk(req.headers['x-admin-password'])) return res.status(401).json({ erro: 'Senha incorreta' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};
  if (body.check) return res.status(200).json({ ok: true });

  if (!Array.isArray(body.produtos) || body.produtos.length > 60) {
    return res.status(400).json({ erro: 'Lista inválida' });
  }
  const produtos = [];
  for (const p of body.produtos) {
    const nome = texto(p && p.nome, 80);
    if (!nome) continue;
    let imagem = texto(p.imagem, 500);
    if (imagem && !/^(https:\/\/|assets\/)/.test(imagem)) imagem = '';
    produtos.push({
      nome,
      descricao: texto(p.descricao, 200),
      imagem,
      preco: texto(p.preco, 30),
      disponivel: p.disponivel !== false
    });
  }

  try {
    await put('config/produtos.json', JSON.stringify({ produtos }), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
      cacheControlMaxAge: 60
    });
    return res.status(200).json({ ok: true, total: produtos.length });
  } catch (e) {
    return res.status(500).json({ erro: 'Não foi possível salvar. Confira se o Blob está conectado ao projeto.' });
  }
}
