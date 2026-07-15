import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Minimize2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const BOT_RESPONSES: Record<string, string> = {
  hello: "Hello! 👋 Welcome to Anna Travel Agency. How can I help you with your World Cup 2026 accommodation?",
  hi: "Hi there! 👋 Ready to help you find the perfect place for the World Cup!",
  booking: "To make a booking, browse our listings at /listings and click 'Book Now' on any property. Need help finding something specific?",
  price: "Our prices range from $150-$500/night depending on location and property type. Early bookings get the best rates! 🏷️",
  refund: "We offer free cancellation up to 7 days before check-in. For cancellations within 7 days, a partial refund may apply.",
  stadium: "All our properties are within easy reach of World Cup venues. Each listing shows the distance to the nearest stadium!",
  payment: "We accept all major credit cards, PayPal, and Apple Pay. Payments are processed securely through Stripe. 💳",
  contact: "You can reach us at hello@annatravelagency.com or +1 (800) 123-4567. We're available 24/7!",
  cities: "We have accommodations in all 16 host cities across USA 🇺🇸, Mexico 🇲🇽, and Canada 🇨🇦!",
  default: "Thanks for your message! For specific inquiries, please email hello@annatravelagency.com or call +1 (800) 123-4567. Is there anything else I can help with?",
};

function getBotResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) return BOT_RESPONSES.hello;
  if (lower.includes('book') || lower.includes('reserve')) return BOT_RESPONSES.booking;
  if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) return BOT_RESPONSES.price;
  if (lower.includes('refund') || lower.includes('cancel')) return BOT_RESPONSES.refund;
  if (lower.includes('stadium') || lower.includes('venue') || lower.includes('match')) return BOT_RESPONSES.stadium;
  if (lower.includes('pay') || lower.includes('card') || lower.includes('stripe')) return BOT_RESPONSES.payment;
  if (lower.includes('contact') || lower.includes('email') || lower.includes('phone')) return BOT_RESPONSES.contact;
  if (lower.includes('city') || lower.includes('cities') || lower.includes('where')) return BOT_RESPONSES.cities;
  return BOT_RESPONSES.default;
}

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! 👋 I'm the Anna Travel Agency assistant. Ask me about bookings, prices, or World Cup cities!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: getBotResponse(input),
      sender: 'bot',
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages(prev => [...prev, botMessage]);
  };

  const quickQuestions = [
    "How do I book?",
    "What are the prices?",
    "Refund policy?",
    "Which cities?",
  ];

  return (
    <>
      {/* Chat button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-red-500 text-white shadow-2xl shadow-amber-500/30 flex items-center justify-center"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed z-50 bg-[#0f0f1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden ${
              isMinimized
                ? 'bottom-6 right-6 w-72 h-14'
                : 'bottom-6 right-6 w-96 h-[500px] max-h-[80vh]'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-red-500 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                {!isMinimized && (
                  <div>
                    <p className="text-white font-bold">Anna Assistant</p>
                    <p className="text-white/80 text-xs">Online • Usually replies instantly</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white/80 hover:text-white"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="h-[340px] overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end gap-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          msg.sender === 'user'
                            ? 'bg-amber-500'
                            : 'bg-gradient-to-br from-amber-500 to-red-500'
                        }`}>
                          {msg.sender === 'user' ? (
                            <User className="w-3 h-3 text-white" />
                          ) : (
                            <Bot className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div className={`px-4 py-2 rounded-2xl text-sm ${
                          msg.sender === 'user'
                            ? 'bg-amber-500 text-white rounded-br-none'
                            : 'bg-white/10 text-gray-200 rounded-bl-none'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                      <div className="px-4 py-3 rounded-2xl bg-white/10 rounded-bl-none">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                              className="w-2 h-2 rounded-full bg-gray-400"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick questions */}
                {messages.length <= 2 && (
                  <div className="px-4 pb-2 flex flex-wrap gap-2">
                    {quickQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setInput(q);
                          setTimeout(() => handleSend(), 100);
                        }}
                        className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs hover:bg-white/10 transition-all"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-white/10">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 text-sm"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="px-4 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-white hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
