<?php

namespace App\Http\Controllers;
use App\Interfaces\IEmployeeRepo;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    private IEmployeeRepo $employeeRepo;

    public function __construct(IEmployeeRepo $employeeRepo1){
        $employeeRepo = $employeeRepo1;
    }

    public function index(){
        $data = $this->employeeRepo->getAll();
        return response()->json($data);
    }

    public function getById($id){
        $data = $this->citizenemployeeRepoRepo->getById($id);
        return response()->json($data);
    }


    public function delete($id){
        $data = $this->employeeRepo->delete($id);
        return response()->json(['message' => 'deleted']);
    }

    public function store(Request $request){
        //
    }

    public function update($id , Request $request){
        $this->employeeRepo->update($id,$validated);
        return response()->json(['message' => 'The data has been updated succesfully ']);
    }
}
