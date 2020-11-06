<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthenticationController extends Controller
{
    static $redirection = [
        'owner' => '/',
        'admin' => '/',
        'regular' => '/',
    ];

    public function register(Request $request)
    {

        // validate the data
        $validated = $request->validate([
            'email' => 'required|email|unique:users',
            'password' => 'required|string|confirmed',
            'name' => "required|string",
            "role" => "nullable|string|in:owner,regular",
        ]);

        // hash the password
        $validated["password"] = Hash::make($validated["password"]);

        // create user
        $user = User::create($validated);

        // create token
        $user->token = $user->createToken('personal-token')->accessToken;

        // add redirection
        $user->redirection = self::$redirection[$user->role];

        return response()->json($user);
    }

    function login(Request $request) {

        // Validate the data
        $credentials = $request->validate([
            'email' => 'required|email|exists:users',
            'password' => 'required|string',
        ]);

        // Authenticate user
        if(!Auth::attempt($credentials)) {
            return response()->json([
                'message'=> 'Invalid credentials!',
                'errors'=> [
                    'password' => [
                        'The given password is incorrect!'
                    ]
                ]
                    ], 422);
        }

        // Get user
        $user = auth()->user();

        // create token
        $user->token = $user->createToken('personal-token')->accessToken;

        // add redirection
        $user->redirection = self::$redirection[$user->role];

        // Return the user
        return response()->json($user);

    }
}
