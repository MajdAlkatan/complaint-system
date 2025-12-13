<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ComplaintType extends Model
{

    public $timestamps = false;
    protected $table = 'complaint_types';

    protected $fillable = [
        'type',
        'createdAt'
    ];

}
