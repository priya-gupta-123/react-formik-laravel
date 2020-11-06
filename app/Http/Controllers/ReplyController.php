<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Reply;
use App\Review;

class ReplyController extends Controller
{
    public function create(Request $request, Review $review)
    {
        // validated
        $validated = $request->validate([
            'comment' => 'required|string',
        ]);

        $user_id = auth()->user()->id;

        // TODO: Add check for only one reply

        $validated['user_id'] = $user_id;

        // create
        $reply = new Reply($validated);

        $review->reply()->save($reply);

        return response()->json([
            "message" => "Reply added!",
            "reply" => $reply,
        ]);
    }

    public function update(Request $request, Reply $reply)
    {
        // validated
        $validated = $request->validate([
            'comment' => 'required|string',
        ]);

        $user_id = auth()->user()->id;

        $reply->update($validated);

        return response()->json([
            "message" => "Reply updated!",
            "reply" => $reply,
        ]);
    }

    public function delete(Request $request, Reply $reply)
    {

        $reply->delete();

        return response()->json([
            "message" => "Reply deleted!",
            "reply" => $reply,
        ]);
    }
}
