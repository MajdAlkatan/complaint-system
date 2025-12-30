import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useGovernmentEntityStore,
  type AddGovernmentEntityData,
} from "../../../app/store/admin/governmentEntityStore";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";

interface AddGovernmentEntitiesProps {
  name?: string;
  contact_email?: string;
  description?: string;
  contact_phone?: string;
  onEntityAdded?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function AddGovernmentEntities({
  name = "",
  contact_email = "",
  description = "",
  contact_phone = "",
  onEntityAdded,
  open,
  onOpenChange,
}: AddGovernmentEntitiesProps) {
  // Use Zustand store
  const { addGovernmentEntity, isAddingEntity } = useGovernmentEntityStore();

  const [formData, setFormData] = useState<AddGovernmentEntityData>({
    name: name,
    contact_email: contact_email,
    description: description,
    contact_phone: contact_phone,
  });
  const [error, setError] = useState<string | null>(null);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setFormData({
        name: "",
        contact_email: "",
        description: "",
        contact_phone: "",
      });
      setError(null);
    } else {
      // If editing, use the provided values
      setFormData({
        name: name,
        contact_email: contact_email,
        description: description,
        contact_phone: contact_phone,
      });
    }
  }, [open, name, contact_email, description, contact_phone]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error("Department name is required");
      }
      if (!formData.contact_email.trim()) {
        throw new Error("Contact email is required");
      }
      if (!formData.description.trim()) {
        throw new Error("Description is required");
      }
      if (!formData.contact_phone.trim()) {
        throw new Error("Contact phone is required");
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.contact_email)) {
        throw new Error("Please enter a valid email address");
      }

      // Call the store action
      const success = await addGovernmentEntity(formData);

      if (success) {
        // Reset form
        setFormData({
          name: "",
          contact_email: "",
          description: "",
          contact_phone: "",
        });

        // Call the callback if provided
        if (onEntityAdded) {
          onEntityAdded();
        }

        // Close the dialog
        onOpenChange(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add department");
    }
  };

  const handleCancel = () => {
    // Reset form and close dialog
    setFormData({
      name: "",
      contact_email: "",
      description: "",
      contact_phone: "",
    });
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add New Department
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Department Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter department name"
              required
              disabled={isAddingEntity}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_email">Contact Email *</Label>
            <Input
              id="contact_email"
              name="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={handleChange}
              placeholder="Enter contact email"
              required
              disabled={isAddingEntity}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_phone">Contact Phone *</Label>
            <Input
              id="contact_phone"
              name="contact_phone"
              type="tel"
              value={formData.contact_phone}
              onChange={handleChange}
              placeholder="Enter contact phone number"
              required
              disabled={isAddingEntity}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter department description"
              rows={4}
              required
              disabled={isAddingEntity}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isAddingEntity}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isAddingEntity} className="gap-2">
              {isAddingEntity ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Department
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddGovernmentEntities;
