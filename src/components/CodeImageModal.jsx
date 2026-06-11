import { useEffect } from "react";

export default function CodeImageModal({ open, src, label, onClose }) {
	useEffect(() => {
		if (!open) return;
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", onKey);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = "";
		};
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div
			className="code-modal"
			onClick={(e) => e.target === e.currentTarget && onClose()}
		>
			<div className="code-modal__panel">
				<div className="code-modal__bar">
					<span className="code-modal__label">{label || "코드"}</span>
					<button
						className="code-modal__close"
						aria-label="닫기"
						onClick={onClose}
					>
						✕
					</button>
				</div>
				<div className="code-modal__body">
					<img
						className="code-modal__img"
						src={src || ""}
						alt={(label || "코드") + " 캡처"}
					/>
					<div className="code-modal__hint">
						실제 IDE 코드 캡처가 들어갈 자리입니다.
					</div>
				</div>
			</div>
		</div>
	);
}
