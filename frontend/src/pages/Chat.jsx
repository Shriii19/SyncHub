import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "../components/Icon";
import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const socket = io(API_BASE_URL);

const ROOM_MODES = {
  dm: {
    title: "1 to 1 Secret Chat",
    detail: "Private room for two people only.",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zm6 13a6 6 0 00-12 0m12 0H10m12 0h-2",
  },
  group: {
    title: "Group Secret Chat",
    detail: "Invite multiple people with one private link.",
    icon: "M17 20h5v-2a3 3 0 00-5.36-1.86M17 20H7m10 0v-2a5 5 0 00-9.29-2.86M7 20H2v-2a3 3 0 015.36-1.86M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  },
};

function getOrCreateAnonymousId() {
  const existing = localStorage.getItem("anonymousId");
  if (existing) return existing;

  const newId = typeof crypto !== "undefined" && crypto.randomUUID
    ? `anon_${crypto.randomUUID().replace(/-/g, "").slice(0, 14)}`
    : `anon_${Math.random().toString(36).slice(2, 16)}`;
  localStorage.setItem("anonymousId", newId);
  return newId;
}

function createRoomId(mode) {
  const randomPart = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID().replace(/-/g, "")
    : Math.random().toString(36).slice(2, 18);
  return `${mode}_${randomPart.slice(0, 18)}`;
}

function formatTime(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function buildShareLink(roomId, mode) {
  if (!roomId || !mode) return "";
  const url = new URL(window.location.origin + "/chat");
  url.searchParams.set("room", roomId);
  url.searchParams.set("mode", mode);
  return url.toString();
}


function Chat() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomMode, setRoomMode] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [showModePicker, setShowModePicker] = useState(false);
  const [joinInput, setJoinInput] = useState("");
  const [error, setError] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const anonymousId = useMemo(() => getOrCreateAnonymousId(), []);
  const shareLink = useMemo(() => buildShareLink(roomId, roomMode), [roomId, roomMode]);

  useEffect(() => {
    const mode = searchParams.get("mode");
    const room = searchParams.get("room");

    if ((mode === "dm" || mode === "group") && room) {
      setRoomMode(mode);
      setRoomId(room);
      setShowModePicker(false);
      setError("");
    }
  }, [searchParams]);

  useEffect(() => {
    if (!roomId || !roomMode) return;

    setLoadingHistory(true);
    setMessages([]);

    const token = localStorage.getItem("token");
    axios
      .get(`${API_BASE_URL}/api/messages/${roomId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then(({ data }) => {
        if (Array.isArray(data)) setMessages(data);
      })
      .catch(() => {
        setError("Unable to load previous messages for this room.");
      })
      .finally(() => setLoadingHistory(false));

    socket.emit("joinRoom", roomId);
    const receiveHandler = (payload) => {
      if (payload?.roomId && payload.roomId !== roomId) return;
      setMessages((prev) => [...prev, payload]);
    };

    socket.on("receiveMessage", receiveHandler);
    return () => {
      socket.off("receiveMessage", receiveHandler);
      socket.emit("leaveRoom", roomId);
    };
  }, [roomId, roomMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLogout = () => {
    // Remove authentication and user info on logout
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const startChatFlow = () => {
    setShowModePicker(true);
    setError("");
  };

  const createChatRoom = (mode) => {
    const newRoomId = createRoomId(mode);
    setSearchParams({ mode, room: newRoomId });
    setCopied(false);
  };

  const joinByLinkOrCode = () => {
    const trimmed = joinInput.trim();
    if (!trimmed) {
      setError("Paste a room link or code first.");
      return;
    }

    try {
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        const url = new URL(trimmed);
        const mode = url.searchParams.get("mode");
        const room = url.searchParams.get("room");

        if ((mode === "dm" || mode === "group") && room) {
          setSearchParams({ mode, room });
          setJoinInput("");
          setError("");
          return;
        }
      }

      const [maybeMode, maybeRoom] = trimmed.split(":");
      if ((maybeMode === "dm" || maybeMode === "group") && maybeRoom) {
        setSearchParams({ mode: maybeMode, room: maybeRoom });
        setJoinInput("");
        setError("");
        return;
      }

      setError("Invalid link or room code. Use a valid invite URL.");
    } catch {
      setError("Invalid link format. Please check and try again.");
    }
  };

  const copyShareLink = async () => {
    if (!shareLink) return;
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const sendMessage = () => {
    if (!message.trim() || !roomId || !roomMode || sending) return;

    setSending(true);
    socket.emit("sendMessage", {
      senderId: anonymousId,
      sender: anonymousId,
      roomId,
      roomMode,
      content: message.trim(),
      createdAt: new Date().toISOString(),
    });

    setMessage("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTextareaChange = (e) => {
    setMessage(e.target.value);
    const area = textareaRef.current;
    if (!area) return;
    area.style.height = "auto";
    area.style.height = `${Math.min(area.scrollHeight, 140)}px`;
  };

  const resetSession = () => {
    setSearchParams({});
    setRoomId("");
    setRoomMode(null);
    setMessages([]);
    setMessage("");
    setCopied(false);
    setError("");
    setShowModePicker(true);
  };

  const roomActive = Boolean(roomId && roomMode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a1020] text-white">
      {/* Decorative Blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-cyan-400 opacity-20 blur-3xl animate-blob animation-delay-2000" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-500 opacity-20 blur-3xl animate-blob animation-delay-4000" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="mb-6 flex items-center justify-between rounded-3xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 text-2xl font-black text-slate-950 shadow-md">
              S
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">SyncHub Secret Chat</p>
              <p className="text-sm text-slate-400">Anonymous rooms by invite link only.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {roomActive && (
              <button
                onClick={resetSession}
                className="rounded-xl border border-white/12 bg-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/20 shadow-sm"
              >
                New chat
              </button>
            )}
            <button
              onClick={handleLogout}
              className="rounded-xl border border-rose-300/20 bg-rose-300/10 px-4 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-300/16 shadow-sm"
            >
              Logout
            </button>
          </div>
        </header>

        {!roomActive && (
          <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[30px] border border-white/10 bg-white/6 p-6 backdrop-blur-xl sm:p-8">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
                Private by design
              </p>
              <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Chat without sharing real names, numbers, or identity details.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Start a secret room, share one link with your friend, and begin chatting anonymously.
                You choose whether it is 1-to-1 or a private group room.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  "No public user directory",
                  "Room access by private invite",
                  "Anonymous sender labels",
                ].map((item) => (
                  <div key={item} className="rounded-[1.5rem] border border-white/10 bg-slate-950/30 px-4 py-3 text-xs uppercase tracking-[0.14em] text-slate-300 hover:bg-cyan-400/10 hover:scale-105 transition-transform duration-200">
                    {item}
                  </div>
                ))}
              </div>

              <button
                onClick={startChatFlow}
                className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-cyan-400 to-blue-600 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_45px_rgba(14,165,233,0.35)] transition hover:-translate-y-px"
              >
                <Icon path="M12 5v14m7-7H5" className="h-4 w-4" />
                Start secret chat
              </button>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/6 p-6 backdrop-blur-xl sm:p-8">
              <h2 className="text-lg font-semibold">Join existing room</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">Paste a full invite link generated by your friend.</p>

              <div className="mt-4 space-y-3">
                <input
                  type="text"
                  placeholder="https://your-app/chat?mode=dm&room=..."
                  value={joinInput}
                  onChange={(e) => setJoinInput(e.target.value)}
                  className="w-full rounded-2xl border border-white/12 bg-slate-950/45 px-4 py-3 text-sm outline-none transition placeholder:text-slate-300 focus:border-cyan-300/40 focus:ring-4 focus:ring-cyan-400/10"
                />
                <button
                  onClick={joinByLinkOrCode}
                  className="w-full rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/18"
                >
                  Join secret room
                </button>
              </div>

              {error && (
                <p className="mt-4 rounded-xl border border-rose-300/25 bg-rose-300/12 px-3 py-2 text-sm text-rose-100">
                  {error}
                </p>
              )}
            </div>
          </section>
        )}

        {showModePicker && !roomActive && (
          <section className="mt-5 rounded-[30px] border border-white/10 bg-slate-950/45 p-5 backdrop-blur-xl sm:p-6">
            <h2 className="text-lg font-semibold">Choose chat type</h2>
            <p className="mt-1 text-sm text-slate-400">Create a room and get an invite link immediately.</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {Object.entries(ROOM_MODES).map(([key, mode]) => (
                <button
                  key={key}
                  onClick={() => createChatRoom(key)}
                  className="rounded-[2rem] border border-white/12 bg-white/6 p-5 text-left transition hover:border-cyan-300/30 hover:bg-white/10 hover:scale-105 hover:shadow-lg duration-200"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
                    <Icon path={mode.icon} className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold">{mode.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{mode.detail}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {roomActive && (
          <section className="grid flex-1 gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <aside className="rounded-[30px] border border-white/10 bg-white/6 p-5 backdrop-blur-xl sm:p-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
                Room Active
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">{ROOM_MODES[roomMode]?.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">Share this private link. Anyone with this link can join this secret room.</p>

              <div className="mt-5 rounded-2xl border border-white/12 bg-slate-950/45 p-3">
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">Invite link</p>
                <p className="break-all text-sm text-slate-200">{shareLink}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={copyShareLink}
                    className="rounded-xl bg-linear-to-r from-cyan-400 to-blue-600 px-4 py-2 text-sm font-semibold text-slate-950"
                  >
                    {copied ? "Copied" : "Copy link"}
                  </button>
                  <button
                    onClick={resetSession}
                    className="rounded-xl border border-white/12 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200"
                  >
                    End room
                  </button>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/12 bg-slate-950/35 p-4 text-sm leading-7 text-slate-300">
                <p>Mode: <span className="font-semibold text-white">{roomMode === "dm" ? "1 to 1" : "Group"}</span></p>
                <p>Room ID: <span className="font-mono text-xs text-slate-300">{roomId}</span></p>
                <p>Your ID in this room: <span className="font-mono text-xs text-slate-300">{anonymousId}</span></p>
              </div>
            </aside>

            <div className="flex min-h-135 flex-col rounded-[30px] border border-white/10 bg-white/6 backdrop-blur-xl">
              <div className="border-b border-white/10 px-5 py-4 sm:px-6">
                <h3 className="text-lg font-semibold">Secret room conversation</h3>
                <p className="mt-1 text-sm text-slate-400">Participants are displayed as anonymous identities only.</p>
              </div>

              <main className="scrollbar-thin flex-1 space-y-3 overflow-y-auto px-5 py-4 sm:px-6">
                {loadingHistory && <p className="text-sm text-slate-500">Loading room history...</p>}

                {!loadingHistory && messages.length === 0 && (
                  <div className="mt-8 rounded-2xl border border-dashed border-white/16 bg-slate-950/35 p-6 text-center">
                    <p className="text-sm text-slate-400">This room is empty. Send the first anonymous message.</p>
                  </div>
                )}

                {messages.map((msg, index) => {
                  const senderId = msg.senderId || msg.sender || "anon_guest";
                  const isMe = senderId === anonymousId;
                  return (
                    <div key={`${msg.createdAt || "t"}_${index}`} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${isMe ? "bg-linear-to-br from-cyan-400 to-blue-600 text-slate-950" : "border border-white/10 bg-slate-950/40 text-slate-100"}`}>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] opacity-70">
                          {isMe ? "You" : "Guest"}
                        </p>
                        <p className="whitespace-pre-wrap wrap-break-word">{msg.content}</p>
                        <p className={`mt-1 text-[11px] ${isMe ? "text-slate-800/80" : "text-slate-500"}`}>
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}

                <div ref={messagesEndRef} />
              </main>

              <footer className="border-t border-white/10 px-5 py-4 sm:px-6">
                <div className="flex items-end gap-3 rounded-2xl border border-white/12 bg-slate-950/40 p-3">
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    placeholder="Send anonymous message..."
                    className="max-h-35 min-h-6 flex-1 resize-none bg-transparent text-sm leading-6 text-white outline-none placeholder:text-slate-300"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!message.trim() || sending}
                    className="rounded-xl bg-linear-to-r from-cyan-400 to-blue-600 px-4 py-2.5 text-sm font-semibold text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Send
                  </button>
                </div>
                {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}
              </footer>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Chat;
