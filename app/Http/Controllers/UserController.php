<?php

namespace App\Http\Controllers;

use App\Http\Resources\OwnerUserDetailResource;
use App\Http\Resources\OwnerUserListResource;
use App\Http\Resources\RegularUserListResource;
use App\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function regular()
    {
        $users = User::whereRole('regular')->get();
        return response()->json([
            "message" => "User List!",
            "users" => RegularUserListResource::collection($users)
        ]);
    }

    public function owner()
    {
        $users = User::whereRole('owner')->get();
        return response()->json([
            "message" => "User List!",
            "users" => OwnerUserListResource::collection($users),
        ]);
    }

    public function show(User $user)
    {
        return response()->json([
            "message" => "User Detail!",
            "user" => $user->role === "owner" ? new OwnerUserDetailResource($user) : $user,
        ]);
    }

    public function edit(Request $request, User $user)
    {
        $validated = $request->validate([
            'email' => "required|email",
            "name" => "required|string",
        ]);

        if ($validated['email'] !== $user->email && User::whereEmail($validated['email'])->exists()) {
            return response()->json([
                "message" => "The given data was invalid.",
                "errors" => [
                    "email" => [
                        "The email has already been taken"
                    ]
                ]
            ], 422);
        }

        $user->update($validated);

        return response()->json([
            "message" => "User Updated!",
            "user" => $user
        ]);
    }

    public function delete(User $user)
    {
        // $user->delete();
        return response()->json([
            "message" => "User Deleted!",
            "user" => $user
        ]);
    }
}
