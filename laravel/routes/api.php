<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\BackupController;
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
/*
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');*/


Route::get('/v1/who-am-i', function () {
    return response()->json([
        'instance_port' => $_SERVER['SERVER_PORT'],
        'time' => now()->toDateTimeString(),
        'message' => 'هذا الطلب تمت معالجته بواسطة النسخة التي تعمل على منفذ: ' . $_SERVER['SERVER_PORT']
    ]);
});

Route::post('admins/register', [AdminController::class, 'register'])
    ->middleware('LogUserActivity')->name('register admin');

Route::post('admins/login', [AdminController::class, 'login'])
    ->middleware('LogUserActivity')->name('login admin');


Route::post('employees/add', [EmployeeController::class, 'store'])
    ->middleware(['LogUserActivity', 'admin'])->name('add employee');



Route::post('admins/login', [AdminController::class, 'login'])
    ->middleware('LogUserActivity')->name('login admin');

Route::post('admins/refresh', [AdminController::class, 'refresh'])->name('refresh token admin');
Route::get('admins/CheckUser', [AdminController::class, 'CheckUser'])
    ->middleware('admin')->name('check auth admin');

Route::post('citizens/register', [CitizenController::class, 'register'])
    ->middleware('LogUserActivity')->name('register citizen account');

Route::post('activities', [ActivityController::class, 'index'])
    ->middleware('LogUserActivity')->name('get all activity');


Route::post('citizens/login', [CitizenController::class, 'login'])
    ->middleware(['throttle:login', 'LogUserActivity'])->name('citizen login');

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
Route::get('attachments', [AttachmentController::class, 'index'])->name('get all attachments');
//->middleware('auth:api');
Route::get('attachments/{id}', [AttachmentController::class, 'getById'])->name('get attachment');
//->middleware('auth:api');
Route::post('attachments', [AttachmentController::class, 'store'])->name('store attachment');
//->middleware('auth:api');
Route::get('attachments/byComplaint/{id}', [AttachmentController::class, 'GetByComplaintId'])->name('get attachment by complaint id');

//Route::delete('attachments/{id}', [AttachmentController::class, 'delete'])
  //  ->middleware('auth:api');
//Route::put('attachments/{id}', [AttachmentController::class, 'update'])
 //   ->middleware('auth:api');


/*
*************
*Citizen*
*************
*/
Route::get('citizen', [CitizenController::class, 'index'])
    ->name('get all citizen');//->middleware('auth:api');
Route::get('citizen/CheckUser', [CitizenController::class,'CheckUser'])
    ->middleware('citizen');
Route::get('citizen/{id}', [CitizenController::class, 'getById'])
    ->name('get citizen account');//->middleware('auth:api');
//Route::post('citizen', [CitizenController::class, 'store']);
//->middleware('auth:api');
Route::post('citizens/refresh', [CitizenController::class, 'refresh'])->name('refresh tokent citizen');
//->middleware('auth:api');
Route::delete('citizen/{id}', action: [CitizenController::class, 'delete'])
    ->middleware('employee')->name('delete citiizen account');
Route::put('citizen/{id}/lock', [CitizenController::class, 'lock'])
    ->middleware('employee')->name('lock citizen account');
Route::put('citizen/{id}/unlock', [CitizenController::class, 'unlock'])
    ->middleware('employee')->name('unlock citizen account');
Route::put('citizen/{id}', [CitizenController::class, 'update'])
    ;//->middleware('auth:api');


/*
*************
*Complaint*
*************
*/
Route::get('analytics', [ComplaintController::class, 'getOverview'])->name('get analystics');
Route::get('complaints', [ComplaintController::class, 'index'])
    ->middleware('employee')->name('get all complaints');
Route::get('complaints/{id}/history', [ComplaintController::class, 'getComplaintHistory'])
    ->name('get complaint history');//->middleware('employee');
Route::get('complaints/Mycomplaints', [ComplaintController::class, 'getMyComplaints'])
    ->middleware('citizen')->name('get my complaints');
Route::get('complaints/Mycomplaints/{id}', [ComplaintController::class, 'getMyComplaintById'])
    ->middleware('citizen')->name('get my complaint');
Route::get('complaints/{id}', [ComplaintController::class, 'getById'])
    ->middleware('employee')->name('get complaint');
Route::get('complaints/byRef/{num}', [ComplaintController::class, 'getByReferenceNumber'])
    ->middleware('employee')->name('get complaint by ref');
Route::post('complaints', [ComplaintController::class, 'store'])
    ->middleware(middleware: 'citizen')->name('add complaint');
Route::post('complaints/addType', [ComplaintController::class, 'storeType'])
    ->middleware(middleware: 'admin')->name('storeType');

Route::get('Alltypes', [ComplaintController::class, 'getAllTypes'])->name('getAllTypes');

Route::delete('/complaint-types/{id}', [ComplaintController::class, 'deleteType']);



    
Route::delete('complaints/Types/{id}', action: [ComplaintController::class, 'deleteType'])
    ->middleware('admin')->name('delete complaint type');
Route::delete('complaints/{id}', action: [ComplaintController::class, 'delete'])
    ->middleware('citizen')->name('delete complaint');
Route::put('complaints/Mycomplaints/{id}', [ComplaintController::class, 'updateMyComplaint'])
    ->middleware('citizen')->name('editMyComplaint');
Route::put('complaints/lock/{id}', [ComplaintController::class, 'lock'])
    ->middleware('employee')->name('lock complaint');
Route::put('complaints/unLock/{id}', [ComplaintController::class, 'unLock'])
    ->middleware('employee')->name('unlock complaint');
Route::put('complaints/requestNotes/{id}', [ComplaintController::class, 'requestNotes'])
    ->middleware('employee')->name('request notes for complaint');
Route::put('complaints/AddNotes/{id}', [ComplaintController::class, 'addNotesForMyComplaint'])
    ->middleware('citizen')->name('AddnotesToComplaint');
Route::put('complaints/{id}', [ComplaintController::class, 'update'])
    ->middleware('employee')->name('editComplaint');
Route::put('complaints/{id}/editPriority', [ComplaintController::class, 'editPriority'])
    ->middleware('employee')->name('editComplaintPriotiry');




/*
*************
*Employee*
*************
*/
Route::get('employees', [EmployeeController::class, 'index'])
    ->middleware('admin')->name('get all employees');
Route::get('employees/CheckUser', [EmployeeController::class, 'CheckUser'])
    ->middleware('employee')->name('check auth emp');
Route::get('employees/{id}', [EmployeeController::class, 'getById'])
    ->middleware('admin')->name('get emp info');
//Route::post('employees', [EmployeeController::class, 'store'])
//  ->middleware(middleware: 'admin');
Route::post('employees/login', [EmployeeController::class, 'login'])->name('login emp');
Route::post('employees/refresh', [EmployeeController::class, 'refresh'])->name('refresh token emp');
Route::delete('employees/{id}', action: [EmployeeController::class, 'delete'])
    ->middleware('admin')->name('delete emp');
Route::post('employees/{id}/edit', [EmployeeController::class, 'update'])
    ->middleware(['LogUserActivity', 'admin'])->name('edit emp info');

/*
*************
*GovernmentEntity*
*************
*/
Route::get('governmentEntites', [GovernmentEntityController::class, 'index'])
    /*->middleware('admin')*/->name('get all government entitiies');
Route::get('governmentEntites/{id}', [GovernmentEntityController::class, 'getById'])
    ->middleware('admin')->name('get government entity');
Route::post('governmentEntites', [GovernmentEntityController::class, 'store'])
    ->middleware(middleware: [/*'auth:api' ,*/'admin'])->name('store government entitiy');
Route::delete('governmentEntites/{id}', action: [GovernmentEntityController::class, 'delete'])
    ->middleware('admin')->name('delete government entiity');
Route::put('governmentEntites/{id}', [GovernmentEntityController::class, 'update'])
    ->middleware('admin')->name('edit government entity');
Route::get('governmentEntites', [GovernmentEntityController::class, 'index'])
    ;//->middleware('citizen');



Route::get('/backup/details', [BackupController::class, 'index']);
Route::post('/backup/run', [BackupController::class, 'run']);
Route::get('/backup/download/{fileName}', [BackupController::class, 'download']);
Route::post('/backup/restore', [BackupController::class, 'restore']);
