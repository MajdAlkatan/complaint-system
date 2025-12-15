<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;


class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'birth_of_date' => 'required|string|date',
            'phone' => 'required|string|max:10',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'full_name' => $request->full_name,
            'email' => $request->email,
            'birth_of_date' => $request->birth_of_date,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
        ]);

        //$token = JWTAuth::fromUser($user);

        return response()->json([
            'user' => $user,
            //'access_token' => $token,
            //'token_type' => 'bearer',
            //'expires_in' => JWTAuth::factory()->getTTL() * 60
        ]);
    }
    /*
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            //'expires_in' => JWTAuth::factory()->getTTL() * 60
        ]);
    }

*/

    public function login(Request $request)
    {
        try {
            // التحقق من المدخلات
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|string|min:6',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            // محاولة تسجيل الدخول
            $credentials = $request->only('email', 'password');

            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid credentials'
                ], 401);
            }

            // الحصول على المستخدم
            $user = Auth::user();

            // إنشاء refresh token
            $refreshToken = $this->createRefreshToken($user);

            return response()->json([
                'status' => 'success',
                'message' => 'Login successful',
                'user' => $user,
                'authorisation' => [
                    'token' => $token,
                    'type' => 'bearer',
                    //'expires_in' => JWTAuth::factory()->getTTL() * 60, // بالثواني
                    'refresh_token' => $refreshToken,
                    //'refresh_token_expires_in' => config('jwt.refresh_ttl') * 60 // بالثواني
                ]
            ]);

        } catch (JWTException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Could not create token',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * إنشاء refresh token
     */
    protected function createRefreshToken($user)
    {
        $customClaims = [
            'type' => 'refresh_token',
            'exp' => time() + (config('jwt.refresh_ttl') * 60)
        ];

        return JWTAuth::customClaims($customClaims)->fromUser($user);
    }

    /**
     * تجديد token باستخدام refresh token
     */
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

            // التحقق من refresh token
            $payload = JWTAuth::setToken($refreshToken)->getPayload();

            if ($payload->get('type') !== 'refresh_token') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid token type'
                ], 401);
            }

            // الحصول على المستخدم من refresh token
            $user = JWTAuth::setToken($refreshToken)->authenticate();

            // إنشاء token جديد
            $newToken = JWTAuth::fromUser($user);

            // إنشاء refresh token جديد
            $newRefreshToken = $this->createRefreshToken($user);

            return response()->json([
                'status' => 'success',
                'message' => 'Token refreshed successfully',
                'authorisation' => [
                    'token' => $newToken,
                    'type' => 'bearer',
                    'expires_in' => JWTAuth::factory()->getTTL() * 60,
                    'refresh_token' => $newRefreshToken,
                    'refresh_token_expires_in' => config('jwt.refresh_ttl') * 60
                ]
            ]);

        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Refresh token has expired',
                'error' => 'TOKEN_EXPIRED'
            ], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
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

    public function me()
    {
        return response()->json(auth()->user());
    }

    public function logout()
    {
        auth()->logout();
        return response()->json(['message' => 'Successfully logged out']);
    }
}
