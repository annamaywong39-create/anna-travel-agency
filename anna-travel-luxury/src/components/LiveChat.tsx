import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message { id: string; text: string; sender: 'user' | 'bot'; timestamp: Date; }

const BOT_RESPONSES: Record<string, string> = {
  hello: "Hello! 👋 Welcome to Anna Travel Agency. How can I help you?",
  booking: "Browse /listings for stays or /tickets for events. We verify availability before PayPal request.",
  price: "Prices are from-prices until supplier confirms. Ticket discount shown before checkout.",
  default: "Thanks for your message! Contact concierge for specific requests.",
};

function getBotResponse(m: string) {
  const l = m.toLowerCase();
  if (l.includes('hello') || l.includes('hi') || l.includes('hey')) return BOT_RESPONSES.hello;
  if (l.includes('book') || l.includes('reserve')) return BOT_RESPONSES.booking;
  if (l.includes('price') || l.includes('cost')) return BOT_RESPONSES.price;
  return BOT_RESPONSES.default;
}

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ id: '1', text: "Hi! 👋 I'm Anna assistant. Ask me about tickets, stays, prices!", sender: 'bot', timestamp: new Date() }]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user', timestamp: new Date() };
    setMessages(p => [...p, userMsg]);
    const q = input;
    setInput('');
    setTimeout(() => {
      setMessages(p => [...p, { id: (Date.now()+1).toString(), text: getBotResponse(q), sender: 'bot', timestamp: new Date() }]);
    }, 800);
  };

  return (
    <>
      {/* Chat button - left side, high z-index, always clickable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className="fixed bottom-[160px] left-4 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-[#1267C4] text-white shadow-2xl hover:bg-[#0F5AAC] md:bottom-6 md:left-6"
        style={{ pointerEvents: 'auto' }}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-[160px] left-4 z-[70] w-[calc(100%-2rem)] max-w-[360px] overflow-hidden rounded-2xl border border-[#D8E5F0] bg-white shadow-2xl md:bottom-24 md:left-6 md:w-96">
          <div className="bg-[#1267C4] p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2"><Bot className="h-5 w-5" /><span className="font-bold text-sm">Anna Assistant</span></div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white"><X className="h-5 w-5" /></button>
          </div>
          <div className="h-[300px] overflow-y-auto p-4 space-y-3 bg-[#F7FAFD]">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.sender==='user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.sender==='user' ? 'bg-[#1267C4] text-white rounded-br-none' : 'bg-white border border-[#D8E5F0] text-[#14253F] rounded-bl-none'}`}>{m.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-[#D8E5F0] bg-white p-3 flex gap-2">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSend()} placeholder="Type a message..." className="flex-1 rounded-xl border border-[#D8E5F0] bg-[#F7FAFD] px-3 py-2 text-sm outline-none focus:border-[#1267C4]" />
            <button onClick={handleSend} disabled={!input.trim()} className="rounded-xl bg-[#1267C4] px-3 py-2 text-white disabled:opacity-50"><Send className="h-4 w-4" /></button>
          </div>
        </div>
      )}
    </>
  );
}
