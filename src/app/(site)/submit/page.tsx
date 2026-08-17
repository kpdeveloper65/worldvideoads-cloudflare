'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Send, CheckCircle, AlertCircle, Loader2, Plus } from 'lucide-react';

export default function SubmitAdPage() {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    brandName: '',
    categoryName: '',
    videoUrl: '',
    notes: '',
    contactEmail: '',
  });

  const CATEGORIES = [
    'Alcohol & Beverages', 'Automotive', 'Education', 'Entertainment',
    'Fashion & Beauty', 'Finance & Insurance', 'Food & Beverage', 'Gaming',
    'Healthcare & Pharma', 'Home & Garden', 'Pets', 'Retail & E-commerce',
    'Sports & Fitness', 'Telecommunications', 'Technology', 'Travel & Tourism', 'Other',
  ].sort(); // Sorted alphabetically for better UX

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          submittedBy: session?.user?.id || null,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Submission failed. Please check your URL and try again.');
      }
    } catch (err) {
      setError('Connection error. Please check your internet and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 py-12 px-4">
        <div className="section-container text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-500/20 mb-6">
            <Plus className="w-8 h-8 text-brand-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Submit a Missing Ad</h1>
          <p className="text-white/60 text-lg">
            Found an ad that's not in our database? Submit it here and our team will review it.
          </p>
        </div>
      </div>

      <div className="section-container py-12">
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-10 text-center">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-3">Submission Received!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for contributing. Our team will review your submission shortly.
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/ads" className="btn btn-primary">Browse Ads</Link>
                <button
                  onClick={() => { 
                    setSubmitted(false); 
                    setForm({ title: '', brandName: '', categoryName: '', videoUrl: '', notes: '', contactEmail: '' }); 
                  }}
                  className="btn btn-outline"
                >
                  Submit Another
                </button>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <div className="rounded-2xl border border-border bg-card p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Form fields remain the same, but ensure they are wrapped in standard layout */}
                  <div>
                    <label className="block text-sm font-medium mb-1.5" htmlFor="title">Ad Title <span className="text-red-500">*</span></label>
                    <input id="title" name="title" type="text" value={form.title} onChange={handleChange} required className="input-base w-full" placeholder="e.g., Nike - Just Do It 2023" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5" htmlFor="brandName">Brand Name <span className="text-red-500">*</span></label>
                    <input id="brandName" name="brandName" type="text" value={form.brandName} onChange={handleChange} required className="input-base w-full" placeholder="e.g., Nike" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5" htmlFor="categoryName">Category / Industry</label>
                    <select id="categoryName" name="categoryName" value={form.categoryName} onChange={handleChange} className="input-base w-full">
                      <option value="">Select a category...</option>
                      {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5" htmlFor="videoUrl">Video URL <span className="text-red-500">*</span></label>
                    <input id="videoUrl" name="videoUrl" type="url" value={form.videoUrl} onChange={handleChange} required className="input-base w-full" placeholder="https://youtube.com/watch?v=..." />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5" htmlFor="notes">Additional Notes</label>
                    <textarea id="notes" name="notes" value={form.notes} onChange={handleChange} rows={4} className="input-base w-full resize-none" placeholder="Campaign name, year, context..." />
                  </div>

                  {!session && (
                    <div>
                      <label className="block text-sm font-medium mb-1.5" htmlFor="contactEmail">Contact Email (optional)</label>
                      <input id="contactEmail" name="contactEmail" type="email" value={form.contactEmail} onChange={handleChange} className="input-base w-full" placeholder="your@email.com" />
                    </div>
                  )}

                  <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full flex items-center justify-center gap-2">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {isSubmitting ? 'Submitting...' : 'Submit Ad'}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}