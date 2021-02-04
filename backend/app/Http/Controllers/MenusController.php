<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Menu;
use App\Models\Pantalla;
use Validator;

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
        $data = Menu::orderBy('nombre','asc');

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
        $menu = Menu::find($id);

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
        $data = Menu::orderBy('nombre','asc')
                    ->where('nombre','Like','%'.$texto.'%');

        $totRows = count($data->get());

        $menus = $data->skip($this->rowsPerPage * $pag)
                    ->take($this->rowsPerPage)
                    ->get();

        return response()->json(['data' => $menus, 'rowsPerPage' => $this->rowsPerPage, 'rows' => $totRows, 'page' => $pag]);
    }


    private function validaDatos(Request $request, $id = null)
    {
        $rules = [
            'nombre' => 'required|min:3|max:50|unique:menus,nombre,'.$id,
            'url' => 'required|min:3|max:200'
        ];

        $messages = [
            'nombre.required' => 'El nombre del menú el obligatorio.',
            'nombre.min' => 'El nombre del menú debe tener almenos 3 carácteres. Ingresa un nombre más largo.',
            'nombre.max' => 'El nombre del menú debe tener un máximo de 50 carácteres. Ingresa un nombre más corto.',
            'nombre.unique' => 'El nombre del menú ya se encuentra registrado. Ingresa un nombre diferente.',

            'url.required' => 'La url del menú el obligatoria.',
            'url.min' => 'La url del menú debe tener almenos 3 carácteres. Ingresa una url más largo.',
            'url.max' => 'La url del menú debe tener un máximo de 200 carácteres. Ingresa una url más corto.',
        ];

        return Validator::make($request->all(), $rules, $messages);
    }
}
