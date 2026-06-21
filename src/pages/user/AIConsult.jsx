import { useState, useEffect, useRef } from "react";
import {
  useNavigate,
  useSearchParams,
  Link,
  useParams,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Plus,
  Trash2,
  MessageSquare,
  LogOut,
  Menu,
  Activity,
  Stethoscope,
  FileText,
  Bell,
  Brain,
  User,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import Logo from "../../components/shared/Logo";
import api from "../../lib/axios";
import toast from "react-hot-toast";
import UserSidebar from "../../components/shared/UserSidebar";

const SYSTEM_PROMPT = `You are Medivox AI, a helpful medical triage assistant. 
Your job is to:
1. Listen to the patient's symptoms carefully
2. Ask relevant follow-up questions
3. Provide a helpful triage summary
4. Suggest what type of specialist they should see
5. Never diagnose definitively — always recommend seeing a real doctor
6. Be empathetic, clear, and concise
Keep responses under 150 words. Always end with a recommendation to see a verified doctor on Medivox.`;

function Sidebar({ active, onLogout, open, setOpen }) {
  const links = [
    { to: "/dashboard", label: "Overview", icon: Activity },
    { to: "/consult", label: "AI Consultation", icon: MessageSquare },
    { to: "/doctors", label: "Find Doctors", icon: Stethoscope },
    { to: "/prescription", label: "Prescriptions", icon: FileText },
    { to: "/medicines", label: "Medicines", icon: Bell },
  ];
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-30 flex flex-col transition-transform duration-300
                        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ background: "#042C53" }}
      >
        <div className="p-6 border-b border-white/10">
          <Logo size="md" />
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: active === to ? "#0C447C" : "transparent",
                color: active === to ? "white" : "rgba(255,255,255,0.6)",
              }}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium w-full hover:bg-white/10 transition-all"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ background: "#185FA5" }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

export default function AIConsult() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get("id");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (chatId) loadChat(chatId);
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const loadChats = async () => {
    try {
      const res = await api.get("/chat");
      setChats(res.data.chats);
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const loadChat = async (id) => {
    try {
      const res = await api.get(`/chat/${id}`);
      setMessages(res.data.chat.messages);
      setActiveChatId(id);
    } catch (err) {
      toast.error("Could not load chat");
    }
  };

  const startNewChat = async () => {
    try {
      const res = await api.post("/chat");
      const newChat = res.data.chat;
      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newChat._id);
      setMessages([]);
      navigate(`/user/${user?._id}/consult?id=${newChat._id}`);
    } catch (err) {
      toast.error("Could not start new chat");
    }
  };

  const selectChat = (id) => {
    navigate(`/user/${user?._id}/consult`);
  };

  const deleteChat = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/chat/${id}`);
      setChats((prev) => prev.filter((c) => c._id !== id));
      if (activeChatId === id) {
        setActiveChatId(null);
        setMessages([]);
        navigate("/consult");
      }
      toast.success("Chat deleted");
    } catch {
      toast.error("Could not delete chat");
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    let currentChatId = activeChatId;

    if (!currentChatId) {
      try {
        const res = await api.post("/chat");
        currentChatId = res.data.chat._id;
        setActiveChatId(currentChatId);
        setChats((prev) => [res.data.chat, ...prev]);
        navigate(`/user/${user?._id}/consult?id=${currentChatId}`);
      } catch {
        toast.error("Could not create chat");
        return;
      }
    }

    const userMessage = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setTyping(true);
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const conversationHistory = updatedMessages.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: conversationHistory,
            generationConfig: { maxOutputTokens: 300, temperature: 0.7 },
          }),
        },
      );

      const data = await res.json();
      const aiText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I could not process that. Please try again.";

      const aiMessage = {
        role: "assistant",
        content: aiText,
        timestamp: new Date(),
      };
      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      const isFirst = updatedMessages.length === 1;
      const title = isFirst
        ? input.trim().slice(0, 50) + (input.length > 50 ? "..." : "")
        : undefined;

      await api.put(`/chat/${currentChatId}`, {
        messages: finalMessages,
        ...(title && { title }),
      });

      if (title) {
        setChats((prev) =>
          prev.map((c) => (c._id === currentChatId ? { ...c, title } : c)),
        );
      }
    } catch (err) {
      toast.error("AI is unavailable. Check your API key.");
      console.error(err);
    } finally {
      setTyping(false);
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-cloud flex">
      <UserSidebar
        active={`/user/${user?._id}/consult`}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <div className="flex-1 lg:ml-64 flex h-screen overflow-hidden">
        {/* Chat history panel */}
        <div className="hidden md:flex flex-col w-64 border-r border-sky-light bg-white flex-shrink-0">
          <div className="p-4 border-b border-sky-light">
            <button
              onClick={startNewChat}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: "#0C447C" }}
            >
              <Plus size={16} /> New consultation
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {historyLoading ? (
              <div className="flex items-center justify-center h-24">
                <div className="w-5 h-5 rounded-full border-2 border-sky-light border-t-navy animate-spin" />
              </div>
            ) : chats.length === 0 ? (
              <div className="text-center py-8 px-4">
                <MessageSquare
                  size={24}
                  className="mx-auto mb-2 opacity-20 text-navy"
                />
                <p className="text-xs text-slate">No consultations yet</p>
              </div>
            ) : (
              chats.map((chat) => (
                <button
                  key={chat._id}
                  onClick={() => selectChat(chat._id)}
                  className="w-full text-left px-3 py-3 rounded-xl mb-1 group transition-all flex items-start gap-2"
                  style={{
                    background:
                      activeChatId === chat._id ? "#E6F1FB" : "transparent",
                  }}
                >
                  <MessageSquare
                    size={14}
                    className="mt-0.5 flex-shrink-0"
                    style={{
                      color: activeChatId === chat._id ? "#0C447C" : "#888780",
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-medium truncate"
                      style={{
                        color:
                          activeChatId === chat._id ? "#0C447C" : "#042C53",
                      }}
                    >
                      {chat.title}
                    </p>
                    <p className="text-xs text-slate mt-0.5">
                      {new Date(chat.updatedAt).toLocaleDateString("en-PK", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <button
                    onClick={(e) => deleteChat(e, chat._id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 transition-all flex-shrink-0"
                  >
                    <Trash2 size={12} className="text-red-400" />
                  </button>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-white border-b border-sky-light px-6 py-4 flex items-center gap-4 flex-shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate"
            >
              <Menu size={22} />
            </button>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "#0C447C" }}
            >
              <Brain size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-midnight">Medivox AI</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse-slow" />
                <span className="text-xs text-teal font-medium">Online</span>
              </div>
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full text-center py-16"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: "#E6F1FB" }}
                >
                  <Brain size={32} style={{ color: "#0C447C" }} />
                </div>
                <h2 className="text-xl font-bold text-midnight mb-2">
                  How can I help you today?
                </h2>
                <p className="text-sm text-slate max-w-sm leading-relaxed mb-6">
                  Describe your symptoms and I will help triage your condition
                  and connect you with the right specialist.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md w-full">
                  {[
                    "I have had a headache for 3 days",
                    "I feel chest pain when walking",
                    "My child has a fever of 38°C",
                    "I have been feeling very tired lately",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setInput(suggestion)}
                      className="text-left text-xs px-4 py-3 rounded-xl border transition-all hover:shadow-sm"
                      style={{
                        borderColor: "#E6F1FB",
                        background: "white",
                        color: "#042C53",
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1"
                      style={{ background: "#0C447C" }}
                    >
                      <Brain size={14} className="text-white" />
                    </div>
                  )}
                  <div className="max-w-sm lg:max-w-lg">
                    <div
                      className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                      style={{
                        background: msg.role === "user" ? "#0C447C" : "white",
                        color: msg.role === "user" ? "white" : "#042C53",
                        borderRadius:
                          msg.role === "user"
                            ? "18px 18px 4px 18px"
                            : "18px 18px 18px 4px",
                        border:
                          msg.role === "assistant"
                            ? "1px solid #E6F1FB"
                            : "none",
                      }}
                    >
                      {msg.content}
                    </div>
                    <p
                      className="text-xs text-slate mt-1 px-1"
                      style={{
                        textAlign: msg.role === "user" ? "right" : "left",
                      }}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString("en-PK", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {msg.role === "user" && (
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 text-xs font-bold text-white"
                      style={{ background: "#1D9E75" }}
                    >
                      {user?.name?.charAt(0)}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {typing && (
              <div className="flex gap-3 justify-start">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "#0C447C" }}
                >
                  <Brain size={14} className="text-white" />
                </div>
                <div
                  className="bg-white border border-sky-light rounded-2xl"
                  style={{ borderRadius: "18px 18px 18px 4px" }}
                >
                  <TypingIndicator />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="bg-white border-t border-sky-light p-4 flex-shrink-0">
            <div className="flex gap-3 items-end max-w-3xl mx-auto">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Describe your symptoms..."
                rows={1}
                className="flex-1 resize-none input-field text-sm py-3"
                style={{ maxHeight: "120px" }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0
                           text-white transition-all active:scale-95 disabled:opacity-40"
                style={{ background: "#0C447C" }}
              >
                <Send size={17} />
              </button>
            </div>
            <p className="text-xs text-slate text-center mt-2">
              Medivox AI is for triage only. Always consult a verified doctor
              for diagnosis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
