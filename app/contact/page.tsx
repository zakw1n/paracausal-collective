'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const socials = [
  {
    name: 'Instagram',
    href: 'https://instagram.com/paracausal',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'SoundCloud',
    href: 'https://soundcloud.com/paracausalworld',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M11.576 8.719c-.187 0-.37.04-.538.118V18.4h8.532c1.59 0 2.88-1.29 2.88-2.88s-1.29-2.88-2.88-2.88c-.16 0-.315.014-.466.041-.177-2.455-2.21-4.39-4.694-4.39-.278 0-.555.028-.834.078zM3.52 12.434c-.293 0-.546.126-.73.324v5.646h6.016v-5.646a1.007 1.007 0 00-1.007-1.007c-.554 0-1.007.453-1.007 1.007 0-.554-.453-1.007-1.007-1.007-.557 0-1.007.453-1.007 1.007 0-.554-.45-1.007-1.008-1.007z" />
      </svg>
    ),
  },
  {
    name: 'Resident Advisor',
    href: 'https://ra.co/promoters/paracausal',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.45 14.5H8.5v-9h3.5c2.2 0 3.5 1.1 3.5 2.8 0 1.1-.6 2-1.5 2.4l2 3.8h-2.1l-1.8-3.4h-1v3.4zm0-5h1c.9 0 1.5-.5 1.5-1.4S12.4 8.9 11.5 8.9h-1v2.6z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com/paracausal',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

const subjects = ['General Enquiry', 'Booking / Collaboration', 'Merchandise', 'Feedback / Review', 'Complaint', 'Other'];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: subjects[0], message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // TODO: connect to Formspree / email service
    await new Promise(r => setTimeout(r, 1200));
    setStatus('sent');
  };

  const inputStyle = {
    background: 'transparent',
    borderColor: 'rgba(255,255,255,0.1)',
    fontFamily: "'Space Grotesk', sans-serif",
  };

  const focusStyle = (e: React.FocusEvent<HTMLElement>) =>
    ((e.target as HTMLElement).style.borderColor = 'rgba(74,56,150,0.7)');
  const blurStyle = (e: React.FocusEvent<HTMLElement>) =>
    ((e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)');

  return (
    <div className="min-h-screen bg-[#080808] text-[#FFFDFA]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 80% 30%, rgba(55,31,118,0.09) 0%, transparent 60%)' }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-24">
        {/* Back */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
          <Link href="/" className="text-white/40 hover:text-white transition-colors text-xs tracking-widest uppercase">
            ← Home
          </Link>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14"
        >
          <p className="text-[10px] tracking-[0.5em] uppercase mb-4" style={{ color: '#4a3896' }}>Reach Out</p>
          <h1
            className="text-white leading-none"
            style={{ fontFamily: "'Archivo Black', sans-serif", letterSpacing: '0.05em', fontSize: 'clamp(3rem, 10vw, 7rem)' }}
          >
            Get In
            <br />
            <span className="text-white/20">Touch</span>
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left — contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-2 space-y-10"
          >
            {/* Email */}
            <div>
              <p className="text-[9px] tracking-[0.4em] text-white/30 uppercase mb-3">Email</p>
              <a
                href="mailto:info@paracausal.world"
                className="text-white/70 hover:text-white transition-colors text-sm tracking-wide"
              >
                info@paracausal.world
              </a>
            </div>

            {/* Location */}
            <div>
              <p className="text-[9px] tracking-[0.4em] text-white/30 uppercase mb-3">Location</p>
              <p className="text-white/50 text-sm">Cape Town, South Africa</p>
            </div>

            {/* Socials */}
            <div>
              <p className="text-[9px] tracking-[0.4em] text-white/30 uppercase mb-4">Socials</p>
              <div className="flex flex-col gap-3">
                {socials.map(s => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-white/40 hover:text-white/80 transition-colors duration-200 group"
                  >
                    <span className="text-white/30 group-hover:text-white/60 transition-colors">{s.icon}</span>
                    <span className="text-xs tracking-widest uppercase">{s.name}</span>
                    <svg viewBox="0 0 16 16" className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <AnimatePresence mode="wait">
              {status === 'sent' ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-20 gap-6"
                >
                  <div
                    className="w-14 h-14 flex items-center justify-center border border-[#4a3896]/50"
                    style={{ background: 'rgba(74,56,150,0.12)', clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#9b7fd4" strokeWidth="1.5">
                      <polyline points="4 12 9 17 20 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.5em] text-[#4a3896] uppercase mb-2">Message Sent</p>
                    <p className="text-white/50 text-sm">We'll get back to you soon.</p>
                  </div>
                  <button
                    onClick={() => { setStatus('idle'); setForm({ name: '', email: '', subject: subjects[0], message: '' }); }}
                    className="text-xs tracking-widest uppercase text-white/30 hover:text-white/60 transition-colors"
                  >
                    Send another →
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} className="space-y-5">
                  <p className="text-[9px] tracking-[0.4em] text-white/30 uppercase mb-6">Send a Message</p>

                  {/* Name + Email */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Name', key: 'name' as const, type: 'text', placeholder: 'Your name' },
                      { label: 'Email', key: 'email' as const, type: 'email', placeholder: 'you@example.com' },
                    ].map(({ label, key, type, placeholder }) => (
                      <div key={key}>
                        <label className="block text-[9px] tracking-[0.35em] text-white/30 uppercase mb-2">{label}</label>
                        <input
                          type={type}
                          required
                          placeholder={placeholder}
                          value={form[key]}
                          onChange={set(key)}
                          onFocus={focusStyle}
                          onBlur={blurStyle}
                          className="w-full border text-white placeholder-white/20 px-4 py-3 text-xs tracking-wider focus:outline-none transition-colors duration-200"
                          style={inputStyle}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-[9px] tracking-[0.35em] text-white/30 uppercase mb-2">Subject</label>
                    <select
                      value={form.subject}
                      onChange={set('subject')}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                      className="w-full border text-white px-4 py-3 text-xs tracking-wider focus:outline-none transition-colors duration-200 cursor-pointer"
                      style={{ ...inputStyle, color: 'rgba(255,253,250,0.7)' }}
                    >
                      {subjects.map(s => <option key={s} value={s} style={{ background: '#0a0a14' }}>{s}</option>)}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[9px] tracking-[0.35em] text-white/30 uppercase mb-2">Message</label>
                    <textarea
                      required
                      rows={6}
                      placeholder="Write your message here..."
                      value={form.message}
                      onChange={set('message')}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                      className="w-full border text-white placeholder-white/20 px-4 py-3 text-xs tracking-wider focus:outline-none transition-colors duration-200 resize-none"
                      style={inputStyle}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full py-4 text-sm tracking-widest uppercase text-white flex items-center justify-center gap-3 transition-opacity hover:opacity-80 disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(135deg, rgba(2,0,121,0.95), rgba(55,31,118,0.8))',
                      clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
                    }}
                  >
                    {status === 'sending' ? (
                      <>
                        <span className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
                        Sending
                      </>
                    ) : 'Send Message'}
                  </button>

                  <p className="text-[9px] text-white/15 tracking-wider text-center">
                    We aim to respond within 48 hours.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
