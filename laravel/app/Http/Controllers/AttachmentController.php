<?php

namespace App\Http\Controllers;

use App\Interfaces\IAttachmentRepo;
use Illuminate\Http\Request;
use function PHPUnit\Framework\returnArgument;

class AttachmentController extends Controller
{
    private IAttachmentRepo $attachmentRepo;

    public function __construct(IAttachmentRepo $attachmentRepo1)
    {
        $this->attachmentRepo = $attachmentRepo1;
    }

    public function index()
    {
        $data = $this->attachmentRepo->getAll();
     
        return response()->json($data);
    }

    public function GetByComplaintId($id)
    {
        $data = $this->attachmentRepo->getWhereEq('complaint_id', $id);
        
        $data->transform(function ($item) {
            $item->file_url = config('app.url', 'http://localhost') . ':8000/storage/' . $item->file_path;
            
            if (strpos($item->file_path, 'storage/') === 0) {
                $item->file_url = config('app.url', 'http://localhost') . ':8000/' . $item->file_path;
            }
            
            return $item;
        });
        
        return response()->json($data)
            ->header('Access-Control-Allow-Origin', 'http://localhost:61460')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, X-Requested-With');
    }

    public function getById($id)
    {
        $data = $this->attachmentRepo->getById($id);
        return response()->json($data);
    }


    public function delete($id)
    {
        $data = $this->attachmentRepo->delete($id);
        return response()->json(['message' => 'deleted']);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'complaint_id' => 'required',
            //'file_path' => 'required',
            //'file_type' => 'required',
            //'uploaded_at' => 'required|date',
            //'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        $validated['file_path'] = 'none';
        $validated['file_type'] = 'none';
        $attatchment = $this->attachmentRepo->insert($validated);

        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        $fileName = $attatchment->attachments_id . '.' . $request->file('image')->extension();
        $path = $request->file('image')->storeAs('attatchments', $fileName, 'public');
        $this->attachmentRepo->update($attatchment->attachments_id, [
            'file_path' => $path,
            'file_type' => $request->file('image')->extension()
        ]);
        return response()->json(['path' => $path]);
    }


    public function upload(Request $request)
    {
        $validated = $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);


        $this->attachmentRepo->insert($validated);
        return response()->json(['message' => 'The data has been inserted succesfully ']);
    }
    public function update($id, Request $request)
    {
        $this->attachmentRepo->update($id, $request->all());
        return response()->json(['message' => 'The data has been updated succesfully ']);
    }
}
