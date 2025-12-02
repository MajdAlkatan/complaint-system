<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ActivityController;



Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('register', [AuthController::class, 'register'])
->middleware('LogUserActivity');

Route::post('activities', [ActivityController::class, 'index'])
->middleware('LogUserActivity');


Route::post('login', [AuthController::class, 'login'])
    ->middleware(['throttle:login', 'LogUserActivity']);

Route::post('logout', [AuthController::class, 'logout']);

Route::get('me', [AuthController::class, 'me'])
    ->middleware('auth:api');



