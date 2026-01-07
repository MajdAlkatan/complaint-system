import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { useCitizenStore } from "../../app/store/citizenStore";
import { Edit, User, Mail, Phone, MapPin, Calendar } from "lucide-react";

interface EditCitizenDialogProps {
  citizen: any;
}

const EditCitizenDialog = ({ citizen }: EditCitizenDialogProps) => {
  const { isEditing, setIsEditing, updateCitizen, loading } = useCitizenStore();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    gender: "",
    address: "",
    city: "",
    account_status: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (citizen && isEditing) {
      setFormData({
        full_name: citizen.full_name || "",
        email: citizen.email || "",
        phone_number: citizen.phone_number || "",
        date_of_birth: citizen.date_of_birth
          ? citizen.date_of_birth.split("T")[0]
          : "",
        gender: citizen.gender || "",
        address: citizen.address || "",
        city: citizen.city || "",
        account_status: citizen.account_status || "",
      });
      setErrors({});
    }
  }, [citizen, isEditing]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Phone number is required";
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = "Date of birth is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !citizen) return;

    const success = await updateCitizen(citizen.citizen_id, formData);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user selects an option
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <Dialog open={isEditing} onOpenChange={setIsEditing}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Edit className="w-5 h-5 text-blue-600" />
            Edit Citizen Profile
          </DialogTitle>
          <DialogDescription>
            Update information for {citizen?.full_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">
                  <User className="inline w-4 h-4 mr-2 text-gray-400" />
                  Full Name *
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className={errors.full_name ? "border-red-300" : ""}
                  disabled={loading}
                />
                {errors.full_name && (
                  <p className="text-red-500 text-xs">{errors.full_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="inline w-4 h-4 mr-2 text-gray-400" />
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className={errors.email ? "border-red-300" : ""}
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone_number">
                  <Phone className="inline w-4 h-4 mr-2 text-gray-400" />
                  Phone Number *
                </Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className={errors.phone_number ? "border-red-300" : ""}
                  disabled={loading}
                />
                {errors.phone_number && (
                  <p className="text-red-500 text-xs">{errors.phone_number}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_of_birth">
                  <Calendar className="inline w-4 h-4 mr-2 text-gray-400" />
                  Date of Birth *
                </Label>
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  className={errors.date_of_birth ? "border-red-300" : ""}
                  disabled={loading}
                />
                {errors.date_of_birth && (
                  <p className="text-red-500 text-xs">{errors.date_of_birth}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">
                  <MapPin className="inline w-4 h-4 mr-2 text-gray-400" />
                  Address *
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter full address"
                  rows={2}
                  className={errors.address ? "border-red-300" : ""}
                  disabled={loading}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs">{errors.address}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">
                  <MapPin className="inline w-4 h-4 mr-2 text-gray-400" />
                  City *
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                  className={errors.city ? "border-red-300" : ""}
                  disabled={loading}
                />
                {errors.city && (
                  <p className="text-red-500 text-xs">{errors.city}</p>
                )}
              </div>
            </div>
          </div>

          {/* Selection Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleSelectChange("gender", value)}
                disabled={loading}
              >
                <SelectTrigger
                  className={errors.gender ? "border-red-300" : ""}
                >
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-red-500 text-xs">{errors.gender}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="account_status">Account Status</Label>
              <Select
                value={formData.account_status}
                onValueChange={(value) =>
                  handleSelectChange("account_status", value)
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 gap-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditCitizenDialog;
