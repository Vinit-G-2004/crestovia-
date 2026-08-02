import fs from 'fs';
import path from 'path';

export async function getServerSideProps({ res }) {
  const filePath = path.join(process.cwd(), 'public', 'dashboard.html');
  const html = fs.readFileSync(filePath, 'utf8');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.write(html);
  res.end();
  return { props: {} };
}

export default function Index() {
  return null;
}
