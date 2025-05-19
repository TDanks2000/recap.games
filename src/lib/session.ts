export function getSessionId() {
	let sessionId = localStorage.getItem("session_id");
	if (!sessionId) {
		sessionId = crypto.randomUUID();
		localStorage.setItem("session_id", sessionId);
	}
	return sessionId;
}
