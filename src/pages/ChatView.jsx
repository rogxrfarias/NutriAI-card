import { useState, useRef, useEffect } from "react";
import getUserId from "../utils/UserId";
import { chatConfig } from "../config/chatConfig";
import { ChevronLeft } from "@boxicons/react";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "../utils/analytics";

// ─── Config ─────────────────────────────────────────────────
const CONFIG = chatConfig;

const userId = getUserId();
const WHATSAPP_URL = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(
  `Olá @${userId} (Não apague essa mensagem)`,
)}`;

const INITIAL_MESSAGE = {
  role: "assistant",
  content: `Olá! 👋 Sou a assistente virtual da ${CONFIG.name}.\n\nVou te ajudar a entender melhor a alimentação do seu filho em menos de 2 minutos.\n\nPara começar: **qual é a maior dificuldade na hora das refeições?**`,
  showCTA: false,
};

const STAGE_PROGRESS = {
  1: 0,
  2: 20,
  3: 40,
  4: 80,
  5: 100,
};

// ─── Helpers ────────────────────────────────────────────────
const formatText = (text) =>
  text
    .replace(/```[\s\S]*?```/g, "<em>[conteúdo técnico removido]</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\n/g, "<br/>");

// ─── TypingIndicator ────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-full bg-emerald-300 flex items-center justify-center text-sm shrink-0 mt-1">
        🥗
      </div>
      <div className="bg-white border border-stone-100 shadow-sm px-4 py-3 rounded-2xl rounded-tl-none">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 0.15, 0.3].map((d) => (
            <span
              key={d}
              style={{ animationDelay: `${d}s` }}
              className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MessageBubble ──────────────────────────────────────────
function MessageBubble({ msg, animate, onWhatsappClick }) {
  const isUser = msg.role === "user";

  return (
    <div
      className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"} 
        ${animate ? "animate-fade-in" : ""}`}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-emerald-300 flex items-center justify-center text-sm shrink-0 mb-1">
          🥗
        </div>
      )}

      <div
        className={`flex flex-col gap-2 max-w-[78%] ${isUser ? "items-end" : "items-start"}`}
      >
        <div
          className={`px-4 py-3 text-sm leading-relaxed shadow-sm
            ${
              isUser
                ? "bg-emerald-600 text-white rounded-2xl rounded-br-none"
                : "bg-white text-stone-800 rounded-2xl rounded-bl-none border border-stone-100"
            }`}
          dangerouslySetInnerHTML={{ __html: formatText(msg.content) }}
        />

        {msg.showCTA && (
          <a
            onClick={onWhatsappClick}
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-3 bg-[#25d366] hover:bg-[#1fbc5a] text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.135.561 4.14 1.535 5.877L0 24l6.318-1.506A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.65-.49-5.18-1.346l-.37-.217-3.743.892.934-3.638-.243-.385A9.937 9.937 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
            Falar com a Dra. agora
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────
export default function AIChatPage() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [newIdx, setNewIdx] = useState(null);
  const [stage, setStage] = useState(1);
  const [pendingLead, setPendingLead] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const backArrow = () => navigate("/");

  useEffect(() => {
    if (!loading) inputRef.current?.focus();
  }, [loading]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // dispara quando o usuário clica no botão do WhatsApp
  const handleWhatsappClick = async () => {
    trackEvent(userId, "whatsapp_click");

    if (pendingLead) {
      try {
        await fetch(`${CONFIG.n8nWebhookUrl}/save-lead`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pendingLead, userId),
        });
      } catch (err) {
        console.error("save-lead error:", err);
      }
    }
  };

  const send = async () => {
    if (!input.trim() || loading) return;

    // registra chat_start apenas na primeira mensagem do usuário
    if (messages.length === 1) {
      trackEvent(userId, "chat_start");
    }

    const userMsg = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setNewIdx(messages.length);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${CONFIG.n8nWebhookUrl}/smart-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: getUserId(),
          user_input: userMsg.content,
        }),
      });

      const data = await response.json();
      const content =
        data.cleanOutput ||
        data.text ||
        "Desculpe, tive um problema ao processar sua resposta.";

      // atualiza estágio
      if (data.stage && STAGE_PROGRESS[data.stage] !== undefined) {
        setStage(data.stage);
      }

      // guarda lead pendente para salvar quando clicar no WhatsApp
      if (data.pendingLead) {
        setPendingLead(data.pendingLead);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content, showCTA: data.showCTA === true },
      ]);
      setNewIdx(messages.length + 1);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Ops! Tive um probleminha técnico. Poderia tentar novamente? 🙏",
          showCTA: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const progress = STAGE_PROGRESS[stage] ?? 0;

  return (
    <>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.25s ease forwards; }
      `}</style>

      <div className="flex flex-col h-dvh bg-stone-50 w-screen max-w-xl mx-auto relative">
        {/* ── Header ── */}
        <header className="shrink-0 bg-white border-b border-stone-100 shadow-sm">
          <div className="flex items-center gap-3 px-4 py-3">
            <span
              className="text-gray-600 px-1 cursor-pointer"
              onClick={backArrow}
            >
              <ChevronLeft />
            </span>
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-full bg-linear-to-br from-emerald-400 to-green-600 flex items-center justify-center text-xl shadow-sm">
                🥗
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-stone-800 text-sm leading-none">
                {CONFIG.agentName}
              </p>
              <p className="text-[11px] text-emerald-600 mt-0.5 font-medium">
                Assistente da {CONFIG.name}
              </p>
            </div>
          </div>

          {/* barra de progresso por estágio */}
          <div className="h-0.5 bg-stone-100 mx-4 mb-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[10px] text-stone-400 text-center pb-2 tracking-wide">
            Simulação do plano alimentar · {progress}% concluído
          </p>
        </header>

        {/* ── Messages ── */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-emerald-100">
          {messages.map((msg, i) => (
            <MessageBubble
              key={i}
              msg={msg}
              animate={i === newIdx}
              onWhatsappClick={handleWhatsappClick}
            />
          ))}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* ── Input ── */}
        <div className="shrink-0 bg-white border-t border-stone-100 px-4 py-3">
          <div className="flex gap-2 items-center">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Digite sua resposta..."
              disabled={loading}
              className="flex-1 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition-all disabled:opacity-50"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="w-11 h-11 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center shadow-md transition-all duration-150 hover:scale-105 active:scale-95 disabled:hover:scale-100"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22l-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-stone-300 text-center mt-2">
            Powered by NutriAI Card · suas respostas são privadas
          </p>
        </div>
      </div>
    </>
  );
}
