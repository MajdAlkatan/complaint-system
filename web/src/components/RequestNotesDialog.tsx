import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { AlertCircle } from "lucide-react";
import { useComplaintStore } from "../app/store/complaint.store";

interface RequestNotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaint: any;
}

const RequestNotesDialog = ({
  open,
  onOpenChange,
  complaint,
}: RequestNotesDialogProps) => {
  const { requestNotes } = useComplaintStore();
  const [message, setMessage] = useState("You should add some notes");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!complaint) return;

    setIsSubmitting(true);
    try {
      const success = await requestNotes(complaint.complaints_id, message);
      if (success) {
        onOpenChange(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            Request More Information
          </DialogTitle>
          <DialogDescription>
            Request additional information for complaint #
            {complaint?.reference_number?.substring(0, 8)}...
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Request Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your request message..."
              rows={6}
              disabled={isSubmitting}
              className="resize-none"
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                This will notify the relevant parties that additional
                information is required for this complaint.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Send Request
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestNotesDialog;
