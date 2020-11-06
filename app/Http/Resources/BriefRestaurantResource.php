<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class BriefRestaurantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            "id" => $this->id,
            "name" => $this->name,
            "owner" => $this->owner->name,
            "image" => $this->image,
            "address" => $this->address,
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
            "max_rating" => $this->reviews()->max('rating'),
            "min_rating" => $this->reviews()->min('rating'),
            "average_rating" => number_format((float) $this->reviews()->average('rating'), 1),
            "pending_reviews" => $this->pending_reviews,
        ];
    }
}
