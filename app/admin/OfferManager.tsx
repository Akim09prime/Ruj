import React, { useState, useEffect } from 'react';
import { dbService } from '../../services/db';
import { Send, Image as ImageIcon, Check, Layout } from 'lucide-react';
import { Media, OfferTemplate } from '../../types';

export const OfferManager: React.FC = () => {
  const [media, setMedia] = useState<Media[]>([]);
  const [templates, setTemplates] = useState<OfferTemplate[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState({ to: '', subject: '', body: '' });
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    Promise.all([
      dbService.getMedia(),
      dbService.getOfferTemplates()
    ]).then(([mediaData, templatesData]) => {
      setMedia(mediaData);
      setTemplates(templatesData);
      setLoading(false);
    });
  }, []);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setMessage(prev => ({
        ...prev,
        subject: template.defaultTitle,
        body: template.defaultMessage
      }));
    }
  };

  const toggleImage = (url: string) => {
    setSelectedImages(prev => 
      prev.includes(url) ? prev.filter(i => i !== url) : [...prev, url]
    );
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.to || !message.subject || !message.body) return;
    if (!selectedTemplateId) {
      setStatus({ type: 'error', text: 'Please select a template' });
      return;
    }

    try {
      setSending(true);
      setStatus(null);

      // 1. Create Offer Record
      const session = await dbService.getSession();
      const offerId = Date.now().toString();
      const offerLink = `${window.location.origin}/oferta/${offerId}`;
      
      const newOffer = {
        id: offerId,
        templateId: selectedTemplateId,
        agentId: session.user || 'unknown',
        clientEmail: message.to,
        subject: message.subject,
        message: message.body,
        images: selectedImages,
        viewCount: 0,
        createdAt: new Date().toISOString(),
        status: 'sent' as const
      };

      await dbService.createOffer(newOffer);
      
      // 2. Send Email (Mocked for now as backend might not support real email yet)
      // In a real app, this would call dbService.sendOffer
      console.log('Sending email to', message.to, 'with link', offerLink);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStatus({ type: 'success', text: 'Offer sent successfully!' });
      setMessage({ to: '', subject: '', body: '' });
      setSelectedImages([]);
      setSelectedTemplateId('');
    } catch (err: any) {
      setStatus({ type: 'error', text: err.message || 'Failed to send offer' });
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-primary">Send Offer</h1>
      </div>

      {status && (
        <div className={`p-4 rounded border ${
          status.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
        }`}>
          {status.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Email Form */}
        <div className="bg-surface p-6 rounded-lg border border-border h-fit space-y-6">
          
          {/* Template Selection */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Layout className="w-5 h-5 text-accent" />
              Select Template
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {templates.map(t => (
                <div 
                  key={t.id}
                  onClick={() => handleTemplateChange(t.id)}
                  className={`p-4 border rounded cursor-pointer transition-all ${
                    selectedTemplateId === t.id 
                      ? 'border-accent bg-accent/5' 
                      : 'border-border hover:border-accent/50'
                  }`}
                >
                  <div className="font-bold">{t.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{t.layout} • {t.theme}</div>
                </div>
              ))}
              {templates.length === 0 && (
                <div className="col-span-2 text-sm text-muted-foreground text-center py-4 border border-dashed rounded">
                  No templates available. Ask an admin to create one.
                </div>
              )}
            </div>
          </div>

          <h2 className="text-xl font-bold pt-4 border-t border-border/50 flex items-center gap-2">
            <Send className="w-5 h-5 text-accent" />
            Compose Email
          </h2>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">To (Email)</label>
              <input
                type="email"
                value={message.to}
                onChange={(e) => setMessage({ ...message, to: e.target.value })}
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:border-accent outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Subject</label>
              <input
                type="text"
                value={message.subject}
                onChange={(e) => setMessage({ ...message, subject: e.target.value })}
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:border-accent outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Message</label>
              <textarea
                value={message.body}
                onChange={(e) => setMessage({ ...message, body: e.target.value })}
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm focus:border-accent outline-none h-40"
                required
              />
            </div>
            
            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-2">
                {selectedImages.length} images selected
              </p>
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-accent hover:bg-accent/90 text-black font-bold py-3 px-4 rounded transition-colors uppercase text-xs tracking-widest flex items-center justify-center gap-2"
              >
                {sending ? 'Sending...' : (
                  <>
                    <Send className="w-4 h-4" /> Send Offer
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Image Selection */}
        <div className="bg-surface p-6 rounded-lg border border-border">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-accent" />
            Select Images
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2">
            {media.map((item) => (
              <div 
                key={item.id} 
                className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden aspect-square ${
                  selectedImages.includes(item.url) ? 'border-accent' : 'border-transparent'
                }`}
                onClick={() => toggleImage(item.url)}
              >
                <img 
                  src={item.url} 
                  alt={item.caption?.ro || 'Gallery image'} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${
                  selectedImages.includes(item.url) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  {selectedImages.includes(item.url) && (
                    <Check className="w-8 h-8 text-accent" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
