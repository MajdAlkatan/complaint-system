<?php

namespace App\Http\Controllers;
use App\Interfaces\IComplaintRepo;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    private IComplaintRepo $complaintRepo;

    public function __construct(IComplaintRepo $complaintRepo1){
        $complaintRepo = $complaintRepo1;
    }

    public function index(){
        $data = $this->complaintRepo->getAll();
        return response()->json($data);
    }

    public function getById($id){
        $data = $this->complaintRepo->getById($id);
        return response()->json($data);
    }


    public function delete($id){
        $data = $this->complaintRepo->delete($id);
        return response()->json(['message' => 'deleted']);
    }

    public function store(Request $request){
        //
    }

    public function update($id , Request $request){
        $this->complaintRepo->update($id,$validated);
        return response()->json(['message' => 'The data has been updated succesfully ']);
    }
}
