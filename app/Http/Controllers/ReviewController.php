<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Restaurant;
use App\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function create(Request $request, Restaurant $restaurant)
    {
        // validate
        $validated = $request->validate([
            "rating" => "required|numeric|min:1|max:5",
            "comment" => "required|string",
        ]);

        $validated['user_id'] = auth()->user()->id;

        // create
        $review = new Review($validated);

        $restaurant->reviews()->save($review);

        return response()->json([
            "message" => "Review completed!",
            "review" => new ReviewResource($review),
        ]);
    }

    public function update(Request $request, Review $review)
    {
        // validate
        $validated = $request->validate([
            "rating" => "nullable|numeric|min:1|max:5",
            "comment" => "nullable|string",
        ]);

        // update
        $review->update($validated);

        return response()->json([
            "message" => "Review updated!",
            "review" => new ReviewResource($review),
        ]);
    }

    public function delete(Request $request, Review $review)
    {

        // delete
        $review->delete();

        return response()->json([
            "message" => "Review deleted!",
            "review" => new ReviewResource($review),
        ]);
    }
}
