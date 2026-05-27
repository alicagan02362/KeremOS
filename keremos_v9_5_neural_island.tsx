import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Cpu, Monitor, Settings, X, Minus, Square, Search, 
  Battery, Wifi, Volume2, ShoppingBag, Globe, Calendar, 
  LayoutGrid, ChevronRight, Download, CheckCircle2, 
  Edit3, FolderOpen, Play, Music, Ghost, Palette, HardDrive, 
  User, Bell, Command, Sparkles, Bot, Brain, MessageSquare,
  Zap, Send, Mic, ImageIcon, Database, Activity, ShieldCheck,
  Camera, Lock, Eye, EyeOff, Power, Trash2, RefreshCw, VolumeX, Key, Paintbrush, RotateCcw
} from 'lucide-react';

// --- Font & CSS Animasyonları ---
const FontLink = () => (
  <>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&family=Pacifico&display=swap" rel="stylesheet" />
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Satisfy&display=swap');
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      .animate-blink {
        animation: blink 1s infinite;
      }
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      .animate-float {
        animation: float 4s ease-in-out infinite;
      }
      @keyframes rotateRing {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .animate-rotate-ring {
        animation: rotateRing 8s linear infinite;
      }
      @keyframes wave {
        0%, 100% { height: 4px; }
        50% { height: 16px; }
      }
      .equalizer-bar {
        animation: wave 1.2s ease-in-out infinite;
      }
      @keyframes clickRise {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-60px) scale(0.8); opacity: 0; }
      }
      .animate-click-rise {
        animation: clickRise 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
      }
    `}</style>
  </>
);

// --- 8-BIT RETRO SYNTHESIZER SOUND ENGINE (ADSR Envelope Applied) ---
const playSystemSound = (type, isMuted = false) => {
  if (isMuted) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === 'boot') {
      // Db Major 9 chord (Ferah ve asil Windows tınısı)
      const freqs = [138.59, 207.65, 277.18, 349.23, 523.25];
      freqs.forEach((f, idx) => {
        const oscNode = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        oscNode.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscNode.type = idx % 2 === 0 ? 'sine' : 'triangle';
        oscNode.frequency.setValueAtTime(f, now);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, now);
        filter.frequency.exponentialRampToValueAtTime(1600, now + 1.2);
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.04, now + 0.8);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 4.0);
        
        oscNode.start(now);
        oscNode.stop(now + 4.5);
      });

      // Chime high bell
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(1046.50, now + 0.7);
      chimeGain.gain.setValueAtTime(0, now + 0.7);
      chimeGain.gain.linearRampToValueAtTime(0.02, now + 0.8);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);
      
      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chimeOsc.start(now + 0.7);
      chimeOsc.stop(now + 2.0);

    } else if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'jump') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.18);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'gameover') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(70, now + 0.6);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'unlock') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(115, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    }
  } catch (e) {
    console.log("AudioContext blocked.");
  }
};

const playAntepHamamlarıMelody = (isMuted) => {
  if (isMuted) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const notes = [
      { f: 392, d: 250 }, { f: 392, d: 250 }, { f: 440, d: 250 }, { f: 494, d: 500 },
      { f: 440, d: 250 }, { f: 392, d: 250 }, { f: 440, d: 500 },
      { f: 392, d: 250 }, { f: 349, d: 250 }, { f: 392, d: 750 },
      
      { f: 440, d: 250 }, { f: 440, d: 250 }, { f: 494, d: 250 }, { f: 523, d: 500 },
      { f: 494, d: 250 }, { f: 440, d: 250 }, { f: 494, d: 500 },
      { f: 440, d: 250 }, { f: 392, d: 250 }, { f: 440, d: 750 },
      
      { f: 523, d: 150 }, { f: 494, d: 150 }, { f: 440, d: 150 }, { f: 392, d: 300 },
      { f: 349, d: 300 }, { f: 293, d: 600 },
      
      { f: 392, d: 250 }, { f: 440, d: 250 }, { f: 494, d: 500 },
      { f: 440, d: 250 }, { f: 392, d: 250 }, { f: 392, d: 800 }
    ];
    let delay = 0;
    notes.forEach(note => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(note.f, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.015, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (note.d / 1000));
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + (note.d / 1000));
      }, delay);
      delay += note.d + 30;
    });
  } catch (e) {}
};

// --- PRO-GRADE SIGNATURE KEREM LOGO ---
const KeremLogo = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 200 240" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="65" cy="75" r="28" fill="#93c5fd" opacity="0.9" />
    <circle cx="135" cy="75" r="28" fill="#93c5fd" opacity="0.9" />
    <rect x="50" y="65" width="100" height="135" rx="50" fill="#a5b4bc" stroke="#93c5fd" strokeWidth="1" />
    <circle cx="78" cy="120" r="4.5" fill="#000" />
    <circle cx="122" cy="120" r="4.5" fill="#000" />
    <circle cx="100" cy="140" r="14" fill="#93c5fd" opacity="0.6" />
    <circle cx="100" cy="138" r="3.5" fill="#000" />
    <text 
      x="100" 
      y="182" 
      textAnchor="middle" 
      fill="#dc2626" 
      fontSize="22" 
      style={{ fontFamily: "'Satisfy', cursive" }}
    >
      Smile
    </text>
    <circle cx="75" cy="208" r="24" fill="#93c5fd" />
    <circle cx="125" cy="208" r="24" fill="#93c5fd" />
  </svg>
);

// --- DYNAMIC ISLAND (iPhone-like Morphing Island) ---
const DynamicIsland = ({ island, onOpenApp }) => {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (island.type !== 'idle') {
      setExpanded(true);
      if (island.type === 'unlock' || island.type === 'notif') {
        const timer = setTimeout(() => setExpanded(false), 3000);
        return () => clearTimeout(timer);
      }
    } else {
      setExpanded(false);
    }
  }, [island]);

  const getIslandClasses = () => {
    if (!expanded || island.type === 'idle') {
      return "w-28 h-7 rounded-full bg-black/95 text-transparent justify-center px-4";
    }
    switch (island.type) {
      case 'unlock':
        return "w-64 h-12 rounded-[24px] bg-emerald-950/95 text-white justify-between px-6 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]";
      case 'music':
        return "w-80 h-14 rounded-[28px] bg-black/95 text-white justify-between px-6 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]";
      case 'camera':
        return "w-52 h-12 rounded-[24px] bg-black/95 text-white justify-between px-6 border border-white/10";
      case 'ai':
        return "w-72 h-14 rounded-[28px] bg-purple-950/95 text-white justify-between px-6 border border-purple-500/30 animate-pulse";
      case 'notif':
        return "w-72 h-12 rounded-[24px] bg-sky-950/95 text-white justify-between px-6 border border-sky-500/30 shadow-[0_0_20px_rgba(14,165,233,0.2)]";
      default:
        return "w-48 h-10 rounded-full bg-black/90 text-white justify-center px-4";
    }
  };

  return (
    <div 
      onClick={() => {
        if (island.type === 'music') onOpenApp('music');
        if (island.type === 'camera') onOpenApp('camera');
        if (island.type === 'ai') onOpenApp('ai');
      }}
      className={`flex items-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] transition-all duration-500 ease-out cursor-pointer overflow-hidden ${getIslandClasses()}`}
    >
      {(!expanded || island.type === 'idle') ? (
        <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
      ) : (
        <div className="flex items-center justify-between w-full text-xs font-semibold animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            {island.type === 'unlock' && <ShieldCheck size={16} className="text-emerald-400" />}
            {island.type === 'music' && <Music size={16} className="text-pink-500 animate-bounce" />}
            {island.type === 'camera' && (
              <div className="flex items-center gap-1.5">
                <Camera size={16} className="text-teal-400" />
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>
            )}
            {island.type === 'ai' && <Sparkles size={16} className="text-purple-400" />}
            {island.type === 'notif' && <Bell size={16} className="text-sky-400 animate-bounce" />}
            
            <div className="text-left leading-tight ml-1">
              <div className="font-black text-[10px] tracking-tight text-white/90">{island.label}</div>
              <div className="text-[9px] text-white/50">{island.desc}</div>
            </div>
          </div>

          <div>
            {island.type === 'music' && (
              <div className="flex items-end gap-0.5 h-4">
                <div className="w-0.5 bg-pink-500 equalizer-bar" style={{ animationDelay: '0.1s' }} />
                <div className="w-0.5 bg-pink-400 equalizer-bar" style={{ animationDelay: '0.4s' }} />
                <div className="w-0.5 bg-pink-500 equalizer-bar" style={{ animationDelay: '0.2s' }} />
                <div className="w-0.5 bg-pink-300 equalizer-bar" style={{ animationDelay: '0.6s' }} />
              </div>
            )}
            {island.type === 'ai' && <Brain size={16} className="text-purple-400 animate-pulse" />}
            {island.type === 'unlock' && <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">OK</span>}
            {island.type === 'camera' && <span className="text-[9px] text-teal-400 font-bold uppercase tracking-widest">CAM</span>}
            {island.type === 'notif' && <span className="text-[9px] text-sky-400 font-bold uppercase tracking-widest">INFO</span>}
          </div>
        </div>
      )}
    </div>
  );
};

// --- CORE HELPER COMPONENTS ---

const DesktopIcon = ({ icon, label, color, onClick, isAi }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 group relative w-24 shrink-0 transition-transform duration-200 hover:scale-105">
    {isAi && <div className="absolute -top-1 -right-1 w-5 h-5 bg-sky-400 rounded-full animate-ping opacity-25" />}
    <div className={`bg-gradient-to-br ${color} w-14 h-14 md:w-16 md:h-16 rounded-[24px] flex items-center justify-center text-white shadow-2xl group-hover:rotate-3 transition-all duration-300 border border-white/10`}>
      {React.cloneElement(icon, { size: 30 })}
    </div>
    <span className="text-[10px] font-black text-white uppercase tracking-widest bg-black/60 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/5 group-hover:bg-sky-600/50 transition-all text-center leading-tight truncate w-24">
      {label}
    </span>
  </button>
);

const StartBtn = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-3 p-4 rounded-[32px] hover:bg-white/10 transition-all group">
    <div className="text-sky-400 group-hover:scale-125 transition-all">{React.cloneElement(icon, { size: 28 })}</div>
    <span className="text-[9px] text-white/40 font-black uppercase tracking-tighter group-hover:text-white truncate w-16 text-center">{label}</span>
  </button>
);

// --- DRAGGABLE WINDOW COMPONENT (Smooth Drag & Focus Stack Z-Index) ---
const Window = ({ win, children, onClose, onFocus, isActive, position, onDrag, windowOrderLength, currentStackIndex }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Calculate dynamic z-index based on focused window history stack
  const computedZIndex = isActive ? 50 : 30 + currentStackIndex;

  const handleMouseDown = (e) => {
    if (e.target.closest('.window-control-btn')) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    onFocus();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      onDrag(win.id, {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, win.id, onDrag]);

  // Touch Support (for mobile/tablet portfolios)
  const handleTouchStart = (e) => {
    if (e.target.closest('.window-control-btn')) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
    onFocus();
  };

  useEffect(() => {
    const handleTouchMove = (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      onDrag(win.id, {
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragStart, win.id, onDrag]);

  return (
    <div 
      onClick={onFocus}
      style={{ 
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isDragging ? 'none' : 'transform 0.05s ease',
        zIndex: computedZIndex
      }}
      className={`absolute top-0 left-0 w-[95vw] md:w-[850px] h-[550px] bg-white/95 backdrop-blur-3xl rounded-[40px] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.6)] border border-white/20 overflow-hidden flex flex-col ${isActive ? 'ring-2 ring-sky-500/40 shadow-[0_60px_120px_-25px_rgba(14,165,233,0.25)]' : 'opacity-70 blur-[1px]'}`}
    >
      <div 
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="h-14 bg-slate-50/50 border-b flex items-center justify-between px-8 cursor-move shrink-0 select-none"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-100 rounded-xl text-sky-600 shadow-inner">
             {win.icon}
          </div>
          <span className="font-black text-slate-800 tracking-tighter text-sm md:text-md uppercase italic">{win.title}</span>
        </div>
        <div className="flex gap-4">
           <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="window-control-btn w-10 h-8 rounded-xl bg-red-100 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all shadow-md group">
             <X size={16} className="group-hover:rotate-90 transition-transform" />
           </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

// --- APP PAGES ---

// --- REAL-TIME GEMINI INTEGRATED SMILE AI APP ---
const AiApp = ({ isMuted, setIsland }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Merhaba! Ben yerleşik akıllı asistanın Smile AI. Gaziantep fıstıkları kadar lezzetli ve Kerci nano-57 kadar hızlı bir yapay zeka deneyimi için hazır mısın? Sana nasıl yardımcı olabilirim? Smile! 😊' }
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;
    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput("");
    setIsThinking(true);
    playSystemSound('click', isMuted);
    
    setIsland({ type: 'ai', label: 'Smile AI Düşünüyor...', desc: 'Kerci Yapay Zeka Çekirdeği' });

    try {
      const aiReply = await callGeminiAPI(userText);
      setMessages(prev => [...prev, { role: 'ai', text: aiReply }]);
      playSystemSound('unlock', isMuted);
      setIsland({ type: 'ai', label: 'Smile AI', desc: 'Cevap Hazırlandı' });
      setTimeout(() => setIsland({ type: 'idle', label: '', desc: '' }), 2000);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Gülümsemeni kaybetme Ali! Bağlantıda ufak bir pürüz oldu, tekrar deneyebiliriz. 😊" }]);
      playSystemSound('error', isMuted);
      setIsland({ type: 'idle', label: '', desc: '' });
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 text-slate-800">
       <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-6`}>
               <div className={`max-w-[80%] p-6 rounded-[28px] text-sm font-semibold shadow-xl border ${m.role === 'user' ? 'bg-sky-500 text-white border-sky-600' : 'bg-white text-slate-800 border-slate-100'}`}>
                  {m.text}
               </div>
            </div>
          ))}
          {isThinking && (
            <div className="flex justify-start animate-pulse">
               <div className="bg-white text-slate-400 p-6 rounded-[28px] text-sm font-semibold shadow-md border border-slate-100 flex items-center gap-2">
                 <Brain size={18} className="animate-spin text-purple-600" /> Smile AI düşünüyor...
               </div>
            </div>
          )}
       </div>
       <div className="p-6 bg-white border-t border-slate-100 flex gap-4 shrink-0">
          <input 
            className="flex-1 h-14 bg-slate-50 border-2 border-slate-100 rounded-[20px] px-6 font-semibold outline-none focus:border-sky-500 transition-all text-slate-700" 
            placeholder="Smile AI ile konuşmaya başla..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            className="w-14 h-14 bg-sky-600 text-white rounded-[20px] flex items-center justify-center shadow-xl shadow-sky-500/20 hover:scale-105 transition-transform"
          >
            <Send size={20} />
          </button>
       </div>
    </div>
  );
};

// --- REAL CAMERA APP ("SMILE CAM") ---
const CameraApp = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [cameraError, setCameraError] = useState(false);

  const startCamera = async () => {
    try {
      setCameraError(false);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError(true);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const width = videoRef.current.videoWidth || 640;
      const height = videoRef.current.videoHeight || 480;
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      const ctx = canvasRef.current.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, width, height);
      
      const dataUrl = canvasRef.current.toDataURL('image/png');
      setPhoto(dataUrl);
    }
  };

  return (
    <div className="h-full bg-slate-900 flex flex-col md:flex-row">
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div className="flex-1 bg-black rounded-3xl overflow-hidden relative border border-white/5 flex items-center justify-center">
          {cameraError ? (
            <div className="text-center p-6 space-y-4">
              <Camera size={48} className="mx-auto text-red-500 animate-pulse" />
              <p className="text-white font-bold text-sm">Kameraya erişilemedi! Kamera iznini onayladığınızdan emin olun.</p>
              <button onClick={startCamera} className="px-6 py-2 bg-sky-500 text-white font-bold rounded-xl text-xs hover:bg-sky-600">Tekrar Dene</button>
            </div>
          ) : (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover transform -scale-x-100"
            />
          )}
        </div>
        
        <div className="mt-4 flex justify-center gap-4">
          <button 
            onClick={takePhoto}
            disabled={cameraError}
            className="px-8 h-12 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-black rounded-2xl text-xs uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <Camera size={16} /> Fotoğraf Çek
          </button>
        </div>
      </div>

      <div className="w-full md:w-64 bg-slate-950 border-t md:border-t-0 md:border-l border-white/10 p-6 flex flex-col shrink-0 overflow-y-auto">
        <h3 className="text-xs font-black text-sky-400 uppercase tracking-widest mb-4">Yakalanan Kare</h3>
        {photo ? (
          <div className="space-y-4 animate-in zoom-in-95">
            <div className="rounded-2xl overflow-hidden border border-white/15">
              <img src={photo} alt="Smile Cam Captured" className="w-full h-auto object-cover transform -scale-x-100" />
            </div>
            <a 
              href={photo} 
              download="smile-photo.png"
              className="w-full h-10 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2"
            >
              <Download size={14} /> İndir
            </a>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-white/20 p-6 border-2 border-dashed border-white/5 rounded-2xl">
            <ImageIcon size={32} className="mb-2" />
            <p className="text-[10px] font-bold uppercase">Fotoğraf galerisi boş</p>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

// --- INTERACTIVE TERMINAL APP ---
const TerminalApp = ({ files }) => {
  const [history, setHistory] = useState([
    "KeremOS Titan Shell [Version 9.5-Signature]",
    "Neural-Link Secured // Active Signature Mode",
    "Mevcut komutları görmek için 'help' yazın.",
    ""
  ]);
  const [input, setInput] = useState("");
  const [termTheme, setTermTheme] = useState("dark");
  const terminalEndRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      const parts = cmd.split(" ");
      const lowerCmd = parts[0].toLowerCase();
      let output = "";

      if (lowerCmd === 'help') {
        output = "Kullanılabilir komutlar:\n  help                 - Komutları listeler\n  clear                - Ekranı temizler\n  ls                   - Dosya sistemindeki dosyaları listeler\n  cat [dosya_adi.txt]  - Belirtilen dosyanın içeriğini okur\n  neofetch             - Sistem detaylarını gösterir\n  fistik               - Gaziantep fıstığı testi yapar\n  nano57               - Kerci nano-57 durum analizi\n  theme [dark/light]   - Terminal temasını değiştirir\n  sudo rm -rf /        - Sistemi silmeye çalışır!";
      } else if (lowerCmd === 'clear') {
        setHistory([]);
        setInput("");
        return;
      } else if (lowerCmd === 'ls') {
        output = files.map(f => `${f.type === 'image' ? '🖼️' : '📄'} ${f.name}`).join("\n");
      } else if (lowerCmd === 'cat') {
        const fileName = parts[1];
        if (!fileName) {
          output = "Hata: Okunacak dosyayı belirtmelisiniz. Örn: cat Ali_Notlar.txt";
        } else {
          const targetFile = files.find(f => f.name.toLowerCase() === fileName.toLowerCase());
          if (targetFile) {
            output = targetFile.content === 'logo' ? "[Görsel Dosya Önizlemesi - SVG Logo]" : targetFile.content;
          } else {
            output = `Hata: '${fileName}' adlı dosya bulunamadı.`;
          }
        }
      } else if (lowerCmd === 'neofetch') {
        output = `               
         _ _       OS: KeremOS v9.5 Signature Edition
       ( @ @ )     Kernel: Kerci Titan-v9.5 (64-bit)
      (   -   )    Uptime: 1.5 hours
       (Smile)     CPU: Kerci nano-57 (16 cores) @ 6.2GHz
                   RAM: 32 GB LPDDR5x (Neural-X)
                   Location: Gaziantep, TR
                `;
      } else if (lowerCmd === 'fistik') {
        output = "GAZIANTEP FISTIĞI TESTİ: %100 Orijinal Gaziantep Fıstığı Enerjisi! Kerci işlemcinin enerji verimliliği en üst düzeyde!";
      } else if (lowerCmd === 'nano57') {
        output = "Kerci nano-57 Durum Analizi:\n  - Çekirdek Isısı: 24°C\n  - Nöral Aktivite: Kusursuz ve Kararlı\n  - Enerji Kaynağı: Antep Fıstığı Özlü Nöral Link";
      } else if (lowerCmd === 'theme') {
        const selected = parts[1];
        if (selected === 'light' || selected === 'dark') {
          setTermTheme(selected);
          output = `Terminal teması '${selected}' olarak değiştirildi.`;
        } else {
          output = "Hata: Geçerli temalar: theme light, theme dark";
        }
      } else if (cmd.toLowerCase() === 'sudo rm -rf /') {
        output = "YETKİ REDDEDİLDİ. Kerci nano-57 işlemcisi koruma moduna geçti.\nAli, kendi sistemini mi çökerteceksin? Gülümsemeye devam et! 😊";
      } else if (cmd !== "") {
        output = `Komut bulunamadı: '${cmd}'. Yardım almak için 'help' yazın.`;
      }

      setHistory(prev => [...prev, `ali@kerembook:~$ ${cmd}`, output, ""]);
      setInput("");
    }
  };

  const isDark = termTheme === 'dark';

  return (
    <div className={`h-full p-6 font-mono text-xs md:text-sm overflow-y-auto selection:bg-sky-500 selection:text-white flex flex-col justify-between transition-colors duration-300 ${isDark ? 'bg-slate-950 text-sky-400' : 'bg-slate-50 text-slate-900'}`}>
      <div className="flex-1 overflow-y-auto space-y-1 mb-4">
        {history.map((line, i) => (
          <pre key={i} className="whitespace-pre-wrap font-mono leading-relaxed">{line}</pre>
        ))}
        <div ref={terminalEndRef} />
      </div>
      <div className={`flex gap-2 items-center shrink-0 border-t pt-2 ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
        <span className={isDark ? 'text-green-400 font-bold' : 'text-emerald-600 font-bold'}>ali@kerembook:~$</span>
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          className={`bg-transparent border-none outline-none flex-1 font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}
          autoFocus
        />
      </div>
    </div>
  );
};

// --- SYSTEM APP ---
const SystemApp = () => (
  <div className="h-full p-10 bg-slate-50 overflow-y-auto">
     <div className="flex items-center gap-8 mb-10">
        <div className="p-8 bg-white rounded-[40px] shadow-md border-2 border-sky-100 group">
           <KeremLogo className="w-24 h-24 group-hover:scale-110 transition-transform animate-float" />
        </div>
        <div>
           <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">Signature</h1>
           <p className="text-2xl font-bold text-sky-600 italic mt-2 underline decoration-sky-300 decoration-8 underline-offset-[8px]">Kerembook Pro OS v9.5</p>
        </div>
     </div>
     <div className="grid grid-cols-2 gap-6">
        <StatItem label="İşlemci" val="Kerci nano-57" sub="Titan-Link v9.5 @ 6.2GHz" />
        <StatItem label="Görsel Mimari" val="Signature v9.5" sub="Mavi-Gri Smile Palette" />
        <StatItem label="Neural Performance" val="SMILE-AI v9.5" sub="Sınırsız Gemini AI API Gücü" />
        <StatItem label="Dinamik Birim" val="Dynamic Island" sub="Morfolojik Bildirim Çentiği" />
     </div>
  </div>
);

// --- PERFORMANCE PANEL APP ---
const ActivityApp = () => (
  <div className="h-full bg-slate-950 p-10 text-white relative overflow-hidden">
     <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-500/10 rounded-full blur-[180px] animate-pulse" />
     <h2 className="text-4xl font-black text-sky-500 mb-10 tracking-tighter uppercase italic border-b-4 border-sky-400/20 pb-4">Neural Analytics</h2>
     <div className="grid grid-cols-2 gap-8 relative z-10">
        <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[40px] border border-white/5 flex flex-col justify-between h-64">
           <div className="text-[12px] text-white/20 font-black uppercase tracking-[0.5em]">System Load</div>
           <div className="text-7xl font-black text-sky-400 tracking-tighter italic leading-none">%4</div>
           <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-sky-400 w-[4%] shadow-[0_0_30px_#0ea5e9]" /></div>
        </div>
        <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[40px] border border-white/5 flex flex-col justify-between h-64">
           <div className="text-[12px] text-white/20 font-black uppercase tracking-[0.5em]">CPU Heat</div>
           <div className="text-7xl font-black text-rose-500 tracking-tighter italic leading-none">24°C</div>
           <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-rose-500 w-[24%] shadow-[0_0_30px_#f43f5e]" /></div>
        </div>
     </div>
  </div>
);

// --- INTERACTIVE FILES APP ---
const FilesApp = ({ files, setFiles, isMuted, setIsland }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [newFileContent, setNewFileContent] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateFile = () => {
    if (!newFileName.trim()) return;
    const extension = newFileName.includes('.') ? newFileName.split('.').pop() : 'txt';
    const newFile = {
      name: newFileName,
      type: extension === 'svg' || extension === 'png' ? 'image' : extension === 'pdf' ? 'pdf' : 'txt',
      content: newFileContent
    };
    setFiles([...files, newFile]);
    setNewFileName("");
    setNewFileContent("");
    setIsCreating(false);
    playSystemSound('unlock', isMuted);
    
    setIsland({ type: 'notif', label: 'Yeni Dosya Oluşturuldu', desc: newFileName });
  };

  const handleDeleteFile = (fileName, e) => {
    e.stopPropagation();
    setFiles(files.filter(f => f.name !== fileName));
    if (selectedFile?.name === fileName) {
      setSelectedFile(null);
    }
    playSystemSound('error', isMuted);
    
    setIsland({ type: 'notif', label: 'Dosya Silindi', desc: fileName });
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-slate-50 text-slate-800">
       <div className="w-full md:w-56 bg-slate-100/50 border-r border-slate-200 p-6 space-y-6 shrink-0 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Bölümler</div>
            <div className="space-y-2">
               <div className="flex items-center gap-3 p-3 bg-sky-600 text-white rounded-[20px] font-black text-xs shadow-lg shadow-sky-500/20">
                 <HardDrive size={18}/> TITAN_SSD_PRO
               </div>
               <div className="flex items-center gap-3 p-3 text-slate-500 font-bold text-xs hover:bg-slate-200 rounded-[20px] transition-colors cursor-pointer">
                 <Database size={18}/> USB_BOOT_SIGNATURE
               </div>
            </div>
          </div>
          <button 
            onClick={() => {
              setIsCreating(true);
              playSystemSound('click', isMuted);
            }}
            className="w-full h-12 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-2xl transition-all shadow-md shadow-sky-500/10 flex items-center justify-center gap-2"
          >
            <Sparkles size={14} /> Yeni Dosya
          </button>
       </div>

       <div className="flex-1 p-8 flex flex-col overflow-hidden relative">
          {isCreating ? (
            <div className="h-full flex flex-col bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 animate-in zoom-in-95">
              <h3 className="text-sm font-black text-slate-800 mb-4 uppercase tracking-wider">Yeni Dosya</h3>
              <div className="space-y-4 flex-1 flex flex-col">
                <input 
                  type="text" 
                  placeholder="Dosya Adı (Örn: plan.txt)"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-sky-500 text-sm font-bold bg-slate-50 border-slate-200"
                />
                <textarea 
                  placeholder="İçerik..."
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                  className="w-full flex-1 p-4 rounded-xl border border-slate-200 outline-none focus:border-sky-500 text-sm font-medium resize-none bg-slate-50 border-slate-200"
                />
                <div className="flex gap-4">
                  <button onClick={handleCreateFile} className="flex-1 h-12 bg-sky-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider">Oluştur</button>
                  <button onClick={() => { setIsCreating(false); playSystemSound('click', isMuted); }} className="flex-1 h-12 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold rounded-xl text-xs uppercase tracking-wider">İptal</button>
                </div>
              </div>
            </div>
          ) : selectedFile ? (
            <div className="h-full flex flex-col bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 animate-in zoom-in-95">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-sky-100 text-sky-600 rounded-full text-[10px] font-black uppercase tracking-wider">{selectedFile.type}</span>
                  <h3 className="text-sm font-black text-slate-800 tracking-tight">{selectedFile.name}</h3>
                </div>
                <button onClick={() => { setSelectedFile(null); playSystemSound('click', isMuted); }} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"><X size={16} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 bg-slate-50 rounded-2xl border border-slate-100 font-mono text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                {selectedFile.content === 'logo' ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <KeremLogo className="w-32 h-32 animate-bounce" />
                    <span className="text-xs font-bold text-slate-400 font-sans uppercase">KeremOS Signature Logo</span>
                  </div>
                ) : (
                  selectedFile.content
                )}
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              <div className="flex items-center gap-3 mb-8 text-slate-400 text-xs font-black uppercase tracking-wider">
                <span>TITAN_SSD_PRO</span> <ChevronRight size={14}/> <span className="text-sky-600 font-black">Dosyalar</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center animate-in fade-in duration-300">
                {files.map((file, i) => (
                  <div 
                    key={i} 
                    onClick={() => { setSelectedFile(file); playSystemSound('click', isMuted); }}
                    className="flex flex-col items-center gap-2 group cursor-pointer relative"
                  >
                    <button 
                      onClick={(e) => handleDeleteFile(file.name, e)}
                      className="absolute top-0 right-0 z-20 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                    >
                      <Trash2 size={12} />
                    </button>
                    <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-white group-hover:text-sky-500 group-hover:border-sky-300 transition-all shadow-sm group-hover:shadow-xl group-hover:scale-110 relative z-10">
                      {file.type === 'image' ? <KeremLogo className="w-10 h-10" /> : file.type === 'pdf' ? <Edit3 size={32} /> : file.type === 'bin' ? <Brain size={32} /> : <FolderOpen size={32} />}
                    </div>
                    <span className="text-[10px] font-black text-slate-700 text-center uppercase tracking-tighter italic group-hover:text-sky-600 transition-colors max-w-[90px] truncate">{file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
       </div>
    </div>
  );
};

// --- SMILE BROWSER APP ---
const BrowserApp = () => {
  const [url, setUrl] = useState("gaziantep.bel.tr");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUrl, setCurrentUrl] = useState("gaziantep.bel.tr");

  const handleGo = (e) => {
    e?.preventDefault();
    setCurrentUrl(url);
  };

  const getPageContent = () => {
    const formattedUrl = currentUrl.toLowerCase().trim();
    if (formattedUrl.includes("gaziantep")) {
      return (
         <div className="p-8 space-y-6 text-slate-800">
           <div className="bg-sky-600 text-white p-6 rounded-3xl shadow-md">
             <h2 className="text-2xl font-black">Gaziantep Büyükşehir Belediyesi</h2>
             <p className="text-xs opacity-80 mt-1">Dünyanın Fıstık ve Lezzet Başkenti</p>
           </div>
           <div className="grid grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-800 text-sm">Günün Haberi</h3>
                <p className="text-xs text-slate-500 mt-2">Kerembook Pro bilgisayarlar Gaziantep baklava fırınlarında test edilmeye başlandı. Kerci nano-57 işlemcinin yüksek ısı koruması sayesinde baklavalar tam kıvamında pişiyor!</p>
             </div>
             <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-800 text-sm">Fıstık Borsası</h3>
                <p className="text-xs text-green-600 font-black mt-2">Gaziantep fıstığı tavan yaptı! Nöral enerji üretiminde kullanım artıyor.</p>
             </div>
           </div>
         </div>
      );
    } else if (formattedUrl.includes("kerci")) {
      return (
         <div className="p-8 space-y-6 text-slate-800">
           <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-lg border border-white/5">
             <h2 className="text-3xl font-black tracking-tighter">KERCI SEMICONDUCTOR</h2>
             <p className="text-xs text-sky-400 font-mono mt-1">SMILE NEURAL LINK ARCHITECTS</p>
           </div>
           <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
             <h4 className="font-black text-slate-800 uppercase tracking-wider text-xs">Mevcut Ürün Serisi</h4>
             <div className="mt-4 space-y-3">
               <div className="flex justify-between text-xs border-b pb-2"><span className="font-bold">Kerci nano-57</span><span className="text-green-500 font-bold">STOKTA (6.2GHz)</span></div>
               <div className="flex justify-between text-xs border-b pb-2"><span className="font-bold">Kerci nano-58</span><span className="text-amber-500 font-bold">ÖN SİPARİŞ (3nm)</span></div>
             </div>
           </div>
         </div>
      );
    } else if (formattedUrl.includes("google")) {
      return (
         <div className="p-12 flex flex-col items-center justify-center text-center space-y-6 text-slate-800">
            <h1 className="text-5xl font-black tracking-tighter"><span className="text-blue-500">G</span><span className="text-red-500">o</span><span className="text-yellow-500">o</span><span className="text-blue-500">g</span><span className="text-green-500">l</span><span className="text-red-500">e</span></h1>
            <div className="w-full max-w-md flex items-center border border-slate-200 bg-white rounded-full px-6 py-3 shadow-sm">
               <Search size={18} className="text-slate-400 mr-2" />
               <input 
                 type="text" 
                 placeholder="Google'da ara veya URL yaz..." 
                 className="flex-1 outline-none text-sm text-slate-800"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && setCurrentUrl(searchQuery)}
               />
            </div>
            <p className="text-[10px] text-slate-400 font-bold">KeremOS için optimize edilmiştir.</p>
         </div>
      );
    } else {
      return (
        <div className="p-12 text-center space-y-4 text-slate-800">
           <Globe size={48} className="mx-auto text-slate-300" />
           <h3 className="text-xl font-bold text-slate-800">"{currentUrl}" Sayfasına Bağlanıldı</h3>
           <p className="text-xs text-slate-500 max-w-sm mx-auto">Görünüşe göre bu web sayfası Kerci nano-57 nöral protokolüyle şifrelenmiş. Smile AI bu sayfanın Ali Kerem için güvenli olduğunu onaylıyor!</p>
        </div>
      );
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-100 text-slate-800">
       <form onSubmit={handleGo} className="bg-white p-3 border-b flex items-center gap-3 shrink-0">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-200" />
            <div className="w-3 h-3 rounded-full bg-slate-200" />
          </div>
          <div className="flex-1 bg-slate-100 rounded-xl px-4 py-2 text-xs text-slate-500 flex items-center gap-2 border border-slate-200">
             <Globe size={12} className="text-sky-500" />
             <input 
               type="text" 
               className="bg-transparent border-none outline-none flex-1 text-slate-800 font-semibold"
               value={url}
               onChange={(e) => setUrl(e.target.value)}
             />
          </div>
          <button type="submit" className="px-4 py-2 bg-sky-500 text-white font-bold text-xs rounded-xl">Git</button>
       </form>
       <div className="flex-1 overflow-y-auto bg-slate-50">
          {getPageContent()}
       </div>
    </div>
  );
};

// --- SMILE APP STORE ---
const StoreApp = ({ installedApps, setInstalledApps, isMuted, setIsIsland }) => {
  const storeApps = [
    { id: 'game', label: 'Bear Dash', desc: 'Sonsuz koşu oyunu!', icon: <Ghost />, color: 'from-purple-500 to-pink-500' },
    { id: 'notes', label: 'Notlar', desc: 'AI destekli akıllı defter', icon: <Edit3 />, color: 'from-amber-400 to-orange-600' },
    { id: 'music', label: 'Bear Music', desc: '8-Bit Retro Müzik Keyfi', icon: <Music />, color: 'from-rose-500 to-red-500' },
    { id: 'clicker', label: 'Fıstık Clicker', desc: 'Antep fıstığı toplama oyunu', icon: <Zap />, color: 'from-green-500 to-emerald-600' },
    { id: 'paint', label: 'Smile Paint', desc: 'Gelişmiş çizim tuvali', icon: <Paintbrush />, color: 'from-cyan-500 to-blue-600' },
    { id: 'chat', label: 'Kerem Chat', desc: 'Sanal Antep Sohbetleri', icon: <MessageSquare />, color: 'from-violet-500 to-indigo-600' }
  ];

  const installApp = (app) => {
    if (installedApps.find(a => a.id === app.id)) return;
    setInstalledApps([...installedApps, app]);
    playSystemSound('unlock', isMuted);
    
    // Dynamic Island Alert on App Install
    setIsland({ type: 'notif', label: 'Uygulama Kuruldu!', desc: `${app.label} başarıyla yüklendi` });
  };

  return (
    <div className="h-full bg-slate-50 p-8 overflow-y-auto text-slate-800">
       <div className="mb-8">
          <h2 className="text-3xl font-black tracking-tight text-slate-800">Smile Store</h2>
          <p className="text-xs text-slate-500 mt-1">KeremOS için resmi ve onaylı uygulamalar</p>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {storeApps.map(app => {
            const isInstalled = installedApps.find(a => a.id === app.id);
            return (
              <div key={app.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between animate-in fade-in duration-300">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${app.color} text-white rounded-2xl flex items-center justify-center`}>
                    {React.cloneElement(app.icon, { size: 28 })}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{app.label}</h4>
                    <p className="text-xs text-slate-400">{app.desc}</p>
                  </div>
                </div>
                <button 
                  onClick={() => installApp(app)}
                  disabled={isInstalled}
                  className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${isInstalled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-sky-500 text-white hover:bg-sky-600 shadow-md shadow-sky-500/10'}`}
                >
                  {isInstalled ? 'YÜKLENDİ' : 'YÜKLE'}
                </button>
              </div>
            );
          })}
       </div>
    </div>
  );
};

// --- BEAR DASH GAME APP ---
const GameApp = ({ isMuted }) => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('bear_high_score') || '0', 10);
  });
  const [jumping, setJumping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [obstaclePos, setObstaclePos] = useState(400);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setObstaclePos(prev => {
          if (prev < -20) {
            setScore(s => {
              const newScore = s + 10;
              if (newScore > highScore) {
                setHighScore(newScore);
                localStorage.setItem('bear_high_score', newScore.toString());
              }
              return newScore;
            });
            return 400; // Reset
          }
          if (prev > 40 && prev < 80 && !jumping) {
            setIsPlaying(false);
            playSystemSound('gameover', isMuted);
            return 400;
          }
          return prev - 8;
        });
      }, 30);
    }
    return () => clearInterval(timer);
  }, [isPlaying, jumping, highScore, isMuted]);

  const handleJump = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      setScore(0);
      playSystemSound('click', isMuted);
      return;
    }
    if (jumping) return;
    setJumping(true);
    playSystemSound('jump', isMuted);
    setTimeout(() => setJumping(false), 600);
  };

  return (
    <div className="h-full bg-slate-900 flex flex-col justify-between p-6 select-none cursor-pointer" onClick={handleJump}>
      <div className="flex justify-between items-center text-white font-mono text-xs">
         <span>Skor: {score}</span>
         <span className="text-yellow-400 font-bold">En Yüksek: {highScore}</span>
         <span>Zıplamak için Tıkla</span>
      </div>
      
      <div className="flex-1 relative overflow-hidden bg-slate-950 rounded-2xl flex items-center justify-center">
         {!isPlaying && (
           <div className="absolute inset-0 bg-black/60 z-20 flex flex-col items-center justify-center text-center p-4">
              <h3 className="text-xl font-black text-sky-400 tracking-wider">BEAR DASH AI</h3>
              <p className="text-xs text-slate-400 mt-2 mb-4">Ayıcığı engellerin üzerinden atlat!</p>
              <button className="px-6 py-2 bg-sky-500 text-white font-bold rounded-xl text-xs uppercase tracking-widest shadow-lg">Oyna</button>
           </div>
         )}
         
         <div 
           className="absolute left-12 transition-all duration-300"
           style={{ bottom: jumping ? '80px' : '20px' }}
         >
           <KeremLogo className="w-12 h-12 animate-float" />
         </div>

         <div 
           className="absolute w-6 h-6 bg-red-500 rounded-md animate-pulse"
           style={{ bottom: '20px', left: `${obstaclePos}px` }}
         />

         <div className="absolute bottom-0 w-full h-5 bg-sky-900" />
      </div>
    </div>
  );
};

// --- FISTIK CLICKER GAME APP (With Floating Click Particles!) ---
const ClickerApp = ({ isMuted, setIsland }) => {
  const [fistiks, setFistiks] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [autoPower, setAutoPower] = useState(0);
  const [clickParticles, setClickParticles] = useState([]);

  // Auto fıstık generator
  useEffect(() => {
    if (autoPower > 0) {
      const timer = setInterval(() => {
        setFistiks(f => f + autoPower);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [autoPower]);

  const handleFistikClick = (e) => {
    setFistiks(f => f + clickPower);
    playSystemSound('click', isMuted);

    // Spawn floating particle text on click coordinates
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newId = Date.now();
    
    setClickParticles(prev => [...prev, { id: newId, x, y, value: `+${clickPower} 🥜` }]);
    setTimeout(() => {
      setClickParticles(prev => prev.filter(p => p.id !== newId));
    }, 800);
    
    if (Math.random() < 0.05) {
      setIsland({ type: 'notif', label: 'Efsane Tıklama!', desc: `Tek seferde +${clickPower} fıstık!` });
    }
  };

  const buyUpgrade = (cost, power, type) => {
    if (fistiks < cost) {
      playSystemSound('error', isMuted);
      return;
    }
    setFistiks(f => f - cost);
    playSystemSound('unlock', isMuted);

    if (type === 'click') {
      setClickPower(cp => cp + power);
      setIsland({ type: 'notif', label: 'Yükseltme Başarılı', desc: `Tıklama Gücü +${power}` });
    } else {
      setAutoPower(ap => ap + power);
      setIsland({ type: 'notif', label: 'Otomatik Tıklayıcı', desc: `Saniyede +${power} Fıstık` });
    }
  };

  return (
    <div className="h-full bg-slate-900 text-white p-6 flex flex-col justify-between select-none">
       <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl">
          <div className="text-center">
             <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Toplam Fıstık</div>
             <div className="text-2xl font-black text-green-400">{fistiks} 🥜</div>
          </div>
          <div className="text-right text-xs">
             <div>Tıklama Gücü: <span className="font-bold text-sky-400">+{clickPower}</span></div>
             <div>Saniyelik Üretim: <span className="font-bold text-emerald-400">+{autoPower}</span></div>
          </div>
       </div>

       {/* Giant Interactive Fıstık */}
       <div className="flex-1 flex items-center justify-center relative">
          <button 
            onClick={handleFistikClick}
            className="w-40 h-40 bg-gradient-to-tr from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-all outline-none relative"
          >
             <span className="text-6xl animate-bounce">🥜</span>
             {clickParticles.map(p => (
               <span 
                 key={p.id} 
                 style={{ left: p.x, top: p.y }}
                 className="absolute text-green-300 font-black text-sm pointer-events-none animate-click-rise"
               >
                 {p.value}
               </span>
             ))}
          </button>
       </div>

       <div className="grid grid-cols-2 gap-3 shrink-0">
          <button 
            onClick={() => buyUpgrade(20, 1, 'click')}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left text-xs flex justify-between items-center transition-all border border-white/5"
          >
             <div>
                <div className="font-black text-sky-400">Süper Çekiç</div>
                <div className="text-[9px] text-slate-400">Tıklama Gücü +1</div>
             </div>
             <span className="bg-sky-500/20 text-sky-400 px-2 py-1 rounded-lg font-black">20 🥜</span>
          </button>

          <button 
            onClick={() => buyUpgrade(100, 2, 'auto')}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left text-xs flex justify-between items-center transition-all border border-white/5"
          >
             <div>
                <div className="font-black text-emerald-400">Baklava Fırını</div>
                <div className="text-[9px] text-slate-400">Saniyede +2 Fıstık</div>
             </div>
             <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-lg font-black">100 🥜</span>
          </button>
       </div>
    </div>
  );
};

// --- PRO-LEVEL SMILE PAINT APP (With Undo-Redo & Canvas Save!) ---
const PaintApp = ({ isMuted }) => {
  const canvasRef = useRef(null);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [historyStack, setHistoryStack] = useState([]);

  // Capture canvas state for Undo capability
  const saveState = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      setHistoryStack(prev => [...prev, canvas.toDataURL()]);
    }
  };

  const handleUndo = () => {
    if (historyStack.length === 0) return;
    const previousState = historyStack[historyStack.length - 1];
    setHistoryStack(prev => prev.slice(0, -1));

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = previousState;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    playSystemSound('click', isMuted);
  };

  const startDrawing = (e) => {
    saveState();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX || (e.touches && e.touches[0].clientX)) - rect.left);
    const y = ((e.clientY || (e.touches && e.touches[0].clientY)) - rect.top);

    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    saveState();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    playSystemSound('error', isMuted);
  };

  return (
    <div className="h-full bg-slate-100 flex flex-col justify-between p-4 text-slate-800">
       <div className="flex-1 bg-white rounded-2xl border border-slate-200 overflow-hidden relative shadow-inner">
          <canvas 
            ref={canvasRef}
            width={780}
            height={400}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full cursor-crosshair bg-white"
          />
       </div>

       {/* Toolbar */}
       <div className="mt-4 bg-white p-3 rounded-2xl border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             {['#000000', '#dc2626', '#2563eb', '#16a34a', '#eab308'].map(c => (
               <button 
                 key={c}
                 onClick={() => { setColor(c); playSystemSound('click', isMuted); }}
                 className={`w-6 h-6 rounded-full border-2 transition-all ${color === c ? 'scale-110 border-slate-800 shadow-md' : 'border-transparent'}`}
                 style={{ backgroundColor: c }}
               />
             ))}
          </div>

          <div className="flex items-center gap-3">
             <label className="text-[10px] font-black text-slate-400 uppercase">Fırça</label>
             <input 
               type="range" 
               min="2" 
               max="20" 
               value={brushSize} 
               onChange={(e) => setBrushSize(parseInt(e.target.value))} 
               className="w-24 accent-sky-500 cursor-pointer"
             />
             <span className="text-xs font-bold text-slate-600 font-mono">{brushSize}px</span>
          </div>

          <div className="flex gap-2">
             <button 
               onClick={handleUndo}
               className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
               title="Geri Al"
             >
                <RotateCcw size={16} />
             </button>
             <button 
               onClick={clearCanvas}
               className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
             >
                Temizle
             </button>
          </div>
       </div>
    </div>
  );
};

// --- MESSENGER CHAT APP ---
const ChatApp = () => {
  const [activeContact, setActiveContact] = useState("Kerem (CEO)");
  const [messages, setMessages] = useState({
    "Kerem (CEO)": [
      { role: 'them', text: 'Ali! Kerembook Pro donanımını Antep fıstığı yağı ile yağladık, efsane hızlı çalışıyor!' }
    ],
    "Kerci Baş Mühendis": [
      { role: 'them', text: 'nano-58 planları tamam gibi. 3nm fabrikasyonu için baklava tepsilerini hazırlayın!' }
    ],
    "Baklavacı Memo": [
      { role: 'them', text: 'Usta yeni işlemcinin ısısıyla fıstıkları kavurabilir miyiz bir test edek hele?' }
    ]
  });
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const currentMsgs = messages[activeContact];
    const updated = [...currentMsgs, { role: 'me', text: input }];
    setMessages({
      ...messages,
      [activeContact]: updated
    });
    setInput("");

    setTimeout(() => {
      let reply = "Fıstık gibi fikir Ali! Smile! 😊";
      if (activeContact === "Kerem (CEO)") reply = "Ali Kerem, KeremOS v9.5 sürümüyle rakipleri dize getirdik. Gaziantep gurur duyuyor!";
      if (activeContact === "Kerci Baş Mühendis") reply = "Nöral ağlar senkronize edildi. nano-57 işlemci tam kapasite aktif!";
      
      setMessages(prev => ({
        ...prev,
        [activeContact]: [...prev[activeContact], { role: 'them', text: reply }]
      }));
    }, 1000);
  };

  return (
    <div className="h-full flex bg-slate-50 text-slate-800">
       <div className="w-56 bg-slate-100 border-r border-slate-200 p-4">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Kişiler</div>
          <div className="space-y-1">
             {Object.keys(messages).map(contact => (
               <button 
                 key={contact}
                 onClick={() => setActiveContact(contact)}
                 className={`w-full p-3 text-left rounded-xl text-xs font-black transition-all ${activeContact === contact ? 'bg-sky-500 text-white shadow-md' : 'hover:bg-slate-200'}`}
               >
                  {contact}
               </button>
             ))}
          </div>
       </div>

       <div className="flex-1 flex flex-col justify-between">
          <div className="p-4 bg-white border-b border-slate-200 font-bold text-sm flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             {activeContact}
          </div>
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
             {messages[activeContact].map((m, i) => (
               <div key={i} className={`flex ${m.role === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-4 rounded-2xl text-xs font-bold max-w-[70%] border ${m.role === 'me' ? 'bg-sky-500 text-white border-sky-600 shadow-md shadow-sky-500/10' : 'bg-white border-slate-150 shadow-sm'}`}>
                     {m.text}
                  </div>
               </div>
             ))}
          </div>
          <div className="p-4 bg-white border-t border-slate-200 flex gap-3 shrink-0">
             <input 
               type="text" 
               className="flex-1 h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 outline-none focus:border-sky-500 text-xs font-semibold"
               placeholder="Mesajınızı yazın..."
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
             />
             <button onClick={handleSend} className="w-12 h-12 bg-sky-600 text-white rounded-xl flex items-center justify-center transition-transform hover:scale-105"><Send size={16}/></button>
          </div>
       </div>
    </div>
  );
};

// --- NOTES APP ---
const NotesApp = () => {
  const [notes, setNotes] = useState([
    { title: "Yeni Tasarım", content: "Kerci nano-58 mimarisi 3nm olarak tasarlanacak." }
  ]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleAdd = () => {
    if (!title.trim() || !content.trim()) return;
    setNotes([...notes, { title, content }]);
    setTitle("");
    setContent("");
  };

  return (
    <div className="h-full flex bg-slate-50 text-slate-800">
       <div className="w-56 bg-slate-100 border-r p-6 space-y-4 overflow-y-auto shrink-0">
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Notlarım</h4>
          {notes.map((n, i) => (
            <div key={i} className="p-3 bg-white border rounded-xl shadow-sm space-y-1">
              <div className="font-bold text-xs text-slate-800 truncate">{n.title}</div>
              <div className="text-[10px] text-slate-400 truncate">{n.content}</div>
            </div>
          ))}
       </div>
       <div className="flex-1 p-8 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
             <input 
               type="text" 
               placeholder="Not Başlığı..."
               className="w-full h-12 px-4 rounded-xl border border-slate-200 outline-none focus:border-sky-500 text-sm font-bold bg-white"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
             />
             <textarea 
               placeholder="Bir şeyler yazın..."
               className="w-full h-56 p-4 rounded-xl border border-slate-200 outline-none focus:border-sky-500 text-sm font-medium bg-white resize-none"
               value={content}
               onChange={(e) => setContent(e.target.value)}
             />
          </div>
          <button 
            onClick={handleAdd}
            className="w-full h-12 bg-sky-500 text-white font-bold text-xs rounded-xl uppercase tracking-wider shadow-md"
          >
            Kaydet
          </button>
       </div>
    </div>
  );
};

// --- PRO SETTINGS APP WITH USER & PASSWORD CUSTOMIZER ---
const SettingsApp = ({ wallpaper, setWallpaper, isMuted, setIsMuted, sysPassword, setSysPassword, setIsland }) => {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState(false);

  const wallpapersList = [
    { id: 'gradient-blue', label: 'Klasik Mavi', previewClass: 'bg-gradient-to-br from-sky-900 to-black' },
    { id: 'sunset', label: 'Antep Sunset', previewClass: 'bg-gradient-to-br from-orange-800 to-violet-950' },
    { id: 'aurora', label: 'Polar Lights', previewClass: 'bg-gradient-to-br from-emerald-950 to-indigo-950' },
    { id: 'space', label: 'Deep Space', previewClass: 'bg-gradient-to-br from-slate-900 to-neutral-950' },
    { id: 'cyber', label: 'Cyber Matrix', previewClass: 'bg-gradient-to-br from-green-950 to-slate-950' }
  ];

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess(false);

    if (currentPass !== sysPassword) {
      setPassError("Mevcut parola hatalı!");
      playSystemSound('error', isMuted);
      return;
    }
    if (newPass.length < 4) {
      setPassError("Yeni parola en az 4 karakter olmalıdır!");
      playSystemSound('error', isMuted);
      return;
    }
    if (newPass !== confirmPass) {
      setPassError("Yeni parolalar uyuşmuyor!");
      playSystemSound('error', isMuted);
      return;
    }

    setSysPassword(newPass);
    setPassSuccess(true);
    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
    playSystemSound('unlock', isMuted);
    
    // Dynamic Island Alert
    setIsland({ type: 'unlock', label: 'Parola Güncellendi', desc: 'Yeni parola koruması aktif' });
  };

  return (
    <div className="h-full bg-slate-50 p-8 overflow-y-auto text-slate-800">
       <div className="mb-8">
          <h2 className="text-3xl font-black tracking-tighter">Sistem Ayarları</h2>
          <p className="text-xs text-slate-500 mt-1">Kerembook Pro sistem bileşenlerini ve güvenliğini özelleştir</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-4">
               <h3 className="font-bold text-sm tracking-tight border-b pb-2 flex items-center gap-2">
                  <Palette size={16} className="text-sky-500" /> Duvar Kağıdı
               </h3>
               <div className="grid grid-cols-2 gap-4">
                  {wallpapersList.map(wall => (
                    <button 
                      key={wall.id}
                      onClick={() => {
                        setWallpaper(wall.id);
                        playSystemSound('click', isMuted);
                        setIsland({ type: 'notif', label: 'Tema Değişti', desc: wall.label });
                      }}
                      className={`p-2 rounded-2xl border-2 transition-all text-left space-y-2 ${wallpaper === wall.id ? 'border-sky-500 bg-sky-50/50' : 'border-slate-100 hover:border-slate-300'}`}
                    >
                       <div className={`h-12 w-full rounded-xl ${wall.previewClass}`} />
                       <div className="text-[10px] font-black uppercase text-center">{wall.label}</div>
                    </button>
                  ))}
               </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-4">
               <h3 className="font-bold text-sm tracking-tight border-b pb-2 flex items-center gap-2">
                  <Volume2 size={16} className="text-sky-500" /> Sistem Sesleri
               </h3>
               <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                  <div className="text-xs font-bold">8-Bit Sound FX</div>
                  <button 
                    onClick={() => {
                      setIsMuted(!isMuted);
                      playSystemSound('click', !isMuted);
                    }}
                    className={`px-4 py-2 rounded-xl font-bold text-[10px] tracking-wider text-white transition-all uppercase ${isMuted ? 'bg-slate-400' : 'bg-green-500 shadow-md shadow-green-500/20'}`}
                  >
                    {isMuted ? 'Sessiz' : 'Açık'}
                  </button>
               </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border shadow-sm space-y-4">
             <h3 className="font-bold text-sm tracking-tight border-b pb-2 flex items-center gap-2">
                <ShieldCheck size={16} className="text-sky-500" /> Güvenlik & Parola Değiştir
             </h3>
             <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Mevcut Parola</label>
                   <input 
                     type="password" 
                     placeholder="••••"
                     value={currentPass}
                     onChange={(e) => setCurrentPass(e.target.value)}
                     className="w-full h-11 px-4 rounded-xl border border-slate-200 outline-none focus:border-sky-500 text-sm font-semibold"
                     required
                   />
                </div>
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Yeni Parola</label>
                   <input 
                     type="password" 
                     placeholder="Yeni şifrenizi girin"
                     value={newPass}
                     onChange={(e) => setNewPass(e.target.value)}
                     className="w-full h-11 px-4 rounded-xl border border-slate-200 outline-none focus:border-sky-500 text-sm font-semibold"
                     required
                   />
                </div>
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Yeni Parola (Onayla)</label>
                   <input 
                     type="password" 
                     placeholder="Yeni şifrenizi tekrar girin"
                     value={confirmPass}
                     onChange={(e) => setConfirmPass(e.target.value)}
                     className="w-full h-11 px-4 rounded-xl border border-slate-200 outline-none focus:border-sky-500 text-sm font-semibold"
                     required
                   />
                </div>

                {passError && (
                  <p className="text-xs text-red-500 font-bold animate-pulse">{passError}</p>
                )}

                {passSuccess && (
                  <p className="text-xs text-green-600 font-bold">Parola başarıyla değiştirildi! Yeni şifreniz aktif.</p>
                )}

                <button 
                  type="submit"
                  className="w-full h-11 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-bold text-xs rounded-xl uppercase tracking-widest transition-all shadow-md shadow-sky-500/10"
                >
                   Güncelle
                </button>
             </form>
          </div>
       </div>
    </div>
  );
};

// --- BEAR MUSIC APP ---
const MusicApp = ({ isMuted }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayMusic = () => {
    setIsPlaying(true);
    playAntepHamamlarıMelody(isMuted);
    setTimeout(() => setIsPlaying(false), 5500); // Melody duration
  };

  return (
    <div className="h-full bg-slate-950 p-10 flex flex-col items-center justify-center text-white relative">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#9d174d_0%,_transparent_70%)] opacity-20" />
       
       <div className="relative z-10 text-center space-y-6">
          <div className={`p-8 bg-white/5 border border-white/10 rounded-full w-32 h-32 flex items-center justify-center mx-auto shadow-2xl ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}>
             <Music size={48} className="text-pink-500" />
          </div>
          
          <div className="space-y-1">
             <h3 className="text-2xl font-black tracking-tighter">Bear Music Chiptune</h3>
             <p className="text-[10px] text-pink-400 font-bold uppercase tracking-widest">Antep Hamamları - Extended Retro Remix</p>
          </div>

          <button 
            onClick={handlePlayMusic}
            disabled={isPlaying}
            className={`px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest transition-all ${isPlaying ? 'bg-pink-600/50 text-white/50 animate-pulse' : 'bg-pink-600 hover:bg-pink-500 text-white shadow-lg shadow-pink-500/20 active:scale-95'}`}
          >
             {isPlaying ? 'Çalınıyor...' : 'Melodiyi Başlat'}
          </button>
       </div>
    </div>
  );
};

// --- USB UTILITY ---
const UsbApp = () => (
  <div className="p-20 h-full bg-slate-50 overflow-y-auto">
     <h2 className="text-7xl font-black text-slate-800 tracking-tighter mb-20 uppercase italic">Titan USB Center</h2>
     <div className="bg-white p-20 rounded-[80px] border border-sky-100 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.1)] flex items-center justify-between group overflow-hidden relative">
        <div className="absolute -right-40 -bottom-40 opacity-5 group-hover:scale-125 transition-transform duration-[2000ms]"><KeremLogo className="w-[600px] h-[600px]"/></div>
        <div className="flex items-center gap-20 relative z-10">
           <div className="p-14 bg-sky-50 rounded-[60px] text-sky-600 shadow-inner">
              <Database size={100} />
           </div>
           <div>
              <div className="text-5xl font-black text-slate-800 tracking-tighter uppercase italic">USB_SIGNATURE_BOOT</div>
              <div className="flex items-center gap-6 mt-6">
                 <span className="px-8 py-3 bg-sky-500 text-white rounded-full text-[12px] font-black uppercase tracking-[0.3em] shadow-lg shadow-sky-200">Verified Boot v9.5</span>
                 <span className="text-slate-400 font-black text-lg italic tracking-tight opacity-70">Nano-Link Enabled USB 3.2</span>
              </div>
           </div>
        </div>
        <div className="text-right relative z-10">
           <div className="text-9xl font-black text-sky-600 tracking-tighter italic leading-none">64 GB</div>
           <div className="text-[14px] text-slate-400 font-black uppercase tracking-[0.5em] mt-5">Ali's Portable KeremOS</div>
        </div>
     </div>
  </div>
);

// --- MAIN OS ENTRYPOINT APPLICATION ---
const App = () => {
  // System States
  const [booting, setBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState("1234"); 
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [isShutDown, setIsShutDown] = useState(false);
  const [shutdownProgress, setShutdownProgress] = useState(false);

  // Dynamic Customizations
  const [wallpaper, setWallpaper] = useState("gradient-blue");
  const [isMuted, setIsMuted] = useState(false);

  // Dynamic Island States
  const [island, setIsland] = useState({ type: 'idle', label: '', desc: '' });

  // Window State and ordered active stack (Z-Index Manager)
  const [windows, setWindows] = useState([]);
  const [windowPositions, setWindowPositions] = useState({});
  const [activeWindow, setActiveWindow] = useState(null);
  const [windowOrder, setWindowOrder] = useState([]); // Keeps track of active depths

  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Installed Apps List
  const [installedApps, setInstalledApps] = useState([
    { id: 'ai', label: 'Smile AI', color: 'from-sky-500 to-blue-700', icon: <Bot /> },
    { id: 'camera', label: 'Smile Cam', color: 'from-teal-500 to-emerald-600', icon: <Camera /> },
    { id: 'usb', label: 'USB Drive', color: 'from-slate-700 to-slate-900', icon: <Database /> },
    { id: 'shell', label: 'Shell', color: 'from-slate-800 to-black', icon: <Terminal /> },
    { id: 'files', label: 'Dosyalar', color: 'from-amber-600 to-orange-700', icon: <FolderOpen /> },
    { id: 'system', label: 'Sistem', color: 'from-sky-600 to-blue-800', icon: <Cpu /> },
    { id: 'activity', label: 'Panel', color: 'from-rose-500 to-red-700', icon: <Activity /> },
    { id: 'browser', label: 'Browser', color: 'from-indigo-500 to-purple-600', icon: <Globe /> },
    { id: 'store', label: 'Store', color: 'from-fuchsia-500 to-pink-600', icon: <ShoppingBag /> },
    { id: 'settings', label: 'Ayarlar', color: 'from-zinc-600 to-zinc-800', icon: <Settings /> }
  ]);

  // File System State
  const [files, setFiles] = useState([
    { name: "Signature_Logo.svg", type: "image", content: "logo" },
    { name: "Nano57_Blueprint.pdf", type: "pdf", content: "CPU: Kerci nano-57\nMimari: Titan v7.5\nMikron: 2nm\nÇekirdekler: 16 Nöral Çekirdek, 8 Performans Çekirdeği\nDurum: %100 Kararlı.\nGaziantep fıstığı enerjisiyle optimize edilmiş nöral yollar." },
    { name: "Smile_Neural_Model.bin", type: "bin", content: "01010011 01001101 01001001 01001100 01000101 00100000 01001110 01000101 01010101 01010010 01000001 01001100" },
    { name: "Ali_Notlar.txt", type: "txt", content: "KeremOS projesi harika gidiyor! \nSürüklenebilir pencereler aktif edildi.\nKilit ekranı şifresi: 1234\nSmile AI gerçek bir yapay zeka ile çalışıyor.\nGaziantep'ten sevgilerle!" },
    { name: "Gaziantep_Fistik_Tarifi.txt", type: "txt", content: "Malzemeler:\n- 1 ölçek Kerci nano-57 işlemci sıcaklığıyla kavrulmuş fıstıklar\n- 2 ölçek samimiyet\n- Çıtır baklava hamuru.\nSmile! 😊" }
  ]);

  // Boot sequence effect
  useEffect(() => {
    let playSoundTimeout;
    if (booting) {
      playSoundTimeout = setTimeout(() => {
        playSystemSound('boot', isMuted);
      }, 1000);

      const interval = setInterval(() => {
        setBootProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setBooting(false), 800);
            return 100;
          }
          return prev + 1.5;
        });
      }, 50);

      return () => {
        clearInterval(interval);
        clearTimeout(playSoundTimeout);
      };
    }
  }, [booting]);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleUnlock = (e) => {
    e?.preventDefault();
    if (passwordInput === password) {
      setIsLocked(false);
      setLoginError(false);
      playSystemSound('unlock', isMuted);
      
      setIsland({ type: 'unlock', label: 'Sistem Kilidi Açıldı', desc: 'Hoş geldiniz, Ali' });
      setTimeout(() => setIsland({ type: 'idle', label: '', desc: '' }), 3000);
      setPasswordInput("");
    } else {
      setLoginError(true);
      setPasswordInput("");
      playSystemSound('error', isMuted);
    }
  };

  const focusWindow = (id) => {
    setActiveWindow(id);
    setWindowOrder(prev => {
      const filtered = prev.filter(wId => wId !== id);
      return [...filtered, id];
    });
  };

  const openWindow = (id, title, icon) => {
    playSystemSound('click', isMuted);
    if (windows.find(w => w.id === id)) {
      focusWindow(id);
    } else {
      const offset = windows.length * 20;
      const initialX = Math.min(window.innerWidth * 0.15 + offset, window.innerWidth - 650);
      const initialY = Math.min(window.innerHeight * 0.1 + offset, window.innerHeight - 500);
      
      setWindowPositions(prev => ({
        ...prev,
        [id]: { x: initialX, y: initialY }
      }));
      setWindows([...windows, { id, title, icon }]);
      focusWindow(id);

      // Handle Dynamic Island indicators
      if (id === 'camera') {
        setIsland({ type: 'camera', label: 'Kamera Aktif', desc: 'Güvenli Kayıt Modu' });
      } else if (id === 'ai') {
        setIsland({ type: 'ai', label: 'Smile AI Nöral Hat', desc: 'Sohbet Başlatılıyor' });
      } else if (id === 'music') {
        setIsland({ type: 'music', label: 'Antep Hamamları', desc: '8-Bit Chiptune' });
      }
    }
    setIsStartMenuOpen(false);
  };

  const closeWindow = (id) => {
    playSystemSound('click', isMuted);
    setWindows(windows.filter(w => w.id !== id));
    setWindowOrder(prev => prev.filter(wId => wId !== id));
    if (activeWindow === id) {
      const remaining = windowOrder.filter(wId => wId !== id);
      setActiveWindow(remaining.length > 0 ? remaining[remaining.length - 1] : null);
    }
    
    if (id === 'camera' || id === 'ai' || id === 'music') {
      setIsland({ type: 'idle', label: '', desc: '' });
    }
  };

  const handleDrag = (id, newPos) => {
    const boundX = Math.max(0, Math.min(newPos.x, window.innerWidth - 200));
    const boundY = Math.max(0, Math.min(newPos.y, window.innerHeight - 100));
    setWindowPositions(prev => ({
      ...prev,
      [id]: { x: boundX, y: boundY }
    }));
  };

  const handleShutdown = () => {
    setIsStartMenuOpen(false);
    setShutdownProgress(true);
    playSystemSound('gameover', isMuted);
    setTimeout(() => {
      setShutdownProgress(false);
      setIsShutDown(true);
    }, 2000);
  };

  const handlePowerOn = () => {
    setIsShutDown(false);
    setBooting(true);
    setBootProgress(0);
    setIsLocked(true);
    setPasswordInput("");
    setWindows([]);
    setWindowOrder([]);
    setIsland({ type: 'idle', label: '', desc: '' });
  };

  if (isShutDown) {
    return (
      <div className="h-screen w-screen bg-black flex flex-col justify-center items-center font-sans text-white">
        <FontLink />
        <div className="text-center space-y-6">
          <p className="text-slate-500 font-mono text-xs tracking-widest uppercase">Kerembook Gücü Kapatıldı</p>
          <button 
            onClick={handlePowerOn}
            className="w-20 h-20 bg-slate-900 hover:bg-sky-950 hover:text-sky-400 border border-slate-800 hover:border-sky-500 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-sky-500/20 active:scale-95 group animate-pulse animate-float"
          >
            <Power size={32} className="text-slate-400 group-hover:text-sky-400 transition-colors" />
          </button>
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Sistemi Başlatmak İçin Güç Tuşuna Bas</p>
        </div>
      </div>
    );
  }

  if (shutdownProgress) {
    return (
      <div className="h-screen w-screen bg-[#020617] flex flex-col justify-center items-center font-sans text-white">
        <FontLink />
        <div className="text-center space-y-6 animate-pulse">
          <KeremLogo className="w-32 h-32 mx-auto animate-float" />
          <h2 className="text-2xl font-black italic tracking-tighter animate-bounce">Sistem Kapatılıyor...</h2>
          <p className="text-xs text-sky-400 font-mono">Kerci nano-57 çekirdekleri uyku moduna geçiyor.</p>
        </div>
      </div>
    );
  }

  // Cinematic Booting Animation
  if (booting) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col justify-center items-center relative overflow-hidden select-none">
        <FontLink />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[160px] animate-pulse" />
        
        <div className="relative z-10 text-center space-y-10">
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-dashed border-sky-400/20 rounded-full animate-rotate-ring" />
            <div className="absolute inset-2 border border-sky-300/10 rounded-full" />
            <div className="animate-float">
              <KeremLogo className="w-36 h-36 drop-shadow-[0_0_35px_rgba(147,197,253,0.4)]" />
            </div>
          </div>
          
          <div className="space-y-4 max-w-sm mx-auto">
            <h2 className="text-white font-black tracking-widest text-lg uppercase italic font-sans">
              KeremOS <span className="text-sky-400 font-medium animate-pulse">Signature</span>
            </h2>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 shadow-[0_0_15px_#38bdf8] transition-all duration-300" 
                style={{ width: `${bootProgress}%` }} 
              />
            </div>
            <p className="text-[9px] text-sky-400/60 font-mono uppercase tracking-[0.4em] animate-pulse">
              Kerci nano-57 // Neural Core Booting
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Choose Wallpaper Style
  const getWallpaperClass = () => {
    switch (wallpaper) {
      case "aurora":
        return "bg-[radial-gradient(circle_at_top_right,_#022c22_0%,_#311042_50%,_#020617_100%)]";
      case "space":
        return "bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#020617_100%)]";
      case "sunset":
        return "bg-[radial-gradient(circle_at_bottom_left,_#7c2d12_0%,_#1e1b4b_60%,_#020617_100%)]";
      case "cyber":
        return "bg-[radial-gradient(circle_at_center,_#052e16_0%,_#020617_100%)]";
      case "gradient-blue":
      default:
        return "bg-[radial-gradient(circle_at_bottom_left,_#0c4a6e_0%,_transparent_40%),radial-gradient(circle_at_top_right,_#1e293b_0%,_#020617_100%)]";
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden font-['Inter',sans-serif] relative select-none flex flex-col bg-slate-950">
      <FontLink />
      {/* BACKGROUND WALLPAPER */}
      <div className={`absolute inset-0 transition-all duration-1000 ${getWallpaperClass()} opacity-90`} />
      
      {/* IPHONE DYNAMIC ISLAND */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[999]">
        <DynamicIsland 
          island={island} 
          setIsland={setIsland} 
          onOpenApp={(id) => openWindow(id, id === 'ai' ? 'Smile AI Assistant' : id === 'camera' ? 'Smile Cam' : id === 'music' ? 'Bear Music' : id === 'clicker' ? 'Fıstık Clicker' : id === 'paint' ? 'Smile Paint' : 'Sanal Chat', id === 'ai' ? <Bot size={18}/> : id === 'camera' ? <Camera size={18}/> : id === 'music' ? <Music size={18}/> : id === 'clicker' ? <Zap size={18}/> : id === 'paint' ? <Palette size={18}/> : <MessageSquare size={18}/>)} 
        />
      </div>

      {/* DESKTOP CONTENT AREA */}
      <div className="flex-1 relative z-10 p-6 md:p-10 pt-16 flex flex-col flex-wrap content-start gap-4 md:gap-6 h-[calc(100vh-80px)] overflow-hidden">
        {installedApps.map(app => (
          <DesktopIcon 
            key={app.id}
            icon={app.icon} 
            label={app.label} 
            color={app.color} 
            onClick={() => openWindow(app.id, app.label, React.cloneElement(app.icon, { size: 18 }))} 
            isAi={app.id === 'ai'} 
          />
        ))}
      </div>

      {/* WINDOWS LAYER WITH STACK Z-INDEX ASSIGNMENTS */}
      {windows.map(win => {
        const stackIndex = windowOrder.indexOf(win.id);
        return (
          <Window 
            key={win.id} 
            win={win} 
            isActive={activeWindow === win.id} 
            position={windowPositions[win.id] || { x: 150, y: 100 }}
            onDrag={handleDrag}
            onClose={() => closeWindow(win.id)}
            onFocus={() => focusWindow(win.id)}
            windowOrderLength={windowOrder.length}
            currentStackIndex={stackIndex}
          >
            {win.id === 'ai' && <AiApp isMuted={isMuted} setIsIsland={setIsland} />}
            {win.id === 'camera' && <CameraApp />}
            {win.id === 'shell' && <TerminalApp files={files} />}
            {win.id === 'system' && <SystemApp />}
            {win.id === 'activity' && <ActivityApp />}
            {win.id === 'files' && <FilesApp files={files} setFiles={setFiles} isMuted={isMuted} setIsIsland={setIsland} />}
            {win.id === 'usb' && <UsbApp />}
            {win.id === 'browser' && <BrowserApp />}
            {win.id === 'store' && <StoreApp installedApps={installedApps} setInstalledApps={setInstalledApps} isMuted={isMuted} setIsIsland={setIsland} />}
            {win.id === 'game' && <GameApp isMuted={isMuted} />}
            {win.id === 'notes' && <NotesApp />}
            {win.id === 'settings' && (
              <SettingsApp 
                wallpaper={wallpaper} 
                setWallpaper={setWallpaper} 
                isMuted={isMuted} 
                setIsMuted={setIsMuted} 
                sysPassword={password}
                setSysPassword={setPassword}
                setIsland={setIsland}
              />
            )}
            {win.id === 'music' && <MusicApp isMuted={isMuted} />}
            {win.id === 'clicker' && <ClickerApp isMuted={isMuted} setIsIsland={setIsland} />}
            {win.id === 'paint' && <PaintApp isMuted={isMuted} />}
            {win.id === 'chat' && <ChatApp />}
          </Window>
        );
      })}

      {/* SYSTEM TASKBAR */}
      <div className="w-full h-16 bg-white/5 backdrop-blur-3xl border-t border-white/10 flex items-center px-6 justify-between z-[100] shadow-2xl shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              setIsStartMenuOpen(!isStartMenuOpen);
              playSystemSound('click', isMuted);
            }}
            className="hover:scale-110 transition-transform active:scale-95 group relative animate-pulse"
          >
            <div className="absolute inset-0 bg-sky-500/20 blur-xl group-hover:bg-sky-500/40 transition-all rounded-full" />
            <KeremLogo className="w-10 h-10 relative z-10" />
          </button>
          <div className="h-8 w-px bg-white/10 mx-2" />
          <div className="flex gap-2">
            {windows.map(w => (
              <button 
                key={w.id} 
                onClick={() => focusWindow(w.id)}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${activeWindow === w.id ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30' : 'hover:bg-white/10 text-white/40'}`}
              >
                {w.icon}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-3 bg-black/40 px-4 py-1.5 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-sky-400">
             <Brain size={14} className="animate-pulse" /> Neural-Link Core
          </div>
          <button 
            onClick={() => {
              setIsMuted(!isMuted);
              playSystemSound('click', !isMuted);
            }} 
            className="text-white/60 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <div className="text-right leading-none">
            <div className="text-white font-black text-xl tracking-tighter">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div className="text-[10px] text-white/30 uppercase mt-1 font-bold tracking-tighter">{currentTime.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</div>
          </div>
        </div>
      </div>

      {/* START MENU */}
      {isStartMenuOpen && (
        <div className="absolute bottom-20 left-6 w-[440px] bg-slate-900/98 backdrop-blur-3xl border border-sky-500/20 rounded-[50px] shadow-2xl z-[110] animate-in zoom-in-95 duration-200 overflow-hidden">
          <div className="p-10">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-20 h-20 bg-white/5 rounded-[32px] flex items-center justify-center shadow-lg border border-white/10">
                <KeremLogo className="w-14 h-14" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white tracking-tighter italic">Ali Kerem</h2>
                <p className="text-[11px] text-sky-500 font-black uppercase tracking-[0.3em] mt-2">KeremOS v9.5 Signature</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-6 overflow-y-auto max-h-[220px] p-1 animate-in fade-in duration-300">
              {installedApps.map(app => (
                <StartBtn 
                  key={app.id} 
                  icon={app.icon} 
                  label={app.label} 
                  onClick={() => openWindow(app.id, app.label, React.cloneElement(app.icon, { size: 18 }))} 
                />
              ))}
            </div>
          </div>
          <div className="bg-black/60 p-6 px-10 flex justify-between items-center border-t border-white/5">
             <span className="text-[10px] text-sky-500/60 font-black tracking-widest uppercase italic font-mono">Build 9.5.26_ALI</span>
             <div className="flex gap-4">
               <button 
                 onClick={() => {
                   setIsLocked(true);
                   playSystemSound('click', isMuted);
                 }}
                 className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1"
               >
                 <Lock size={12} /> Kilitle
               </button>
               <button 
                 onClick={handleShutdown} 
                 className="px-4 py-2 bg-red-500/10 hover:bg-red-500 hover:text-white transition-all rounded-xl text-[10px] font-black text-red-500 uppercase tracking-widest"
               >
                 Kapat
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- LOCK SCREEN ---
const LockScreen = () => {
  // Not used anymore as integrated cleanly inside App rendering path
  return null;
};

export default App;