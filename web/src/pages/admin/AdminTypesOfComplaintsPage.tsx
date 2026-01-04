import React, { useEffect, useState } from "react";
import { useTypesOfComplaintsStore } from "../../app/store/admin/typesOfComplaints.store";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Check,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { Badge } from "../../components/ui/badge";
import { toast } from "react-hot-toast";

const AdminTypesOfComplaintsPage = () => {
  // Store state
  const {
    types,
    isLoading,
    error,
    isSubmitting,
    currentType,
    fetchTypes,
    addType,
    updateType,
    deleteType,
    setCurrentType,
    clearError,
  } = useTypesOfComplaintsStore();

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<number | null>(null);
  const [newTypeName, setNewTypeName] = useState("");
  const [editTypeName, setEditTypeName] = useState("");

  // Fetch types on component mount
  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  // Filter types based on search
  const filteredTypes = types.filter((type) =>
    type.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle add type
  const handleAddType = async () => {
    if (!newTypeName.trim()) {
      toast.error("Please enter a type name");
      return;
    }

    const result = await addType(newTypeName);

    if (result.success) {
      toast.success("Complaint type added successfully!");
      setNewTypeName("");
      setIsAddDialogOpen(false);
      fetchTypes();
    } else {
      toast.error(result.error || "Failed to add complaint type");
    }
  };

  // Handle edit type
  const handleEditType = async () => {
    if (!currentType || !editTypeName.trim()) {
      toast.error("Please enter a type name");
      return;
    }

    const result = await updateType(currentType.id, editTypeName);

    if (result.success) {
      toast.success("Complaint type updated successfully!");
      setEditTypeName("");
      setIsEditDialogOpen(false);
      setCurrentType(null);
    } else {
      toast.error(result.error || "Failed to update complaint type");
    }
  };

  // Handle delete type
  const handleDeleteType = async () => {
    if (!typeToDelete) return;

    const result = await deleteType(typeToDelete);

    if (result.success) {
      toast.success("Complaint type deleted successfully!");
    } else {
      toast.error(result.error || "Failed to delete complaint type");
    }

    setTypeToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  // Open edit dialog
  const openEditDialog = (type: any) => {
    setCurrentType(type);
    setEditTypeName(type.type);
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (id: number) => {
    setTypeToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Reset form
  const resetAddForm = () => {
    setNewTypeName("");
  };

  // Clear error when dialog closes
  const handleAddDialogChange = (open: boolean) => {
    setIsAddDialogOpen(open);
    if (!open) {
      clearError();
      resetAddForm();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaint Types</h1>
          <p className="text-gray-600">
            Manage different types of complaints in the system
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={handleAddDialogChange}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Complaint Type</DialogTitle>
              <DialogDescription>
                Enter the name for the new complaint type.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="e.g., Infrastructure, Security, Service"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddType();
                }}
                disabled={isSubmitting}
              />
              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddType}
                disabled={isSubmitting || !newTypeName.trim()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Type"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search complaint types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Error Display */}
      {error && !isAddDialogOpen && !isEditDialogOpen && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Error loading complaint types</span>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={fetchTypes}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Types Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Type Name</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-2" />
                    <p className="text-gray-500">Loading complaint types...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Search className="h-12 w-12 text-gray-300 mb-2" />
                    <p className="text-gray-500">
                      {searchTerm
                        ? "No complaint types found matching your search"
                        : "No complaint types found"}
                    </p>
                    {!searchTerm && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => setIsAddDialogOpen(true)}
                      >
                        <Plus className="mr-2 h-3 w-3" />
                        Add First Type
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredTypes.map((type) => (
                <TableRow key={type.id} className="hover:bg-gray-50">
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      #{type.id}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{type.type}</TableCell>
                  <TableCell>{type.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(type)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(type.id)}
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Complaint Type</DialogTitle>
            <DialogDescription>
              Update the name for this complaint type.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Type name"
              value={editTypeName}
              onChange={(e) => setEditTypeName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEditType();
              }}
              disabled={isSubmitting}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditType}
              disabled={isSubmitting || !editTypeName.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Type"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              complaint type{" "}
              <span className="font-semibold">
                "{types.find((t) => t.id === typeToDelete)?.type}"
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTypeToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteType}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminTypesOfComplaintsPage;
