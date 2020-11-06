<?php

namespace App\Policies;

use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function view(User $authUser, User $user)
    {
        return $authUser->role === "admin" && $user->role !== 'admin';
    }

    public function edit(User $authUser, User $user)
    {
        return $authUser->role === "admin" && $user->role !== 'admin';
    }

    public function delete(User $authUser, User $user)
    {
        return $authUser->role === "admin" && $user->role !== 'admin';
    }
}
