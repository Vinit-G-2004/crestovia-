import { isAuthed } from '../../lib/auth';
import { getState, setState } from '../../lib/db';

export const config = {
  api: { bodyParser: { sizeLimit: '6mb' } },
};

export default async function handler(req, res) {
  if (!isAuthed(req)) return res.status(401).json({ error: 'Not authenticated' });

  try {
    if (req.method === 'GET') {
      const data = await getState();
      return res.status(200).json({ data });
    }
    if (req.method === 'POST') {
      await setState(req.body);
      return res.status(200).json({ ok: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Database error' });
  }
}
