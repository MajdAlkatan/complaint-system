<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CitizenController;
use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\GovernmentEntityController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\AttachmentController;

Route::options('{any}', function() {
    return response()->json([], 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
})->where('any', '.*');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('admins/register', [AdminController::class, 'register'])
    ->middleware('LogUserActivity');

Route::post('admins/login', [AdminController::class, 'login'])
    ->middleware('LogUserActivity');


Route::post('employees/add', [EmployeeController::class, 'store'])
    ->middleware(['LogUserActivity', 'admin']);



Route::post('admins/login', [AdminController::class, 'login'])
    ->middleware('LogUserActivity');

Route::post('admins/refresh', [AdminController::class, 'refresh']);
Route::get('admins/CheckUser', [AdminController::class, 'CheckUser'])
    ->middleware('admin');

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
Route::get('attachments', [AttachmentController::class, 'index']);
//->middleware('auth:api');
Route::get('attachments/{id}', [AttachmentController::class, 'getById']);
//->middleware('auth:api');
Route::post('attachments', [AttachmentController::class, 'store']);
//->middleware('auth:api');
Route::get('attachments/byComplaint/{id}', [AttachmentController::class, 'GetByComplaintId']);

Route::delete('attachments/{id}', [AttachmentController::class, 'delete'])
    ->middleware('auth:api');
Route::put('attachments/{id}', [AttachmentController::class, 'update'])
    ->middleware('auth:api');


/*
*************
*Citizen*
*************
*/
Route::get('citizen', [CitizenController::class, 'index'])
    ;//->middleware('auth:api');
Route::get('citizen/CheckUser', [CitizenController::class,'CheckUser'])
    ->middleware('citizen');
Route::get('citizen/{id}', [CitizenController::class, 'getById'])
    ;//->middleware('auth:api');
Route::post('citizen', [CitizenController::class, 'store']);
//->middleware('auth:api');
Route::post('citizens/refresh', [CitizenController::class, 'refresh']);
//->middleware('auth:api');
Route::delete('citizen/{id}', action: [CitizenController::class, 'delete'])
    ->middleware('auth:api');
Route::put('citizen/{id}/lock', [CitizenController::class, 'lock'])
    ;//->middleware('auth:api');
Route::put('citizen/{id}', [CitizenController::class, 'update'])
    ;//->middleware('auth:api');


/*
*************
*Complaint*
*************
*/
Route::get('complaints', [ComplaintController::class, 'index'])
    ->middleware('employee');
Route::get('complaints/{id}/history', [ComplaintController::class, 'getComplaintHistory'])
    ;//->middleware('employee');
Route::get('complaints/Mycomplaints', [ComplaintController::class, 'getMyComplaints'])
    ->middleware('citizen');
Route::get('complaints/Mycomplaints/{id}', [ComplaintController::class, 'getMyComplaintById'])
    ->middleware('citizen');
Route::get('complaints/{id}', [ComplaintController::class, 'getById'])
    ;//->middleware('employee');
Route::get('complaints/byRef/{num}', [ComplaintController::class, 'getByReferenceNumber'])
    ->middleware('employee');
Route::post('complaints', [ComplaintController::class, 'store'])
    ->middleware(middleware: 'citizen');
Route::post('complaints/addType', [ComplaintController::class, 'storeType'])
    ->middleware(middleware: 'admin');

Route::get('Alltypes', [ComplaintController::class, 'getAllTypes']);

Route::delete('/complaint-types/{id}', [ComplaintController::class, 'deleteType']);



    
Route::delete('complaints/Types/{id}', action: [ComplaintController::class, 'deleteType'])
    ;//->middleware('auth:api');
Route::delete('complaints/{id}', action: [ComplaintController::class, 'delete'])
    ->middleware('citizen');
Route::put('complaints/Mycomplaints/{id}', [ComplaintController::class, 'updateMyComplaint'])
    ->middleware('citizen')->name('editMyComplaint');
Route::put('complaints/lock/{id}', [ComplaintController::class, 'lock'])
    ->middleware('employee');
Route::put('complaints/unLock/{id}', [ComplaintController::class, 'unLock'])
    ->middleware('employee');
Route::put('complaints/requestNotes/{id}', [ComplaintController::class, 'requestNotes'])
    ->middleware('employee');
Route::put('complaints/AddNotes/{id}', [ComplaintController::class, 'addNotesForMyComplaint'])
    ->middleware('citizen');
Route::put('complaints/{id}', [ComplaintController::class, 'update'])
    ->middleware('employee')->name('editComplaint');




/*
*************
*Employee*
*************
*/
Route::get('employees', [EmployeeController::class, 'index'])
    ->middleware('admin');
Route::get('employees/CheckUser', [EmployeeController::class, 'CheckUser'])
    ->middleware('employee');
Route::get('employees/{id}', [EmployeeController::class, 'getById'])
    ->middleware('admin');
//Route::post('employees', [EmployeeController::class, 'store'])
//  ->middleware(middleware: 'admin');
Route::post('employees/login', [EmployeeController::class, 'login']);
Route::post('employees/refresh', [EmployeeController::class, 'refresh']);
Route::delete('employees/{id}', action: [EmployeeController::class, 'delete'])
    ->middleware('admin');
Route::post('employees/{id}/edit', [EmployeeController::class, 'update'])
    ->middleware(['LogUserActivity', 'admin']);

/*
*************
*GovernmentEntity*
*************
*/
Route::get('governmentEntites', [GovernmentEntityController::class, 'index'])
    ->middleware('admin');
Route::get('governmentEntites/{id}', [GovernmentEntityController::class, 'getById'])
    ->middleware('admin');
Route::post('governmentEntites', [GovernmentEntityController::class, 'store'])
    ->middleware(middleware: [/*'auth:api' ,*/'admin']);
Route::delete('governmentEntites/{id}', action: [GovernmentEntityController::class, 'delete'])
    ->middleware('admin');
Route::put('governmentEntites/{id}', [GovernmentEntityController::class, 'update'])
    ->middleware('admin');
Route::get('governmentEntites', [GovernmentEntityController::class, 'index'])
    ->middleware('citizen');
