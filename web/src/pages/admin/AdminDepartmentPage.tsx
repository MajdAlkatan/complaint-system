import { Building2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import DepartmentCard from "../../components/admin/cards/DepartmentCard";
import { getGovernmentEntity } from '../../lib/adminAction';
import { useEffect, useState } from "react";
import AddGovernmentEntities from "../../components/admin/dialog/AddgovernmentEntites"; // Import the dialog component

interface GovernmentEntity {
  government_entities_id?: string | number;
  name: string;
  description: string;
  contact_email: string;
  contact_phone: string;
}

// Define the API response type
interface ApiResponse {
  data?: GovernmentEntity[];
  success?: boolean;
  message?: string;
}

const AdminDepartmentPage = () => {
  const [entities, setEntities] = useState<GovernmentEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false); // State to control dialog

  const loadGovernmentEntities = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const response: ApiResponse | GovernmentEntity[] = await getGovernmentEntity();

      if (Array.isArray(response)) {
        setEntities(response);
      } else if (response && Array.isArray(response.data)) {
        setEntities(response.data);
      } else {
        console.warn("Unexpected response format from getGovernmentEntity:", response);
        setEntities([]);
        setError("Received data in unexpected format");
      }
    } catch (err) {
      console.error("Failed to load government entities:", err);
      setError("Failed to load departments. Please try again.");
      setEntities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (): void => {
    setDialogOpen(true);
  };



  const handleEntityAdded = (): void => {
    loadGovernmentEntities();
    setDialogOpen(false);
  };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await loadGovernmentEntities();
    };

    fetchData();
  }, []);

  return (
    <div className="">
      <div className="bg-white rounded-xl sm:mx-16 p-2 py-3 sm:p-12 sm:py-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4 max-sm:px-1">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
              Department Management
            </h1>
            {error && (
              <div className="text-red-600 text-sm mt-1">{error}</div>
            )}
          </div>
          <Button
            onClick={handleOpenDialog}
            className="text-white shadow-sm w-full sm:w-auto"
            disabled={loading}
          >
            <Building2 className="w-4 h-4 mr-2" />
            Add Department
          </Button>
        </div>

        {/* AddGovernmentEntities Dialog - Controlled from parent */}
        <AddGovernmentEntities
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onEntityAdded={handleEntityAdded}
        />

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">Loading departments...</div>
          </div>
        )}

        {/* Error State (when not loading but there's an error) */}
        {!loading && error && entities.length === 0 && (
          <div className="flex flex-col justify-center items-center py-12">
            <div className="text-red-600 mb-2">{error}</div>
            <Button
              onClick={loadGovernmentEntities}
              variant="outline"
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && entities.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">No departments found. Add one to get started.</div>
          </div>
        )}

        {/* Department Grid */}
        {!loading && !error && entities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {entities.map((entity, index) => (
              <DepartmentCard
                key={entity.government_entities_id || index}
                name={entity.name}
                description={entity.description}
                contact_email={entity.contact_email}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDepartmentPage;