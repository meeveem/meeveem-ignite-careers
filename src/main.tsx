import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { injectSpeedInsights } from "@vercel/speed-insights";
import { inject as injectAnalytics } from "@vercel/analytics";

// Collect performance metrics for Vercel Speed Insights (no-op locally)
injectSpeedInsights();
// Enable Vercel Analytics (records pageviews and basic events in production)
injectAnalytics();

createRoot(document.getElementById("root")!).render(<App />);
