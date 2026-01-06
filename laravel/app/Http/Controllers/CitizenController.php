<?php

namespace App\Http\Controllers;
use App\Interfaces\ICitizenRepo;
use Auth;
use Cache;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

class CitizenController extends Controller
{
    private ICitizenRepo $citizenRepo;

    public function __construct(ICitizenRepo $citizenRepo1){
        $this->citizenRepo = $citizenRepo1;
    }

    public function index(){

        $data = Cache::remember('Citizens', 3600, function () {
            return $this->citizenRepo->getAll();
        });
        return response()->json($data);
    }

    public function getById($id){
        $data = Cache::remember("citizen_{$id}", 3600, function () use ($id) {
            return $this->citizenRepo->getById($id);
        });
        //$data = $this->citizenRepo->getById($id);
        return response()->json($data);
    }


    public function delete($id){
        if (Cache::has("citizen_{$id}"))
            Cache::forget("citizen_{$id}");
        $this->citizenRepo->delete($id);
        return response()->json(['message' => 'deleted']);
    }

    public function lock($id , Request $request){
        if (Cache::has("citizen_{$id}"))
            Cache::forget("citizen_{$id}");
        $citizen = $this->citizenRepo->getById($id);
        $citizen->locked_until = Carbon::now()->addHours($request->hoursCnt)->toDateTimeString();
        return response()->json(['message' => 'the citizen account has locked until '. $citizen->locked_until]);
    }

    public function store(Request $request){
        //
    }

    public function update($id , Request $request){
        if (Cache::has("citizen_{$id}"))
            Cache::forget("citizen_{$id}");
        $this->citizenRepo->update($id,$request->all());
        $this->citizenRepo->update($id,['updated_at'=> now()]);
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
        $user = Auth::guard('citizen')->user();

        // إنشاء refresh token
        $refreshToken = $this->createRefreshToken($user);
        return response()->json([
            'access_token' => $token,
            'refresh_token' => $refreshToken,
            'token_type' => 'bearer',
            'user' => $user,
        ]);
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


    public function CheckUser(Request $request){
        $user = Auth::guard('citizen')->user();
        return response()->json($user);
    }


}
