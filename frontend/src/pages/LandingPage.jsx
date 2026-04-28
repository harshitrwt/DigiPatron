import React from 'react'
import { Fingerprint, GitBranch, FileText, ArrowRight, Shield, Zap, Globe, Upload, Search, TreePine } from 'lucide-react'

// ── Reusable card shell ──────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{
    background: '#080808',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 36,
    position: 'relative',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '8px 8px 0px var(--orange), 0 20px 40px rgba(0,0,0,0.4)',
    ...style,
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = '12px 12px 0px var(--orange), 0 24px 48px rgba(232,98,26,0.1)' }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '8px 8px 0px var(--orange), 0 20px 40px rgba(0,0,0,0.4)' }}
  >{children}</div>
)

// ── Mini dashboard mockup (right side of hero) ───────────────
function DashboardMockup() {
  return (
    <div style={{
      background: '#111', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 12, overflow: 'hidden',
      boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
      height: '100%',
      
      objectPosition: 'center',
      width: '100%',

    }}>
      {/* Browser bar */}
      <div style={{ background: '#1A1A1A', padding: '10px 16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 6, alignItems: 'center' }}>
        {['#FF5F57', '#FEBC2E', '#28C840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
        <div style={{ flex: 1, marginLeft: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 4, padding: '3px 12px', fontSize: 11, color: 'var(--text3)', fontFamily: 'JetBrains Mono,monospace' }}>
          digiwarden.app/dashboard
        </div>
      </div>

      {/* Dashboard content */}
      <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 0 }}>
        {/* Sidebar */}
        <div style={{ background: '#0F0F0F', borderRight: '1px solid var(--border)', padding: '16px 12px', fontSize: 12 }}>
          <div style={{ color: 'var(--orange)', fontWeight: 700, marginBottom: 16, fontSize: 13 }}>DigiWarden</div>
          {['Dashboard', 'Products', 'Analyze', 'Done', 'Settings'].map((item, i) => (
            <div key={item} style={{
              padding: '7px 10px', borderRadius: 6, marginBottom: 2,
              background: i === 0 ? 'rgba(232,98,26,0.15)' : 'transparent',
              color: i === 0 ? 'var(--orange)' : 'var(--text3)', cursor: 'pointer', fontSize: 12,
            }}>{item}</div>
          ))}
        </div>

        {/* Main */}
        <div style={{ padding: 32, minHeight: 460 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
            <div style={{ background: '#1A1A1A', border: '1px solid var(--border)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Similarity Score</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 80 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', border: '4px solid var(--orange)', borderTopColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: 'var(--orange)', boxShadow: '0 0 20px rgba(232,98,26,0.2)' }}>
                  86
                </div>
              </div>
            </div>
            <div style={{ background: '#1A1A1A', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 12, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Propagation Tree</div>
              <div style={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="100%" height={80} viewBox="0 0 120 56">
                  <line x1="20" y1="10" x2="50" y2="28" stroke="rgba(232,98,26,0.4)" strokeWidth="1.5" strokeDasharray="3,2" />
                  <line x1="20" y1="10" x2="50" y2="46" stroke="rgba(232,98,26,0.4)" strokeWidth="1.5" strokeDasharray="3,2" />
                  <line x1="50" y1="28" x2="90" y2="18" stroke="rgba(255,59,92,0.5)" strokeWidth="1.5" strokeDasharray="3,2" />
                  <line x1="50" y1="28" x2="90" y2="38" stroke="rgba(232,98,26,0.4)" strokeWidth="1.5" strokeDasharray="3,2" />
                  <circle cx="20" cy="10" r="7" fill="#22C55E" />
                  <circle cx="50" cy="28" r="5" fill="var(--orange)" />
                  <circle cx="50" cy="46" r="5" fill="var(--orange)" />
                  <circle cx="90" cy="18" r="5" fill="#FF3B5C" />
                  <circle cx="90" cy="38" r="5" fill="var(--orange)" />
                </svg>
              </div>
            </div>
          </div>
          
          <div style={{ background: 'rgba(255,59,92,0.05)', border: '1px solid rgba(255,59,92,0.1)', borderRadius: 12, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF3B5C', boxShadow: '0 0 10px #FF3B5C' }} />
              <div style={{ fontSize: 12, fontWeight: 800, color: '#FF3B5C', letterSpacing: '0.05em' }}>CRITICAL INFRINGEMENT ALERT</div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 20 }}>
              Mathematical forensic fingerprint detected on 12 platforms including X (Twitter), Instagram, and private sports forums. AI has already mapped the full propagation route.
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ padding: '8px 16px', background: 'var(--orange)', borderRadius: 6, fontSize: 12, fontWeight: 800, color: '#111', cursor: 'pointer' }}>Generate Legal Draft</div>
              <div style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, color: '#fff', cursor: 'pointer' }}>View Evidence Vault</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LandingPage({ navigate }) {
  const features = [
    { icon: Fingerprint, title: 'Fingerprint Detection', desc: 'pHash + ORB + semantic embeddings fused into a single tamper-proof score.' },
    { icon: GitBranch, title: 'Propagation Mapping', desc: 'Visualize exactly how copies spread across the internet as a live DAG.' },
    { icon: FileText, title: 'DMCA Workflow', desc: 'AI-generated legal takedown notices backed by forensic evidence.' },
  ]

  const howSteps = [
    { n: 1, title: 'Upload', desc: 'Upload your original image. ContentGenome assigns a unique ID and begins fingerprinting immediately.' },
    { n: 2, title: 'Analyze', desc: 'Three fingerprint methods run in parallel: pHash, ORB, and CLIP embeddings fused into a combined score.' },
    { n: 3, title: 'Trace', desc: 'Matched copies are arranged in a directed propagation tree, with mutation type labeled on each edge.' },
    { n: 4, title: 'Act', desc: 'Generate a complete DMCA notice with pre-filled evidence. Copy, download, or send directly to platforms.' },
  ]

  const why = [
    { icon: Shield, title: 'Cryptographic Provenance', desc: 'SHA-256 + pHash vault registration proves ownership at the moment of upload.' },
    { icon: Zap, title: 'Automated Web Scanning', desc: 'Gemini Vision identifies the image context; Google Custom Search finds copies across the internet.' },
    { icon: Globe, title: 'One-Click Legal Action', desc: 'Generate platform-ready DMCA notices with mathematical fingerprint evidence cited.' },
  ]

  const Btn = ({ children, onClick, style = {}, outline = false }) => (
    <button
      onClick={onClick}
      style={{
        padding: '13px 26px', borderRadius: 10,
        background: outline ? 'transparent' : 'var(--orange)',
        color: outline ? '#fff' : '#111',
        border: outline ? '1px solid var(--border)' : 'none',
        fontSize: 15, fontWeight: 600, cursor: 'pointer',
        fontFamily: 'Inter, sans-serif', transition: 'all 0.18s', ...style,
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; if (!outline) e.currentTarget.style.background = 'var(--orange2)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; if (!outline) e.currentTarget.style.background = 'var(--orange)' }}
    >
      {children}
    </button>
  )

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ padding: '100px 0 60px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 60, alignItems: 'start' }}>
          {/* Left */}
          <div style={{ animation: 'fadeUp 0.5s ease forwards', position: 'relative' }}>
            <h1 style={{
              fontFamily: 'Syne,sans-serif', fontWeight: 800,
              fontSize: 'clamp(38px,4.5vw,58px)', lineHeight: 1.08, letterSpacing: '-0.03em',
              marginBottom: 20,
            }}>
              <span style={{ color: '#fff' }}>Protect Sports Media From</span>{' '}
              <span style={{
                background: 'linear-gradient(90deg,var(--orange),#FF9040)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Unauthorized Reuse</span>
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text2)', lineHeight: 1.75, marginBottom: 32, maxWidth: 460 }}>
              Track image copies, map propagation trees, and generate takedown-ready reports in one place.
            </p>
            <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
              <Btn onClick={() => navigate('upload')}>Start Tracking</Btn>
            </div>

            {/* Feature pills - Shorter and Balanced */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 40 }}>
              {features.map((f, i) => (
                <div key={f.title} style={{
                  display: 'flex', flexDirection: 'column', gap: 12,
                  background: '#0a0a0a', border: '1px solid var(--border)',
                  borderRadius: 16, padding: '20px 16px',
                  boxShadow: '4px 4px 0px var(--orange)',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translate(-2px, -2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                >
                  <div style={{ width: 32, height: 32, background: 'var(--orange-dim)', border: '1px solid var(--orange-border)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <f.icon size={14} color="var(--orange)" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{f.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.4 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Thicker Solid Inverted Curvy Arrow from 3rd Card to Dashboard */}
            <div style={{ position: 'absolute', bottom: -40, right: '-25%', zIndex: 10, pointerEvents: 'none' }}>
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                <path
                  d="M0,10 Q80,10 90,90"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="4"
                />
                <path
                  d="M82,82 L90,90 L98,82"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Right — digiwarden.png aligned to top */}
          <div style={{ animation: 'fadeIn 0.6s 0.1s ease both', paddingTop: 10 }}>
            <div style={{
              borderRadius: 20,
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.05)',
              background: '#000',
              boxShadow: '0 24px 60px rgba(0,0,0,0.5)'
            }}>
              <img
                src="/digiwardenframe.png"
                alt="DigiWarden Propagation"
                style={{ width: '100%', display: 'block', opacity: 0.95, border: '2px solid var(--orange)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── DASHBOARD SHOWCASE ────────────────────────────── */}
      <section style={{ padding: '20px 0 60px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 32px' }}>
          <div style={{
            animation: 'fadeUp 0.8s ease both',
            transform: 'scale(1.05)',
            transformOrigin: 'top center'
          }}>
            <DashboardMockup />
          </div>
        </div>
      </section>


      <section id="features" style={{ padding: '100px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 36, letterSpacing: '-0.02em' }}>
            Why Sports Media Teams Use It
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {why.map(w => (
              <div key={w.title} style={{
                background: '#080808', border: '1px solid var(--border)',
                borderRadius: 24, padding: '40px 32px',
                display: 'flex', flexDirection: 'column', gap: 24,
                boxShadow: '8px 8px 0px var(--orange)',
                transition: 'all 0.2s ease'
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translate(-3px, -3px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                <div style={{ width: 48, height: 48, flexShrink: 0, background: 'var(--orange-dim)', border: '1px solid var(--orange-border)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <w.icon size={20} color="var(--orange)" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{w.title}</div>
                  <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>{w.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: '100px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <h2 style={{ textAlign: 'center', fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 36, letterSpacing: '-0.02em' }}>
            How It Works
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32, position: 'relative' }}>
            {howSteps.map((h, i) => (
              <React.Fragment key={h.n}>
                <div style={{
                  background: '#080808', border: '1px solid var(--border)',
                  borderRadius: 24, padding: '40px 32px', position: 'relative',
                  boxShadow: '6px 6px 0px var(--orange)',
                  transition: 'all 0.2s ease',
                  zIndex: 2,
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translate(-2px, -2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                >
                  <div style={{
                    position: 'absolute', top: 20, right: 24,
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 28, fontWeight: 800,
                    color: 'rgba(232,98,26,0.1)',
                  }}>{h.n}</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 12 }}>{h.title}</div>
                  <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7 }}>{h.desc}</div>
                </div>

                {/* Curvy Arrow between cards */}
                {i < howSteps.length - 1 && (
                  <div style={{
                    position: 'absolute',
                    width: 60,
                    height: 40,
                    left: `${(i + 1) * 25 - 2.5}%`,
                    top: i % 2 === 0 ? '20%' : '60%',
                    zIndex: 1,
                    pointerEvents: 'none',
                  }}>
                    <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
                      <path
                        d={i % 2 === 0 ? "M0,20 Q30,0 60,20" : "M0,20 Q30,40 60,20"}
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="2"
                        strokeDasharray="4,4"
                      />
                      <path
                        d={i % 2 === 0 ? "M55,15 L60,20 L55,25" : "M55,15 L60,20 L55,25"}
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ─────────────────────────────────────── */}
      <section style={{ padding: '80px 32px 140px' }}>
        <div style={{
          maxWidth: 1000, margin: '0 auto',
          background: 'linear-gradient(135deg, #080808, #020202)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 40, padding: '80px 40px',
          textAlign: 'center',
          boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 80px rgba(232,98,26,0.1)',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, background: 'var(--orange)', filter: 'blur(150px)', opacity: 0.1 }} />
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#fff', marginBottom: 24, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Ready to secure your <br /><span style={{ color: 'var(--orange)' }}>Media?</span>
          </h2>
          <p style={{ fontSize: 18, color: 'var(--text2)', marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
            Join elite sports organizations protecting their digital footprint with mathematical precision.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <Btn style={{ padding: '18px 48px', fontSize: 18 }} onClick={() => navigate('upload')}>Get Started Now</Btn>
          </div>
        </div>
      </section>


      <footer style={{ padding: '40px 16px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', background: '#010101' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 60, marginBottom: 60 }}>
            <div>
              <div style={{ color: 'var(--orange)', fontWeight: 800, fontSize: 24, marginBottom: 20 }}>DigiWarden</div>
              <p style={{ color: 'var(--text3)', fontSize: 14, lineHeight: 1.6, maxWidth: 240 }}>
                Next-generation forensic protection for high-value sports media and digital assets.
              </p>
            </div>

          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ color: 'var(--text3)', fontSize: 12 }}>© 2026 DigiWarden Forensic. All rights reserved.</div>

          </div>
        </div>
      </footer>
    </div>
  )
}
