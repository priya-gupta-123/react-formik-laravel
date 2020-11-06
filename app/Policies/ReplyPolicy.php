<?php

namespace App\Policies;

use App\Reply;
use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ReplyPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        $review = request()->route()->parameter("review");
        return $review->restaurant->user_id === $user->id;
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\User  $user
     * @param  \App\Reply  $reply
     * @return mixed
     */
    public function update(User $user, Reply $reply)
    {
        switch ($user->role) {
            case 'owner':
                return $user->id === $reply->user_id;
            case 'admin':
                return true;
            case 'regular':
                return false;
        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\User  $user
     * @param  \App\Reply  $reply
     * @return mixed
     */
    public function delete(User $user, Reply $reply)
    {
        switch ($user->role) {
            case 'owner':
                return $user->id === $reply->user_id;
            case 'admin':
                return true;
            case 'regular':
                return false;
        }
    }
}
