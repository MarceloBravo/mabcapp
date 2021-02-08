<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pantalla;
use Validator;

class PantallasController extends Controller
{
    private $rowsPerPage = 10;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($page = 0)
    {
        $data = Pantalla::join('menus','pantallas.menus_id','=','menus.id')
                        ->select('pantallas.*','menus.nombre as menu', 'menus.url as url')
                        ->orderBy('pantallas.nombre','asc')
                        ->orderBy('menus.nombre','asc')
                        ->whereNull('menus.deleted_at');

        $totRows = count($data->get());

        $pantallas = $data->skip($this->rowsPerPage * $page)
                            ->take($this->rowsPerPage)
                            ->get();

        return response()->json(['data' => $pantallas, 'rowsPerPage' => $this->rowsPerPage, 'page' => $page, 'rows' => $totRows]);
    }


    public function getAll()
    {
        $pantallas = Pantalla::all();

        return response()->json($pantallas->toArray());
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
        $validator = $this->validaDatos($request, null);
        if($validator->fails()){
            return response()->json(['mensaje' => "Datos inompletos o no válidos", 'tipoMensaje' => 'danger', 'errores' => $validator->errors()]);
        }
        $pantalla = new Pantalla();
        $res = $pantalla->fill($request->all())->save();
        $mensaje = $res ? 'El registro ha sido ingresado.' : 'Ocurrió un error al intentar ingresar el registro.';
        $tipoMensaje = $res ? 'success' : 'danger';
        $id = $res ? $pantalla->id : -1;

        return response(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $pantalla = Pantalla::join('menus','pantallas.menus_id','=','menus.id')
                        ->select('pantallas.*','menus.nombre as menu')
                        ->whereNull('menus.deleted_at')
                        ->find($id);

        return response()->json($pantalla->toArray());
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
            return response()->json(['mensaje' => "Datos inompletos o no válidos", 'tipoMensaje' => 'danger', 'errores' => $validator->errors()]);
        }
        $pantalla = Pantalla::find($id);
        $res = $pantalla->fill($request->all())->save();
        $mensaje = $res ? 'El registro ha sido actualizado.' : 'Ocurrió un error al intentar actualizar el registro.';
        $tipoMensaje = $res ? 'success' : 'danger';

        return response(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $pantalla = Pantalla::find($id);
        $res = $pantalla->delete();
        $mensaje = $res ? 'El registro ha sido eliminado.' : 'Ocurrió un error al intentar eliminar el registro.';
        $tipoMensaje = $res ? 'success' : 'danger';

        return response(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
    }


    public function filter($texto, $page = 0)
    {
        $data = Pantalla::join('menus','pantallas.menus_id','=','menus.id')
                        ->select('pantallas.*','menus.nombre as menu', 'menus.url as url')
                        ->orderBy('pantallas.nombre','asc')
                        ->orderBy('menus.nombre','asc')
                        ->where('pantallas.nombre','Like','%'.$texto.'%')
                        ->orWhere('menus.nombre','Like','%'.$texto.'%')
                        ->orWhere('menus.url','Like','%'.$texto.'%')
                        ->whereNull('menus.deleted_at');

        $totRows = count($data->get());

        $pantallas = $data->skip($this->rowsPerPage * $page)
                            ->take($this->rowsPerPage)
                            ->get();

        return response()->json(['data' => $pantallas, 'rowsPerPage' => $this->rowsPerPage, 'page' => $page, 'rows' => $totRows]);
    }


    private function validaDatos(Request $request, $id = null)
    {
        $rules = [
            'nombre' => 'required|min:3|max:50|unique:pantallas,nombre,'.$id,
            'menus_id' => 'required|exists:menus,id'
        ];

        $messages = [
            'nombre.required' => 'El nombre de la pantalla es obligatorio.',
            'nombre.min' => 'El nombre de la pantalla debe tener almenos 3 carácteres. Ingrese un nombre más largo.',
            'nombre.max' => 'El nombre de la pantalla debe tener hasta 50 carácteres. Ingrese un nombre más corto.',
            'nombre.unique' => 'El nombre de la pantalla ya se encuentra en uso. Ingresa un nombre diferente.',

            'menus_id.required' => 'El menú asociada a la pantalla es obligatoria.',
            'menus_id.exists' => 'El menú asociado a la pantalla no es válido o no existe.',
        ];

        return Validator::make($request->all(), $rules, $messages);
    }
}
