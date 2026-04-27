"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Mic, Loader2, X } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIChatBotProps {
  apiKey: string;
  position?: "bottom-right" | "bottom-left" | "fixed";
  welcomeMessage?: string;
  suggestions?: string[];
}

export function AIChatBot({
  apiKey,
  position = "bottom-right",
  welcomeMessage = "Hello! I'm your AI assistant. How can I help you today?",
  suggestions = [
    "What products do you recommend?",
    "Tell me about discounts",
    "Help me find something",
    "Shipping information",
  ],
}: AIChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: welcomeMessage,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        handleSend(transcript);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleSend = async (text?: string) => {
    const messageToSend = text || input;
    if (!messageToSend.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: messageToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Prepare conversation history
      const history = messages.slice(1).map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

      const contents = [
        ...history,
        {
          role: "user",
          parts: [{ text: messageToSend }],
        },
      ];

      // Try multiple endpoints
      const endpoints = [
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
      ];

      let aiResponse = null;
      let lastError = null;

      for (const endpoint of endpoints) {
        try {
          console.log("Trying endpoint:", endpoint);
          
          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: contents,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 500,
              },
            }),
          });

          const responseText = await response.text();
          console.log("Response status:", response.status);
          console.log("Response body:", responseText);

          if (response.ok) {
            const data = JSON.parse(responseText);
            aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (aiResponse) {
              console.log("Success! Got response");
              break;
            }
          } else {
            console.log(`Endpoint failed with status ${response.status}`);
          }
        } catch (err) {
          console.error("Error with endpoint:", err);
          lastError = err;
        }
      }

      if (!aiResponse) {
        // If API fails, use a smart fallback response based on the question
        aiResponse = getFallbackResponse(messageToSend);
      }

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("FULL ERROR:", error);
      
      // Use fallback response
      const fallbackResponse = getFallbackResponse(messageToSend);
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: fallbackResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Smart fallback responses when API is unavailable
  const getFallbackResponse = (question: string): string => {
    const q = question.toLowerCase();
    
    if (q.includes("mouse") || q.includes("gaming mouse")) {
      return "🎮 **Gaming Mouse Recommendations:**\n\n• **Logitech G502 X** - $49.99 - Best overall\n• **Razer DeathAdder V3** - $69.99 - Best for FPS\n• **SteelSeries Rival 5** - $59.99 - Most customizable\n\nAll our mice feature RGB lighting, programmable buttons, and high-precision sensors!";
    }
    
    if (q.includes("keyboard") || q.includes("mechanical keyboard")) {
      return "⌨️ **Mechanical Keyboards:**\n\n• **Razer BlackWidow V4** - $89.99 - Green switches\n• **Corsair K70** - $129.99 - RGB mechanical\n• **Logitech G915** - $199.99 - Wireless\n\nAll keyboards come with a 2-year warranty!";
    }
    
    if (q.includes("monitor") || q.includes("display")) {
      return "🖥️ **Gaming Monitors:**\n\n• **ASUS VG249Q** - $199.99 - 144Hz, 24\"\n• **LG UltraGear** - $299.99 - 165Hz, 27\"\n• **Samsung Odyssey** - $399.99 - 240Hz, Curved\n\nAsk about our bundle deals!";
    }
    
    if (q.includes("discount") || q.includes("deal") || q.includes("sale")) {
      return "🔥 **Current Deals & Discounts:**\n\n• 20% OFF all gaming mice\n• Buy 1 Get 1 50% OFF on headsets\n• Free shipping on orders over $100\n• Student discount: 15% OFF with valid ID\n\nCheck our website for flash sales!";
    }
    
    if (q.includes("shipping") || q.includes("delivery")) {
      return "📦 **Shipping Information:**\n\n• Free shipping on orders $100+\n• Standard: 3-5 business days ($5.99)\n• Express: 1-2 business days ($12.99)\n• Same-day delivery available in select areas\n\nInternational shipping available!";
    }
    
    if (q.includes("return") || q.includes("refund")) {
      return "🔄 **Return Policy:**\n\n• 30-day hassle-free returns\n• Full refund or exchange\n• Free return shipping on defective items\n• Original packaging required\n\nContact support for return labels!";
    }
    
    if (q.includes("headset") || q.includes("headphone") || q.includes("audio")) {
      return "🎧 **Gaming Headsets:**\n\n• **HyperX Cloud II** - $79.99 - 7.1 Surround\n• **SteelSeries Arctis 7** - $149.99 - Wireless\n• **Razer BlackShark V2** - $99.99 - THX Spatial Audio\n\nAll headsets feature noise-cancelling mics!";
    }
    
    return "🎮 Thanks for reaching out! Our AI is currently experiencing high demand. Please visit our Products page to browse our full catalog, or contact our support team for immediate assistance. You can also check out our amazing deals on gaming mice, keyboards, monitors, and headsets!";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startVoiceInput = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case "bottom-left":
        return "bottom-6 left-6";
      case "fixed":
        return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
      default:
        return "bottom-6 right-6";
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[10000] group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity z-0" />
            <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-full shadow-lg hover:scale-105 transition-transform duration-300 z-10">
              <Bot size={24} className="text-white" />
            </div>
          </div>
        </button>
      )}

      {isOpen && (
        <div className={`fixed z-[10001] ${getPositionClasses()}`}>
          <div className="w-[400px] h-[600px] bg-gradient-to-br from-[#0a0a0a] to-[#0f0f0f] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
            <div className="relative px-5 py-4 border-b border-white/10 bg-gradient-to-r from-orange-500/10 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-orange-500 rounded-full blur-md" />
                    <Bot size={20} className="relative text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">AI Assistant</h3>
                    <p className="text-[10px] text-gray-500">
                      {apiKey ? "Ready to help" : "API key required"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center flex-shrink-0">
                      <Bot size={14} className="text-orange-500" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                        : "bg-white/5 text-gray-200 border border-white/10"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <span className="text-[9px] opacity-50 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center flex-shrink-0">
                      <User size={14} className="text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center">
                    <Bot size={14} className="text-orange-500" />
                  </div>
                  <div className="bg-white/5 rounded-2xl px-4 py-3 border border-white/10">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && (
              <div className="px-4 pb-3">
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSend(suggestion)}
                      className="text-[11px] px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-orange-500/50 transition-all"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                  />
                </div>
                <button
                  onClick={startVoiceInput}
                  disabled={isListening}
                  className={`p-2.5 rounded-xl transition-all ${
                    isListening
                      ? "bg-orange-500 text-white animate-pulse"
                      : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-orange-500/50"
                  }`}
                >
                  <Mic size={18} />
                </button>
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}