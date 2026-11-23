import React, { useEffect, useState } from 'react';
import { Edit3, Plus, Trash2, Upload, X } from 'lucide-react';
import { API_URL, apiFetch } from '../api/client';

const EMPTY_FORM = {
  code: '',
  name: '',
  subtitle: '',
  description: '',
  department: '',
  equipmentType: '',
  location: '',
  requiresApproval: false,
  maxHours: 4,
  rules: '',
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Imaginea nu a putut fi citită.'));
    reader.readAsDataURL(file);
  });
}

export default function AdminResources() {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  const loadResources = async () => {
    setLoading(true);
    try {
      setResources(await apiFetch('/resources'));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const updateField = (event) => {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const startCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSelectedImage(null);
    setError('');
    setFeedback('');
  };

  const startEdit = (resource) => {
    setEditingId(resource.id);
    setForm({
      code: resource.code,
      name: resource.name,
      subtitle: resource.subtitle,
      description: resource.description,
      department: resource.department,
      equipmentType: resource.equipmentType,
      location: resource.location,
      requiresApproval: resource.requiresApproval,
      maxHours: resource.maxHours,
      rules: (resource.rules || []).join('\n'),
    });
    setSelectedImage(null);
    setError('');
    setFeedback('');
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    setError('');
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError('Alege o imagine JPEG, PNG sau WebP.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError('Imaginea trebuie să aibă maximum 5 MB.');
      return;
    }
    try {
      setSelectedImage({ file, dataUrl: await readImageAsDataUrl(file) });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setFeedback('');
    const payload = {
      ...form,
      code: form.code.trim().toUpperCase(),
      maxHours: Number(form.maxHours),
      rules: form.rules.split('\n').map((rule) => rule.trim()).filter(Boolean),
    };

    try {
      let saved;
      if (editingId) {
        saved = await apiFetch(`/resources/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        saved = await apiFetch('/resources', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      if (selectedImage) {
        await apiFetch(`/resources/${saved.id}/image`, {
          method: 'PUT',
          body: JSON.stringify({
            mimeType: selectedImage.file.type,
            data: selectedImage.dataUrl.split(',')[1],
          }),
        });
      }

      await loadResources();
      setSelectedImage(null);
      setFeedback(editingId ? 'Resursa a fost actualizată.' : 'Resursa a fost creată.');
      if (!editingId) {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setError('');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (resource) => {
    if (!window.confirm(`Ștergi resursa „${resource.name}” (${resource.code})?\n\nToate rezervările asociate vor fi șterse definitiv.`)) return;
    setDeletingId(resource.id);
    setError('');
    setFeedback('');
    try {
      await apiFetch(`/resources/${resource.id}`, { method: 'DELETE' });
      setResources((current) => current.filter((item) => item.id !== resource.id));
      if (editingId === resource.id) startCreate();
      setFeedback(`Resursa ${resource.code} și rezervările asociate au fost șterse.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId('');
    }
  };

  const inputClass = 'w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1D1464]/20';
  const labelClass = 'block text-xs font-semibold text-slate-700 mb-1.5';
  const editingResource = resources.find((resource) => resource.id === editingId);
  const previewUrl = selectedImage?.dataUrl ||
    (editingResource?.hasImage ? `${API_URL}/resources/${editingResource.id}/image` : null);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-xs font-bold tracking-wider text-[#3729A6] uppercase">ADMINISTRAREA RESURSELOR</div>
      <h1 className="text-3xl font-bold text-slate-900 mt-1">Administrare resurse</h1>
      <p className="text-sm text-slate-500 mt-1">Creează, editează și șterge resurse, inclusiv fotografiile asociate.</p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">{editingId ? 'Editează resursa' : 'Adaugă o resursă'}</h2>
            {editingId && (
              <button type="button" onClick={startCreate} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800">
                <X className="w-4 h-4" /> Anulează editarea
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label htmlFor="resource-code" className={labelClass}>Cod</label><input id="resource-code" name="code" value={form.code} onChange={updateField} placeholder="Ex.: N07" required pattern="[A-Za-z0-9-]+" className={inputClass} /></div>
            <div><label htmlFor="resource-name" className={labelClass}>Nume</label><input id="resource-name" name="name" value={form.name} onChange={updateField} required className={inputClass} /></div>
            <div><label htmlFor="resource-subtitle" className={labelClass}>Descriere scurtă</label><input id="resource-subtitle" name="subtitle" value={form.subtitle} onChange={updateField} required className={inputClass} /></div>
            <div><label htmlFor="resource-department" className={labelClass}>Departament</label><input id="resource-department" name="department" value={form.department} onChange={updateField} required className={inputClass} /></div>
            <div><label htmlFor="resource-type" className={labelClass}>Tip echipament</label><input id="resource-type" name="equipmentType" value={form.equipmentType} onChange={updateField} required className={inputClass} /></div>
            <div><label htmlFor="resource-location" className={labelClass}>Locație</label><input id="resource-location" name="location" value={form.location} onChange={updateField} required className={inputClass} /></div>
            <div className="md:col-span-2"><label htmlFor="resource-description" className={labelClass}>Descriere completă</label><textarea id="resource-description" name="description" value={form.description} onChange={updateField} rows={3} required className={inputClass} /></div>
            <div><label htmlFor="resource-max-hours" className={labelClass}>Durata maximă (ore)</label><input id="resource-max-hours" name="maxHours" type="number" min="1" max="24" value={form.maxHours} onChange={updateField} required className={inputClass} /></div>
            <div className="flex items-center pt-6"><label className="inline-flex items-center gap-2 text-sm text-slate-700"><input name="requiresApproval" type="checkbox" checked={form.requiresApproval} onChange={updateField} className="rounded border-slate-300 text-[#1D1464]" />Necesită aprobare</label></div>
            <div className="md:col-span-2"><label htmlFor="resource-rules" className={labelClass}>Reguli (câte una pe rând)</label><textarea id="resource-rules" name="rules" value={form.rules} onChange={updateField} rows={3} className={inputClass} /></div>

            {error && <p role="alert" className="md:col-span-2 text-sm text-rose-700">{error}</p>}
            {feedback && <p role="status" className="md:col-span-2 text-sm text-emerald-700">{feedback}</p>}

            <div className="md:col-span-2 flex justify-end gap-3">
              {editingId && <button type="button" onClick={() => handleDelete(editingResource)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 text-sm font-semibold"><Trash2 className="w-4 h-4" /> Șterge</button>}
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1D1464] text-white text-sm font-semibold disabled:opacity-50">
                {editingId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {saving ? 'Se salvează...' : editingId ? 'Salvează modificările' : 'Creează resursa'}
              </button>
            </div>
          </form>
        </section>

        <section className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">Imagine resursă</h2>
            <div className="mt-3 aspect-[16/9] rounded-xl border border-slate-200 overflow-hidden bg-slate-100">
              {previewUrl ? <img src={previewUrl} alt="Previzualizare resursă" className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-xs text-slate-400">Nicio imagine încărcată</div>}
            </div>
            <label htmlFor="resource-image-file" className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#EEF0FF] text-xs font-semibold text-[#1D1464] cursor-pointer"><Upload className="w-4 h-4" /> Alege imaginea</label>
            <input id="resource-image-file" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="sr-only" />
            <p className="mt-2 text-xs text-slate-400">JPEG, PNG sau WebP • maximum 5 MB</p>
            {selectedImage && <p className="mt-2 text-xs text-slate-600">{selectedImage.file.name}</p>}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between"><h2 className="text-base font-bold text-slate-900">Resurse existente</h2><span className="text-xs text-slate-500">{resources.length}</span></div>
            {loading ? <div className="p-5 text-sm text-slate-500">Se încarcă...</div> : (
              <ul className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
                {resources.map((resource) => (
                  <li key={resource.id} className={`px-5 py-3 flex items-center justify-between gap-3 ${editingId === resource.id ? 'bg-indigo-50' : ''}`}>
                    <button type="button" onClick={() => startEdit(resource)} className="min-w-0 text-left flex-1">
                      <div className="text-sm font-semibold text-slate-900 truncate">{resource.code} · {resource.name}</div>
                      <div className="mt-1 text-xs text-slate-500 truncate">{resource.department} · {resource.location}</div>
                    </button>
                    <button type="button" onClick={() => startEdit(resource)} aria-label={`Editează ${resource.name}`} className="p-2 rounded-lg text-slate-500 hover:bg-white"><Edit3 className="w-4 h-4" /></button>
                    <button type="button" onClick={() => handleDelete(resource)} disabled={deletingId === resource.id} aria-label={`Șterge ${resource.name}`} className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 disabled:opacity-50"><Trash2 className="w-4 h-4" /></button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
