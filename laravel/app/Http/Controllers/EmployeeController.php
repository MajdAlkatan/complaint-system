<?php

namespace App\Http\Controllers;
use App\Interfaces\IEmployeeRepo;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

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
        $data = $this->employeeRepo->getById($id);
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
        $validated['password_hash'] = Hash::make($request->password);
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
        $user = Auth::guard('employee')->user();

        // إنشاء refresh token
        $refreshToken = $this->createRefreshToken($user);
        return response()->json([
            'access_token' => $token,
            'refresh_token' => $refreshToken,
            'token_type' => 'bearer',
            'user' => $user,
            //'expires_in' => JWTAuth::factory()->getTTL() * 60
        ]);
    }

    public function CheckUser(Request $request){
        $user = Auth::guard('employee')->user();
        return response()->json($user);
    }


    protected function createRefreshToken($user)
    {
        $customClaims = [
            'type' => 'refresh_token',
            'exp' => time() + (config('jwt.refresh_ttl') * 60)
        ];

        return JWTAuth::customClaims($customClaims)->fromUser($user);
    }
    public function refresh(Request $request)
    {
        try {
            $refreshToken = $request->input('refresh_token');

            if (!$refreshToken) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Refresh token is required'
                ], 400);
            }
            $payload = JWTAuth::setToken($refreshToken)->getPayload();

            if ($payload->get('type') !== 'refresh_token') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid token type'
                ], 401);
            }
            $user = JWTAuth::setToken($refreshToken)->authenticate();
            $newToken = JWTAuth::fromUser($user);
            $newRefreshToken = $this->createRefreshToken($user);

            return response()->json([
                    'token' => $newToken,
                    'type' => 'bearer',
                    'expires_in' => JWTAuth::factory()->getTTL() * 60,
                    'refresh_token' => $newRefreshToken,
                    'refresh_token_expires_in' => config('jwt.refresh_ttl') * 60
            ]);

        } catch (TokenExpiredException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Refresh token has expired',
                'error' => 'TOKEN_EXPIRED'
            ], 401);
        } catch (TokenInvalidException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Refresh token is invalid',
                'error' => 'TOKEN_INVALID'
            ], 401);
        } catch (JWTException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Could not refresh token',
                'error' => $e->getMessage()
            ], 500);
        }
    }


}
