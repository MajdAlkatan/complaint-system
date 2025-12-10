<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            //'expires_in' => JWTAuth::factory()->getTTL() * 60
        ]);
    }

}
