import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
const COOKIE_KEY = "portfolio_liked";

function HeartIcon({ filled }) {
	return (
		<svg
			viewBox="0 0 24 24"
			width="38"
			height="38"
			style={{ display: "block", transition: "transform 0.3s cubic-bezier(.34,1.56,.64,1)" }}
		>
			<path
				d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
				fill={filled ? "#f43f5e" : "none"}
				stroke={filled ? "#f43f5e" : "currentColor"}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export default function LikeButton() {
	const [count, setCount] = useState(null);
	const [liked, setLiked] = useState(false);
	const [popping, setPopping] = useState(false);
	const [showThanks, setShowThanks] = useState(false);
	const [isDark, setIsDark] = useState(false);
	const buttonRef = useRef(null);

	useEffect(() => {
		// Dark mode observer
		const update = () => setIsDark(document.documentElement.classList.contains("dark"));
		update();
		const obs = new MutationObserver(update);
		obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

		// Fetch count from API
		fetch("/api/likes")
			.then(r => r.json())
			.then(d => setCount(d.count))
			.catch(() => setCount(0));

		// Check cookie on client for immediate UI state
		setLiked(document.cookie.includes("portfolio_liked=1"));

		return () => obs.disconnect();
	}, []);

	const handleLike = async () => {
		if (liked) {
			// Unlike — optimistic
			setLiked(false);
			setCount(c => Math.max(0, (c ?? 1) - 1));
			try {
				const res = await fetch("/api/likes", { method: "DELETE" });
				const data = await res.json();
				setCount(data.count);
			} catch { /* keep optimistic */ }
			return;
		}

		// Like — optimistic update
		setLiked(true);
		setCount(c => (c ?? 0) + 1);
		setPopping(true);
		setShowThanks(true);
		setTimeout(() => setPopping(false), 500);
		setTimeout(() => setShowThanks(false), 2000);

		// Confetti burst from the button position
		if (buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect();
			const x = (rect.left + rect.width / 2) / window.innerWidth;
			const y = (rect.top + rect.height / 2) / window.innerHeight;
			confetti({
				particleCount: 80,
				spread: 70,
				origin: { x, y },
				colors: ["#f43f5e", "#fb7185", "#fda4af", "#fff", "#fbbf24"],
				startVelocity: 30,
				gravity: 0.8,
				scalar: 0.9,
			});
		}

		try {
			const res = await fetch("/api/likes", { method: "POST" });
			const data = await res.json();
			setCount(data.count);
		} catch {
			// keep optimistic count
		}
	};

	const text = isDark ? "#e4e4e7" : "#27272a";
	const sub = isDark ? "#71717a" : "#a1a1aa";
	const bg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
	const bgHover = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.07)";
	const border = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)";

	return (
		<div style={{
			width: "100%",
			height: "100%",
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			gap: 16,
			padding: 24,
			boxSizing: "border-box",
			position: "relative",
		}}>
			{/* Floating "Thanks!" */}
			<span style={{
				position: "absolute",
				top: "28%",
				fontSize: 13,
				fontWeight: 600,
				color: "#f43f5e",
				opacity: showThanks ? 1 : 0,
				transform: showThanks ? "translateY(-8px)" : "translateY(0px)",
				transition: "opacity 0.4s ease, transform 0.4s ease",
				pointerEvents: "none",
			}}>
				Thanks! 🎉
			</span>

			{/* Heart button */}
			<button
				ref={buttonRef}
				onClick={handleLike}
				aria-label={liked ? "Already liked" : "Like this portfolio"}
				style={{
					background: liked
						? "rgba(244,63,94,0.12)"
						: bg,
					border: `1px solid ${liked ? "rgba(244,63,94,0.25)" : border}`,
					borderRadius: "50%",
					width: 72,
					height: 72,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					cursor: "pointer",
					transform: popping ? "scale(1.25)" : "scale(1)",
					transition: "transform 0.3s cubic-bezier(.34,1.56,.64,1), background 0.3s ease, border-color 0.3s ease",
					color: liked ? "#f43f5e" : sub,
				}}
				onMouseEnter={e => {
					if (!liked) e.currentTarget.style.background = bgHover;
				}}
				onMouseLeave={e => {
					if (!liked) e.currentTarget.style.background = bg;
				}}
			>
				<HeartIcon filled={liked} />
			</button>

			{/* Count */}
			<div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
				<span style={{
					fontSize: 26,
					fontWeight: 700,
					color: text,
					lineHeight: 1,
					transition: "color 0.3s",
					fontVariantNumeric: "tabular-nums",
				}}>
					{count === null ? "—" : count}
				</span>
				<span style={{ fontSize: 12, color: sub, fontWeight: 500 }}>
					{liked ? "click to unlike" : "like this portfolio"}
				</span>
			</div>
		</div>
	);
}
