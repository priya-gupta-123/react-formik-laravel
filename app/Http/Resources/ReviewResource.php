<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
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
            "restaurant_id" => $this->restaurant_id,
            "user" => $this->user,
            "rating" => $this->rating,
            "comment" => $this->comment,
            "reply" => new ReplyResource($this->reply),
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at,
        ];
    }
}
