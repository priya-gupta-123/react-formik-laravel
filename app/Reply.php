<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Reply extends Model
{
    protected $fillable = [
        'review_id',
        'user_id',
        'comment',
    ];

    public function user() {
        $this->belongsTo(User::class);
    }
}
