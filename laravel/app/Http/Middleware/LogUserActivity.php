<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;
use Illuminate\Support\Facades\Auth;

class LogUserActivity
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        if(Auth::guard('admin')->check()){
            activity('user-actions')
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
            activity('user-actions')
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
            activity('user-actions')
                ->causedBy(Auth::guard('citizen')->user())
                ->withProperties([
                    'ip' => $request->ip(),
                    'method' => $request->method(),
                    'url' => $request->fullUrl(),
                    'status' => $response->status()
                ])
                ->log('Citizen ' . Auth::guard('citizen')->user()->email . ' performed an action');
        }

        return $response;
    }
}