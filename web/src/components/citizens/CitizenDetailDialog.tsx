import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  FileText,
  Building,
  Globe,
  Award,
  Clock,
} from "lucide-react";
import { useCitizenStore } from "../../app/store/citizenStore";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Separator } from "../../components/ui/separator";

const CitizenDetailDialog = () => {
  const {
    selectedCitizen,
    isDialogOpen,
    setIsDialogOpen,
    getStatusColor,
    getStatusText,
    getGenderText,
    formatDate,
    suspendCitizen,
    activateCitizen,
  } = useCitizenStore();

  if (!selectedCitizen) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSuspend = async () => {
    if (
      !window.confirm(
        `Are you sure you want to suspend ${selectedCitizen.full_name}'s account?`
      )
    ) {
      return;
    }

    const success = await suspendCitizen(selectedCitizen.citizen_id);
    if (success) {
      setIsDialogOpen(false);
    }
  };

  const handleActivate = async () => {
    if (
      !window.confirm(
        `Are you sure you want to activate ${selectedCitizen.full_name}'s account?`
      )
    ) {
      return;
    }

    const success = await activateCitizen(selectedCitizen.citizen_id);
    if (success) {
      setIsDialogOpen(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Citizen Profile
          </DialogTitle>
          <DialogDescription>
            Detailed information about {selectedCitizen.full_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className="h-24 w-24 border-4 border-blue-100">
              {selectedCitizen.profile_image_url ? (
                <AvatarImage
                  src={selectedCitizen.profile_image_url}
                  alt={selectedCitizen.full_name}
                />
              ) : null}
              <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                {getInitials(selectedCitizen.full_name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedCitizen.full_name}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      className={`${getStatusColor(
                        selectedCitizen.account_status
                      )} text-sm font-medium`}
                    >
                      {getStatusText(selectedCitizen.account_status)}
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      {getGenderText(selectedCitizen.gender)}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-sm bg-blue-50 text-blue-700"
                    >
                      ID: {selectedCitizen.national_id}
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 md:mt-0">
                  {selectedCitizen.account_status === "active" ? (
                    <Button
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                      onClick={handleSuspend}
                    >
                      Suspend Account
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="border-green-300 text-green-700 hover:bg-green-50"
                      onClick={handleActivate}
                    >
                      Activate Account
                    </Button>
                  )}
                </div>
              </div>

              <p className="text-gray-600 mt-3">
                Member since {formatDate(selectedCitizen.created_at)}
              </p>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500">Email Address</div>
                    <div className="font-medium text-gray-900">
                      {selectedCitizen.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500">Phone Number</div>
                    <div className="font-medium text-gray-900">
                      {selectedCitizen.phone_number}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500">Address</div>
                    <div className="font-medium text-gray-900">
                      {selectedCitizen.address}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500">City</div>
                    <div className="font-medium text-gray-900">
                      {selectedCitizen.city}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Personal Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500">National ID</div>
                    <div className="font-medium text-gray-900">
                      {selectedCitizen.national_id}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500">Date of Birth</div>
                    <div className="font-medium text-gray-900">
                      {formatDate(selectedCitizen.date_of_birth)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500">Account Created</div>
                    <div className="font-medium text-gray-900">
                      {formatDate(selectedCitizen.created_at)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500">Last Updated</div>
                    <div className="font-medium text-gray-900">
                      {formatDate(selectedCitizen.updated_at)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {selectedCitizen.total_complaints !== undefined && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  Activity & Statistics
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-blue-600 font-medium">
                        Complaints Filed
                      </div>
                      <div className="text-2xl font-bold text-blue-900 mt-1">
                        {selectedCitizen.total_complaints}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-blue-600 font-medium">
                        Account Status
                      </div>
                      <div className="text-lg font-bold text-blue-900 mt-1">
                        {getStatusText(selectedCitizen.account_status)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            {selectedCitizen.account_status === "active" ? (
              <Button variant="destructive" onClick={handleSuspend}>
                Suspend Account
              </Button>
            ) : (
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleActivate}
              >
                Activate Account
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CitizenDetailDialog;
