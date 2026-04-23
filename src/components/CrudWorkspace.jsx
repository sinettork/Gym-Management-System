import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Edit3, Loader2, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import { useCrudStore } from '../hooks/useCrudStore';
import { currencyFormat } from '../lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogActionButton,
  AlertDialogCancel,
  AlertDialogCancelButton,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

function createEmptyForm(fields) {
  return fields.reduce((values, field) => ({ ...values, [field.key]: '' }), {});
}

function StatusChip({ value }) {
  const needsAttention = /pending|service|waitlist|due|risk/i.test(value || '');

  return (
    <Badge variant={needsAttention ? 'error' : 'success'}>
      {value || 'Active'}
    </Badge>
  );
}

function formatCellValue(column, value) {
  if (column.format === 'currency') {
    return currencyFormat(value);
  }

  return value;
}

function DeleteRecordDialog({ row, onDelete, trigger }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-[460px] gap-7 rounded-[2rem] px-8 py-9 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-error-container text-error">
          <Trash2 className="h-10 w-10" strokeWidth={2.25} />
        </div>
        <AlertDialogHeader className="items-center space-y-3">
          <AlertDialogTitle className="text-[24px] leading-8">Delete record?</AlertDialogTitle>
          <AlertDialogDescription className="max-w-sm text-base leading-6">
            {row.name} will be removed. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AlertDialogCancelButton className="h-14 border border-error bg-white text-error hover:bg-error-container">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogCancelButton>
          <AlertDialogActionButton className="h-14 bg-error text-on-error shadow-sm">
            <AlertDialogAction onClick={() => onDelete(row)}>Delete</AlertDialogAction>
          </AlertDialogActionButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function CrudWorkspace({ moduleKey, config, requestedAction, onActionHandled }) {
  const { rows, metrics, loading, saving, error, reloadRows, createRow, updateRow, deleteRow } = useCrudStore(moduleKey, config.seed);
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('idle');
  const [editingRow, setEditingRow] = useState(null);
  const [lastSaved, setLastSaved] = useState('');
  const [formError, setFormError] = useState('');
  const [formValues, setFormValues] = useState(() => createEmptyForm(config.fields));

  useEffect(() => {
    setQuery('');
    setMode('idle');
    setEditingRow(null);
    setLastSaved('');
    setFormError('');
    setFormValues(createEmptyForm(config.fields));
  }, [config, moduleKey]);

  useEffect(() => {
    if (requestedAction !== 'create') {
      return;
    }

    setMode('create');
    setEditingRow(null);
    setFormValues(createEmptyForm(config.fields));
    onActionHandled();
  }, [config.fields, requestedAction, onActionHandled]);

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return rows;
    }

    return rows.filter((row) => (
      Object.values(row).some((value) => String(value).toLowerCase().includes(normalizedQuery))
    ));
  }, [query, rows]);

  const openCreate = () => {
    setMode('create');
    setEditingRow(null);
    setFormError('');
    setFormValues(config.fields.reduce((values, field) => ({
      ...values,
      [field.key]: field.type === 'select' ? field.options[0] : '',
    }), {}));
  };

  const openEdit = (row) => {
    setMode('edit');
    setEditingRow(row);
    setFormError('');
    setFormValues(config.fields.reduce((values, field) => ({ ...values, [field.key]: row[field.key] || '' }), {}));
  };

  const closeForm = () => {
    setMode('idle');
    setEditingRow(null);
    setFormError('');
    setFormValues(createEmptyForm(config.fields));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (mode === 'edit' && editingRow) {
        await updateRow(editingRow.id, formValues);
        setLastSaved('Saved');
      } else {
        await createRow(formValues);
        setLastSaved('Created');
      }

      closeForm();
    } catch (submitError) {
      setFormError(submitError.message);
    }
  };

  const handleDelete = async (row) => {
    await deleteRow(row.id);
    setLastSaved('Deleted');
  };

  return (
    <section className="animate-fade-in-up">
      <div className="glass-card overflow-hidden rounded-[1.75rem]">
        <div className="flex flex-col gap-4 border-b border-surface-container px-card-padding py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
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
                placeholder={`Search ${config.title.toLowerCase()}...`}
                className="w-full rounded-pill border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-zinc-900 shadow-sm transition-all placeholder:text-zinc-400 focus:border-primary-container focus:outline-none focus:ring-2 focus:ring-primary-container/50"
              />
            </label>
            <Button
              type="button"
              onClick={reloadRows}
              variant="surface"
              size="icon"
              aria-label="Sync records"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button type="button" onClick={openCreate} disabled={saving}>
              <Plus className="h-4 w-4" />
              {config.action}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-3 px-card-padding py-6">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-16 animate-pulse rounded-3xl bg-surface" />
            ))}
          </div>
        ) : (
          <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[720px] text-left">
              <thead className="bg-surface">
                <tr>
                  {config.columns.map((column) => (
                    <th key={column.key} className="px-6 py-4 font-label text-label-sm font-bold uppercase text-on-surface-variant">
                      {column.label}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-right font-label text-label-sm font-bold uppercase text-on-surface-variant">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {filteredRows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-surface/70">
                    {config.columns.map((column) => (
                      <td key={column.key} className="px-6 py-4 text-sm font-semibold text-on-surface">
                        {column.key === 'status' ? <StatusChip value={row[column.key]} /> : formatCellValue(column, row[column.key])}
                      </td>
                    ))}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          onClick={() => openEdit(row)}
                          variant="surface"
                          size="icon"
                          aria-label={`Edit ${row.name}`}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <DeleteRecordDialog
                          row={row}
                          onDelete={handleDelete}
                          trigger={(
                            <Button type="button" variant="danger" size="icon" aria-label={`Delete ${row.name}`}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-3 p-4 md:hidden">
            {filteredRows.map((row) => (
              <div key={row.id} className="rounded-[1.5rem] bg-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-headline text-lg font-bold text-on-surface">{row.name}</p>
                    <p className="mt-1 text-sm font-semibold text-on-surface-variant">
                      {config.columns.filter((column) => column.key !== 'name' && column.key !== 'status').slice(0, 2).map((column) => formatCellValue(column, row[column.key])).join(' • ')}
                    </p>
                  </div>
                  <StatusChip value={row.status} />
                </div>
                <div className="mt-4 flex gap-2">
                  <Button type="button" variant="surface" size="sm" onClick={() => openEdit(row)}>
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </Button>
                  <DeleteRecordDialog
                    row={row}
                    onDelete={handleDelete}
                    trigger={(
                      <Button type="button" variant="danger" size="sm">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
          </>
        )}

        {!loading && filteredRows.length === 0 && (
          <div className="px-card-padding py-12 text-center">
            <p className="font-headline text-headline-md font-semibold text-on-surface">No records found</p>
          </div>
        )}

      </div>

      <Dialog open={mode !== 'idle'} onOpenChange={(open) => !open && closeForm()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{mode === 'edit' ? `Edit ${config.entityLabel}` : `Create ${config.entityLabel}`}</DialogTitle>
            <DialogDescription>{config.title}</DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {formError && (
              <Badge variant="error" className="w-fit">
                <AlertCircle className="h-4 w-4" />
                {formError}
              </Badge>
            )}
            {config.fields.map((field) => (
              <label key={field.key} className="block">
                <span className="mb-2 block font-label text-label-sm font-bold uppercase text-on-surface-variant">{field.label}</span>
                {field.type === 'select' ? (
                  <Select
                    value={formValues[field.key]}
                    onValueChange={(value) => setFormValues((values) => ({ ...values, [field.key]: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={formValues[field.key]}
                    onChange={(event) => setFormValues((values) => ({ ...values, [field.key]: event.target.value }))}
                    type={field.type === 'number' ? 'number' : 'text'}
                    placeholder={field.placeholder}
                    required
                  />
                )}
              </label>
            ))}
            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button type="button" variant="surface" onClick={closeForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                {saving ? 'Saving...' : mode === 'edit' ? 'Save changes' : `Create ${config.entityLabel}`}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
