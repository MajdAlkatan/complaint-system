<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;
use Illuminate\Support\Facades\Auth;

use App\Interfaces\IComplaintRepo;

class LogUserActivity
{

   private IComplaintRepo $complaintRepo;
    public function __construct(IComplaintRepo $complaintRepo1){
        $this->complaintRepo = $complaintRepo1;
    }
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);


        if( $request->route()->getName() == 'editComplaint'){
            $complaint = $this->complaintRepo->getById($request->id);

                activity('edit-complaint-status')
                ->causedBy(Auth::guard('employee')->user())
                ->withProperties([
                    'ip' => $request->ip(),
                    'method' => $request->method(),
                    'url' => $request->fullUrl(),
                    'complaint-id' => $complaint->complaints_id,
                    'new-status' => $complaint->status
                ])
                ->log('ُEmployee ' . Auth::guard('employee')->user()->email . ' editied a complaint'. $complaint->complaints_id);
        }else{

        if(Auth::guard('admin')->check()){
            activity($request->route()->getName())
                ->causedBy(Auth::guard('admin')->user())
                ->withProperties([
                    'ip' => $request->ip(),
                    'method' => $request->method(),
                    'url' => $request->fullUrl(),
                    'status' => $response->status()
                ])
                ->log('Admin ' . Auth::guard('admin')->user()->email . ' performed an action');
        }

        else if(Auth::guard('employee')->check()){
            activity($request->route()->getName())
                ->causedBy(Auth::guard('employee')->user())
                ->withProperties([
                    'ip' => $request->ip(),
                    'method' => $request->method(),
                    'url' => $request->fullUrl(),
                    'status' => $response->status()
                ])
                ->log('Employee ' . Auth::guard('employee')->user()->email . ' performed an action');
        }
        else if(Auth::guard('citizen')->check()){
            activity($request->route()->getName())
                ->causedBy(Auth::guard('citizen')->user())
                ->withProperties([
                    'ip' => $request->ip(),
                    'method' => $request->method(),
                    'url' => $request->fullUrl(),
                    'status' => $response->status()
                ])
                ->log('Citizen ' . Auth::guard('citizen')->user()->email . ' performed an action');
        }
    }

        return $response;
    }
}