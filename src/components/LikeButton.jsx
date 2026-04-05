import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";

function StarIcon({ filled, scale = 1 }) {
	return (
		<svg
			viewBox="0 0 24 24"
			width="56"
			height="56"
			style={{
				display: "block",
				transform: `scale(${scale})`,
				transformOrigin: "center",
				transition: "transform 0.22s ease-out",
			}}
		>
			<path
				d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
				fill={filled ? "rgba(212,175,55,0.95)" : "none"}
				stroke={filled ? "rgba(212,175,55,0.95)" : "currentColor"}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export default function LikeButton({ repo = "YetonDew/portfolio" }) {
	const [count, setCount] = useState(null);
	const [popping, setPopping] = useState(false);
	const [isDark, setIsDark] = useState(false);
	const [starHovered, setStarHovered] = useState(false);
	const [starFilled, setStarFilled] = useState(false);
	const buttonRef = useRef(null);
	const repoUrl = `https://github.com/${repo}`;
	const starUrl = `${repoUrl}/stargazers`;
	const starredKey = `portfolio_starred_${repo}`;

	const fetchStars = async () => {
		try {
			const res = await fetch(`https://api.github.com/repos/${repo}`);
			if (!res.ok) {
				throw new Error("Failed to fetch GitHub stars");
			}
			const data = await res.json();
			setCount(typeof data.stargazers_count === "number" ? data.stargazers_count : 0);
		} catch {
			setCount(0);
		}
	};

	useEffect(() => {
		// Dark mode observer
		const update = () => setIsDark(document.documentElement.classList.contains("dark"));
		update();
		const obs = new MutationObserver(update);
		obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

		// Restore the local visual state after a previous click.
		try {
			setStarFilled(localStorage.getItem(starredKey) === "1");
		} catch {
			setStarFilled(false);
		}

		// Fetch stars from GitHub repo
		fetchStars();

		// Re-fetch when the tab regains focus after starring on GitHub.
		const onFocus = () => fetchStars();
		const onVisibility = () => {
			if (document.visibilityState === "visible") fetchStars();
		};
		window.addEventListener("focus", onFocus);
		document.addEventListener("visibilitychange", onVisibility);

		return () => {
			obs.disconnect();
			window.removeEventListener("focus", onFocus);
			document.removeEventListener("visibilitychange", onVisibility);
		};
	}, [repo]);

	const handleLike = () => {
		setStarFilled(true);
		try {
			localStorage.setItem(starredKey, "1");
		} catch {
			// ignore storage failures
		}
		setPopping(true);
		setTimeout(() => setPopping(false), 500);

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

		// Re-sync with real count after navigation has had time to happen.
		setTimeout(() => {
			fetchStars();
		}, 2500);
	};

	const text = isDark ? "#e4e4e7" : "#27272a";
	const sub = isDark ? "#71717a" : "#a1a1aa";
	const border = isDark ? "rgba(212,175,55,0.95)" : "rgba(212,175,55,0.95)";

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
			{/* Star button */}
			<a
				ref={buttonRef}
				href={starUrl}
				target="_blank"
				rel="noreferrer"
				onClick={handleLike}
				aria-label="Star this repository on GitHub"
				style={{
					minWidth: 82,
					height: 66,
					padding: "0 20px",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					cursor: "pointer",
					textDecoration: "none",
					transform: popping ? "scale(1.25)" : "scale(1)",
					transition: "transform 0.3s cubic-bezier(.34,1.56,.64,1), border-color 0.3s ease",
					color: border,
					background: isDark ? "transparent" : "transparent",
					boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.08)" : "none",
				}}
				onMouseEnter={e => {
					setStarHovered(true);
				}}
				onMouseLeave={e => {
					setStarHovered(false);
				}}
			>
				<StarIcon filled={starFilled} scale={starHovered ? 1.18 : 1} />
			</a>

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
					star this repo
				</span>
				<a
					href={repoUrl}
					target="_blank"
					rel="noreferrer"
					style={{ fontSize: 11, color: sub, opacity: 0.9, textDecoration: "none" }}
				>
					{repo}
				</a>
			</div>
		</div>
	);
}
