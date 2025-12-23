<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->api(prepend: [
             \App\Http\Middleware\LogUserActivity::class,
        ]);

        // تسجيل الـ Middleware كـ Route Middleware
        $middleware->alias([
            'LogUserActivity' => \App\Http\Middleware\LogUserActivity::class,
            'admin' => \App\Http\Middleware\CheckAdmin::class,
            'employee' => \App\Http\Middleware\checkEmployee::class,
            'citizen' => \App\Http\Middleware\checkCitizen::class,
        ]);        
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
