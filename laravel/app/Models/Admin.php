<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Admin extends Model
{
    use HasFactory;

    protected $table = 'admins';
    protected $primaryKey = 'admin_id';

    protected $fillable = [
        'email',
        'password_hash',
        'failed_login_attempts',
        'locked_until',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'locked_until' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $hidden = [
        'password_hash',
    ];

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class, 'created_by');
    }

    public function adminTracking(): HasMany
    {
        return $this->hasMany(AdminTracking::class, 'admin_id');
    }
}