import { createServer } from 'node:http';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { crudModules, settingsModule } from '../src/data/crudConfig.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', 'data');
const dbPath = join(dataDir, 'gym-system.sqlite');
const port = Number(process.env.API_PORT || 4174);
const jwtSecret = process.env.JWT_SECRET || 'stamina-os-local-secret';

const moduleConfigs = {
  ...crudModules,
  Settings: settingsModule,
};

mkdirSync(dataDir, { recursive: true });

const db = new DatabaseSync(dbPath);
db.exec(`
  CREATE TABLE IF NOT EXISTS records (
    id TEXT PRIMARY KEY,
    module TEXT NOT NULL,
    payload TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_records_module ON records(module);

  CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    module TEXT NOT NULL,
    record_id TEXT,
    action TEXT NOT NULL,
    summary TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_audit_logs_module ON audit_logs(module);

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

const countByModule = db.prepare('SELECT COUNT(*) AS total FROM records WHERE module = ?');
const insertRecord = db.prepare(`
  INSERT INTO records (id, module, payload, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?)
`);
const insertAudit = db.prepare(`
  INSERT INTO audit_logs (id, module, record_id, action, summary, created_at)
  VALUES (?, ?, ?, ?, ?, ?)
`);
const userCount = db.prepare('SELECT COUNT(*) AS total FROM users').get().total;

if (userCount === 0) {
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO users (id, name, email, password_hash, role, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    'user-manager',
    'Manager',
    'manager@titangym.local',
    bcrypt.hashSync('manager', 12),
    'Manager',
    now,
  );
}

for (const [moduleKey, config] of Object.entries(moduleConfigs)) {
  const existing = countByModule.get(moduleKey).total;

  if (existing === 0) {
    for (const row of config.seed) {
      const now = new Date().toISOString();
      insertRecord.run(row.id, moduleKey, JSON.stringify(row), now, now);
    }
  }
}

function parseAmount(value) {
  return Number(String(value).replace(/[^0-9.-]/g, ''));
}

const financialRows = db.prepare('SELECT * FROM records WHERE module = ?').all('Financials');

for (const row of financialRows) {
  const record = JSON.parse(row.payload);

  if (typeof record.amount === 'string') {
    const amount = parseAmount(record.amount);

    if (Number.isFinite(amount)) {
      record.amount = amount;
      db.prepare('UPDATE records SET payload = ? WHERE id = ?').run(JSON.stringify(record), row.id);
    }
  }
}

function sendJson(response, statusCode, payload) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(payload));
}

function sendJsonWithCookie(response, statusCode, payload, cookie) {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    'Set-Cookie': cookie,
  });
  response.end(JSON.stringify(payload));
}

function parseBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk;
    });

    request.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

function rowToRecord(row) {
  return {
    ...JSON.parse(row.payload),
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function getModuleKey(pathParts) {
  return decodeURIComponent(pathParts[2] || '');
}

function parseCookies(request) {
  const cookieHeader = request.headers.cookie || '';

  return cookieHeader.split(';').reduce((cookies, cookie) => {
    const [key, ...valueParts] = cookie.trim().split('=');

    if (key) {
      cookies[key] = decodeURIComponent(valueParts.join('='));
    }

    return cookies;
  }, {});
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function signAuthCookie(user) {
  const token = jwt.sign(publicUser(user), jwtSecret, { expiresIn: '8h' });
  return `stamina_token=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${8 * 60 * 60}`;
}

function clearAuthCookie() {
  return 'stamina_token=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0';
}

function getCurrentUser(request) {
  const token = parseCookies(request).stamina_token;

  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, jwtSecret);
  } catch {
    return null;
  }
}

function normalizePayload(config, payload) {
  return config.fields.reduce((values, field) => {
    if (field.type === 'number') {
      values[field.key] = parseAmount(payload[field.key]);
      return values;
    }

    values[field.key] = String(payload[field.key] || '').trim();
    return values;
  }, {});
}

function validatePayload(moduleKey, config, payload, existingRecordId = '') {
  const nextPayload = normalizePayload(config, payload);
  const missingField = config.fields.find((field) => !nextPayload[field.key]);

  if (missingField) {
    return { error: `${missingField.label} is required` };
  }

  const invalidNumberField = config.fields.find((field) => (
    field.type === 'number' && (!Number.isFinite(nextPayload[field.key]) || nextPayload[field.key] <= 0)
  ));

  if (invalidNumberField) {
    return { error: `${invalidNumberField.label} must be a positive number` };
  }

  const duplicateName = db
    .prepare("SELECT id FROM records WHERE module = ? AND json_extract(payload, '$.name') = ? AND id != ?")
    .get(moduleKey, nextPayload.name, existingRecordId);

  if (duplicateName) {
    return { error: 'Name already exists' };
  }

  return { payload: nextPayload };
}

function writeAudit(moduleKey, recordId, action, summary) {
  insertAudit.run(
    `audit-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    moduleKey,
    recordId,
    action,
    summary,
    new Date().toISOString(),
  );
}

const server = createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    sendJson(response, 204, {});
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host}`);
  const pathParts = url.pathname.split('/').filter(Boolean);

  if (url.pathname === '/api/health') {
    sendJson(response, 200, { ok: true, database: dbPath });
    return;
  }

  if (url.pathname === '/api/auth/login' && request.method === 'POST') {
    try {
      const payload = await parseBody(request);
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(String(payload.email || '').trim());

      if (!user || !bcrypt.compareSync(String(payload.password || ''), user.password_hash)) {
        sendJson(response, 401, { error: 'Invalid email or password' });
        return;
      }

      writeAudit('Auth', user.id, 'login', user.email);
      sendJsonWithCookie(response, 200, { user: publicUser(user) }, signAuthCookie(user));
    } catch (error) {
      sendJson(response, 500, { error: error.message || 'Login failed' });
    }
    return;
  }

  if (url.pathname === '/api/auth/logout' && request.method === 'POST') {
    const currentUser = getCurrentUser(request);

    if (currentUser) {
      writeAudit('Auth', currentUser.id, 'logout', currentUser.email);
    }

    sendJsonWithCookie(response, 200, { ok: true }, clearAuthCookie());
    return;
  }

  if (url.pathname === '/api/auth/me' && request.method === 'GET') {
    const currentUser = getCurrentUser(request);

    if (!currentUser) {
      sendJson(response, 401, { error: 'Unauthorized' });
      return;
    }

    sendJson(response, 200, { user: currentUser });
    return;
  }

  if (pathParts[0] !== 'api' || pathParts[1] !== 'modules') {
    sendJson(response, 404, { error: 'Not found' });
    return;
  }

  const currentUser = getCurrentUser(request);

  if (!currentUser) {
    sendJson(response, 401, { error: 'Unauthorized' });
    return;
  }

  const moduleKey = getModuleKey(pathParts);
  const config = moduleConfigs[moduleKey];

  if (!config) {
    sendJson(response, 404, { error: 'Unknown module' });
    return;
  }

  try {
    if (pathParts[3] === 'records' && request.method === 'GET') {
      const rows = db.prepare('SELECT * FROM records WHERE module = ? ORDER BY updated_at DESC').all(moduleKey);
      sendJson(response, 200, rows.map(rowToRecord));
      return;
    }

    if (pathParts[3] === 'audit' && request.method === 'GET') {
      const logs = db
        .prepare('SELECT * FROM audit_logs WHERE module = ? ORDER BY created_at DESC LIMIT 20')
        .all(moduleKey);
      sendJson(response, 200, logs);
      return;
    }

    if (pathParts[3] === 'records' && request.method === 'POST') {
      const payload = await parseBody(request);
      const validation = validatePayload(moduleKey, config, payload);

      if (validation.error) {
        sendJson(response, 422, { error: validation.error });
        return;
      }

      const now = new Date().toISOString();
      const id = `${moduleKey.toLowerCase()}-${Date.now()}`;
      const record = { id, ...validation.payload };

      insertRecord.run(id, moduleKey, JSON.stringify(record), now, now);
      writeAudit(moduleKey, id, 'create', record.name || id);
      sendJson(response, 201, { ...record, createdAt: now, updatedAt: now });
      return;
    }

    if (pathParts[3] === 'records' && pathParts[4] && request.method === 'PUT') {
      const recordId = decodeURIComponent(pathParts[4]);
      const payload = await parseBody(request);
      const existing = db.prepare('SELECT * FROM records WHERE id = ? AND module = ?').get(recordId, moduleKey);

      if (!existing) {
        sendJson(response, 404, { error: 'Record not found' });
        return;
      }

      const validation = validatePayload(moduleKey, config, payload, recordId);

      if (validation.error) {
        sendJson(response, 422, { error: validation.error });
        return;
      }

      const now = new Date().toISOString();
      const nextRecord = { ...rowToRecord(existing), ...validation.payload, id: recordId };
      db.prepare('UPDATE records SET payload = ?, updated_at = ? WHERE id = ? AND module = ?')
        .run(JSON.stringify(nextRecord), now, recordId, moduleKey);
      writeAudit(moduleKey, recordId, 'update', nextRecord.name || recordId);
      sendJson(response, 200, { ...nextRecord, updatedAt: now });
      return;
    }

    if (pathParts[3] === 'records' && pathParts[4] && request.method === 'DELETE') {
      const recordId = decodeURIComponent(pathParts[4]);
      const existing = db.prepare('SELECT * FROM records WHERE id = ? AND module = ?').get(recordId, moduleKey);

      if (!existing) {
        sendJson(response, 404, { error: 'Record not found' });
        return;
      }

      db.prepare('DELETE FROM records WHERE id = ? AND module = ?').run(recordId, moduleKey);
      writeAudit(moduleKey, recordId, 'delete', rowToRecord(existing).name || recordId);
      sendJson(response, 200, { ok: true });
      return;
    }

    sendJson(response, 404, { error: 'Not found' });
  } catch (error) {
    sendJson(response, 500, { error: error.message || 'Server error' });
  }
});

server.listen(port, () => {
  console.log(`SQLite API running at http://localhost:${port}`);
  console.log(`Database: ${dbPath}`);
});
