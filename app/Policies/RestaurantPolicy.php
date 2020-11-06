<?php

namespace App\Policies;

use App\Restaurant;
use App\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class RestaurantPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function viewAny(User $user)
    {
        return $user->role !== 'owner';
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\User  $user
     * @param  \App\Restaurant  $restaurant
     * @return mixed
     */
    public function view(User $user, Restaurant $restaurant)
    {
        switch($user->role) {
            case "owner":
                return $user->id === $restaurant->user_id;
            case "admin":
            case "regular":
                return true;
        }
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->role === 'owner';
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\User  $user
     * @param  \App\Restaurant  $restaurant
     * @return mixed
     */
    public function update(User $user, Restaurant $restaurant)
    {
        switch($user->role) {
            case "owner":
                return $user->id === $restaurant->user_id;
            case "admin":
                return true;
            case "regular":
                return false;
        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\User  $user
     * @param  \App\Restaurant  $restaurant
     * @return mixed
     */
    public function delete(User $user, Restaurant $restaurant)
    {
        switch($user->role) {
            case "owner":
                return $user->id === $restaurant->user_id;
            case "admin":
                return true;
            case "regular":
                return false;
        }
    }
}
