<?php

namespace App\Http\Controllers;
use App\Interfaces\IGovernmentEntityRepo;
use Illuminate\Http\Request;

class GovernmentEntityController extends Controller
{
    private IGovernmentEntityRepo $governmentEntityRepo;

    public function __construct(IGovernmentEntityRepo $governmentEntityRepo1){
        $this->governmentEntityRepo = $governmentEntityRepo1;
    }

    public function index(){
        $data = $this->governmentEntityRepo->getAll();
        return response()->json($data);
    }

    public function getById($id){
        $data = $this->governmentEntityRepo->getById($id);
        return response()->json($data);
    }


    public function delete($id){
        $data = $this->governmentEntityRepo->delete($id);
        return response()->json(['message' => 'deleted']);
    }

    public function store(Request $request){
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:government_entities,name',
            'description' => 'nullable|string',
            'contact_email' => 'nullable|email|max:255',
            'contact_phone' => 'nullable|string|max:20',
        ]);
        $this->governmentEntityRepo->insert($validated);
        return response()->json(['message' => 'The data has been inserted succesfully ']);
    }

    public function update($id , Request $request){
        $this->governmentEntityRepo->update($id,$validated);
        return response()->json(['message' => 'The data has been updated succesfully ']);
    }
}
