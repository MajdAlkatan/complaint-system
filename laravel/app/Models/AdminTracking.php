<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdminTracking extends Model
{
    use HasFactory;

    protected $table = 'admin_tracking';
    protected $primaryKey = 'id';

    protected $fillable = [
        'admin_id',
        'action',
        'employee_id',
        'complaint_id',
        'citizen_id',
        'report_id',
        'timestamp',
    ];

    protected $casts = [
        'action' => 'string',
        'timestamp' => 'datetime',
    ];

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'admin_id');
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }

    public function complaint(): BelongsTo
    {
        return $this->belongsTo(Complaint::class, 'complaint_id');
    }

    public function citizen(): BelongsTo
    {
        return $this->belongsTo(Citizen::class, 'citizen_id');
    }
}