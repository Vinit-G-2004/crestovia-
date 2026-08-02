import { getState } from '../../lib/db';
import { sha256 } from '../../lib/seed';
import { createSessionCookie } from '../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ ok: false, error: 'User ID and password are required.' });
    }
    const data = await getState();
    const auth = (data && data.settings && data.settings.auth) || {};
    if (username === auth.username && sha256(password) === auth.passwordHash) {
      res.setHeader('Set-Cookie', createSessionCookie());
      return res.status(200).json({ ok: true });
    }
    return res.status(401).json({ ok: false, error: 'Incorrect user ID or password.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'Server error — check the database connection.' });
  }
}
