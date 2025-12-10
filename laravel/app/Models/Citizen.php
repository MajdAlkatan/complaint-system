<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Citizen extends Authenticatable  implements JWTSubject
{
    use HasFactory;

    protected $table = 'citizens';
    protected $primaryKey = 'citizen_id';

    protected $fillable = [
        'email',
        'phone',
        'password_hash',
        'full_name',
        'is_verified',
        'failed_login_attempts',
        'locked_until',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'locked_until' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $hidden = [
        'password_hash',
    ];

    public function complaints(): HasMany
    {
        return $this->hasMany(Complaint::class, 'citizen_id');
    }

    public function notificationHistory(): HasMany
    {
        return $this->hasMany(NotificationHistory::class, 'citizen_id');
    }

    public function loginAttempts(): HasMany
    {
        return $this->hasMany(LoginAttempt::class, 'citizen_id');
    }



    

    public function getAuthPassword(){
        return $this->password_hash;
    }
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}