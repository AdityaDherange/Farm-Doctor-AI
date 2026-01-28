import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Send, Bot, User, Loader2, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  diagnosis_id: string | null;
  message: string;
  role: string;
  user_id: string;
  created_at: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

// Mock AI responses for demo
const mockResponses: Record<string, string> = {
  default: `I'm Krushi Doctor, your AI farming assistant! 🌱 I can help you with:

• **Disease identification** - Understanding symptoms and causes
• **Treatment recommendations** - Both organic and chemical options
• **Prevention tips** - How to protect your crops
• **Best practices** - Planting, watering, and care

What would you like to know about your crops today?`,
  
  treatment: `For treating plant diseases, I recommend a two-pronged approach:

**Organic Options:**
- Neem oil spray (2-3 times weekly)
- Copper-based fungicides
- Proper pruning of infected areas
- Improve air circulation

**Chemical Options:**
- Consult with local agricultural extension
- Use targeted fungicides based on disease type
- Follow application instructions carefully

Would you like more specific advice for your crop?`,

  prevention: `Here are key prevention strategies for healthy crops:

1. **Crop Rotation** - Change crops each season
2. **Proper Spacing** - Ensure good air flow
3. **Water Management** - Avoid wet leaves, water at base
4. **Soil Health** - Maintain proper pH and nutrients
5. **Early Detection** - Regular monitoring

Prevention is always better than cure! 🌿`,
};

export default function Chat() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const diagnosisId = searchParams.get("diagnosis");
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history
  useEffect(() => {
    async function loadHistory() {
      if (!user) {
        setInitialLoading(false);
        return;
      }

      const query = supabase
        .from("chat_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(100);

      if (diagnosisId) {
        query.eq("diagnosis_id", diagnosisId);
      }

      const { data } = await query;
      if (data) {
        // Map database messages to Message format
        const mappedMessages: Message[] = data.map((msg) => ({
          id: msg.id,
          role: msg.role as "user" | "assistant",
          content: msg.message,
          created_at: msg.created_at,
        }));
        setMessages(mappedMessages);
      }
      setInitialLoading(false);
    }

    loadHistory();
  }, [user, diagnosisId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add welcome message if no history
  useEffect(() => {
    if (!initialLoading && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: mockResponses.default,
          created_at: new Date().toISOString(),
        },
      ]);
    }
  }, [initialLoading, messages.length]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Save user message if logged in
    if (user) {
      await supabase.from("chat_history").insert({
        user_id: user.id,
        diagnosis_id: diagnosisId || null,
        message: userMessage.content,
        role: "user",
      });
    }

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Generate mock response based on keywords
    let response = mockResponses.default;
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes("treat") || lowerInput.includes("cure") || lowerInput.includes("spray")) {
      response = mockResponses.treatment;
    } else if (lowerInput.includes("prevent") || lowerInput.includes("protect") || lowerInput.includes("avoid")) {
      response = mockResponses.prevention;
    } else if (lowerInput.includes("thank")) {
      response = "You're welcome! 🌻 I'm always here to help with your farming questions. Don't hesitate to ask anything about your crops!";
    } else {
      response = `That's a great question about **${input.slice(0, 30)}**! 

Based on agricultural best practices, I recommend consulting with your local extension office for region-specific advice. In the meantime, ensure your plants have:

- Proper watering schedule
- Adequate sunlight
- Good soil drainage
- Regular monitoring for pests

Would you like me to elaborate on any of these points?`;
    }

    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content: response,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, assistantMessage]);

    // Save assistant message if logged in
    if (user) {
      await supabase.from("chat_history").insert({
        user_id: user.id,
        diagnosis_id: diagnosisId || null,
        message: response,
        role: "assistant",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="Krushi Doctor" />

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-32">
        {initialLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4 max-w-2xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 animate-fade-in",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                
                <div
                  className={cn(
                    "max-w-[80%] whitespace-pre-wrap",
                    message.role === "user"
                      ? "chat-bubble-user"
                      : "chat-bubble-assistant"
                  )}
                >
                  {message.content}
                </div>

                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="chat-bubble-assistant flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input Area */}
      <div className="fixed bottom-16 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border p-4 safe-area-bottom">
        <div className="max-w-2xl mx-auto flex gap-3">
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Ask about your crops..."
              className="input-agricultural pr-12"
              disabled={loading}
            />
            <Leaf className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="bg-gradient-primary h-12 w-12"
            size="icon"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
