<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::prefix('auth')->group(function () {
    Route::post('register', 'AuthenticationController@register');
    Route::post('login', 'AuthenticationController@login');
});

// restaurant routes
Route::get('restaurant/all', 'RestaurantController@all'); // list all or mine
Route::get('restaurant/{restaurant}', 'RestaurantController@show'); // show 1 with details

Route::middleware('auth:api')->group(function () {
    // user routes
    Route::get('user/regular', 'UserController@regular');
    Route::get('user/owner', 'UserController@owner');
    Route::get('user/{user}', 'UserController@show')->middleware('can:view,user');
    Route::post('user/{user}', 'UserController@edit')->middleware('can:edit,user');
    Route::delete('user/{user}', 'UserController@delete')->middleware('can:delete,user');

    // restaurant routes
    Route::get('restaurant', 'RestaurantController@list'); // list all or mine
    Route::post('restaurant', 'RestaurantController@create')->middleware('can:create,App\Restaurant'); // create a new
    Route::post('restaurant/{restaurant}', 'RestaurantController@update')->middleware('can:update,restaurant'); // update an existing
    Route::delete('restaurant/{restaurant}', 'RestaurantController@delete')->middleware('can:delete,restaurant'); // delete an existing

    // review routes
    Route::post('restaurant/{restaurant}/review', 'ReviewController@create')->middleware('can:create,App\Review');
    Route::post('review/{review}', 'ReviewController@update')->middleware('can:update,review');
    Route::delete('review/{review}', 'ReviewController@delete')->middleware('can:delete,review');

    // reply routes
    Route::post('review/{review}/reply', 'ReplyController@create')->middleware('can:create,App\Reply');
    Route::post('reply/{reply}', 'ReplyController@update')->middleware('can:update,reply');
    Route::delete('reply/{reply}', 'ReplyController@delete')->middleware('can:delete,reply');
});
