import { useState, useEffect, useRef } from 'react';
import { Github, Mail, Phone, ExternalLink, Menu, X, Download, ChevronDown } from 'lucide-react';

// ── Typewriter Hook ──────────────────────────────────────────────
function useTypewriter(words: string[], speed = 100, pause = 1800) {
  const [display, setDisplay] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, display.length + 1));
        if (display.length + 1 === current.length) setTimeout(() => setDeleting(true), pause);
      } else {
        setDisplay(current.slice(0, display.length - 1));
        if (display.length - 1 === 0) {
          setDeleting(false);
          setWordIdx((wordIdx + 1) % words.length);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [display, deleting, wordIdx, words, speed, pause]);

  return display;
}

// ── Scroll Reveal Hook ───────────────────────────────────────────
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

// ── Reveal Wrapper ───────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ── Data ─────────────────────────────────────────────────────────
const projects = [
  {
    icon: '🍽️',
    title: 'Zomato Data Analysis',
    desc: 'Exploratory data analysis on the Zomato dataset to uncover insights on restaurant ratings, popular cuisines, and city-wise distribution using Python.',
    tags: ['Python', 'Pandas', 'Seaborn', 'EDA'],
    link: 'https://github.com/DataWithRiddhesh',
  },
  {
    icon: '📊',
    title: 'Power BI Sales Dashboard',
    desc: 'Interactive Power BI dashboard with dynamic KPIs, regional sales filters, trend lines, and revenue breakdowns for business decision-making.',
    tags: ['Power BI', 'DAX', 'Data Viz'],
    link: 'https://github.com/DataWithRiddhesh',
  },
  {
    icon: '💹',
    title: 'Sales Data Analysis',
    desc: 'End-to-end sales data pipeline: data cleaning, trend forecasting, and multi-dimensional visualization using NumPy and Matplotlib.',
    tags: ['Python', 'NumPy', 'Matplotlib'],
    link: 'https://github.com/DataWithRiddhesh',
  },
];

const skills = [
  { name: 'Python', icon: '🐍' },
  { name: 'Pandas', icon: '🐼' },
  { name: 'NumPy', icon: '🔢' },
  { name: 'Matplotlib', icon: '📉' },
  { name: 'Seaborn', icon: '🎨' },
  { name: 'Power BI', icon: '📊' },
  { name: 'SQL', icon: '🗄️' },
  { name: 'Machine Learning', icon: '🤖' },
  { name: 'Data Visualization', icon: '📈' },
  { name: 'GitHub', icon: '🐙' },
];

// ── Particle Canvas ──────────────────────────────────────────────
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,212,255,0.5)';
        ctx.fill();
      });
      // draw lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,212,255,${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

// ── Main App ─────────────────────────────────────────────────────
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const typed = useTypewriter(['AI/ML Engineer', 'Data Analyst', 'Python Developer', 'BI Developer']);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = ['About', 'Projects', 'Skills', 'Contact'];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0f1e', color: '#e2e8f0' }}>

      {/* ── NAV ── */}
      <nav
        className="fixed top-0 w-full z-50 transition-all duration-300"
        style={{ background: scrolled ? 'rgba(10,15,30,0.95)' : 'transparent', backdropFilter: scrolled ? 'blur(10px)' : 'none', borderBottom: scrolled ? '1px solid rgba(0,212,255,0.15)' : 'none' }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="font-mono text-lg font-bold" style={{ color: '#00d4ff' }}>
            &lt;Riddhesh /&gt;
          </span>
          <div className="hidden md:flex gap-8">
            {navLinks.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`}
                className="text-sm font-medium transition-colors duration-200 hover:text-cyan-400"
                style={{ color: '#94a3b8' }}>
                {l}
              </a>
            ))}
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden" style={{ color: '#00d4ff' }}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden px-6 pb-4 flex flex-col gap-4" style={{ background: 'rgba(10,15,30,0.98)' }}>
            {navLinks.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                className="text-sm font-medium" style={{ color: '#94a3b8' }}>{l}</a>
            ))}
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <ParticleBackground />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="animate-fade-in-up">
            <p className="font-mono text-sm mb-4 tracking-widest uppercase" style={{ color: '#00d4ff' }}>
              👋 Hello, World!
            </p>
            <h1 className="text-4xl md:text-7xl font-bold mb-4 leading-tight">
              I'm{' '}
              <span style={{
                background: 'linear-gradient(135deg, #00d4ff, #0099cc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Riddhesh
              </span>
            </h1>
            <h1 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: '#cbd5e1' }}>
              Arvind Chole
            </h1>
            <div className="flex items-center justify-center gap-2 mb-8 text-xl md:text-2xl font-mono">
              <span style={{ color: '#64748b' }}>&gt;</span>
              <span style={{ color: '#00d4ff' }}>{typed}</span>
              <span className="cursor-blink" style={{ color: '#00d4ff' }}>|</span>
            </div>
            <p className="text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: '#94a3b8' }}>
              AI/ML Engineering student turning raw data into powerful insights. I build dashboards, run analyses, and explore the edges of machine learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="#projects"
                className="px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #0099cc)', color: '#0a0f1e' }}>
                View Projects
              </a>
              <a href="/resume.pdf" download
                className="flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105"
                style={{ border: '1px solid #00d4ff', color: '#00d4ff' }}>
                <Download size={16} /> Download Resume
              </a>
              <a href="https://github.com/DataWithRiddhesh" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105"
                style={{ border: '1px solid rgba(0,212,255,0.3)', color: '#94a3b8' }}>
                <Github size={16} /> GitHub
              </a>
            </div>
          </div>
          <a href="#about" className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float" style={{ color: '#00d4ff' }}>
            <ChevronDown size={28} />
          </a>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2 className="font-mono text-3xl md:text-4xl font-bold mb-12 text-center">
              <span style={{ color: '#00d4ff' }}>#</span> About Me
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Reveal delay={0.1}>
              <div className="rounded-xl p-6" style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.15)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-3 h-3 rounded-full bg-red-400"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                  <span className="w-3 h-3 rounded-full bg-green-400"></span>
                  <span className="font-mono text-xs ml-2" style={{ color: '#64748b' }}>about.py</span>
                </div>
                <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#94a3b8' }}>
{`name = "Riddhesh Arvind Chole"
role = "AI/ML Engineering Student"
passion = "Data Analysis"

skills = [
  "Python", "Pandas", "NumPy",
  "Matplotlib", "Seaborn",
  "Power BI", "Machine Learning"
]

print("Turning data → insights 🚀")`}
                </pre>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div>
                <p className="text-base leading-relaxed mb-6" style={{ color: '#94a3b8' }}>
                  I'm an AI/ML Engineering student passionate about turning raw data into meaningful stories. I love working with Python, building interactive dashboards, and solving real-world problems through data.
                </p>
                <p className="text-base leading-relaxed mb-8" style={{ color: '#94a3b8' }}>
                  From exploratory data analysis to Power BI dashboards, I bring both technical depth and visual clarity to every project.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Power BI', 'ML', 'Data Analysis'].map(s => (
                    <span key={s} className="px-3 py-1 rounded-full text-xs font-mono font-semibold"
                      style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className="py-24 px-6" style={{ background: 'rgba(0,212,255,0.02)' }}>
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <h2 className="font-mono text-3xl md:text-4xl font-bold mb-12 text-center">
              <span style={{ color: '#00d4ff' }}>#</span> My Projects
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.15}>
                <div
                  className="rounded-xl p-6 flex flex-col h-full transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] group"
                  style={{
                    background: 'rgba(10,15,30,0.8)',
                    border: '1px solid rgba(0,212,255,0.15)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,212,255,0.6)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,212,255,0.15)')}
                >
                  <div className="text-4xl mb-4">{p.icon}</div>
                  <h3 className="font-bold text-lg mb-3" style={{ color: '#e2e8f0' }}>{p.title}</h3>
                  <p className="text-sm leading-relaxed mb-5 flex-grow" style={{ color: '#94a3b8' }}>{p.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {p.tags.map(t => (
                      <span key={t} className="px-2 py-1 rounded text-xs font-mono"
                        style={{ background: 'rgba(0,212,255,0.08)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <a href={p.link} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-sm font-semibold transition-colors duration-200 hover:text-cyan-300"
                    style={{ color: '#00d4ff' }}>
                    <ExternalLink size={15} /> View Project
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <h2 className="font-mono text-3xl md:text-4xl font-bold mb-12 text-center">
              <span style={{ color: '#00d4ff' }}>#</span> Skills
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {skills.map((s, i) => (
              <Reveal key={s.name} delay={i * 0.05}>
                <div
                  className="rounded-xl p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:scale-105 cursor-default"
                  style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.12)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(0,212,255,0.1)';
                    e.currentTarget.style.borderColor = 'rgba(0,212,255,0.5)';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(0,212,255,0.2)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(0,212,255,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(0,212,255,0.12)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <p className="text-xs font-mono font-semibold" style={{ color: '#94a3b8' }}>{s.name}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, #00d4ff, transparent)' }} />
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <Reveal>
            <h2 className="font-mono text-3xl md:text-4xl font-bold mb-4 text-center">
              <span style={{ color: '#00d4ff' }}>#</span> Let's Connect
            </h2>
            <p className="text-center mb-12" style={{ color: '#64748b' }}>
              Open to opportunities, collaborations, and data conversations!
            </p>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: <Mail size={22} />, label: 'Email', value: 'riddheshchole@gmail.com', href: 'mailto:riddheshchole@gmail.com' },
              { icon: <Phone size={22} />, label: 'Phone', value: '+91 9284990961', href: 'tel:+919284990961' },
              { icon: <Github size={22} />, label: 'GitHub', value: 'DataWithRiddhesh', href: 'https://github.com/DataWithRiddhesh' },
            ].map((c, i) => (
              <Reveal key={c.label} delay={i * 0.1}>
                <a href={c.href} target="_blank" rel="noreferrer"
                  className="flex flex-col items-center gap-3 p-6 rounded-xl text-center transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                  style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.15)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.5)'; e.currentTarget.style.background = 'rgba(0,212,255,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.15)'; e.currentTarget.style.background = 'rgba(0,212,255,0.04)'; }}
                >
                  <span style={{ color: '#00d4ff' }}>{c.icon}</span>
                  <span className="text-xs font-mono uppercase tracking-wider" style={{ color: '#64748b' }}>{c.label}</span>
                  <span className="text-sm font-medium" style={{ color: '#e2e8f0' }}>{c.value}</span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 text-center" style={{ borderTop: '1px solid rgba(0,212,255,0.1)' }}>
        <p className="font-mono text-sm" style={{ color: '#475569' }}>
          Built with ❤️ by{' '}
          <span style={{ color: '#00d4ff' }}>Riddhesh Arvind Chole</span>
          {' '}· © 2025
        </p>
        <a href="https://github.com/DataWithRiddhesh" target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 mt-3 text-xs transition-colors duration-200 hover:text-cyan-400"
          style={{ color: '#475569' }}>
          <Github size={14} /> DataWithRiddhesh
        </a>
      </footer>
    </div>
  );
}
