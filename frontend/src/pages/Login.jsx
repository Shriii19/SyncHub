import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const highlights = [
  {
    title: "Focused team messaging",
    description: "Organize conversations across direct messages, project channels, and decision threads.",
  },
  {
    title: "Fast collaboration flow",
    description: "Share updates, align priorities, and keep delivery moving without context switching.",
  },
  {
    title: "Built for secure work",
    description: "Reliable access control and protected communication for distributed teams.",
  },
];

const stats = [
  { value: "12k+", label: "messages delivered daily" },
  { value: "94%", label: "weekly team retention" },
  { value: "38", label: "active product squads" },
];

const trustBadges = ["SOC-aware access", "Real-time channels", "Cross-team updates"];

function Icon({ path, className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={path} />
    </svg>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email: email.trim(),
        password,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", data.email || email.trim().toLowerCase());
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        name: username.trim(),
        email: email.trim(),
        password,
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("userEmail", data.email || email.trim().toLowerCase());
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3.5 pl-11 pr-11 text-[15px] text-white outline-none transition duration-200 placeholder:text-slate-500 focus:border-cyan-300/50 focus:bg-white/8 focus:ring-4 focus:ring-cyan-400/10";

  return (
    <div className="relative min-h-screen overflow-hidden bg-(--page-bg) text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.12),transparent_28%),radial-gradient(circle_at_75%_20%,rgba(14,165,233,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.14),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 auth-grid opacity-40" />

      <div className="relative mx-auto flex min-h-screen max-w-360 flex-col lg:flex-row">
        <section className="flex flex-1 items-center px-6 py-10 sm:px-10 lg:px-16 lg:py-14 xl:px-20">
          <div className="w-full max-w-2xl animate-fade-up">
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-linear-to-br from-cyan-400 to-blue-500 text-lg font-black text-slate-950 shadow-[0_18px_45px_rgba(14,165,233,0.25)]">
                S
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight text-white">SyncHub</p>
                <p className="text-sm text-slate-400">Team communication, made operational.</p>
              </div>
            </div>

            <div className="max-w-xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                Trusted workspace messaging
              </div>

              <h1 className="max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                A sharper workspace for teams that need fast decisions and clear communication.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                SyncHub brings project channels, direct conversations, and live coordination into one focused environment that feels dependable from the first sign-in.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((item, index) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-white/10 bg-white/6 p-5 shadow-[0_24px_60px_rgba(2,6,23,0.26)] backdrop-blur-xl animate-fade-up"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <div className="text-3xl font-semibold tracking-tight text-white">{item.value}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-4xl border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.88),rgba(15,23,42,0.56))] p-5 shadow-[0_35px_90px_rgba(2,6,23,0.35)] backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/8 pb-4">
                  <div>
                    <p className="text-sm font-semibold text-white">Launch coordination</p>
                    <p className="mt-1 text-sm text-slate-400">Cross-functional team channel</p>
                  </div>
                  <div className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                    18 active now
                  </div>
                </div>

                <div className="space-y-4 py-5">
                  {[
                    { name: "Maya", role: "Product", message: "Design QA is complete. Engineering can lock the launch checklist.", accent: "bg-emerald-400" },
                    { name: "Jon", role: "Engineering", message: "API latency is below target. Shipping the final release candidate now.", accent: "bg-cyan-400" },
                    { name: "Nia", role: "Ops", message: "Support macros are ready and rollout monitoring starts at 14:00 UTC.", accent: "bg-violet-400" },
                  ].map((message) => (
                    <div key={message.name} className="flex gap-3 rounded-2xl border border-white/6 bg-white/5 p-4">
                      <div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${message.accent}`} />
                      <div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-semibold text-white">{message.name}</span>
                          <span className="text-slate-500">{message.role}</span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3 rounded-2xl border border-white/8 bg-slate-950/40 p-4 sm:grid-cols-3">
                  {trustBadges.map((item) => (
                    <div key={item} className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3 text-center text-xs font-medium tracking-[0.16em] text-slate-300 uppercase">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {highlights.map((item, index) => (
                  <div
                    key={item.title}
                    className="rounded-4xl border border-white/10 bg-white/6 p-5 backdrop-blur-xl animate-fade-up"
                    style={{ animationDelay: `${140 + index * 100}ms` }}
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/8 text-cyan-200">
                      <Icon path={[
                        "M4 7h16M4 12h10M4 17h7",
                        "M3 8l7.2 4.8a3 3 0 003.6 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                        "M12 11V7m0 8h.01M7 4h10l1 3v4.6a4 4 0 01-4 4H10a4 4 0 01-4-4V7l1-3z",
                      ][index]} />
                    </div>
                    <h2 className="text-lg font-semibold tracking-tight text-white">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative flex w-full items-center justify-center px-6 pb-10 sm:px-10 lg:w-135 lg:px-10 lg:pb-0 xl:w-145 xl:px-14">
          <div className="absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-white/12 to-transparent lg:inset-x-0 lg:left-0 lg:top-8 lg:h-auto lg:w-px lg:bg-linear-to-b" />

          <div className="relative w-full max-w-md animate-fade-up rounded-4xl border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.88),rgba(15,23,42,0.72))] p-6 shadow-[0_40px_120px_rgba(2,6,23,0.48)] backdrop-blur-2xl sm:p-8">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-cyan-200">{isSignUp ? "Set up your workspace" : "Secure sign in"}</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                  {isSignUp ? "Create your account" : "Welcome back"}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {isSignUp ? "Launch team collaboration with a cleaner, more organized workspace." : "Access your team channels, direct messages, and live collaboration history."}
                </p>
              </div>

              <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right sm:block">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Status</div>
                <div className="mt-1 text-sm font-semibold text-emerald-300">Operational</div>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl border border-white/8 bg-slate-950/40 p-1.5">
              {[false, true].map((su) => (
                <button
                  key={String(su)}
                  type="button"
                  onClick={() => {
                    setIsSignUp(su);
                    setError("");
                  }}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    isSignUp === su
                      ? "bg-white text-slate-950 shadow-[0_12px_30px_rgba(255,255,255,0.16)]"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {su ? "Create account" : "Sign in"}
                </button>
              ))}
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 animate-shake">
                <div className="mt-0.5 text-rose-300">
                  <Icon path="M12 8v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" className="h-5 w-5" />
                </div>
                <p className="text-sm leading-6 text-rose-100">{error}</p>
              </div>
            )}

            <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Username</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                      <Icon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM5 20a7 7 0 0114 0" className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required={isSignUp}
                      className={inputClass}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Email address</label>
                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <Icon path="M3 7l8.28 5.52a1.3 1.3 0 001.44 0L21 7M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Password</label>
                  {!isSignUp && (
                    <button type="button" className="text-sm font-medium text-cyan-200 transition hover:text-cyan-100">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <Icon path="M12 14v2m-6 4h12a2 2 0 002-2v-5a2 2 0 00-2-2H6a2 2 0 00-2 2v5a2 2 0 002 2zm10-9V8a4 4 0 00-8 0v3" className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-200"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <Icon
                        path="M4 4l16 16M10.73 10.73a3 3 0 004.24 4.24M9.88 5.09A10.94 10.94 0 0112 5c4.8 0 8.77 3 10 7a11.8 11.8 0 01-3.04 4.57M6.1 6.11A11.77 11.77 0 002 12c1.23 4 5.2 7 10 7a10.9 10.9 0 005.01-1.2"
                        className="h-4 w-4"
                      />
                    ) : (
                      <Icon
                        path="M2 12c1.23-4 5.2-7 10-7s8.77 3 10 7c-1.23 4-5.2 7-10 7S3.23 16 2 12zm10-3a3 3 0 100 6 3 3 0 000-6z"
                        className="h-4 w-4"
                      />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-cyan-400 via-sky-500 to-blue-600 px-4 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_24px_55px_rgba(14,165,233,0.35)] transition duration-200 hover:-translate-y-px hover:shadow-[0_28px_60px_rgba(14,165,233,0.42)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.29A7.96 7.96 0 014 12H0c0 3.04 1.13 5.82 3 7.94l3-2.65z" />
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>{isSignUp ? "Create account" : "Continue to workspace"}</span>
                    <Icon path="M5 12h14m-4-4l4 4-4 4" className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-white/8 bg-slate-950/35 p-4 text-sm text-slate-400">
              <div className="flex items-center justify-between gap-3">
                <span>{isSignUp ? "Already have an account?" : "Need access for your team?"}</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError("");
                  }}
                  className="font-semibold text-cyan-200 transition hover:text-cyan-100"
                >
                  {isSignUp ? "Sign in" : "Create one"}
                </button>
              </div>
            </div>

            <p className="mt-6 text-center text-xs leading-6 text-slate-500">
              Protected access for authenticated workspaces. Your session remains encrypted in transit.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;
