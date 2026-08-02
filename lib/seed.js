import crypto from 'crypto';

export function uid() {
  return 'id_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function sha256(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

export const DEFAULT_ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
export const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Crestovia@2026';

// Builds the initial dataset the very first time the database is used.
// Change the admin credentials afterwards from Settings inside the app,
// or by setting ADMIN_USERNAME / ADMIN_PASSWORD before the first login.
export function seedState() {
  const clientId = uid();
  const projects = ['Siddhi Aspire', 'Green One', 'Abri Crystal', 'Royal Complex', 'Airavat', 'Aurum Abir'];
  return {
    settings: {
      companyName: 'Crestovia',
      tagline: 'Digital Marketing Agency',
      ownerName: '',
      email: '',
      phone: '',
      address: 'Pune, Maharashtra',
      gstin: '',
      bankDetails: '',
      invoicePrefix: 'CRV',
      nextInvoiceNo: 1,
      taxRate: 18,
      auth: {
        username: DEFAULT_ADMIN_USERNAME,
        passwordHash: sha256(DEFAULT_ADMIN_PASSWORD),
      },
    },
    clients: [
      { id: clientId, name: 'Pinecliff Realty', contactPerson: '', email: '', phone: '', createdAt: Date.now() },
    ],
    projects: projects.map((p) => ({ id: uid(), clientId, name: p, createdAt: Date.now() })),
    expenses: [],
    payments: [],
    invoices: [],
    dailyLog: [],
  };
}
