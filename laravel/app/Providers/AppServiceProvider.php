<?php

namespace App\Providers;

use App\Interfaces\IComplaintTypeRepo;
use App\Repositories\ComplaintTypeRepo;
use Illuminate\Support\ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use App\Interfaces\IAttachmentRepo;
use App\Repositories\AttachmentRepo;

use App\Interfaces\ICitizenRepo;
use App\Repositories\CitizenRepo;

use App\Interfaces\IComplaintRepo;
use App\Repositories\ComplaintRepo;

use App\Interfaces\IEmployeeRepo;
use App\Repositories\EmployeeRepo;

use App\Interfaces\IGovernmentEntityRepo;
use App\Repositories\GovernmentEntityRepo;

use App\Interfaces\IInformationRequestRepo;
use App\Repositories\InformationRequestRepo;

use App\Interfaces\ILoginAttemptRepo;
use App\Repositories\LoginAttemptRepo;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(IAttachmentRepo::class, AttachmentRepo::class);
        $this->app->bind(ICitizenRepo::class, CitizenRepo::class);
        $this->app->bind(IComplaintRepo::class, ComplaintRepo::class);
        $this->app->bind(IComplaintTypeRepo::class, ComplaintTypeRepo::class);
        $this->app->bind(IEmployeeRepo::class, EmployeeRepo::class);
        $this->app->bind(IGovernmentEntityRepo::class, GovernmentEntityRepo::class);
        $this->app->bind(IInformationRequestRepo::class, InformationRequestRepo::class);
        $this->app->bind(ILoginAttemptRepo::class, LoginAttemptRepo::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    { 
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(3)->by($request->input('email'));
        });
    }
}
