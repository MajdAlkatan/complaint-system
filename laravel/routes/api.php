<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AttachmentController;
use App\Http\Controllers\CitizenController;
use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\GovernmentEntityController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ActivityController;



Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('admins/register', [AdminController::class, 'register'])
->middleware('LogUserActivity');

Route::post('admins/login', [AdminController::class, 'login'])
->middleware('LogUserActivity');


Route::post('citizens/register', [CitizenController::class, 'register'])
->middleware('LogUserActivity');

Route::post('activities', [ActivityController::class, 'index'])
->middleware('LogUserActivity');


Route::post('citizens/login', [CitizenController::class, 'login'])
    ->middleware(['throttle:login', 'LogUserActivity']);

Route::post('logout', [AuthController::class, 'logout']);

Route::get('me', [AuthController::class, 'me'])
    ->middleware('auth:api');



/*
*************
*Attachment*
*************
*/
Route::get('attachment', [AttachmentController::class, 'index'])
    ->middleware('auth:api');
Route::get('attachment/{id}', [AttachmentController::class, 'getById'])
    ->middleware('auth:api');
Route::post('attachment', [AttachmentController::class, 'store'])
    ->middleware('auth:api');
Route::delete('attachment/{id}', [AttachmentController::class, 'delete'])
    ->middleware('auth:api');
Route::put('attachment/{id}', [AttachmentController::class, 'update'])
    ->middleware('auth:api');

    
/*
*************
*Citizen*
*************
*/
Route::get('citizen', [CitizenController::class, 'index'])
    ->middleware('auth:api');
Route::get('citizen/{id}', [CitizenController::class, 'getById'])
    ->middleware('auth:api');
Route::post('citizen', [CitizenController::class, 'store'])
    ->middleware('auth:api');
Route::delete('citizen/{id}', action: [CitizenController::class, 'delete'])
    ->middleware('auth:api');
Route::put('citizen/{id}', [CitizenController::class, 'update'])
    ->middleware('auth:api');

    
/*
*************
*Complaint*
*************
*/
Route::get('complaint', [ComplaintController::class, 'index'])
    ->middleware('auth:api');
Route::get('complaint/{id}', [ComplaintController::class, 'getById'])
    ->middleware('auth:api');
Route::post('complaint', [ComplaintController::class, 'store'])
    ->middleware(middleware: 'auth:api');
Route::delete('complaint/{id}', action: [ComplaintController::class, 'delete'])
    ->middleware('auth:api');
Route::put('complaint/{id}', [ComplaintController::class, 'update'])
    ->middleware('auth:api');

        
/*
*************
*Employee*
*************
*/
Route::get('employee', [EmployeeController::class, 'index'])
    ->middleware('auth:api');
Route::get('employee/{id}', [EmployeeController::class, 'getById'])
    ->middleware('auth:api');
Route::post('employee', [EmployeeController::class, 'store'])
    ->middleware(middleware: 'auth:api');
Route::delete('employee/{id}', action: [EmployeeController::class, 'delete'])
    ->middleware('auth:api');
Route::put('employee/{id}', [EmployeeController::class, 'update'])
    ->middleware('auth:api');

        
/*
*************
*GovernmentEntity*
*************
*/
Route::get('governmentEntity', [GovernmentEntityController::class, 'index'])
    ->middleware('auth:api');
Route::get('governmentEntity/{id}', [GovernmentEntityController::class, 'getById'])
    ->middleware('auth:api');
Route::post('governmentEntity', [GovernmentEntityController::class, 'store'])
    ->middleware(middleware: 'auth:api');
Route::delete('governmentEntity/{id}', action: [GovernmentEntityController::class, 'delete'])
    ->middleware('auth:api');
Route::put('governmentEntity/{id}', [GovernmentEntityController::class, 'update'])
    ->middleware('auth:api');