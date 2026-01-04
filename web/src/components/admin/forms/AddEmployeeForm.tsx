import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Checkbox } from "../../../components/ui/checkbox";
import toast, { LoaderIcon } from "react-hot-toast";

import type { GovernmentEntity } from "../../../app/store/admin/governmentEntityStore";
import {
  useEmployeeStore,
  type AddEmployeeData,
} from "../../../app/store/admin/employeeStore";

interface AddEmployeeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  governmentEntities: GovernmentEntity[];
}

const AddEmployeeForm = ({
  open,
  onOpenChange,

  governmentEntities,
}: AddEmployeeFormProps) => {
  // Use Zustand store
  const { addEmployee, isAddingEmployee } = useEmployeeStore();

  const [formData, setFormData] = useState<AddEmployeeData>({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    government_entity_id: 0,
    position: "",
    can_add_notes_on_complaints: 0,
    can_request_more_info_on_complaints: 0,
    can_change_complaints_status: 0,
    can_view_reports: 0,
    can_export_data: 0,
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setFormData({
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
        government_entity_id:
          governmentEntities.length > 0
            ? governmentEntities[0].government_entities_id
            : 0,
        position: "",
        can_add_notes_on_complaints: 0,
        can_request_more_info_on_complaints: 0,
        can_change_complaints_status: 0,
        can_view_reports: 0,
        can_export_data: 0,
      });
    }
  }, [open, governmentEntities]);

  const handleSubmit = async () => {
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.password_confirmation ||
      !formData.government_entity_id ||
      !formData.position
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (formData.password !== formData.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    const success = await addEmployee(formData);

    if (success) {
      // Call the callback to refresh the employee list

      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleCheckboxChange = (
    field: keyof typeof formData,
    checked: boolean
  ) => {
    setFormData({
      ...formData,
      [field]: checked ? 1 : 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto transition-all duration-1000">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Add New Employee
          </DialogTitle>
          <DialogDescription className="sr-only">
            Form to add a new employee with username, email, password,
            department, position and permissions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Username and Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="john_health"
                value={formData.username}
                className="focus:ring-0! focus:border-2! focus:border-emerald-500! focus:shadow-lg!"
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.employee@health.gov"
                value={formData.email}
                className="focus:ring-0! focus:border-2! focus:border-emerald-500! focus:shadow-lg!"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
          </div>

          {/* Password and Confirm Password Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                className="focus:ring-0! focus:border-2! focus:border-emerald-500! focus:shadow-lg!"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <p className="text-xs text-gray-500">
                Password must be at least 6 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Confirm Password</Label>
              <Input
                id="password_confirmation"
                type="password"
                placeholder="Confirm password"
                value={formData.password_confirmation}
                className="focus:ring-0! focus:border-2! focus:border-emerald-500! focus:shadow-lg!"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password_confirmation: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Government Entity and Position Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="government_entity_id">Government Entity</Label>
              <Select
                value={
                  formData.government_entity_id
                    ? formData.government_entity_id.toString()
                    : ""
                }
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    government_entity_id: parseInt(value),
                  })
                }
              >
                <SelectTrigger className="focus:ring-0! focus:border-2! focus:border-emerald-500! focus:shadow-lg!">
                  <SelectValue
                    placeholder={
                      governmentEntities.length === 0
                        ? "No departments available"
                        : "Select government entity"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="focus:ring-0! focus:border-2! focus:border-emerald-500! focus:shadow-lg!">
                  {governmentEntities.map((entity) => (
                    <SelectItem
                      key={entity.government_entities_id}
                      value={entity.government_entities_id.toString()}
                    >
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {governmentEntities.length === 0 && (
                <p className="text-xs text-amber-600">
                  No departments found. Please add departments first.
                </p>
              )}
              {governmentEntities.length > 0 && (
                <p className="text-xs text-gray-500">
                  {governmentEntities.length} department(s) available
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                className="focus:ring-0! focus:border-2! focus:border-emerald-500! focus:shadow-lg!"
                id="position"
                placeholder="Health Inspector"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
              />
            </div>
          </div>

          {/* Permissions Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-base font-semibold">Permissions</Label>
              <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                <span className="text-xs text-gray-500">i</span>
              </div>
            </div>

            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="addNotes"
                  className="text-sm font-normal cursor-pointer"
                >
                  Can add notes on complaints
                </Label>
                <Checkbox
                  id="addNotes"
                  checked={formData.can_add_notes_on_complaints === 1}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(
                      "can_add_notes_on_complaints",
                      checked as boolean
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label
                  htmlFor="requestInfo"
                  className="text-sm font-normal cursor-pointer"
                >
                  Can request more information on complaints
                </Label>
                <Checkbox
                  id="requestInfo"
                  checked={formData.can_request_more_info_on_complaints === 1}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(
                      "can_request_more_info_on_complaints",
                      checked as boolean
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label
                  htmlFor="changeStatus"
                  className="text-sm font-normal cursor-pointer"
                >
                  Can change complaints status
                </Label>
                <Checkbox
                  id="changeStatus"
                  checked={formData.can_change_complaints_status === 1}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(
                      "can_change_complaints_status",
                      checked as boolean
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label
                  htmlFor="viewReports"
                  className="text-sm font-normal cursor-pointer"
                >
                  Can view reports
                </Label>
                <Checkbox
                  id="viewReports"
                  checked={formData.can_view_reports === 1}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("can_view_reports", checked as boolean)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label
                  htmlFor="exportData"
                  className="text-sm font-normal cursor-pointer"
                >
                  Can export data
                </Label>
                <Checkbox
                  id="exportData"
                  checked={formData.can_export_data === 1}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("can_export_data", checked as boolean)
                  }
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={isAddingEmployee || governmentEntities.length === 0}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isAddingEmployee ? (
                <>
                  <LoaderIcon className="w-5 h-5 animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                "Add Employee"
              )}
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeForm;
