import { useEffect, useState } from "react";
import SuccessOverlay from "./SuccessOverlay";

const SuccessDialogGlobal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => {
      setOpen(false);
      requestAnimationFrame(() => setOpen(true));
    };
    window.addEventListener("successdialog", handler as EventListener);

    // Dev QA hook: open via hash or query (?test=success)
    if (import.meta.env.DEV) {
      const shouldTest = window.location.hash === "#test-success" ||
        new URLSearchParams(window.location.search).get("test") === "success";
      if (shouldTest) {
        setTimeout(() => setOpen(true), 200);
      }
    }

    return () => window.removeEventListener("successdialog", handler as EventListener);
  }, []);

  return <SuccessOverlay open={open} onOpenChange={setOpen} />;
};

export default SuccessDialogGlobal;
