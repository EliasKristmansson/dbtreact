// CrazyButton.jsx
import React, { useRef } from "react";
import { motion } from "framer-motion";
import "./CrazyButton.css";

export default function CrazyButton({ onClick }) {
	const buttonRef = useRef(null);

	const handleMouseMove = (e) => {
		const rect = buttonRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		buttonRef.current.style.setProperty('--x', `${x}px`);
		buttonRef.current.style.setProperty('--y', `${y}px`);
	};

	return (
		<motion.button
			ref={buttonRef}
			onClick={onClick}
			onMouseMove={handleMouseMove}
			className="crazy-button"
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
		>
			+ Nytt projekt
		</motion.button>
	);
}
