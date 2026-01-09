import React, { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  MoreVertical,
  UserCheck,
  UserX,
  Download,
  RefreshCw,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { useCitizenStore, type Citizen } from "../../app/store/citizenStore";
import CitizenDetailDialog from "./CitizenDetailDialog";
import EditCitizenDialog from "./EditCitizenDialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";

const CitizenList = () => {
  const {
    citizens,
    loading,
    fetchCitizens,
    deleteCitizen,
    suspendCitizen,
    activateCitizen,
    getStatusColor,
    getStatusText,
    getGenderText,
    formatDate,
    setSelectedCitizen,
    setIsDialogOpen,
    setIsEditing,
  } = useCitizenStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCitizenForAction, setSelectedCitizenForAction] =
    useState<Citizen | null>(null);

  const filteredCitizens = citizens.filter((citizen) => {
    const matchesSearch =
      citizen?.national_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      citizen.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      citizen.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      citizen.phone_number.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || citizen.account_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (citizen: Citizen) => {
    setSelectedCitizen(citizen);
    setIsDialogOpen(true);
  };

  const handleEdit = (citizen: Citizen) => {
    setSelectedCitizen(citizen);
    setIsEditing(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${name}? This action cannot be undone.`
      )
    ) {
      return;
    }

    await deleteCitizen(id);
  };

  const handleSuspend = async (id: number, name: string) => {
    if (
      !window.confirm(`Are you sure you want to suspend ${name}'s account?`)
    ) {
      return;
    }

    await suspendCitizen(id);
  };

  const handleActivate = async (id: number, name: string) => {
    if (
      !window.confirm(`Are you sure you want to activate ${name}'s account?`)
    ) {
      return;
    }

    await activateCitizen(id);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, national ID, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full md:w-64">
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => fetchCitizens()}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredCitizens.length} of {citizens.length} citizens
      </div>

      {/* Citizen Cards */}
      {filteredCitizens.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No matching citizens
          </h3>
          <p className="text-gray-600 mt-1">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "No citizens found in the system"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCitizens.map((citizen) => (
            <Card
              key={citizen.citizen_id}
              className="border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-blue-100">
                      {citizen.profile_image_url ? (
                        <AvatarImage
                          src={citizen.profile_image_url}
                          alt={citizen.full_name}
                        />
                      ) : null}
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {getInitials(citizen.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {citizen.full_name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          className={getStatusColor(citizen.account_status)}
                        >
                          {getStatusText(citizen.account_status)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {getGenderText(citizen.gender)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Action Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => handleViewDetails(citizen)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(citizen)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {citizen.account_status === "active" ? (
                        <DropdownMenuItem
                          onClick={() =>
                            handleSuspend(citizen.citizen_id, citizen.full_name)
                          }
                          className="text-amber-600"
                        >
                          <UserX className="w-4 h-4 mr-2" />
                          Suspend Account
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() =>
                            handleActivate(
                              citizen.citizen_id,
                              citizen.full_name
                            )
                          }
                          className="text-green-600"
                        >
                          <UserCheck className="w-4 h-4 mr-2" />
                          Activate Account
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() =>
                          handleDelete(citizen.citizen_id, citizen.full_name)
                        }
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Citizen
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Basic Information */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">
                      ID: {citizen.national_id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span
                      className="text-gray-700 truncate"
                      title={citizen.email}
                    >
                      {citizen.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">
                      {citizen.phone_number}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span
                      className="text-gray-700 truncate"
                      title={citizen.address}
                    >
                      {citizen.city}, {citizen.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">
                      Born: {formatDate(citizen.date_of_birth)}
                    </span>
                  </div>
                </div>

                {/* Stats (if available) */}
                {citizen.total_complaints !== undefined && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <div className="text-xs text-blue-600 font-medium">
                      Complaints Filed
                    </div>
                    <div className="text-lg font-bold text-blue-900">
                      {citizen.total_complaints}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewDetails(citizen)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50"
                    onClick={() => handleEdit(citizen)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  {citizen.account_status === "active" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                      onClick={() =>
                        handleSuspend(citizen.citizen_id, citizen.full_name)
                      }
                    >
                      <UserX className="w-4 h-4 mr-2" />
                      Suspend
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
                      onClick={() =>
                        handleActivate(citizen.citizen_id, citizen.full_name)
                      }
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Activate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialogs */}
      <CitizenDetailDialog />
      <EditCitizenDialog citizen={selectedCitizenForAction} />
    </div>
  );
};

export default CitizenList;
