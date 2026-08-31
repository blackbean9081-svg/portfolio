import { useEffect, useRef } from "react";
import hljs from "highlight.js/lib/core";
import java from "highlight.js/lib/languages/java";
import python from "highlight.js/lib/languages/python";

hljs.registerLanguage("java", java);
hljs.registerLanguage("python", python);

export default function CodeBlock({ code, lang = "java" }) {
	const ref = useRef(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		// 재하이라이트 경고 방지용 초기화 후 적용
		delete el.dataset.highlighted;
		el.textContent = code;
		hljs.highlightElement(el);
	}, [code, lang]);

	return (
		<pre className="func__code">
			<code className={`language-${lang}`} ref={ref}>
				{code}
			</code>
		</pre>
	);
}
