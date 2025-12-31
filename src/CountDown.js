import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CountdownTimer = () => {
    const navigate = useNavigate();
    const targetDate = new Date("2025-12-31T18:00:00");
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    const getTimeLeft = () => {
        const now = new Date();
        const diff = targetDate - now;
        if (diff <= 0) return null;

        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: Math.floor((diff / 1000) % 60)
        };
    };

    const [timeLeft, setTimeLeft] = useState(getTimeLeft());
    const [ended, setEnded] = useState(false);
    const [fireworksActive, setFireworksActive] = useState(false);
    const [visible, setVisible] = useState(true);

    // Fireworks system
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let fireworks = [];
        let particles = [];

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        class Firework {
            constructor(x, y, targetX, targetY) {
                this.x = x;
                this.y = y;
                this.targetX = targetX;
                this.targetY = targetY;
                this.speed = 6 + Math.random() * 2;
                this.acceleration = 1.10;
                this.brightness = Math.random() * 50 + 50;
                this.color = `hsl(${Math.random() * 360}, 100%, ${this.brightness}%)`;
                this.trail = [];
                this.trailLength = 5;
            }

            update() {
                // Add to trail
                this.trail.push({ x: this.x, y: this.y });
                if (this.trail.length > this.trailLength) {
                    this.trail.shift();
                }

                // Move towards target
                const dx = this.targetX - this.x;
                const dy = this.targetY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                this.x += (dx / distance) * this.speed;
                this.y += (dy / distance) * this.speed;
                this.speed *= this.acceleration;

                // If close to target, explode
                if (distance < 10) {
                    this.explode();
                    return false;
                }
                return true;
            }

            explode() {
                const particleCount = 100 + Math.random() * 200;
                for (let i = 0; i < particleCount; i++) {
                    particles.push(new Particle(
                        this.x,
                        this.y,
                        this.color
                    ));
                }
            }

            draw() {
                // Draw trail
                this.trail.forEach((pos, i) => {
                    const alpha = i / this.trailLength;
                    ctx.beginPath();
                    ctx.arc(pos.x, pos.y, 2 * alpha, 0, Math.PI * 2);
                    ctx.fillStyle = this.color.replace('%)', `%, ${alpha})`);
                    ctx.fill();
                });

                // Draw firework
                ctx.beginPath();
                ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();

                // Glow effect
                ctx.beginPath();
                ctx.arc(this.x, this.y, 8, 0, Math.PI * 2);
                ctx.fillStyle = this.color.replace('%)', '%, 0.3)');
                ctx.fill();
            }
        }

        class Particle {
            constructor(x, y, color) {
                this.x = x;
                this.y = y;
                this.color = color;
                this.velocity = {
                    x: (Math.random() - 0.5) * 10,
                    y: (Math.random() - 0.5) * 10
                };
                this.alpha = 1;
                this.decay = Math.random() * 0.02 + 0.01;
                this.size = Math.random() * 3 + 1;
                this.gravity = 0.05;
            }

            update() {
                this.velocity.y += this.gravity;
                this.x += this.velocity.x;
                this.y += this.velocity.y;
                this.alpha -= this.decay;
                return this.alpha > 0;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.restore();
            }
        }

        const animate = () => {
            if (!fireworksActive) {
                animationRef.current = requestAnimationFrame(animate);
                return;
            }

            // Clear with fade effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Create new fireworks
            if (Math.random() < 0.03) {
                const x = Math.random() * canvas.width;
                fireworks.push(new Firework(
                    x,
                    canvas.height,
                    x + (Math.random() - 0.5) * 200,
                    Math.random() * canvas.height * 0.5
                ));
            }

            // Create special big fireworks when countdown ends
            if (ended && Math.random() < 0.05) {
                for (let i = 0; i < 3; i++) {
                    const x = Math.random() * canvas.width;
                    const y = Math.random() * canvas.height * 0.8;
                    fireworks.push(new Firework(
                        x,
                        canvas.height,
                        x,
                        y
                    ));
                }
            }

            // Update and draw fireworks
            fireworks = fireworks.filter(firework => firework.update());
            fireworks.forEach(firework => firework.draw());

            // Update and draw particles
            particles = particles.filter(particle => particle.update());
            particles.forEach(particle => particle.draw());

            animationRef.current = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationRef.current);
        };
    }, [fireworksActive, ended]);

    useEffect(() => {
        const timer = setInterval(() => {
            const remaining = getTimeLeft();
            setTimeLeft(remaining);

            if (!remaining) {
                clearInterval(timer);
                setEnded(true);
                setFireworksActive(true);

                // Launch initial celebration fireworks
                setTimeout(() => {
                    const canvas = canvasRef.current;
                    if (canvas) {
                        // Trigger multiple fireworks at once
                        for (let i = 0; i < 20; i++) {
                            setTimeout(() => {
                                const ctx = canvas.getContext('2d');
                                const particleCount = 150;
                                const color = `hsl(${Math.random() * 360}, 100%, 60%)`;

                                for (let j = 0; j < particleCount; j++) {
                                    const x = canvas.width / 2;
                                    const y = canvas.height / 2;
                                    setTimeout(() => {
                                        const angle = Math.random() * Math.PI * 2;
                                        const speed = Math.random() * 5 + 2;
                                        const particle = {
                                            x,
                                            y,
                                            vx: Math.cos(angle) * speed,
                                            vy: Math.sin(angle) * speed,
                                            color,
                                            size: Math.random() * 4 + 1,
                                            alpha: 1,
                                            decay: 0.02
                                        };

                                        const animateParticle = () => {
                                            particle.x += particle.vx;
                                            particle.y += particle.vy;
                                            particle.vy += 0.05;
                                            particle.alpha -= particle.decay;

                                            if (particle.alpha > 0) {
                                                ctx.save();
                                                ctx.globalAlpha = particle.alpha;
                                                ctx.beginPath();
                                                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                                                ctx.fillStyle = particle.color;
                                                ctx.fill();
                                                ctx.restore();
                                                requestAnimationFrame(animateParticle);
                                            }
                                        };
                                        animateParticle();
                                    }, j * 10);
                                }
                            }, i * 100);
                        }
                    }
                }, 100);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    if (!timeLeft && !ended) return null;

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[9999] overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
            {/* Fireworks Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0"
            />

            {/* Animated Background Particles */}
            <div className="absolute inset-0">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white/10"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 4 + 1}px`,
                            height: `${Math.random() * 4 + 1}px`,
                            animation: `twinkle ${Math.random() * 3 + 2}s infinite`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
                <div className="text-center px-6 py-12 rounded-3xl  border border-white/10 shadow-2xl max-w-2xl mx-auto">
                    {!ended ? (
                        <>
                            {/* Animated Launch Badge */}
                            <div className="relative inline-block mb-10 px-10 py-3 rounded-full 
                                bg-gradient-to-r from-orange-500/25 via-amber-400/20 to-yellow-300/25
                                backdrop-blur-lg border border-orange-400/40
                                shadow-lg shadow-orange-500/20
                                overflow-hidden">

                                {/* shimmer */}
                                <span className="absolute inset-0 bg-gradient-to-r 
                                    from-transparent via-white/20 to-transparent 
                                    animate-shimmer" />

                                <span className="relative z-10 flex items-center gap-3 text-sm text-white tracking-widest uppercase font-semibold">
                                    <span className="animate-bounce">🚀</span>
                                    We Are Launching In
                                    <span className="animate-bounce delay-200">🚀</span>
                                </span>
                            </div>

                            {/* Main Title */}
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl 
                                font-extrabold mb-6 text-center
                                bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400
                                bg-clip-text text-transparent
                                drop-shadow-[0_0_25px_rgba(255,165,0,0.35)]
                                animate-gradient">
                                Get Ready For Launch!
                            </h1>

                            {/* Subtitle */}
                            <p className="text-lg sm:text-xl text-white/90 mb-2 animate-fadeInUp">
                                Launching on{" "}
                                <strong className="text-amber-300">
                                    Jan 1, 2026 · 12:00 AM
                                </strong>
                            </p>
                            <p className="text-sm text-white/60 mb-12 animate-fadeInUp delay-200">
                                Something bold. Something powerful. Something new.
                            </p>

                            {/* Countdown Timer */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mb-10">
                                <TimeBox value={timeLeft.days} label="Days" />
                                <TimeBox value={timeLeft.hours} label="Hours" />
                                <TimeBox value={timeLeft.minutes} label="Minutes" />
                                <TimeBox value={timeLeft.seconds} label="Seconds" />
                            </div>

                            {/* Progress Bar */}
                            <div className="max-w-lg mx-auto mb-6">
                                <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="absolute left-0 top-0 h-full
                                            bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300
                                            rounded-full animate-progressGlow"
                                        style={{
                                            width: `${Math.min(
                                                100,
                                                Math.max(0, 100 - (timeLeft.days / 365) * 100)
                                            )}%`,
                                            transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)"
                                        }}
                                    />
                                </div>

                                <div className="flex justify-between text-xs text-white/50 mt-2">
                                    <span>Countdown Started</span>
                                    <span>Launch Day</span>
                                </div>
                            </div>

                        </>
                    ) : (
                        <div className="relative space-y-10 animate-scaleIn text-center">

                            {/* Glow background */}
                            <div className="absolute inset-0 -z-10 flex items-center justify-center">
                                <div className="w-96 h-96 bg-orange-500/30 rounded-full blur-3xl animate-pulse" />
                                <div className="absolute w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-700" />
                            </div>

                            {/* 🎉 Celebration Title */}
                            <div className="space-y-5">
                                <h2 className="text-3xl sm:text-3xl md:text-4xl font-extrabold leading-tight">
                                    <span className="block text-white bg-clip-text text-transparent animate-gradient drop-shadow-[0_0_30px_rgba(255,165,0,0.5)]">
                                        🎉 WE ARE LIVE 🎉
                                    </span>
                                </h2>

                                <p className="text-xl sm:text-2xl text-white/90 font-medium animate-fadeInUp">
                                    The wait is over.
                                    <span className="block text-white/70 text-lg mt-1">
                                        Welcome to something extraordinary ✨
                                    </span>
                                </p>
                            </div>

                            {/* 🚀 Celebration Card */}
                            <div className="relative bg-gradient-to-br from-emerald-500/25 to-green-600/20 border border-emerald-400/40 rounded-3xl p-8 backdrop-blur-md shadow-2xl animate-float">
                                <div className="absolute -top-4 -right-4 text-4xl animate-spin-slow">🚀</div>

                                <p className="text-lg sm:text-xl text-white/95 leading-relaxed">
                                    <span className="block text-emerald-300 font-bold text-2xl mb-2">
                                        Launch Successful!
                                    </span>
                                    You’re among the first to experience the future.
                                    Buckle up — it’s going to be exciting 🚀
                                </p>
                            </div>

                            {/* 🔥 Action Button */}
                            <button
                                onClick={() => {
                                    setVisible(false);
                                    navigate("/");
                                }}
                                className="
      group relative px-10 py-5
      bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400
      text-black font-extrabold rounded-full text-lg
      shadow-xl shadow-orange-500/30
      hover:scale-110 transition-all duration-300
      animate-bounce-slow
      overflow-hidden
    "
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Enter Platform
                                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                                        →
                                    </span>
                                </span>

                                {/* Button shine */}
                                <span className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
                            </button>
                        </div>

                    )}
                </div>
            </div>

            {/* Additional Animation Elements */}
            {ended && (
                <>
                    {/* Floating Emojis */}
                    {['🎊', '✨', '🚀', '🎇', '⭐', '🔥'].map((emoji, i) => (
                        <div
                            key={i}
                            className="absolute text-4xl animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${i * 0.5}s`,
                                animationDuration: `${Math.random() * 3 + 3}s`
                            }}
                        >
                            {emoji}
                        </div>
                    ))}
                </>
            )}

            {/* Styles */}
            <style>{`
        @keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.animate-shimmer {
  animation: shimmer 2.5s infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}
.animate-gradient {
  background-size: 200% 200%;
  animation: gradient 4s ease infinite;
}

@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(15px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fadeInUp {
  animation: fadeInUp 0.8s ease-out forwards;
}

@keyframes progressGlow {
  0%,100% { filter: brightness(1); }
  50% { filter: brightness(1.25); }
}
.animate-progressGlow {
  animation: progressGlow 2s ease-in-out infinite;
}

      `}</style>
        </div>
    );
};

/* ⏱️ Time Card Component */
const TimeBox = ({ value, label }) => (
    <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-400 rounded-2xl blur opacity-70 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative bg-black/80 backdrop-blur-xl rounded-2xl px-6 py-8 border border-white/10">
            <div className="text-5xl sm:text-6xl font-bold tabular-nums bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {value.toString().padStart(2, '0')}
            </div>
            <div className="mt-3 text-sm uppercase tracking-widest text-white/60">
                {label}
            </div>
        </div>
    </div>
);

export default CountdownTimer;