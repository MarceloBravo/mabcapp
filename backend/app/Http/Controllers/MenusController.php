<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Menu;
use App\Models\Pantalla;
use Validator;
use Illuminate\Support\Facades\DB;

class MenusController extends Controller
{
    private $rowsPerPage = 10;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($pag = 0)
    {
        $data = Menu::orderBy('menus.nombre','asc');

        $totRows = count($data->get());

        $menus = $data->skip($this->rowsPerPage * $pag)
                ->take($this->rowsPerPage)
                ->get();

        return response()->json(['data' => $menus, 'rowsPerPage' => $this->rowsPerPage, 'rows' => $totRows, 'page' => $pag]);
    }


    public function getAll()
    {
        $menus = Menu::orderBy('nombre','asc')->get();

        return response()->json($menus->toArray());
    }


    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = $this->validaDatos($request);
        if($validator->fails()){
            return response()->json(['mensaje' => 'Datos no incompletos o no validos!', 'tipoMensaje' => 'danger', 'errores' => $validator->errors()]);
        }
        $menu = new Menu();
        $res = $menu->fill($request->all())->save();
        $mensaje = $res ? 'El menú ha sido registrado exitosamente.' : 'Ocurrió un error al intentar registrar el menú.';
        $tipoMensaje = $res ? 'success' : 'danger';
        $id = $res ? $menu->id : -1;

        return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $menu = Menu::select(
                            'id',
                            'nombre',
                            'url',
                            'menu_padre_id',
                            'posicion',
                            'created_at',
                            'updated_at',
                            'deleted_at'
                        )
                    ->find($id);

        return response()->json($menu->toArray());
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = $this->validaDatos($request, $id);
        if($validator->fails()){
            return response()->json(['mensaje' => 'Datos no incompletos o no validos!', 'tipoMensaje' => 'danger', 'errores' => $validator->errors()]);
        }
        $menu =  Menu::find($id);
        $res = $menu->fill($request->all())->save();
        $mensaje = $res ? 'El menú ha sido actualizado exitosamente.' : 'Ocurrió un error al intentar actualizar el menú.';
        $tipoMensaje = $res ? 'success' : 'danger';
        $id = $res ? $menu->id : -1;

        return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $menu =  Menu::find($id);
        $res = $menu->delete();
        $mensaje = $res ? 'El menú ha sido eliminado exitosamente.' : 'Ocurrió un error al intentar eliminar el menú.';
        $tipoMensaje = $res ? 'success' : 'danger';
        $id = $res ? $menu->id : -1;

        return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
    }



    public function filter($texto, $pag){

        try{
            $texto = str_replace(env('CARACTER_COMODIN_BUSQUEDA'),'/',$texto);
            $data = Menu::orderBy('menus.nombre','asc')
                        ->where('nombre','Like','%'.$texto.'%')
                        ->orWhere(DB::raw('DATE_FORMAT(created_at, "%d/%m/%Y")'),'like','%'.$texto.'%')
                        ->orWhere(DB::raw('DATE_FORMAT(updated_at, "%d/%m/%Y")'),'like','%'.$texto.'%');

            $totRows = count($data->get());

            $menus = $data->skip($this->rowsPerPage * $pag)
                        ->take($this->rowsPerPage)
                        ->get();

            return response()->json(['data' => $menus, 'rowsPerPage' => $this->rowsPerPage, 'rows' => $totRows, 'page' => $pag]);
        }catch(\PDOException $e){
            return response()->json(['data' => [], 'rowsPerPage' => $this->rowsPerPage, 'rows' => 0, 'page' => $pag]);
        }
    }


    private function validaDatos(Request $request, $id = null)
    {
        $rules = [
            'nombre' => 'required|min:3|max:50|unique:menus,nombre,'.$id,
        ];

        if($request['url']){
            $rules += ['url' => 'min:3|max:200'];
        }

        $messages = [
            'nombre.required' => 'El nombre del menú el obligatorio.',
            'nombre.min' => 'El nombre del menú debe tener almenos 3 carácteres. Ingresa un nombre más largo.',
            'nombre.max' => 'El nombre del menú debe tener un máximo de 50 carácteres. Ingresa un nombre más corto.',
            'nombre.unique' => 'El nombre del menú ya se encuentra registrado. Ingresa un nombre diferente.',
        ];

        if($request['url']){
            $messages += [
                'url.min' => 'La url del menú debe tener almenos 3 carácteres. Ingresa una url más largo.',
                'url.max' => 'La url del menú debe tener un máximo de 200 carácteres. Ingresa una url más corto.',
            ];
        }

        return Validator::make($request->all(), $rules, $messages);
    }

    /* ********** Obteneindo los menús a mostrar en la barra de menús ********** */
    public function getMenus($rolId)
    {
        $mainMenu = Menu::where('menus.menu_padre_id','=',0)
                    ->orderBy('posicion','asc')
                    ->get();

        foreach($mainMenu->toArray() as $key => $menu)
        {
            $mainMenu[$key]['sub_menu'] = $this->getSubMenus($rolId, $menu['id']);
        }
        return response()->json($mainMenu->toArray());
    }


    private function getSubMenus($rolId, $menuId)
    {
        $subMenu = Menu::join('pantallas','menus.id','=','pantallas.menus_id')
                    ->join('permisos','pantallas.id','=','permisos.pantallas_id')
                    ->join('roles','permisos.roles_id','=','roles.id')
                    ->select('menus.*','permisos.acceder')
                    ->where('roles.id','=',$rolId)
                    ->where('menus.menu_padre_id','=',$menuId)
                    ->orderBy('posicion','asc')
                    ->get();


        foreach($subMenu->toArray() as $menu)
        {
            $menu['sub_menu'] = $this->getSubMenus($rolId, $menu['id']);
        }
        return $subMenu->toArray();
    }
    /* ********** /Obteneindo los menús a mostrar en la barra de menús ********** */

}
