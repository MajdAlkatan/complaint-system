<?php

namespace App\Http\Controllers;
use App\Interfaces\IEmployeeRepo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class EmployeeController extends Controller
{
    private IEmployeeRepo $employeeRepo;

    public function __construct(IEmployeeRepo $employeeRepo1){
        $this->employeeRepo = $employeeRepo1;
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
        $validated = $request->validate([
            'username' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'government_entity_id' => 'required|exists:government_entities,government_entities_id',
            'position' => 'required|string|max:50',
            'can_add_notes_on_complaints' => 'boolean',
            'can_request_more_info_on_complaints' => 'boolean',
            'can_change_complaints_status' => 'boolean',
            'can_view_reports' => 'boolean',
            'can_export_data' => 'boolean',

        ]);
        $validated['created_by'] = auth()->id();
        $validated['password_hash'] = $request->password;
        $employee = $this->employeeRepo->insert($validated);

        return response()->json([
            'employee' => $employee,
            //'access_token' => $token,
            //'token_type' => 'bearer',
            //'expires_in' => JWTAuth::factory()->getTTL() * 60
        ]);
    }


    public function update($id , Request $request){
        $data = $request->all();
        $data['permissions_updated_by'] = auth()->id(); 
        $this->employeeRepo->update($id,$data);
        return response()->json(['message' => 'The data has been updated succesfully ']);
    }


    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = auth()->guard('employee')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            //'expires_in' => JWTAuth::factory()->getTTL() * 60
        ]);
    }
}
