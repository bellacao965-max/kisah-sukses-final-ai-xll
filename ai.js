window.KSPai = {
  askAI: async function(prompt, opts = {}) {
    try {
      const controller = new AbortController();
      const timeout = opts.timeout || 20000;
      const timer = setTimeout(() => controller.abort(), timeout);

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
        signal: controller.signal
      });

      clearTimeout(timer);

      if (!res.ok) {
        const txt = await res.text().catch(()=>'');
        throw new Error(`Server ${res.status}: ${txt}`);
      }

      const data = await res.json();
      return data.reply || "No reply";
    } catch (err) {
      console.error("KSPai error:", err);
      if (err.name === 'AbortError') return "⏳ Timeout: AI server terlalu lama merespons.";
      return "⚠️ Could not reach AI server.";
    }
  }
};
