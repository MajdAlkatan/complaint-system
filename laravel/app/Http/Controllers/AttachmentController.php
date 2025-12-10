<?php

namespace App\Http\Controllers;
use App\Interfaces\IAttachmentRepo;
use Illuminate\Http\Request;
use function PHPUnit\Framework\returnArgument;

class AttachmentController extends Controller
{
    private IAttachmentRepo $attachmentRepo;

    public function __construct(IAttachmentRepo $attachmentRepo1){
        $attachmentRepo = $attachmentRepo1;
    }

    public function index(){
        $data = $this->attachmentRepo->getAll();
        return response()->json($data);
    }

    public function getById($id){
        $data = $this->attachmentRepo->getById($id);
        return response()->json($data);
    }


    public function delete($id){
        $data = $this->attachmentRepo->delete($id);
        return response()->json(['message' => 'deleted']);
    }

    public function store(Request $request){
        $validated = $request->validate([
            'complaint_id' => 'required',
            'file_path' => 'required',
            'file_type' => 'required',
            'uploaded_at' => 'required|date',
        ]);
        $this->attachmentRepo->insert($validated);
        return response()->json(['message' => 'The data has been inserted succesfully ']);
    }

    public function update($id , Request $request){
        $this->attachmentRepo->update($id,$validated);
        return response()->json(['message' => 'The data has been updated succesfully ']);
    }
}
