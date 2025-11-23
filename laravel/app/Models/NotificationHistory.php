<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NotificationHistory extends Model
{
    use HasFactory;

    protected $table = 'notification_history';
    protected $primaryKey = 'id';

    protected $fillable = [
        'citizen_id',
        'title',
        'message',
        'type',
        'related_complaint_id',
        'is_read',
        'created_at',
    ];

    protected $casts = [
        'type' => 'string',
        'is_read' => 'boolean',
        'created_at' => 'datetime',
    ];

    public function citizen(): BelongsTo
    {
        return $this->belongsTo(Citizen::class, 'citizen_id');
    }

    public function relatedComplaint(): BelongsTo
    {
        return $this->belongsTo(Complaint::class, 'related_complaint_id');
    }
}