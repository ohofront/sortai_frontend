import { useState } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

export default function AICopilot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([
        { role: 'ai', text: '안녕하세요! 작업 중 궁금한 점이나 SOP 규정이 필요하면 물어보세요.' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');

        // AI 응답 시뮬레이션
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'ai',
                text: `[SOP 규정 3-2조] ${userMsg}에 대한 기준은 '허용 오차 5%' 입니다. 사진을 찍어주시면 더 정확히 판단해드릴 수 있어요.`
            }]);
        }, 1000);
    };

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform z-50"
                >
                    <MessageCircle className="w-7 h-7" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-full max-w-[340px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <Bot className="w-5 h-5" />
                            <span className="font-bold">SOP Copilot</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-indigo-700 p-1 rounded">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-xl text-sm ${
                                    msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-white border-t flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="질문을 입력하세요..."
                            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button onClick={handleSend} className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700">
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}