<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Employee extends Authenticatable  implements JWTSubject
{
    use HasFactory;

    protected $table = 'employees';
    protected $primaryKey = 'employee_id';

    protected $fillable = [
        'email',
        'password_hash',
        'username',
        'is_verified',
        'government_entity_id',
        'failed_login_attempts',
        'locked_until',
        'position',
        'created_by',
        'can_add_notes_on_complaints',
        'can_request_more_info_on_complaints',
        'can_change_complaints_status',
        'can_view_reports',
        'can_export_data',
        'permissions_updated_by',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'locked_until' => 'datetime',
        'can_add_notes_on_complaints' => 'boolean',
        'can_request_more_info_on_complaints' => 'boolean',
        'can_change_complaints_status' => 'boolean',
        'can_view_reports' => 'boolean',
        'can_export_data' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $hidden = [
        'password_hash',
    ];

    public function governmentEntity(): BelongsTo
    {
        return $this->belongsTo(GovernmentEntity::class, 'government_entity_id');
    }

    public function createdByAdmin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function permissionsUpdatedByAdmin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'permissions_updated_by');
    }

    public function lockedComplaints(): HasMany
    {
        return $this->hasMany(Complaint::class, 'locked_by_employee_id');
    }

    public function informationRequests(): HasMany
    {
        return $this->hasMany(InformationRequest::class, 'requested_by');
    }

    public function loginAttempts(): HasMany
    {
        return $this->hasMany(LoginAttempt::class, 'employee_id');
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

