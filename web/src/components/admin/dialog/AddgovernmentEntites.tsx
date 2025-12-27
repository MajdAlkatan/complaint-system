import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {  Plus } from "lucide-react";
import { useState } from "react";
import { Textarea } from "../../ui/textarea";
import { addGovernmentEntity } from "../../../lib/adminAction";

interface AddGovernmentEntitiesProps {
  name?: string;
  contact_email?: string;
  description?: string;
  contact_phone?: string;
  onEntityAdded?: () => void;
  open: boolean; // Add this prop
  onOpenChange: (open: boolean) => void; // Add this prop
}

function AddGovernmentEntities({
  name = "",
  contact_email = "",
  description = "",
  contact_phone = "",
  onEntityAdded,
  open,
  onOpenChange
}: AddGovernmentEntitiesProps) {
  const [formData, setFormData] = useState({
    name: name,
    contact_email: contact_email,
    description: description,
    contact_phone: contact_phone
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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

      // Call the actual API function
      await addGovernmentEntity({
        name: formData.name,
        contact_email: formData.contact_email,
        description: formData.description,
        contact_phone: formData.contact_phone
      });
      
      // Reset form
      setFormData({
        name: "",
        contact_email: "",
        description: "",
        contact_phone: ""
      });
      
      // Call the callback if provided
      if (onEntityAdded) {
        onEntityAdded();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add department");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form and close dialog
    setFormData({
      name: "",
      contact_email: "",
      description: "",
      contact_phone: ""
    });
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Department</DialogTitle>
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="gap-2"
            >
              {loading ? (
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