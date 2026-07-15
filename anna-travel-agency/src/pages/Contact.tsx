import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2,
  Clock, Globe, Headphones
} from 'lucide-react';
import SEO from '../components/SEO';
import Card3D from '../components/Card3D';
import { useData } from '../contexts/DataContext';

export default function Contact() {
  const { saveContactMessage } = useData();
  const [formData, setFormData] = useState({
    name: '', email: '', subject: '', message: '', type: 'general',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveContactMessage(formData);
    setSubmitted(true);
  };

  return (
    <main className="pt-24 pb-20 min-h-screen">
      <SEO title="Contact Us" description="Get in touch with Anna Travel Agency. 24/7 support for your World Cup 2026 accommodation needs." path="/contact" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm mb-6">
            <MessageSquare className="w-4 h-4" />
            Get In Touch
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            Contact{' '}
            <span className="bg-gradient-to-r from-amber-300 to-red-400 bg-clip-text text-transparent">
              Us
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Have questions about your World Cup accommodation? We're here to help 24/7.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact info cards */}
          <div className="space-y-4">
            {[
              { icon: Mail, title: 'Email Us', value: 'hello@annatravelagency.com', sub: 'We reply within 2 hours', color: 'text-blue-400' },
              { icon: Phone, title: 'Call Us', value: '+1 (587) 681-0591', sub: 'Mon-Sun, 24/7', color: 'text-green-400' },
              { icon: MapPin, title: 'Office', value: 'New York, NY, USA', sub: 'Visit by appointment', color: 'text-purple-400' },
              { icon: Clock, title: 'Response Time', value: 'Under 2 hours', sub: 'Average response time', color: 'text-amber-400' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card3D>
                  <div className="p-5 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{item.title}</h3>
                      <p className="text-gray-300 text-sm">{item.value}</p>
                      <p className="text-gray-500 text-xs">{item.sub}</p>
                    </div>
                  </div>
                </Card3D>
              </motion.div>
            ))}

            {/* Languages */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card3D>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-5 h-5 text-amber-400" />
                    <h3 className="text-white font-semibold">We Speak Your Language</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['English', 'Español', 'Français', 'Português', 'العربية', '日本語', 'Deutsch'].map((lang) => (
                      <span key={lang} className="px-2 py-1 rounded-md bg-white/5 text-gray-400 text-xs border border-white/10">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </Card3D>
            </motion.div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card3D glowColor="rgba(245, 158, 11, 0.15)">
                <div className="p-6 md:p-8">
                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-12 text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-8 h-8 text-green-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Message Sent! 🎉</h3>
                      <p className="text-gray-400 mb-6">We'll get back to you within 2 hours.</p>
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({ name: '', email: '', subject: '', message: '', type: 'general' });
                        }}
                        className="px-6 py-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-all"
                      >
                        Send Another Message
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <Headphones className="w-6 h-6 text-amber-400" />
                        Send Us a Message
                      </h2>

                      {/* Inquiry type */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {[
                          { value: 'general', label: '💬 General' },
                          { value: 'booking', label: '🏨 Booking' },
                          { value: 'group', label: '👥 Group Travel' },
                          { value: 'partner', label: '🤝 Partnership' },
                        ].map((t) => (
                          <button
                            key={t.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, type: t.value }))}
                            className={`px-4 py-2 rounded-lg text-sm transition-all ${
                              formData.type === t.value
                                ? 'bg-amber-500/20 border border-amber-500/30 text-amber-300'
                                : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="text-sm text-gray-400 mb-1 block">Your Name *</label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="John Doe"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-400 mb-1 block">Email *</label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="john@example.com"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="text-sm text-gray-400 mb-1 block">Subject *</label>
                        <input
                          type="text"
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                          placeholder="Help with World Cup booking"
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
                        />
                      </div>

                      <div className="mb-6">
                        <label className="text-sm text-gray-400 mb-1 block">Message *</label>
                        <textarea
                          required
                          value={formData.message}
                          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                          placeholder="Tell us how we can help..."
                          rows={5}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 resize-none transition-all"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold text-lg hover:scale-[1.02] transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
                      >
                        <Send className="w-5 h-5" />
                        Send Message
                      </button>
                    </form>
                  )}
                </div>
              </Card3D>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
