import { useEffect, useState } from "react";

export function useHashRoute(defaultPage) {
	const read = () => window.location.hash.replace("#", "") || defaultPage;
	const [page, setPage] = useState(read);

	useEffect(() => {
		const onHash = () => setPage(read());
		window.addEventListener("hashchange", onHash);
		return () => window.removeEventListener("hashchange", onHash);
	}, [defaultPage]);

	const navigate = (id) => {
		if (window.location.hash === "#" + id) {
			setPage(id);
		} else {
			window.location.hash = id;
		}
	};

	return [page, navigate];
}
