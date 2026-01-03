// import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
// import { Button } from "../../ui/button";
// import { Badge } from "../../ui/badge";
// import {
//   Building,
//   Mail,
//   Phone,
//   Calendar,
//   Users,
//   FileText,
//   MoreVertical,
//   Globe,
//   Briefcase,
//   Edit,
//   Trash,
// } from "lucide-react";
// import { useState } from "react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../../../components/ui/dropdown-menu";
// import { format } from "date-fns";
// import { useGovernmentEntityStore } from "../../../app/store/admin/governmentEntityStore";
// import { toast } from "react-hot-toast";

// const DepartmentCard = ({
//   id,
//   name,
//   description,
//   contact_email,
//   created_at,
//   contact_phone,
// }: {
//   id: number;
//   contact_phone: string;
//   created_at: string;
//   name: string;
//   description: string;
//   contact_email: string;
// }) => {
//   const { deleteGovernmentEntity } = useGovernmentEntityStore();
//   const [isDeleting, setIsDeleting] = useState(false);

//   const formatDate = (dateString: string) => {
//     try {
//       return format(new Date(dateString), "MMM d, yyyy");
//     } catch {
//       return "Invalid date";
//     }
//   };

//   const handleDelete = async () => {
//     if (
//       !window.confirm(
//         `Are you sure you want to delete "${name}" department? This action cannot be undone.`
//       )
//     ) {
//       return;
//     }

//     setIsDeleting(true);
//     try {
//       const success = await deleteGovernmentEntity(id);
//       if (success) {
//         toast.success(`Department "${name}" deleted successfully`);
//       }
//     } catch (error) {
//       toast.error("Failed to delete department");
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   return (
//     <Card className="group relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:border-emerald-100 overflow-hidden">
//       {/* Accent Bar */}
//       <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-400 to-emerald-600" />

//       <CardHeader className="pb-3 pt-5 px-6">
//         <div className="flex justify-between items-start">
//           <div className="flex-1 min-w-0">
//             <div className="flex items-center gap-3 mb-2">
//               <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
//                 <Building className="w-5 h-5 text-emerald-600" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <CardTitle className="text-lg font-semibold text-gray-900 truncate">
//                   {name}
//                 </CardTitle>
//                 <div className="flex items-center gap-2 mt-1">
//                   <Badge
//                     variant="outline"
//                     className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-medium"
//                   >
//                     <Globe className="w-3 h-3 mr-1" />
//                     Department
//                   </Badge>
//                   <span className="text-xs text-gray-500 flex items-center">
//                     <Calendar className="w-3 h-3 mr-1" />
//                     Created {formatDate(created_at)}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Action Menu */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-8 w-8 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
//               >
//                 <MoreVertical className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-48">
//               <DropdownMenuItem className="cursor-pointer">
//                 <FileText className="w-4 h-4 mr-2" />
//                 View Details
//               </DropdownMenuItem>
//               <DropdownMenuItem className="cursor-pointer">
//                 <Users className="w-4 h-4 mr-2" />
//                 View Employees
//               </DropdownMenuItem>
//               <DropdownMenuItem className="cursor-pointer">
//                 <Briefcase className="w-4 h-4 mr-2" />
//                 View Complaints
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem className="cursor-pointer text-amber-600">
//                 <Edit className="w-4 h-4 mr-2" />
//                 Edit Department
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem
//                 className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
//                 onClick={handleDelete}
//                 disabled={isDeleting}
//               >
//                 <Trash className="w-4 h-4 mr-2" />
//                 {isDeleting ? "Deleting..." : "Delete Department"}
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </CardHeader>

//       <CardContent className="px-6 pb-5">
//         {/* Description */}
//         <div className="mb-5">
//           <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
//         </div>

//         {/* Contact Information */}
//         <div className="space-y-3">
//           <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
//             <div className="p-2 bg-white rounded-md border border-gray-200">
//               <Mail className="w-4 h-4 text-gray-600" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-xs text-gray-500 font-medium mb-1">
//                 Contact Email
//               </p>
//               <a
//                 href={`mailto:${contact_email}`}
//                 className="text-sm font-medium text-gray-900 hover:text-emerald-600 truncate block"
//                 title={contact_email}
//               >
//                 {contact_email}
//               </a>
//             </div>
//           </div>

//           <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
//             <div className="p-2 bg-white rounded-md border border-gray-200">
//               <Phone className="w-4 h-4 text-gray-600" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-xs text-gray-500 font-medium mb-1">
//                 Contact Phone
//               </p>
//               <a
//                 href={`tel:${contact_phone}`}
//                 className="text-sm font-medium text-gray-900 hover:text-emerald-600"
//               >
//                 {contact_phone}
//               </a>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default DepartmentCard;

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  Building,
  Mail,
  Phone,
  Calendar,
  Users,
  FileText,
  MoreVertical,
  Globe,
  Briefcase,
  Edit,
  Trash,
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { format } from "date-fns";
import { useGovernmentEntityStore } from "../../../app/store/admin/governmentEntityStore";
import { toast } from "react-hot-toast";

// Edit Dialog Component
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";

const DepartmentCard = ({
  id,
  name,
  description,
  contact_email,
  created_at,
  contact_phone,
}: {
  id: number;
  contact_phone: string;
  created_at: string;
  name: string;
  description: string;
  contact_email: string;
}) => {
  const { deleteGovernmentEntity, updateGovernmentEntity } =
    useGovernmentEntityStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name,
    description,
    contact_email,
    contact_phone,
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return "Invalid date";
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${name}" department? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const success = await deleteGovernmentEntity(id);
      if (success) {
        toast.success(`Department "${name}" deleted successfully`);
      }
    } catch (error) {
      toast.error("Failed to delete department");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    // Reset form data to current values
    setEditFormData({
      name,
      description,
      contact_email,
      contact_phone,
    });
  };

  const handleUpdate = async () => {
    // Validate form data
    if (!editFormData.name.trim()) {
      toast.error("Department name is required");
      return;
    }
    if (!editFormData.contact_email.trim()) {
      toast.error("Contact email is required");
      return;
    }
    if (!editFormData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!editFormData.contact_phone.trim()) {
      toast.error("Contact phone is required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editFormData.contact_email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSaving(true);
    try {
      const success = await updateGovernmentEntity(id, editFormData);
      if (success) {
        toast.success(`Department "${editFormData.name}" updated successfully`);
        setIsEditing(false);
      }
    } catch (error) {
      toast.error("Failed to update department");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <Card className="group relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:border-emerald-100 overflow-hidden">
        {/* Accent Bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-400 to-emerald-600" />

        <CardHeader className="pb-3 pt-5 px-6">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                  <Building className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                    {name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-medium"
                    >
                      <Globe className="w-3 h-3 mr-1" />
                      Department
                    </Badge>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      Created {formatDate(created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="cursor-pointer">
                  <FileText className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Users className="w-4 h-4 mr-2" />
                  View Employees
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Briefcase className="w-4 h-4 mr-2" />
                  View Complaints
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-amber-600"
                  onClick={handleEdit}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Department
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <Trash className="w-4 h-4 mr-2" />
                  {isDeleting ? "Deleting..." : "Delete Department"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-5">
          {/* Description */}
          <div className="mb-5">
            <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="p-2 bg-white rounded-md border border-gray-200">
                <Mail className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium mb-1">
                  Contact Email
                </p>
                <a
                  href={`mailto:${contact_email}`}
                  className="text-sm font-medium text-gray-900 hover:text-emerald-600 truncate block"
                  title={contact_email}
                >
                  {contact_email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="p-2 bg-white rounded-md border border-gray-200">
                <Phone className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium mb-1">
                  Contact Phone
                </p>
                <a
                  href={`tel:${contact_phone}`}
                  className="text-sm font-medium text-gray-900 hover:text-emerald-600"
                >
                  {contact_phone}
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Edit Department
            </DialogTitle>
            <DialogDescription>
              Update the department information below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Department Name *</Label>
              <Input
                id="edit-name"
                name="name"
                value={editFormData.name}
                onChange={handleInputChange}
                placeholder="Enter department name"
                required
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-contact_email">Contact Email *</Label>
              <Input
                id="edit-contact_email"
                name="contact_email"
                type="email"
                value={editFormData.contact_email}
                onChange={handleInputChange}
                placeholder="Enter contact email"
                required
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-contact_phone">Contact Phone *</Label>
              <Input
                id="edit-contact_phone"
                name="contact_phone"
                type="tel"
                value={editFormData.contact_phone}
                onChange={handleInputChange}
                placeholder="Enter contact phone number"
                required
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={editFormData.description}
                onChange={handleInputChange}
                placeholder="Enter department description"
                rows={4}
                required
                disabled={isSaving}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleUpdate}
                disabled={isSaving}
                className="gap-2 bg-amber-600 hover:bg-amber-700"
              >
                {isSaving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4" />
                    Update Department
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DepartmentCard;
