import React, { useState, useEffect, useRef } from 'react';
import { Zap, Layers, Maximize, ArrowRight, Image as ImageIcon, Type, Palette, LayoutTemplate } from 'lucide-react';

const TypewriterHeading = () => {
  const phrases = ["Intelligence Evolved.", "Forms in Motion.", "Let's Build.", "Tomorrow Together."];
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const timer = setTimeout(() => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];
      if (isDeleting) {
        setText(fullText.substring(0, text.length - 1));
        setTypingSpeed(40);
      } else {
        setText(fullText.substring(0, text.length + 1));
        setTypingSpeed(100 - Math.random() * 40);
      }
      if (!isDeleting && text === fullText) {
        setTypingSpeed(2500);
        setIsDeleting(true);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500);
      }
    }, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed]);

  const renderText = () => {
    const spaceIndex = text.indexOf(' ');
    if (spaceIndex !== -1) {
      return <>{text.substring(0, spaceIndex)}<br />{text.substring(spaceIndex + 1)}</>;
    }
    return text;
  };

  return (
    <h1 className="text-6xl md:text-8xl font-medium tracking-tighter leading-none h-[120px] md:h-[192px]">
      {renderText()}
      <span className="inline-block font-light animate-pulse text-zinc-300 -ml-1 md:-ml-2">|</span>
    </h1>
  );
};

const CanvasWave = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const particles = [];
    for (let i = 0; i < 80; i++) {
      for (let j = 0; j < 40; j++) {
        particles.push({ x: (i - 40) * 45, z: (j - 20) * 45, y: 0 });
      }
    }
    let time = 0, mouseX = 0, mouseY = 0, targetMouseX = 0, targetMouseY = 0;
    
    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX - window.innerWidth / 2) * 2.5;
      targetMouseY = (e.clientY - window.innerHeight / 2) * 2.5;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', () => {
      width = canvas.offsetWidth; height = canvas.offsetHeight;
      canvas.width = width * window.devicePixelRatio; canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.015; mouseX += (targetMouseX - mouseX) * 0.03; mouseY += (targetMouseY - mouseY) * 0.03;
      particles.forEach(p => {
        const baseY = Math.sin(p.x * 0.003 + time * 0.6) * 30 + Math.sin(p.z * 0.004 + time * 0.5) * 30;
        const dist = Math.sqrt(Math.pow(p.x - mouseX, 2) + Math.pow(p.z - mouseY, 2));
        p.y = baseY + (dist < 350 ? -50 * Math.pow(1 - dist / 350, 2.8) : 0);
        const dz = p.z + 250;
        if (dz > 0) {
          const scale = 400 / dz; const x2d = width / 2 + p.x * scale; const y2d = height / 2 + (p.y - 150) * scale;
          if (x2d > -10 && x2d < width + 10 && y2d > -10 && y2d < height + 10) {
            ctx.beginPath(); ctx.arc(x2d, y2d, scale * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(113, 113, 122, ${Math.max(0, Math.min(1, scale * 1.2 - 0.1)) * 0.35})`;
            ctx.fill();
          }
        }
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    return () => { window.removeEventListener('mousemove', handleMouseMove); cancelAnimationFrame(animationFrameId); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

const App = () => {
  const [view, setView] = useState('concept');
  const brandColors = [
    { name: 'Kinetic Black', hex: '#000000', text: 'text-white' },
    { name: 'Motion White', hex: '#FFFFFF', text: 'text-black', border: true },
    { name: 'Graphite', hex: '#18181B', text: 'text-white' },
    { name: 'Steel', hex: '#A1A1AA', text: 'text-black' },
    { name: 'Vapor', hex: '#F4F4F5', text: 'text-black', border: true }
  ];
  const views = [
    { id: 'concept', label: 'Concept', icon: LayoutTemplate },
    { id: 'logo', label: 'Logo', icon: ImageIcon },
    { id: 'typography', label: 'Typography', icon: Type },
    { id: 'colors', label: 'Color System', icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-200">
      <div className={`fixed top-0 left-0 w-full h-[80vh] pointer-events-none overflow-hidden z-0 transition-opacity duration-500 ${view === 'concept' ? 'opacity-100' : 'opacity-0'}`}>
        <CanvasWave />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-50/20 to-zinc-50 pointer-events-none"></div>
      </div>

      <nav className="fixed top-0 w-full z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center"><span className="text-white font-bold text-xs">K.</span></div>
          <span className="font-semibold tracking-tight uppercase text-sm">Kinetic Forms Brandbook</span>
        </div>
        <div className="flex gap-4 md:gap-6 text-xs font-medium uppercase tracking-widest text-zinc-500 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {views.map((v) => (
            <button key={v.id} onClick={() => setView(v.id)} className={`flex items-center gap-2 whitespace-nowrap transition-colors ${view === v.id ? 'text-black border-b-2 border-black pb-1' : 'hover:text-black pb-1'}`}>
              <v.icon className="w-3.5 h-3.5" />{v.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-24 px-6 max-w-6xl mx-auto">
        
        {view === 'concept' && (
          <section className="space-y-24 animate-in fade-in duration-700">
            <div className="space-y-6">
              <TypewriterHeading />
              <p className="max-w-xl text-zinc-500 text-lg leading-relaxed">Kinetic Forms is an AI-native design system built for velocity. We blend relentless momentum with considered, human-centric details—creating digital experiences that feel alive, intuitive, and relentlessly forward-leaning.</p>
            </div>
            <div className="space-y-8">
              <h2 className="text-2xl font-medium tracking-tight border-b border-zinc-200 pb-4">Brand Pillars</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { title: 'Velocity', desc: 'Frictionless interactions and rapid visual feedback that propel users forward at the speed of thought.', icon: Zap },
                  { title: 'Flow', desc: 'Seamless, intuitive pathways powered by AI, designed to adapt naturally to human behavior.', icon: Layers },
                  { title: 'Precision', desc: 'An uncompromising attention to detail, ensuring every pixel, transition, and micro-interaction is perfectly resolved.', icon: Maximize }
                ].map((pillar, i) => (
                  <div key={i} className="p-8 border border-zinc-200 rounded-2xl bg-white hover:border-zinc-400 hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mb-6"><pillar.icon className="w-5 h-5 text-zinc-900" /></div>
                    <h3 className="font-bold text-lg mb-2">{pillar.title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">{pillar.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="aspect-square bg-zinc-900 rounded-3xl flex items-center justify-center p-12 group overflow-hidden relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative w-full h-full border border-white/10 rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
                   <div className="w-1/2 h-0.5 bg-white rotate-45 translate-x-4"></div>
                   <div className="w-1/2 h-0.5 bg-white -rotate-45 translate-x-4"></div>
                   <div className="absolute w-0.5 h-1/2 bg-white -translate-x-8"></div>
                </div>
              </div>
              <div className="aspect-square bg-white border border-zinc-200 rounded-3xl p-12 flex flex-col justify-between hover:border-zinc-300 transition-colors">
                <div className="space-y-6">
                  <div className="h-1 w-12 bg-black"></div>
                  <h4 className="text-4xl md:text-5xl font-medium tracking-tight leading-tight">Intelligence <br/>in Motion.</h4>
                  <p className="text-zinc-500 text-base max-w-sm">Subtle geometric offset patterns help give a sense of intrigue, while maintaining structural integrity across all digital mediums.</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-black">
                  Explore Identity <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </section>
        )}

        {view === 'logo' && (
          <section className="space-y-16 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 max-w-none">
              <div className="space-y-6 max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight">Logo System</h2>
                <p className="text-zinc-500 text-lg leading-relaxed">Our mark strips away the superfluous, leaving only pure, directed energy. The Kinetic Forms identity is designed to scale effortlessly, maintaining absolute clarity from a 16px favicon to a stadium display.</p>
              </div>
            </div>
            <div className="space-y-12">
              <div>
                <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-400 mb-6">Primary Lockup</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white border border-zinc-200 rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center relative min-h-[240px]">
                    <span className="absolute top-6 left-8 text-xs font-bold tracking-widest uppercase text-zinc-400">Positive</span>
                    <div className="flex items-center gap-3 md:gap-4"><div className="w-10 h-10 md:w-14 md:h-14 bg-black text-white flex items-center justify-center font-bold text-xl md:text-3xl rounded-sm">K.</div><span className="text-xl md:text-3xl font-semibold tracking-tight uppercase">Kinetic Forms</span></div>
                  </div>
                  <div className="bg-black rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center relative min-h-[240px]">
                    <span className="absolute top-6 left-8 text-xs font-bold tracking-widest uppercase text-zinc-500">Negative</span>
                    <div className="flex items-center gap-3 md:gap-4"><div className="w-10 h-10 md:w-14 md:h-14 bg-white text-black flex items-center justify-center font-bold text-xl md:text-3xl rounded-sm">K.</div><span className="text-xl md:text-3xl font-semibold tracking-tight uppercase text-white">Kinetic Forms</span></div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-400 mb-6">Standalone Mark</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="aspect-[4/3] bg-white border border-zinc-200 rounded-3xl flex flex-col items-center justify-center p-12 relative">
                    <span className="absolute top-6 left-8 text-xs font-bold tracking-widest uppercase text-zinc-400">Positive</span><div className="w-32 h-32 bg-black text-white flex items-center justify-center font-bold text-6xl rounded-md">K.</div>
                  </div>
                  <div className="aspect-[4/3] bg-black rounded-3xl flex flex-col items-center justify-center p-12 relative">
                    <span className="absolute top-6 left-8 text-xs font-bold tracking-widest uppercase text-zinc-500">Negative</span><div className="w-32 h-32 bg-white text-black flex items-center justify-center font-bold text-6xl rounded-md">K.</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {view === 'typography' && (
          <section className="space-y-16 animate-in fade-in duration-700">
             <div className="space-y-6 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight">Typography</h2>
              <p className="text-zinc-500 text-lg leading-relaxed">Our typography is the anchor to our motion. We utilize crisp, highly legible neo-grotesque sans-serifs to provide a stable, clean structure that allows our dynamic interactions to shine.</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-16 border-t border-zinc-200 pt-16">
              <div className="space-y-8">
                <div><p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2">Primary Typeface</p><h3 className="text-5xl font-medium">System Sans</h3></div>
                <div className="p-8 bg-white border border-zinc-200 rounded-2xl flex flex-wrap gap-4 text-3xl md:text-4xl">
                  <span className="font-light">Aa</span><span className="font-normal">Bb</span><span className="font-medium">Cc</span><span className="font-bold">Dd</span><span className="font-extrabold">Ee</span>
                </div>
                <p className="text-zinc-500 text-sm leading-relaxed">System Sans acts as our universal voice. Unopinionated yet distinct, it ensures perfect clarity and focus, stripping away cognitive load to let the content breathe.</p>
              </div>
              <div className="space-y-10">
                <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 mb-2 border-b border-zinc-200 pb-4">Type Hierarchy</p>
                <div>
                  <div className="flex justify-between items-end mb-2 text-xs text-zinc-400"><span>Display / H1</span><span>Tracking: Tighter</span></div>
                  <h1 className="text-6xl font-medium tracking-tighter leading-none">Velocity by design</h1>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-2 text-xs text-zinc-400"><span>Heading / H2</span><span>Tracking: Tight</span></div>
                  <h2 className="text-4xl font-medium tracking-tight leading-none">Intelligent forms for modern teams</h2>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-2 text-xs text-zinc-400"><span>Body Copy / P</span><span>Tracking: Normal</span></div>
                  <p className="text-lg text-zinc-600 leading-relaxed">We craft digital spaces where momentum feels effortless. Every micro-interaction is deliberate, every layout meticulously considered. We believe that true technological sophistication shouldn't feel mechanical—it should feel like an extension of your own thought process.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {view === 'colors' && (
          <section className="space-y-16 animate-in fade-in duration-700">
             <div className="space-y-6 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight">Color System</h2>
              <p className="text-zinc-500 text-lg leading-relaxed">Our palette is unapologetically minimalist. By constraining our colors to high-contrast monochromes, we eliminate visual noise, direct focus, and establish a premium, modern aesthetic.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-8">
              {brandColors.map((color, i) => (
                <div key={i} className="space-y-4 group">
                  <div className={`aspect-square rounded-2xl shadow-sm transition-transform duration-300 group-hover:-translate-y-2 flex items-end p-4 ${color.border ? 'border border-zinc-200' : ''}`} style={{ backgroundColor: color.hex }}>
                    <span className={`${color.text} font-mono text-sm opacity-0 group-hover:opacity-100 transition-opacity`}>{color.hex}</span>
                  </div>
                  <div><h4 className="font-semibold">{color.name}</h4><p className="text-xs text-zinc-500 font-mono uppercase mt-1">{color.hex}</p></div>
                </div>
              ))}
            </div>
            <div className="mt-16 bg-black rounded-3xl p-12 md:p-24 text-white overflow-hidden relative">
              <div className="relative z-10 max-w-lg space-y-6">
                <h3 className="text-3xl md:text-5xl font-medium tracking-tighter">Maximum Contrast.</h3>
                <p className="text-zinc-400 text-lg">Binary precision meets bold execution. Our core visual language relies on stark white against deep black, reflecting our AI-native foundation while creating striking, undeniable clarity.</p>
              </div>
              <div className="absolute right-0 top-0 w-full h-full md:w-1/2 opacity-20 pointer-events-none">
                <div className="absolute top-1/2 right-12 w-64 h-64 border border-white rounded-full transform -translate-y-1/2"></div>
                <div className="absolute top-1/2 right-16 w-64 h-64 border border-white rounded-full transform -translate-y-1/2 scale-75"></div>
                <div className="absolute top-1/2 right-20 w-64 h-64 border border-white rounded-full transform -translate-y-1/2 scale-50 bg-white/5"></div>
              </div>
            </div>
          </section>
        )}

      </main>

      <footer className="py-8 border-t border-zinc-200 px-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-white relative z-10">
        <div className="flex items-center gap-2">
           <div className="w-5 h-5 bg-black rounded-[2px] flex items-center justify-center"><span className="text-white font-bold text-[8px]">K.</span></div>
          <span className="text-sm font-semibold">Kinetic Forms Identity</span>
        </div>
        <p className="text-zinc-400 text-xs tracking-wide uppercase font-medium">Confidential Brand Guidelines &copy; 2026</p>
      </footer>
    </div>
  );
};

export default App;