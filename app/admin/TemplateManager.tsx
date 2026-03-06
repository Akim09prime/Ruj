import React, { useState, useEffect } from 'react';
import { dbService } from '../../services/db';
import { OfferTemplate } from '../../types';
import { Plus, Trash2, Save, Layout, Palette, Type, Image as ImageIcon, User } from 'lucide-react';

export const TemplateManager: React.FC = () => {
  const [templates, setTemplates] = useState<OfferTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<OfferTemplate | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [currentUser, setCurrentUser] = useState<{ username: string; role: string } | null>(null);

  useEffect(() => {
    loadTemplates();
    dbService.getSession().then(sess => {
      if (sess.authenticated && sess.user) {
        setCurrentUser({ username: sess.user, role: sess.role || 'agent' });
      }
    });
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await dbService.getOfferTemplates();
      setTemplates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load templates', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    const newTemplate: OfferTemplate = {
      id: Date.now().toString(),
      name: 'New Template',
      layout: 'grid',
      theme: 'light',
      defaultTitle: 'Special Offer for You',
      defaultMessage: 'We have curated a selection of premium furniture pieces for your project.',
      contactInfo: {
        name: '',
        phone: '',
        email: '',
        role: 'Sales Agent'
      },
      createdBy: currentUser?.username,
      createdAt: new Date().toISOString()
    };
    setEditingTemplate(newTemplate);
  };

  const handleSave = async () => {
    if (!editingTemplate) return;
    
    try {
      await dbService.upsertOfferTemplate(editingTemplate);
      setStatus({ type: 'success', text: 'Template saved successfully' });
      setEditingTemplate(null);
      loadTemplates();
    } catch (err) {
      setStatus({ type: 'error', text: 'Failed to save template' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    
    try {
      await dbService.deleteOfferTemplate(id);
      loadTemplates();
    } catch (err) {
      console.error('Failed to delete template', err);
    }
  };

  const canEdit = (template: OfferTemplate) => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    return template.createdBy === currentUser.username || !template.createdBy;
  };

  if (loading) return <div>Loading templates...</div>;

  if (editingTemplate) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-serif font-bold text-primary">
            {editingTemplate.id ? 'Edit Template' : 'New Template'}
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setEditingTemplate(null)}
              className="px-4 py-2 border border-border rounded text-sm hover:bg-surface"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-accent text-black font-bold rounded text-sm flex items-center gap-2 hover:bg-accent/90"
            >
              <Save className="w-4 h-4" /> Save Template
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div className="space-y-6 bg-surface p-6 rounded-lg border border-border">
            
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-bold flex items-center gap-2 text-lg">
                <Layout className="w-5 h-5 text-accent" /> Basic Settings
              </h3>
              
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Template Name</label>
                <input 
                  type="text" 
                  value={editingTemplate.name}
                  onChange={e => setEditingTemplate({...editingTemplate, name: e.target.value})}
                  className="w-full bg-background border border-border rounded px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Layout</label>
                  <select 
                    value={editingTemplate.layout}
                    onChange={e => setEditingTemplate({...editingTemplate, layout: e.target.value as any})}
                    className="w-full bg-background border border-border rounded px-3 py-2"
                  >
                    <option value="grid">Grid</option>
                    <option value="masonry">Masonry</option>
                    <option value="carousel">Carousel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Theme</label>
                  <select 
                    value={editingTemplate.theme}
                    onChange={e => setEditingTemplate({...editingTemplate, theme: e.target.value as any})}
                    className="w-full bg-background border border-border rounded px-3 py-2"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="gold">Gold</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4 pt-4 border-t border-border/50">
              <h3 className="font-bold flex items-center gap-2 text-lg">
                <Type className="w-5 h-5 text-accent" /> Default Content
              </h3>
              
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Default Title</label>
                <input 
                  type="text" 
                  value={editingTemplate.defaultTitle}
                  onChange={e => setEditingTemplate({...editingTemplate, defaultTitle: e.target.value})}
                  className="w-full bg-background border border-border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Default Message</label>
                <textarea 
                  value={editingTemplate.defaultMessage}
                  onChange={e => setEditingTemplate({...editingTemplate, defaultMessage: e.target.value})}
                  className="w-full bg-background border border-border rounded px-3 py-2 h-32"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 pt-4 border-t border-border/50">
              <h3 className="font-bold flex items-center gap-2 text-lg">
                <User className="w-5 h-5 text-accent" /> Agent Info
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Name</label>
                  <input 
                    type="text" 
                    value={editingTemplate.contactInfo.name}
                    onChange={e => setEditingTemplate({
                      ...editingTemplate, 
                      contactInfo: {...editingTemplate.contactInfo, name: e.target.value}
                    })}
                    className="w-full bg-background border border-border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Role</label>
                  <input 
                    type="text" 
                    value={editingTemplate.contactInfo.role}
                    onChange={e => setEditingTemplate({
                      ...editingTemplate, 
                      contactInfo: {...editingTemplate.contactInfo, role: e.target.value}
                    })}
                    className="w-full bg-background border border-border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Phone</label>
                  <input 
                    type="text" 
                    value={editingTemplate.contactInfo.phone}
                    onChange={e => setEditingTemplate({
                      ...editingTemplate, 
                      contactInfo: {...editingTemplate.contactInfo, phone: e.target.value}
                    })}
                    className="w-full bg-background border border-border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Email</label>
                  <input 
                    type="email" 
                    value={editingTemplate.contactInfo.email}
                    onChange={e => setEditingTemplate({
                      ...editingTemplate, 
                      contactInfo: {...editingTemplate.contactInfo, email: e.target.value}
                    })}
                    className="w-full bg-background border border-border rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>

             {/* Logo */}
             <div className="space-y-4 pt-4 border-t border-border/50">
              <h3 className="font-bold flex items-center gap-2 text-lg">
                <ImageIcon className="w-5 h-5 text-accent" /> Branding
              </h3>
              
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Logo URL</label>
                <input 
                  type="text" 
                  value={editingTemplate.logoUrl || ''}
                  onChange={e => setEditingTemplate({...editingTemplate, logoUrl: e.target.value})}
                  className="w-full bg-background border border-border rounded px-3 py-2"
                  placeholder="https://..."
                />
              </div>
            </div>

          </div>

          {/* Live Preview */}
          <div className="bg-gray-100 p-8 rounded-lg border border-border overflow-y-auto max-h-[800px]">
            <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-widest">Live Preview</h3>
            
            <div className={`
              max-w-md mx-auto shadow-2xl rounded-lg overflow-hidden min-h-[600px]
              ${editingTemplate.theme === 'dark' ? 'bg-zinc-900 text-white' : 
                editingTemplate.theme === 'gold' ? 'bg-amber-50 text-amber-900' : 'bg-white text-gray-900'}
            `}>
              {/* Header */}
              <div className="p-6 text-center border-b border-current/10">
                {editingTemplate.logoUrl ? (
                  <img src={editingTemplate.logoUrl} alt="Logo" className="h-12 mx-auto mb-4 object-contain" />
                ) : (
                  <div className="text-2xl font-serif font-bold">LOGO</div>
                )}
              </div>

              {/* Body */}
              <div className="p-8 space-y-6">
                <h1 className="text-2xl font-serif font-bold text-center">
                  {editingTemplate.defaultTitle || 'Title Goes Here'}
                </h1>
                
                <p className="text-center opacity-80 leading-relaxed whitespace-pre-wrap">
                  {editingTemplate.defaultMessage || 'Message content...'}
                </p>

                {/* Mock Grid */}
                <div className={`grid gap-2 ${
                  editingTemplate.layout === 'grid' ? 'grid-cols-2' : 'grid-cols-1'
                }`}>
                  <div className="aspect-square bg-current/10 rounded"></div>
                  <div className="aspect-square bg-current/10 rounded"></div>
                  <div className="aspect-square bg-current/10 rounded"></div>
                  <div className="aspect-square bg-current/10 rounded"></div>
                </div>

                <div className="text-center pt-8 border-t border-current/10">
                  <button className={`
                    px-6 py-3 rounded-full font-bold text-sm uppercase tracking-widest
                    ${editingTemplate.theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}
                  `}>
                    View Full Gallery
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 bg-current/5 text-center text-sm space-y-1">
                <p className="font-bold">{editingTemplate.contactInfo.name || 'Agent Name'}</p>
                <p className="opacity-70">{editingTemplate.contactInfo.role || 'Role'}</p>
                <p className="opacity-70">{editingTemplate.contactInfo.phone}</p>
                <p className="opacity-70">{editingTemplate.contactInfo.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-primary">Offer Templates</h1>
        <button 
          onClick={handleCreate}
          className="bg-accent hover:bg-accent/90 text-black font-bold py-2 px-4 rounded flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Template
        </button>
      </div>

      {status && (
        <div className={`p-4 rounded border ${
          status.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
        }`}>
          {status.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(template => (
          <div key={template.id} className="bg-surface border border-border rounded-lg p-6 hover:border-accent transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{template.name}</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                  {template.layout} • {template.theme}
                </p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {canEdit(template) && (
                  <>
                    <button 
                      onClick={() => setEditingTemplate(template)}
                      className="p-2 hover:bg-background rounded text-primary"
                      title="Edit Template"
                    >
                      <Palette className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(template.id)}
                      className="p-2 hover:bg-red-500/10 rounded text-red-500"
                      title="Delete Template"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground mb-4">
              <p className="line-clamp-1">"{template.defaultTitle}"</p>
              <p className="flex items-center gap-2">
                <User className="w-3 h-3" /> {template.contactInfo.name || 'No agent info'}
              </p>
              {template.createdBy && (
                 <p className="text-xs text-muted-foreground/50">By: {template.createdBy}</p>
              )}
            </div>

            <div className="pt-4 border-t border-border/50 flex justify-between items-center text-xs text-muted-foreground">
              <span>Created: {new Date(template.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}

        {templates.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed border-border rounded-lg">
            <p>No templates created yet.</p>
            <button onClick={handleCreate} className="text-accent hover:underline mt-2">Create your first template</button>
          </div>
        )}
      </div>
    </div>
  );
};
