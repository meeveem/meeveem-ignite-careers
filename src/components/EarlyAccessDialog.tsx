import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import SuccessDialog from "./SuccessDialog";

interface EarlyAccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EarlyAccessDialog = ({ open, onOpenChange }: EarlyAccessDialogProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    onOpenChange(false);
    setShowSuccess(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Join the HealthTech Career Network
            </DialogTitle>
            <p className="text-muted-foreground text-sm pt-1 text-center">
              Be the first to access 1000+ curated UK HealthTech jobs.
            </p>
            <p className="text-primary font-semibold text-sm pt-2 text-center">
              Launching December 2025
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-semibold">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12"
                required
              />
            </div>

            <Button type="submit" variant="gradient" size="lg" className="w-full h-12 text-base">
              Get Early Access
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              No spam. Just opportunities that matter.
            </p>
          </form>
        </DialogContent>
      </Dialog>

      <SuccessDialog open={showSuccess} onOpenChange={setShowSuccess} />
    </>
  );
};

export default EarlyAccessDialog;
