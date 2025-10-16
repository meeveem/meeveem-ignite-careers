import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
// Removed local SuccessDialog; using global event-based success dialog
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EarlyAccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EarlyAccessDialog = ({ open, onOpenChange }: EarlyAccessDialogProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate input
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast({
          title: "Invalid email",
          description: "Please enter a valid email address",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (formData.firstName.length > 100 || formData.lastName.length > 100) {
        toast({
          title: "Invalid input",
          description: "Names must be less than 100 characters",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Call the edge function
      const { data, error } = await supabase.functions.invoke('add-brevo-contact', {
        body: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          listIds: [3],
        },
      });

      if (error && !data?.success) {
        console.error("Error adding contact:", error);
        toast({
          title: "Something went wrong",
          description: "Failed to sign up. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Check if successful (either from data.success or no error)
      if (data?.success || !error) {
        console.log("Contact added successfully:", data);
        
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
        });
        
        onOpenChange(false);
        setTimeout(() => window.dispatchEvent(new Event('successdialog')), 200);
      } else {
        // Fallback error handling
        toast({
          title: "Something went wrong",
          description: "Failed to sign up. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Join the HealthTech Career Network
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm pt-1 text-center">
              Be the first to access 1000+ curated UK HealthTech jobs.
            </DialogDescription>
            <p className="text-primary font-semibold text-sm pt-2 text-center">
              Launching December 2025
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="firstName" className="text-sm font-semibold">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="h-12"
                  required
                />
              </div>

              <div className="flex-1 space-y-2">
                <Label htmlFor="lastName" className="text-sm font-semibold">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="h-12"
                  required
                />
              </div>
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

            <Button 
              type="submit" 
              variant="gradient" 
              size="lg" 
              className="w-full h-12 text-base"
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Get Early Access"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              No spam. Just opportunities that matter.
            </p>
          </form>
        </DialogContent>
      </Dialog>
      </>
  );
};

export default EarlyAccessDialog;
