<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\BriefRestaurantResource;
use App\Http\Resources\RestaurantResource;
use App\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RestaurantController extends Controller
{
    public function all(Request $request)
    {
        $restaurants = Restaurant::all();

        if ($request->has('min_avg_rating')) {
            $restaurants = $restaurants->where('average_rating', '>=', $request->min_avg_rating);
        }

        return response()->json([
            "message" => "Restaurant List!",
            "restaurants" => BriefRestaurantResource::collection($restaurants->sortByDesc('average_rating')),
        ]);
    }

    public function list(Request $request)
    {
        if (auth()->user()->role === 'owner') {
            $restaurants = auth()->user()->restaurants;
        } else {
            $restaurants = Restaurant::all();
        }

        if ($request->has('min_avg_rating')) {
            $restaurants = $restaurants->where('average_rating', '>=', $request->min_avg_rating);
        }

        return response()->json([
            "message" => "Restaurant List!",
            "restaurants" => BriefRestaurantResource::collection($restaurants->sortByDesc('average_rating')),
        ]);
    }

    public function show(Request $request, Restaurant $restaurant)
    {

        return response()->json([
            "message" => "Restaurant Detail!",
            "restaurant" => new RestaurantResource($restaurant),
        ]);
    }

    public function create(Request $request)
    {
        // validate
        $validated = $request->validate([
            "name" => "string|required",
            "image" => "string|nullable",
            "address" => "string|nullable",
        ]);

        // create
        $restaurant = new Restaurant($validated);

        $request->user()->restaurants()->save($restaurant);

        return response()->json([
            "message" => "Restaurant Created!",
            "restaurant" => $restaurant
        ]);
    }

    public function update(Request $request, Restaurant $restaurant)
    {
        // validate
        $validated = $request->validate([
            "name" => "string|required",
            "image" => "string|nullable",
            "address" => "string|nullable",
        ]);

        $restaurant->update($validated);

        return response()->json([
            "message" => "Restaurant Updated!",
            "restaurant" => $restaurant
        ]);
    }

    public function delete(Request $request, Restaurant $restaurant)
    {

        $restaurant->delete();

        return response()->json([
            "message" => "Restaurant Deleted!",
            "restaurant" => new RestaurantResource($restaurant),
        ]);
    }
}
