<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuthClientController;

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

Route::middleware('auth:clientes')->get('/cliente', function (Request $request) {
    return $request->cliente();
});

Route::get('configuracion', 'ConfiguracionController@index');

//Route::group(['prefix' => 'api'], function () { Route::get('sendmail', 'MailController@sendmail'); });
//Read more: https://rabineupane.com.np/how-to-send-mail-in-laravel-6-api-with-gmail/#ixzz7GdgabxNX

//Route::get('clientes/login', 'AuthClientController@login');

Route::group([
    'prefix' => 'auth',

], function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::post('me', [AuthController::class, 'me']);

    Route::post('clientes_login', [AuthClientController::class, 'login']);
    Route::post('clientes_logout', [AuthClientController::class, 'logout']);
    Route::post('clientes_refresh', [AuthClientController::class, 'refresh']);
    Route::post('clientes_me', [AuthClientController::class, 'me']);

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
    Route::post('marcas/subir/imagen', 'MarcasController@uploadImage');

    Route::resource('impuestos', 'ImpuestosController');
    Route::get('impuestos/pag/{pag}', 'ImpuestosController@index');
    Route::get('impuestos/get/all', 'ImpuestosController@getAll');
    Route::get('impuestos/filter/{texto}/{pag}', 'ImpuestosController@filter');

    Route::resource('categorias', 'CategoriasController');
    Route::get('categorias/pag/{pag}', 'CategoriasController@index');
    Route::get('categorias/filter/{texto}/{pag}', 'CategoriasController@filter');
    Route::post('categorias/subir/imagen', 'CategoriasController@uploadImage');

    Route::resource('sub_categorias', 'SubCategoriasController');
    Route::get('sub_categorias/pag/{pag}', 'SubCategoriasController@index');
    Route::get('sub_categorias/get/all', 'SubCategoriasController@getAll');
    Route::get('sub_categorias/get/all/{idCategoria}', 'SubCategoriasController@getAllByCategoria');
    Route::get('sub_categorias/filter/{texto}/{pag}', 'SubCategoriasController@filter');

    Route::resource('unidades', 'UnidadesController');
    Route::get('unidades/pag/{pag}', 'UnidadesController@index');
    Route::get('unidades/get/all', 'UnidadesController@getAll');
    Route::get('unidades/filter/{texto}/{pag}', 'UnidadesController@filter');

    //Route::resource('clientes', 'ClientesController');
    Route::delete('clientes/{id}', 'ClientesController@destroy');
    Route::get('clientes/pag/{pag}', 'ClientesController@index');
    Route::get('clientes/get/all', 'ClientesController@getAll');
    Route::get('clientes/filter/{texto}/{pag}', 'ClientesController@filter');

    Route::resource('productos', 'ProductosController');
    Route::post('productos/subir/imagenes','ProductosController@uploadImage');
    Route::get('productos/pag/{pag}', 'ProductosController@index');
    Route::get('productos/get/all', 'ProductosController@getAll');
    Route::get('productos/filter/{texto}/{pag}', 'ProductosController@filter');
    Route::get('productos/filter/{texto}', 'ProductosController@getAllfilter');

    Route::post('precios','PreciosController@masiveStore');
    Route::get('precios/pag/{pag}', 'PreciosController@index');
    Route::get('precios/filter/{texto}/{pag}', 'PreciosController@filter');

    Route::put('tienda/{id}','TiendaController@update');

    Route::get('imagenes_marquesina', 'ImagenesMarquesinaController@getAll');
    Route::post('imagenes_marquesina', 'ImagenesMarquesinaController@store');
    Route::post('imagenes_marquesina/files', 'ImagenesMarquesinaController@uploadFiles');

    Route::resource('secciones_home', 'SeccionesHomeController');
    Route::get('secciones_home/pag/{pag}', 'SeccionesHomeController@index');
    Route::get('secciones_home/get/all', 'SeccionesHomeController@getAll');
    Route::get('secciones_home/filter/{texto}/{pag}', 'SeccionesHomeController@filter');

    Route::resource('oferta_principal_home', 'ConfigImagenPrincipalController');
    Route::post('oferta_principal_home/subir/imagen', 'ConfigImagenPrincipalController@uploadImage');

    Route::resource('tallas', 'TallasController');
    Route::get('tallas/pag/{pag}', 'TallasController@index');
    Route::get('tallas/get/all', 'TallasController@getAll');
    Route::get('tallas/filter/{texto}/{pag}', 'TallasController@filter');

    Route::delete('ventas/{id}','VentaController@destroy');

    Route::delete('ventas_cliente_tienda/{id}','VentasClienteTiendaController@destroy');

    Route::delete('ventas_cliente_invitado/{id}','VentasClienteInvitadoController@destroy');
});
Route::get('imagenes_marquesina/imagenes', 'ImagenesMarquesinaController@getImages');

Route::get('tienda', 'TiendaController@show');

Route::get('categorias/get/all', 'CategoriasController@getAll');

Route::get('marcas/get/home', 'MarcasController@getMarcasHome');

Route::get('oferta_principal_home', 'ConfigImagenPrincipalController@show');

Route::get('secciones_home/secciones/home', 'SeccionesHomeController@seccionesHome');

Route::post('catalogo/pag/{pag}', 'CatalogoProductosController@catalogo');

Route::get('catalogo/precio-min-max', 'CatalogoProductosController@minMaxPrice');

Route::get('marcas/get/all', 'MarcasController@getAll');

Route::get('detalle_productos/{id}', 'ProductosController@show');

Route::get('tallas/get/all/{idSubCategoria}', 'TallasController@getAllByCategory');

Route::get('clientes/{id}', 'ClientesController@show');
Route::get('clientes/rut/{rut}', 'ClientesController@findByRut');
Route::post('clientes', 'ClientesController@store');
Route::put('clientes/{id}', 'ClientesController@update');

Route::post('/wp/iniciar_transaccion', 'WebpayController@startTransaction');
Route::get('/wp/confirmar_transaccion', 'WebpayController@confirmPay')->name('wp/confirmar_transaccion');
Route::get('/wp/transaccion/{id}','WebPayController@show');

Route::post('ventas','VentaController@store');
Route::post('ventas/{id}','VentaController@update');

Route::post('ventas_cliente_tienda','VentasClienteTiendaController@store');
Route::post('ventas_cliente_tienda/{id}','VentasClienteTiendaController@update');

Route::post('ventas_cliente_invitado','VentasClienteInvitadoController@store');
Route::post('ventas_cliente_invitado/{id}','VentasClienteInvitadoController@update');

//Read more: https://rabineupane.com.np/how-to-send-mail-in-laravel-6-api-with-gmail/#ixzz7GdgabxNX
Route::post('sendmail', 'MailController@sendEmail');
