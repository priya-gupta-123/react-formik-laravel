<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    protected $fillable = [
        'name',
        'user_id',
        'image',
        'address',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function getPendingReviewsAttribute()
    {
        return $this->reviews()->has('reply', '0')->count();
    }

    public function getAverageRatingAttribute()
    {
        return number_format((float) $this->reviews->average('rating'), 1);
    }
}
