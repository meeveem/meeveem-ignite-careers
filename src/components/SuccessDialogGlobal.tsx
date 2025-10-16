import { useEffect, useState } from "react";
import SuccessDialog from "./SuccessDialog";

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
        setTimeout(() => window.dispatchEvent(new Event("successdialog")), 300);
      }
    }

    return () => window.removeEventListener("successdialog", handler as EventListener);
  }, []);

  return <SuccessDialog open={open} onOpenChange={setOpen} />;
};

export default SuccessDialogGlobal;
