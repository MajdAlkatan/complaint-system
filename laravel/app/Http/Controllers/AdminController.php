<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

class AdminController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $admin = Admin::create([
            'email' => $request->email,
            'password_hash' => Hash::make($request->password),
        ]);

        return response()->json([
            'admin' => $admin,
            //'access_token' => $token,
            //'token_type' => 'bearer',
            //'expires_in' => JWTAuth::factory()->getTTL() * 60
        ]);
    }
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = auth()->guard('admin')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $user = Auth::guard('admin')->user();

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
}
