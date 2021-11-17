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

Route::get('configuracion', 'ConfiguracionController@index');

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
    Route::post('configuracion', 'ConfiguracionController@store');

    Route::resource('roles','RolesController');
    Route::get('roles/pag/{pag}','RolesController@index');
    Route::get('roles/filtrar/{buscado}/{pag}','RolesController@filter');
    Route::get('roles/get/all','RolesController@getAll');

    Route::resource('usuarios','UserController');
    Route::post('usuarios/subir/foto','UserController@storePhoto');
    Route::get('usuarios/pag/{pag}','UserController@index');
    Route::get('usuarios/pag/{pag}','UserController@index');
    Route::get('usuarios/filtrar/{buscado}/{pag}','UserController@filter');
    Route::get('usuarios/get/all','UserController@getAll');

    Route::resource('menus','MenusController');
    Route::get('menus/pag/{pag}','MenusController@index');
    Route::get('menus/filtrar/{buscado}/{pag}','MenusController@filter');
    Route::get('menus/get/all','MenusController@getAll');
    Route::get('menus/rol/{rolId}','MenusController@getMenus');

    Route::resource('pantallas','PantallasController');
    Route::get('pantallas/pag/{pag}','PantallasController@index');
    Route::get('pantallas/filtrar/{buscado}/{pag}','PantallasController@filter');
    Route::get('pantallas/get/all','PantallasController@getAll');

    //Route::resource('permisos','PermisosController');
    Route::post('permisos','PermisosController@save');
    Route::get('permisos/{id}','PermisosController@show');
    Route::post('permisos/url/{url}','PermisosController@getPermisos');
    Route::get('permisos/filtrar/{buscado}/{pag}','PermisosController@filter');
    Route::get('permisos/get/all','PermisosController@getAll');

    Route::resource('marcas', 'MarcasController');
    Route::get('marcas/pag/{pag}', 'MarcasController@index');
    Route::get('marcas/filtrar/{texto}{pag}', 'MarcasController@filter');
    Route::get('marcas/get/all', 'MarcasController@getAll');

    Route::resource('impuestos', 'ImpuestosController');
    Route::get('impuestos/pag/{pag}', 'ImpuestosController@index');
    Route::get('impuestos/get/all', 'ImpuestosController@getAll');
    Route::get('impuestos/filter/{texto}/{pag}', 'ImpuestosController@filter');

    Route::resource('categorias', 'CategoriasController');
    Route::get('categorias/pag/{pag}', 'CategoriasController@index');
    Route::get('categorias/get/all', 'CategoriasController@getAll');
    Route::get('categorias/filter/{texto}/{pag}', 'CategoriasController@filter');

    Route::resource('sub_categorias', 'SubCategoriasController');
    Route::get('sub_categorias/pag/{pag}', 'SubCategoriasController@index');
    Route::get('sub_categorias/get/all', 'SubCategoriasController@getAll');
    Route::get('sub_categorias/filter/{texto}/{pag}', 'SubCategoriasController@filter');

    Route::resource('unidades', 'UnidadesController');
    Route::get('unidades/pag/{pag}', 'UnidadesController@index');
    Route::get('unidades/get/all', 'UnidadesController@getAll');
    Route::get('unidades/filter/{texto}/{pag}', 'UnidadesController@filter');
});
