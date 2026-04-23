import { useEffect, useMemo, useState } from 'react';

async function requestJson(url, options) {
  let response;

  try {
    response = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
  } catch {
    throw new Error('Backend offline');
  }

  const rawPayload = await response.text();
  let payload = {};

  if (rawPayload) {
    try {
      payload = JSON.parse(rawPayload);
    } catch {
      throw new Error(response.ok ? 'Invalid server response' : 'Backend unavailable');
    }
  }

  if (!response.ok) {
    throw new Error(payload.error || 'Request failed');
  }

  return payload;
}

export function useCrudStore(moduleKey, seedRows = []) {
  const [rows, setRows] = useState(seedRows);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [auditLogs, setAuditLogs] = useState([]);

  const apiBase = `/api/modules/${encodeURIComponent(moduleKey)}/records`;
  const auditBase = `/api/modules/${encodeURIComponent(moduleKey)}/audit`;

  const loadRows = async () => {
    setLoading(true);
    setError('');

    try {
      const nextRows = await requestJson(apiBase);
      setRows(nextRows);
    } catch (requestError) {
      setRows(seedRows);
      setError(requestError.message === 'Failed to fetch' ? 'Backend offline' : requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAuditLogs = async () => {
    try {
      const nextLogs = await requestJson(auditBase);
      setAuditLogs(nextLogs);
    } catch {
      setAuditLogs([]);
    }
  };

  useEffect(() => {
    loadRows();
    loadAuditLogs();
  }, [apiBase, auditBase, seedRows]);

  const metrics = useMemo(() => {
    const activeRows = rows.filter((row) => !/pending|service|waitlist|due/i.test(row.status || ''));
    const attentionRows = rows.length - activeRows.length;

    return {
      total: rows.length,
      active: activeRows.length,
      attention: attentionRows,
    };
  }, [rows]);

  const createRow = async (payload) => {
    setSaving(true);
    setError('');

    try {
      const createdRow = await requestJson(apiBase, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setRows((currentRows) => [createdRow, ...currentRows]);
      loadAuditLogs();
      return createdRow;
    } catch (requestError) {
      setError(requestError.message === 'Failed to fetch' ? 'Backend offline' : requestError.message);
      throw requestError;
    } finally {
      setSaving(false);
    }
  };

  const updateRow = async (rowId, payload) => {
    setSaving(true);
    setError('');

    try {
      const updatedRow = await requestJson(`${apiBase}/${encodeURIComponent(rowId)}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      setRows((currentRows) => currentRows.map((row) => (row.id === rowId ? updatedRow : row)));
      loadAuditLogs();
      return updatedRow;
    } catch (requestError) {
      setError(requestError.message === 'Failed to fetch' ? 'Backend offline' : requestError.message);
      throw requestError;
    } finally {
      setSaving(false);
    }
  };

  const deleteRow = async (rowId) => {
    setSaving(true);
    setError('');

    try {
      await requestJson(`${apiBase}/${encodeURIComponent(rowId)}`, {
        method: 'DELETE',
      });
      setRows((currentRows) => currentRows.filter((row) => row.id !== rowId));
      loadAuditLogs();
    } catch (requestError) {
      setError(requestError.message === 'Failed to fetch' ? 'Backend offline' : requestError.message);
      throw requestError;
    } finally {
      setSaving(false);
    }
  };

  return {
    rows,
    auditLogs,
    metrics,
    loading,
    saving,
    error,
    reloadRows: loadRows,
    createRow,
    updateRow,
    deleteRow,
  };
}
