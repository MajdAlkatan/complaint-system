<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GovernmentEntity extends Model
{
    use HasFactory;

    protected $table = 'government_entities';
    protected $primaryKey = 'government_entities_id';

    protected $fillable = [
        'name',
        'description',
        'contact_email',
        'contact_phone',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class, 'government_entity_id');
    }

    public function complaints(): HasMany
    {
        return $this->hasMany(Complaint::class, 'entity_id');
    }
}