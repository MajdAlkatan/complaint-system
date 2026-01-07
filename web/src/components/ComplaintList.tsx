// import { useState, useEffect } from "react";
// import {
//   Search,
//   Filter,
//   Eye,
//   Lock,
//   Unlock,
//   MessageSquare,
//   Edit,
//   FileText,
//   Calendar,
//   MapPin,
//   User,
//   Shield,
//   AlertCircle,
// } from "lucide-react";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Badge } from "./ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "./ui/dropdown-menu";
// import {
//   useComplaintStore,
//   type Complaint,
// } from "../app/store/complaint.store";
// import { format } from "date-fns";
// import ComplaintDetailDialog from "./ComplaintDetailDialog";
// import AddNoteDialog from "./AddNoteDialog";
// import RequestNotesDialog from "./RequestNotesDialog";

// const ComplaintList = () => {
//   const {
//     complaints,
//     loading,
//     error,
//     fetchComplaints,
//     lockComplaint,
//     unlockComplaint,
//     getStatusColor,
//     getStatusBadge,
//     setSelectedComplaint,
//     setIsDialogOpen,
//   } = useComplaintStore();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState<string>("all");
//   const [selectedComplaintForAction, setSelectedComplaintForAction] =
//     useState<Complaint | null>(null);
//   const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
//   const [isRequestNotesOpen, setIsRequestNotesOpen] = useState(false);

//   useEffect(() => {
//     fetchComplaints();
//   }, []);

//   const formatDate = (dateString: string) => {
//     try {
//       return format(new Date(dateString), "MMM d, yyyy HH:mm");
//     } catch {
//       return "Invalid date";
//     }
//   };

//   const filteredComplaints = complaints.filter((complaint) => {
//     const matchesSearch =
//       complaint.reference_number
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       complaint.location.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesStatus =
//       statusFilter === "all" || complaint.status === statusFilter;

//     return matchesSearch && matchesStatus;
//   });

//   const handleViewDetails = (complaint: Complaint) => {
//     setSelectedComplaint(complaint);
//     setIsDialogOpen(true);
//   };

//   const handleLock = async (id: number) => {
//     await lockComplaint(id);
//   };

//   const handleUnlock = async (id: number) => {
//     await unlockComplaint(id);
//   };

//   const handleAddNote = (complaint: Complaint) => {
//     setSelectedComplaintForAction(complaint);
//     setIsAddNoteOpen(true);
//   };

//   const handleRequestNotes = (complaint: Complaint) => {
//     setSelectedComplaintForAction(complaint);
//     setIsRequestNotesOpen(true);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-gray-500">Loading complaints...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
//         <div className="flex items-center gap-2">
//           <AlertCircle className="w-5 h-5" />
//           <span>{error}</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header and Filters */}
//       <div className="bg-white p-6 rounded-xl border border-gray-200">
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">
//               Complaint Management
//             </h1>
//             <p className="text-gray-600 mt-1">
//               Manage and track citizen complaints
//             </p>
//           </div>
//           <Button className="bg-blue-600 hover:bg-blue-700">
//             <FileText className="w-4 h-4 mr-2" />
//             Generate Report
//           </Button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {/* Search */}
//           <div className="relative">
//             <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//             <Input
//               placeholder="Search complaints..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-9"
//             />
//           </div>

//           {/* Status Filter */}
//           <div className="relative">
//             <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="all">All Statuses</option>
//               <option value="new">New</option>
//               <option value="pending">Pending</option>
//               <option value="in_progress">In Progress</option>
//               <option value="resolved">Resolved</option>
//               <option value="rejected">Rejected</option>
//             </select>
//           </div>

//           {/* Stats */}
//           <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
//             <div className="text-sm text-blue-700 font-medium">
//               Total Complaints
//             </div>
//             <div className="text-2xl font-bold text-blue-900">
//               {complaints.length}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Complaint Cards */}
//       {filteredComplaints.length === 0 ? (
//         <div className="text-center py-12">
//           <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-medium text-gray-900">
//             No complaints found
//           </h3>
//           <p className="text-gray-600 mt-1">
//             {searchTerm || statusFilter !== "all"
//               ? "Try adjusting your filters"
//               : "No complaints have been submitted yet"}
//           </p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {filteredComplaints.map((complaint) => (
//             <Card
//               key={complaint.complaints_id}
//               className="border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
//             >
//               <CardHeader className="pb-3">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                       <Shield className="w-5 h-5 text-blue-600" />
//                       Complaint #{complaint.reference_number.substring(0, 8)}...
//                     </CardTitle>
//                     <div className="flex items-center gap-2 mt-2">
//                       <Badge className={getStatusColor(complaint.status)}>
//                         {getStatusBadge(complaint.status)}
//                       </Badge>
//                       {complaint.locked && (
//                         <Badge className="bg-amber-100 text-amber-800">
//                           <Lock className="w-3 h-3 mr-1" />
//                           Locked
//                         </Badge>
//                       )}
//                     </div>
//                   </div>

//                   {/* Action Menu */}
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="sm">
//                         Actions
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end" className="w-48">
//                       <DropdownMenuItem
//                         onClick={() => handleViewDetails(complaint)}
//                       >
//                         <Eye className="w-4 h-4 mr-2" />
//                         View Details
//                       </DropdownMenuItem>
//                       <DropdownMenuSeparator />
//                       {!complaint.locked ? (
//                         <DropdownMenuItem
//                           onClick={() => handleLock(complaint.complaints_id)}
//                         >
//                           <Lock className="w-4 h-4 mr-2" />
//                           Lock Complaint
//                         </DropdownMenuItem>
//                       ) : (
//                         <DropdownMenuItem
//                           onClick={() => handleUnlock(complaint.complaints_id)}
//                         >
//                           <Unlock className="w-4 h-4 mr-2" />
//                           Unlock Complaint
//                         </DropdownMenuItem>
//                       )}
//                       <DropdownMenuItem
//                         onClick={() => handleAddNote(complaint)}
//                       >
//                         <Edit className="w-4 h-4 mr-2" />
//                         Add Notes
//                       </DropdownMenuItem>
//                       <DropdownMenuItem
//                         onClick={() => handleRequestNotes(complaint)}
//                       >
//                         <MessageSquare className="w-4 h-4 mr-2" />
//                         Request More Info
//                       </DropdownMenuItem>
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </div>
//               </CardHeader>

//               <CardContent className="space-y-4">
//                 {/* Description */}
//                 <div>
//                   <p className="text-sm text-gray-600 line-clamp-2">
//                     {complaint.description}
//                   </p>
//                 </div>

//                 {/* Details */}
//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="flex items-center gap-2 text-sm">
//                     <MapPin className="w-4 h-4 text-gray-400" />
//                     <span className="text-gray-700">{complaint.location}</span>
//                   </div>
//                   <div className="flex items-center gap-2 text-sm">
//                     <Calendar className="w-4 h-4 text-gray-400" />
//                     <span className="text-gray-700">
//                       {formatDate(complaint.created_at)}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2 text-sm">
//                     <User className="w-4 h-4 text-gray-400" />
//                     <span className="text-gray-700">
//                       Citizen #{complaint.citizen_id}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2 text-sm">
//                     <Shield className="w-4 h-4 text-gray-400" />
//                     <span className="text-gray-700">
//                       Entity #{complaint.entity_id}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex gap-2 pt-3 border-t border-gray-100">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="flex-1"
//                     onClick={() => handleViewDetails(complaint)}
//                   >
//                     <Eye className="w-4 h-4 mr-2" />
//                     View Details
//                   </Button>
//                   {!complaint.locked ? (
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50"
//                       onClick={() => handleLock(complaint.complaints_id)}
//                     >
//                       <Lock className="w-4 h-4 mr-2" />
//                       Lock
//                     </Button>
//                   ) : (
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
//                       onClick={() => handleUnlock(complaint.complaints_id)}
//                     >
//                       <Unlock className="w-4 h-4 mr-2" />
//                       Unlock
//                     </Button>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* Dialogs */}
//       <ComplaintDetailDialog />
//       <AddNoteDialog
//         open={isAddNoteOpen}
//         onOpenChange={setIsAddNoteOpen}
//         complaint={selectedComplaintForAction}
//       />
//       <RequestNotesDialog
//         open={isRequestNotesOpen}
//         onOpenChange={setIsRequestNotesOpen}
//         complaint={selectedComplaintForAction}
//       />
//     </div>
//   );
// };

// export default ComplaintList;

import React, { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Lock,
  Unlock,
  MessageSquare,
  Edit,
  FileText,
  Calendar,
  MapPin,
  User,
  Shield,
  AlertCircle,
  MoreVertical,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { format } from "date-fns";
import ComplaintDetailDialog from "./ComplaintDetailDialog";
import AddNoteDialog from "./AddNoteDialog";
import RequestNotesDialog from "./RequestNotesDialog";
import { useComplaintStore } from "../app/store/complaint.store";

const ComplaintList = () => {
  const {
    complaints,
    loading,
    error,
    fetchComplaints,
    lockComplaint,
    unlockComplaint,
    getStatusColor,
    getStatusBadge,
    setSelectedComplaint,
    setIsDialogOpen,
  } = useComplaintStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedComplaintForAction, setSelectedComplaintForAction] =
    useState<any>(null);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isRequestNotesOpen, setIsRequestNotesOpen] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy HH:mm");
    } catch {
      return "Invalid date";
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch =
      complaint.reference_number
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || complaint.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (complaint: any) => {
    setSelectedComplaint(complaint);
    setIsDialogOpen(true);
  };

  const handleLock = async (id: number) => {
    await lockComplaint(id);
  };

  const handleUnlock = async (id: number) => {
    await unlockComplaint(id);
  };

  const handleAddNote = (complaint: any) => {
    setSelectedComplaintForAction(complaint);
    setIsAddNoteOpen(true);
  };

  const handleRequestNotes = (complaint: any) => {
    setSelectedComplaintForAction(complaint);
    setIsRequestNotesOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search complaints by reference, description, or location..."
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
              <option value="new">New</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredComplaints.length} of {complaints.length} complaints
      </div>

      {/* Complaint Cards */}
      {filteredComplaints.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No matching complaints
          </h3>
          <p className="text-gray-600 mt-1">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "No complaints available"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredComplaints.map((complaint) => (
            <Card
              key={complaint.complaints_id}
              className="border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      Complaint #{complaint.reference_number.substring(0, 8)}...
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getStatusColor(complaint.status)}>
                        {getStatusBadge(complaint.status)}
                      </Badge>
                      {complaint.locked && (
                        <Badge className="bg-amber-100 text-amber-800">
                          <Lock className="w-3 h-3 mr-1" />
                          Locked
                        </Badge>
                      )}
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
                        onClick={() => handleViewDetails(complaint)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {!complaint.locked ? (
                        <DropdownMenuItem
                          onClick={() => handleLock(complaint.complaints_id)}
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          Lock Complaint
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => handleUnlock(complaint.complaints_id)}
                        >
                          <Unlock className="w-4 h-4 mr-2" />
                          Unlock Complaint
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleAddNote(complaint)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Add Notes
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRequestNotes(complaint)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Request More Info
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Description */}
                <div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {complaint.description}
                  </p>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{complaint.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">
                      {formatDate(complaint.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">
                      Citizen #{complaint.citizen_id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">
                      Entity #{complaint.entity_id}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewDetails(complaint)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  {!complaint.locked ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50"
                      onClick={() => handleLock(complaint.complaints_id)}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Lock
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
                      onClick={() => handleUnlock(complaint.complaints_id)}
                    >
                      <Unlock className="w-4 h-4 mr-2" />
                      Unlock
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialogs */}
      <ComplaintDetailDialog />
      <AddNoteDialog
        open={isAddNoteOpen}
        onOpenChange={setIsAddNoteOpen}
        complaint={selectedComplaintForAction}
      />
      <RequestNotesDialog
        open={isRequestNotesOpen}
        onOpenChange={setIsRequestNotesOpen}
        complaint={selectedComplaintForAction}
      />
    </div>
  );
};

export default ComplaintList;
