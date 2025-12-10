<?php

namespace App\Http\Controllers;
use App\Interfaces\ICitizenRepo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class CitizenController extends Controller
{
    private ICitizenRepo $citizenRepo;

    public function __construct(ICitizenRepo $citizenRepo1){
        $this->citizenRepo = $citizenRepo1;
    }

    public function index(){
        $data = $this->citizenRepo->getAll();
        return response()->json($data);
    }

    public function getById($id){
        $data = $this->citizenRepo->getById($id);
        return response()->json($data);
    }


    public function delete($id){
        $data = $this->citizenRepo->delete($id);
        return response()->json(['message' => 'deleted']);
    }

    public function store(Request $request){
        //
    }

    public function update($id , Request $request){
        $this->citizenRepo->update($id,$validated);
        return response()->json(['message' => 'The data has been updated succesfully ']);
    }

    public function register(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $citizen = $this->citizenRepo->insert([
            'full_name' => $request->full_name,
            'email' => $request->email,
            'password_hash' => Hash::make($request->password),
        ]);

        return response()->json([
            'citizen' => $citizen,
            //'access_token' => $token,
            //'token_type' => 'bearer',
            //'expires_in' => JWTAuth::factory()->getTTL() * 60
        ]);
    }
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = auth()->guard('citizen')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            //'expires_in' => JWTAuth::factory()->getTTL() * 60
        ]);
    }

}
