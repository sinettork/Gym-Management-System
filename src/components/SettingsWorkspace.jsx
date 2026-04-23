import { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, RefreshCw, Search } from 'lucide-react';
import { useCrudStore } from '../hooks/useCrudStore';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const ownerOptions = ['Manager', 'Front desk', 'Admin'];
const statusOptions = ['Active', 'Paused', 'Disabled'];

export default function SettingsWorkspace({ config }) {
  const { rows, loading, saving, error, reloadRows, updateRow } = useCrudStore('Settings', config.seed);
  const [query, setQuery] = useState('');
  const [drafts, setDrafts] = useState({});
  const [lastSaved, setLastSaved] = useState('');

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return rows;
    }

    return rows.filter((row) => (
      [row.name, row.value, row.owner, row.status].some((value) => String(value || '').toLowerCase().includes(normalizedQuery))
    ));
  }, [query, rows]);

  const getDraft = (row) => drafts[row.id] || row;

  const updateDraft = (row, key, value) => {
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [row.id]: {
        ...getDraft(row),
        [key]: value,
      },
    }));
  };

  const saveSetting = async (row) => {
    const draft = getDraft(row);
    await updateRow(row.id, {
      name: draft.name,
      value: draft.value,
      owner: draft.owner,
      status: draft.status,
    });
    setDrafts((currentDrafts) => {
      const nextDrafts = { ...currentDrafts };
      delete nextDrafts[row.id];
      return nextDrafts;
    });
    setLastSaved('Saved');
  };

  return (
    <section className="animate-fade-in-up">
      <div className="glass-card overflow-hidden rounded-[1.75rem]">
        <div className="flex flex-col gap-4 border-b border-surface-container px-card-padding py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <Badge>{rows.length} settings</Badge>
            {lastSaved && (
              <Badge variant="success">
                <CheckCircle2 className="h-4 w-4" />
                {lastSaved}
              </Badge>
            )}
            {error && (
              <Badge variant="error">
                <AlertCircle className="h-4 w-4" />
                {error}
              </Badge>
            )}
          </div>

          <div className="flex flex-col gap-3 lg:ml-auto lg:flex-row lg:items-center">
            <label className="relative w-full lg:w-80">
              <span className="sr-only">Search {config.title}</span>
              <Search className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-zinc-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="text"
                placeholder="Search settings..."
                className="w-full rounded-pill border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-zinc-900 shadow-sm transition-all placeholder:text-zinc-400 focus:border-primary-container focus:outline-none focus:ring-2 focus:ring-primary-container/50"
              />
            </label>
            <Button type="button" onClick={reloadRows} variant="surface" size="icon" aria-label="Sync settings">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 p-card-padding">
            {[0, 1].map((item) => (
              <div key={item} className="h-32 animate-pulse rounded-[1.5rem] bg-surface" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 p-card-padding">
            {filteredRows.map((row) => {
              const draft = getDraft(row);
              const isDirty = JSON.stringify(draft) !== JSON.stringify(row);

              return (
                <div key={row.id} className="rounded-[1.5rem] bg-surface p-5">
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_1fr_0.8fr_0.8fr_auto] lg:items-end">
                    <label>
                      <span className="mb-2 block font-label text-label-sm font-bold uppercase text-on-surface-variant">Setting</span>
                      <Input value={draft.name} onChange={(event) => updateDraft(row, 'name', event.target.value)} />
                    </label>

                    <label>
                      <span className="mb-2 block font-label text-label-sm font-bold uppercase text-on-surface-variant">Value</span>
                      <Input value={draft.value} onChange={(event) => updateDraft(row, 'value', event.target.value)} />
                    </label>

                    <label>
                      <span className="mb-2 block font-label text-label-sm font-bold uppercase text-on-surface-variant">Owner</span>
                      <Select value={draft.owner} onValueChange={(value) => updateDraft(row, 'owner', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ownerOptions.map((option) => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </label>

                    <label>
                      <span className="mb-2 block font-label text-label-sm font-bold uppercase text-on-surface-variant">Status</span>
                      <Select value={draft.status} onValueChange={(value) => updateDraft(row, 'status', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </label>

                    <Button type="button" disabled={!isDirty || saving} onClick={() => saveSetting(row)}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                      Save
                    </Button>
                  </div>
                </div>
              );
            })}

            {filteredRows.length === 0 && (
              <div className="py-12 text-center">
                <p className="font-headline text-headline-md font-semibold text-on-surface">No settings found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
