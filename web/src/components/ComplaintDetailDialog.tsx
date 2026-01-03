import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Calendar,
  MapPin,
  User,
  Shield,
  FileText,
  MessageSquare,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { format } from "date-fns";
import { useComplaintStore } from "../app/store/complaint.store";

const ComplaintDetailDialog = () => {
  const {
    selectedComplaint,
    isDialogOpen,
    setIsDialogOpen,
    getStatusColor,
    getStatusBadge,
    updateComplaint,
  } = useComplaintStore();

  if (!selectedComplaint) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not completed";
    try {
      return format(new Date(dateString), "MMM d, yyyy HH:mm");
    } catch {
      return "Invalid date";
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    await updateComplaint(selectedComplaint.complaints_id, {
      status: newStatus,
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Complaint Details
          </DialogTitle>
          <DialogDescription>
            Reference: {selectedComplaint.reference_number}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Badge
                  className={`${getStatusColor(
                    selectedComplaint.status
                  )} text-sm font-medium`}
                >
                  {getStatusBadge(selectedComplaint.status)}
                </Badge>
                {selectedComplaint.locked && (
                  <Badge className="bg-amber-100 text-amber-800 text-sm font-medium">
                    <Clock className="w-3 h-3 mr-1" />
                    Locked
                  </Badge>
                )}
              </div>
              <div className="text-sm text-gray-500">
                ID: #{selectedComplaint.complaints_id}
              </div>
            </div>

            {/* Status Actions */}
            <div className="flex flex-wrap gap-2 mt-3">
              <Button
                size="sm"
                variant={
                  selectedComplaint.status === "pending" ? "default" : "outline"
                }
                onClick={() => handleStatusChange("pending")}
              >
                Mark as Pending
              </Button>
              <Button
                size="sm"
                variant={
                  selectedComplaint.status === "in_progress"
                    ? "default"
                    : "outline"
                }
                onClick={() => handleStatusChange("in_progress")}
              >
                Mark In Progress
              </Button>
              <Button
                size="sm"
                variant={
                  selectedComplaint.status === "resolved"
                    ? "default"
                    : "outline"
                }
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleStatusChange("resolved")}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Resolve
              </Button>
              <Button
                size="sm"
                variant={
                  selectedComplaint.status === "rejected"
                    ? "default"
                    : "outline"
                }
                className="bg-red-600 hover:bg-red-700"
                onClick={() => handleStatusChange("rejected")}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">
                  {formatDate(selectedComplaint.created_at)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Completed:</span>
                <span className="font-medium">
                  {formatDate(selectedComplaint.completed_at)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Citizen ID:</span>
                <span className="font-medium">
                  {selectedComplaint.citizen_id}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Location:</span>
                <span className="font-medium">
                  {selectedComplaint.location}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Entity ID:</span>
                <span className="font-medium">
                  {selectedComplaint.entity_id}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">
                  Type {selectedComplaint.complaint_type}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              <h3 className="font-medium text-gray-900">Description</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-700 whitespace-pre-line">
                {selectedComplaint.description}
              </p>
            </div>
          </div>

          {/* Notes Section */}
          {selectedComplaint.notes && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <h3 className="font-medium text-gray-900">Notes</h3>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <p className="text-amber-800 whitespace-pre-line">
                  {selectedComplaint.notes}
                </p>
              </div>
            </div>
          )}

          {/* Lock Information */}
          {selectedComplaint.locked && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-400" />
                <h3 className="font-medium text-gray-900">Lock Information</h3>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="text-sm text-red-800">
                  <p>
                    Locked by Employee ID:{" "}
                    {selectedComplaint.locked_by_employee_id || "Unknown"}
                  </p>
                  <p>Locked at: {formatDate(selectedComplaint.locked_at)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComplaintDetailDialog;
