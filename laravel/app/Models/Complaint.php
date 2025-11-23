<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Complaint extends Model
{
    use HasFactory;

    protected $table = 'complaints';
    protected $primaryKey = 'complaints_id';

    protected $fillable = [
        'reference_number',
        'citizen_id',
        'entity_id',
        'complaint_type',
        'location',
        'description',
        'status',
        'completed_at',
        'locked',
        'locked_by_employee_id',
        'locked_at',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'status' => 'string',
        'locked' => 'boolean',
        'completed_at' => 'datetime',
        'locked_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function citizen(): BelongsTo
    {
        return $this->belongsTo(Citizen::class, 'citizen_id');
    }

    public function governmentEntity(): BelongsTo
    {
        return $this->belongsTo(GovernmentEntity::class, 'entity_id');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class, 'complaint_id');
    }

    public function informationRequests(): HasMany
    {
        return $this->hasMany(InformationRequest::class, 'complaint_id');
    }

    public function lockedByEmployee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'locked_by_employee_id');
    }
}