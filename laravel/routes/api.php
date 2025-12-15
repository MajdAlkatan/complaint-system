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


Route::post('employees/add', [EmployeeController::class, 'store'])
->middleware(['LogUserActivity' , 'admin' ]);



Route::post('admins/login', [AdminController::class, 'login'])
->middleware('LogUserActivity');

Route::post('admins/refresh', [AdminController::class, 'refresh']);


Route::post('citizens/register', [CitizenController::class, 'register'])
->middleware('LogUserActivity');

Route::post('activities', [ActivityController::class, 'index'])
->middleware('LogUserActivity');


Route::post('citizens/login', [CitizenController::class, 'login'])
    ->middleware(['throttle:login', 'LogUserActivity']);

Route::post('logout', [AuthController::class, 'logout']);
Route::post('login', [AuthController::class, 'login']);

Route::post('refresh', [AuthController::class, 'refresh']);

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
Route::get('complaints', [ComplaintController::class, 'index'])
    ->middleware('employee');
Route::get('complaints/Mycomplaints', [ComplaintController::class, 'getMyComplaints'])
    ->middleware('citizen');
Route::get('complaints/Mycomplaints/{id}', [ComplaintController::class, 'getMyComplaintById'])
    ->middleware('citizen');
Route::get('complaints/{id}', [ComplaintController::class, 'getById'])
    ->middleware('employee');
Route::get('complaints/byRef/{num}', [ComplaintController::class, 'getByReferenceNumber'])
    ->middleware('employee');
Route::post('complaints', [ComplaintController::class, 'store'])
    ->middleware(middleware: 'citizen');
Route::post('complaints/addType', [ComplaintController::class, 'storeType'])
    ->middleware(middleware: 'admin');
Route::delete('complaints/{id}', action: [ComplaintController::class, 'delete'])
    ->middleware('citizen');
Route::put('complaints/Mycomplaints/{id}', [ComplaintController::class, 'updateMyComplaint'])
    ->middleware('citizen');
Route::put('complaints/{id}', [ComplaintController::class, 'update'])
    ->middleware('employee');



        
/*
*************
*Employee*
*************
*/
Route::get('employees', [EmployeeController::class, 'index'])
    ->middleware('auth:api');
Route::get('employees/{id}', [EmployeeController::class, 'getById'])
    ->middleware('auth:api');
Route::post('employees', [EmployeeController::class, 'store'])
    ->middleware(middleware: 'auth:api');
Route::post('employees/login', [EmployeeController::class, 'login']);
Route::post('employees/refresh', [EmployeeController::class, 'refresh']);
Route::delete('employees/{id}', action: [EmployeeController::class, 'delete'])
    ->middleware('auth:api');
Route::post('employees/{id}/edit', [EmployeeController::class, 'update'])
->middleware(['LogUserActivity' , 'admin' ]);
        
/*
*************
*GovernmentEntity*
*************
*/
Route::get('governmentEntites', [GovernmentEntityController::class, 'index'])
    ->middleware('auth:api');
Route::get('governmentEntites/{id}', [GovernmentEntityController::class, 'getById'])
    ->middleware('auth:api');
Route::post('governmentEntites', [GovernmentEntityController::class, 'store'])
    ->middleware(middleware: [/*'auth:api' ,*/ 'admin']);
Route::delete('governmentEntites/{id}', action: [GovernmentEntityController::class, 'delete'])
    ->middleware('auth:api');
Route::put('governmentEntites/{id}', [GovernmentEntityController::class, 'update'])
    ->middleware('auth:api');