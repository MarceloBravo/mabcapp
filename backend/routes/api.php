<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group([
    'prefix' => 'auth',

], function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::post('me', [AuthController::class, 'me']);
});

Route::group([
    'middleware' => ['jwt.verify']
], function(){
    Route::resource('roles','RolesController');
    Route::get('roles/pag/{pag}','RolesController@index');
    Route::get('roles/filtrar/{buscado}/{pag}','RolesController@filter');
    Route::get('roles/get/all','RolesController@getAll');

    Route::resource('usuarios','UserController');
    Route::get('usuarios/pag/{pag}','UserController@index');
    Route::get('usuarios/filtrar/{buscado}/{pag}','UserController@filter');
    Route::get('usuarios/get/all','UserController@getAll');

    Route::resource('menus','MenusController');
    Route::get('menus/pag/{pag}','MenusController@index');
    Route::get('menus/filtrar/{buscado}/{pag}','MenusController@filter');
    Route::get('menus/get/all','MenusController@getAll');

    Route::resource('pantallas','PantallasController');
    Route::get('pantallas/pag/{pag}','PantallasController@index');
    Route::get('pantallas/filtrar/{buscado}/{pag}','PantallasController@filter');
    Route::get('pantallas/get/all','PantallasController@getAll');
});
