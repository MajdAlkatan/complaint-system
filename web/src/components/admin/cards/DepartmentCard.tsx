import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Delete, Edit, Eye, FileText, Trash, Users } from "lucide-react";
import { useGovernmentEntityStore } from "../../../app/store/admin/governmentEntityStore";

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
  const { deleteGovernmentEntity } = useGovernmentEntityStore();
  return (
    <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900">
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span>{description} </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FileText className="w-4 h-4" />
            <span>{contact_email} </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="ghost">
            <Edit />
            Edit
          </Button>
          <Button variant="ghost">
            <Eye />
            View
          </Button>
          <Button variant="ghost" onClick={() => deleteGovernmentEntity(id)}>
            <Trash className="text-red-500" />
            delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentCard;
