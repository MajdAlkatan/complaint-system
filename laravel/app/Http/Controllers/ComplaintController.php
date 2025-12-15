<?php

namespace App\Http\Controllers;
use App\Interfaces\IComplaintRepo;
use App\Interfaces\IComplaintTypeRepo;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    private IComplaintRepo $complaintRepo;
    private IComplaintTypeRepo $complaintTypeRepo;

    public function __construct(IComplaintRepo $complaintRepo1, IComplaintTypeRepo $complaintTypeRepo1){
        $this->complaintRepo = $complaintRepo1;
        $this->complaintTypeRepo = $complaintTypeRepo1;
    }

    public function index(){
        $data = $this->complaintRepo->getAll();
        return response()->json($data);
    }


    public function getMyComplaints(){
        $data = $this->complaintRepo->getWhereEq('citizen_id', auth()->guard('citizen')->id());
        return response()->json($data);
    }

    public function getMyComplaintById($id){

        $data = $this->complaintRepo->getById($id);
        if(!auth()->guard('citizen')->id() == $data->citizen_id)
            return response()->json(['message' => 'UnAuthorize'] , 403);
        return response()->json($data);
    }


    public function getById($id){
        $data = $this->complaintRepo->getById($id);
        return response()->json($data);
    }

    public function getByReferenceNumber($num){
        $data = $this->complaintRepo->getFirstEq('reference_number' , $num);
        return response()->json($data);
    }


    public function delete($id){
        $data = $this->complaintRepo->getById($id);
        if(!auth()->guard('citizen')->id() == $data->citizen_id)
            return response()->json(['message' => 'UnAuthorize'] , 403);
        $data = $this->complaintRepo->delete($id);
        return response()->json(['message' => 'deleted']);
    }

    public function store(Request $request){
        $validated = $request->validate([
            'entity_id' => 'required|integer|exists:government_entities,government_entities_id',
            'complaint_type' => 'required|integer|exists:complaint_types,id',
            'location' => 'nullable|string|max:65535',
            'description' => 'required|string|min:10|max:65535',
        ]);
        $validated['reference_number'] = \Illuminate\Support\Str::uuid()->toString();
        $validated['status'] = 'new';
        $validated['citizen_id'] = auth()->guard('citizen')->id();
        $this->complaintRepo->insert($validated);
        return response()->json(['message' => 'The data has been inserted succesfully ']);
    }

    public function updateMyComplaint($id , Request $request){
        $complaint = $this->complaintRepo->getById($id);
        if($complaint->locked == true)
            return response()->json(['message' => 'this complaint is locked'] , 400);

        $data = $this->complaintRepo->getById($id);
        if(!auth()->guard('citizen')->id() == $data->citizen_id)
            return response()->json(['message' => 'UnAuthorize'] , 403);
        $validated = $request->validate([
            'entity_id' => 'integer|exists:government_entities,government_entities_id',
            'complaint_type' => 'integer|exists:complaint_types,id',
            'location' => 'string|max:65535',
            'description' => 'string|min:10|max:65535',
        ]);
        $this->complaintRepo->update($id,$validated);
        return response()->json(['message' => 'The data has been updated succesfully ']);
    }


    public function update($id , Request $request){
        $complaint = $this->complaintRepo->getById($id);
        if($complaint->locked == true && $complaint->locked_by_employee_id != auth()->guard('employee')->id())
            return response()->json(['message' => 'this complaint is locked'] , 400);

        $this->complaintRepo->update($id,$request->all());
        return response()->json(['message' => 'The data has been updated succesfully ']);
    }

    
    public function lock($id ){
        $this->complaintRepo->update($id,[
            'locked' => true ,
            'locked_by_employee_id' => auth()->guard('employee')->id() ,
            'locked_at' => now()
        ]);
        return response()->json(['message' => 'The complaint has been locked succesfully ']);
    }

    public function unLock($id ){
        $this->complaintRepo->update($id,[
            'locked' => false ,
            'locked_by_employee_id' => null ,
            'locked_at' => null
        ]);
        return response()->json(['message' => 'The complaint has been locked succesfully ']);
    }


    public function storeType(Request $request){
        $validated = $request->validate([
            'type' => 'required|string'
        ]);
        $validated['createdAt'] = now();
        $this->complaintTypeRepo->insert($validated);
        return response()->json(['message' => 'The data has been inserted succesfully ']);
    }
}
