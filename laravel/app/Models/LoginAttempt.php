<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoginAttempt extends Model
{
    use HasFactory;

    protected $table = 'login_attempts';
    protected $primaryKey = 'login_attempts_id';

    protected $fillable = [
        'citizen_id',
        'employee_id',
        'email',
        'ip_address',
        'success',
        'attempt_time',
    ];

    protected $casts = [
        'success' => 'boolean',
        'attempt_time' => 'datetime',
    ];

    public function citizen(): BelongsTo
    {
        return $this->belongsTo(Citizen::class, 'citizen_id');
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }
}