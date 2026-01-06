<?php
///app/Http/Controller/ComplaintController.php
namespace App\Http\Controllers;

use App\Interfaces\IComplaintRepo;
use App\Interfaces\IComplaintTypeRepo;
use Cache;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;
use App\Events\MyEvent;
use Pusher\Pusher;
use Spatie\Activitylog\Models\Activity;

class ComplaintController extends Controller
{
    private Pusher $pusher;
    private IComplaintRepo $complaintRepo;
    private IComplaintTypeRepo $complaintTypeRepo;
    public function __construct(IComplaintRepo $complaintRepo1, IComplaintTypeRepo $complaintTypeRepo1)
    {
        $this->complaintRepo = $complaintRepo1;
        $this->complaintTypeRepo = $complaintTypeRepo1;
        $this->pusher = Broadcast::connection('pusher')->getPusher();
    }

    public function index()
    {
        //$data = $this->complaintRepo->getAll();
        $data = Cache::remember("complaints", 3600, function () {
            return $this->complaintRepo->getAll();
        });
        return response()->json($data);
    }


    public function getMyComplaints()
    {
        $id = auth()->guard('citizen')->id();
        $data = Cache::remember("complaintsFor_{$id}", 3600, function () {
            return $this->complaintRepo->getWhereEq('citizen_id', auth()->guard('citizen')->id());
        });
        //$data = $this->complaintRepo->getWhereEq('citizen_id', auth()->guard('citizen')->id());
        return response()->json($data);
    }


    public function getAllTypes()
    {
        $types = Cache::remember('cacheTypes',3600, function () {
            return $this->complaintTypeRepo->getAll();
        });
        //$types = $this->complaintTypeRepo->getAll();
        return response()->json($types);
    }
    public function getMyComplaintById($id)
    {
        $data = $this->complaintRepo->getById($id);
        if (!auth()->guard('citizen')->id() == $data->citizen_id)
            return response()->json(['message' => 'UnAuthorize'], 403);
        return response()->json($data);
    }


    public function getById($id)
    {
        $data = Cache::remember("Complaint_{$id}",3600, function () use ($id) {
            return $this->complaintRepo->getById($id);
        });
        //$data = $this->complaintRepo->getById($id);
        return response()->json($data);
    }

    public function getByReferenceNumber($num)
    {   
        $data = Cache::remember("Complaint_{$num}",0, function () use ($num) {
            return $this->complaintRepo->getFirstEq('reference_number', $num);
        });
        //$data = $this->complaintRepo->getFirstEq('reference_number', $num);
        return response()->json($data);
    }


    public function delete($id)
    {

        $data = $this->complaintRepo->getById($id);
        if (!auth()->guard('citizen')->id() == $data->citizen_id)
            return response()->json(['message' => 'UnAuthorize'], 403);
        $data = $this->complaintRepo->delete($id);

        $this->pusher->trigger('User' . auth()->guard('citizen')->id(), 'Delete Complaint', ['message' => 'your complaint have been deleted']);
        return response()->json(['message' => 'deleted']);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'entity_id' => 'required|integer|exists:government_entities,government_entities_id',
            'complaint_type' => 'required|integer|exists:complaint_types,id',
            'location' => 'nullable|string|max:65535',
            'description' => 'required|string|min:10|max:65535',
        ]);
        $validated['reference_number'] = \Illuminate\Support\Str::uuid()->toString();
        $validated['status'] = 'new';
        $validated['citizen_id'] = auth()->guard('citizen')->id();
        $complaint = $this->complaintRepo->insert($validated);
        $this->pusher->trigger('User' . auth()->guard('citizen')->id(), 'Add Complaint', ['message' => 'complaint have been added']);
        return response()->json(['complaint' => $complaint]);
    }

    public function updateMyComplaint($id, Request $request)
    {
        $complaint = $this->complaintRepo->getById($id);
        if ($complaint->locked == true)
            return response()->json(['message' => 'this complaint is locked'], 400);

        $data = $this->complaintRepo->getById($id);
        if (!auth()->guard('citizen')->id() == $data->citizen_id)
            return response()->json(['message' => 'UnAuthorize'], 403);
        $validated = $request->validate([
            'entity_id' => 'integer|exists:government_entities,government_entities_id',
            'complaint_type' => 'integer|exists:complaint_types,id',
            'location' => 'string|max:65535',
            'description' => 'string|min:10|max:65535',
        ]);
        $this->complaintRepo->update($id, $validated);
        $this->pusher->trigger('User' . auth()->guard('citizen')->id(), 'Update Complaint', ['message' => 'complaint have been updated by citizen']);
        return response()->json(['message' => 'The data has been updated succesfully ']);
    }

    public function requestNotes($id, Request $request)
    {
        $complaint = $this->complaintRepo->getById($id);
        if ($complaint->locked == true && $complaint->locked_by_employee_id != auth()->guard('employee')->id())
            return response()->json(['message' => 'this complaint is locked'], 400);
        $validated = $request->validate([
            'message' => 'string|min:10|max:65535',
        ]);
        $this->pusher->trigger('User' . auth()->guard('employee')->id(), 'Notes Required', ['message' => $validated['message']]);
        return response()->json(['message' => 'Your request have sent to the citizen']);
    }

    public function addNotesForMyComplaint($id, Request $request)
    {
        $complaint = $this->complaintRepo->getById($id);
        if ($complaint->locked == true)
            return response()->json(['message' => 'this complaint is locked'], 400);

        $data = $this->complaintRepo->getById($id);
        if (!auth()->guard('citizen')->id() == $data->citizen_id)
            return response()->json(['message' => 'UnAuthorize'], 403);
        $validated = $request->validate([
            'notes' => 'string|min:10|max:65535',
        ]);
        $this->complaintRepo->update($id, [
            'description' => $data->description . '\nnotes : \n' .  $validated['notes'],
        ]);
        $this->pusher->trigger('User' . auth()->guard('citizen')->id(), 'Add Notes', ['message' => 'complaint have been updated by citizen']);
        return response()->json(['message' => 'The data has been updated succesfully ']);
    }


    public function update($id, Request $request)
    {
        $complaint = $this->complaintRepo->getById($id);
        if ($complaint->locked == true && $complaint->locked_by_employee_id != auth()->guard('employee')->id())
            return response()->json(['message' => 'this complaint is locked'], 400);

        $this->complaintRepo->update($id, $request->all());
        $this->pusher->trigger('User' . auth()->guard('employee')->id(), 'Update Complaint', ['message' => 'complaint have been updated by employee ']);
        return response()->json(['message' => 'The data has been updated succesfully ']);
    }


    public function lock($id)
    {
        $this->complaintRepo->update($id, [
            'locked' => true,
            'locked_by_employee_id' => auth()->guard('employee')->id(),
            'locked_at' => now()
        ]);
        return response()->json(['message' => 'The complaint has been locked succesfully ']);
    }

    public function unLock($id)
    {
        $this->complaintRepo->update($id, [
            'locked' => false,
            'locked_by_employee_id' => null,
            'locked_at' => null
        ]);
        return response()->json(['message' => 'The complaint has been unLocked succesfully ']);
    }


    public function storeType(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string'
        ]);
        $validated['createdAt'] = now();
        $this->complaintTypeRepo->insert($validated);
        return response()->json(['message' => 'The data has been inserted succesfully ']);
    }

    public function deleteType($id)
    {
        $this->complaintTypeRepo->delete($id);
        return response()->json(['message' => 'The Type has deleted succesfully ']);
    }

      /*** complaint acitvity */

    public function getComplaintHistory($id)
    {
        // جلب كافة الأنشطة المتعلقة بهذه الشكوى من خلال الـ ID المخزن في الخصائص
        $history = Activity::where('log_name', 'edit-complaint-status')
            ->where('properties->complaint-id', $id) // تحديد النوع الذي سجلته في الميدل وير
            ->with('causer') // لجلب بيانات الموظف الذي قام بالتعديل
            ->get();

        // تنسيق البيانات للعرض
        $formattedHistory = $history->map(function ($activity) {
            return [
                'editor_name'  => $activity->causer ? $activity->causer->name : 'Unknown',
                'editor_email' => $activity->causer ? $activity->causer->email : 'N/A',
                'new_status'   => $activity->getExtraProperty('new-status'),
                'ip_address'   => $activity->getExtraProperty('ip'),
                'edit_time'    => $activity->created_at->format('Y-m-d H:i:s'),
                'description'  => $activity->description,
            ];
        });

        return response()->json($formattedHistory);
    }
}
