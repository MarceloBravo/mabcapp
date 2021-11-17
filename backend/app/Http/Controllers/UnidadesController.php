<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Unidad;
use Validator;

class UnidadesController extends Controller
{
    private $rowsPerPage = 10;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($pag)
    {
        $unidades = Unidad::orderBy('nombre','asc');

        $totRows = count($unidades->get());

        $data = $unidades->skip($this->rowsPerPage * $pag)
                        ->take($this->rowsPerPage)
                        ->get();

        return response()->json(['data' => $data, 'rows' => $totRows, 'rowsPerPage' => $this->rowsPerPage, 'page' => $pag]);
    }


    public function getAll(){
        $data = Unidad::all();

        return response()->json($data->toArray());
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
        $validacion = $this->validaDatos($request);
        if($validacion->fails()){
            return response()->json(['mensaje' => 'Datos incompletos o no validos.', 'tipoMensaje' => 'danger', 'errores' => $validacion->errors()]);
        }
        $unidad = new Unidad();
        $res = $unidad->fill($request->all())->save();
        $mensaje = $res ? 'El registro ha sido ingresado exitosamente.' : 'Ocurrió un error al intentar ingresaer el registro.';
        $tipoMensaje = $res ? 'success' : 'danger';
        $newId = $res ? $unidad->id : -1;

        return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $newId]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $unidad = Unidad::find($id);

        return response()->json($unidad);
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
        $validacion = $this->validaDatos($request, $id);
        if($validacion->fails()){
            return response()->json(['mensaje' => 'Datos incompletos o no validos.', 'tipoMensaje' => 'danger', 'errores' => $validacion->errors()]);
        }
        $unidad = Unidad::find($id);
        $res = $unidad->fill($request->all())->save();
        $mensaje = $res ? 'El registro ha sido actualizado exitosamente.' : 'Ocurrió un error al intentar actualizar el registro.';
        $tipoMensaje = $res ? 'success' : 'danger';

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
        $unidad = Unidad::find($id);
        $res = $unidad->delete();
        $mensaje = $res ? 'El registro ha sido eliminado exitosamente.' : 'Ocurrió un error al intentar eliminar el registro.';
        $tipoMensaje = $res ? 'success' : 'danger';

        return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
    }


    public function filter($texto, $pag){
        $unidades = Unidad::orderBy('nombre','asc')
                        ->where('nombre','Like','%'.$texto.'%');

        $totRows = count($unidades->get());

        $data = $unidades->skip($this->rowsPerPage * $pag)
                        ->take($this->rowsPerPage)
                        ->get();

        return response()->json(['data' => $data, 'rows' => $totRows, 'rowsPerPage' => $this->rowsPerPage, 'page' => $pag]);
    }


    private function validaDatos(Request $request, $id = null){
        $rules = [
            'nombre' => 'required|min:3|max:50|unique:unidades,nombre,'.$id,
            'nombre_plural' => 'required|min:3|max:50'
        ];

        $messages = [
            'nombre.required' => 'El nombre de la unidad es obligatorio.',
            'nombre.min' => 'El nombre de la unidad debe tener un mínimo de 3 carácteres. Ingresa un nombre más largo.',
            'nombre.max' => 'El nombre de la unidad debe tener un maximo de 50 carácteres. Ingresa un nombre más corto.',
            'nombre.unique' => 'El nombre de la unidad ya se encuentra resgistrado. Ingresa un nombre diferente.',

            'nombre_plural.required' => 'El nombre en plural es obligatorio.',
            'nombre_plural.min' => 'El nombre en plural debe tener un mínimo de 3 carácteres. Ingresa un nombre más largo.',
            'nombre_plural.max' => 'El nombre en plural debe tener un maximo de 50 carácteres. Ingresa un nombre más corto.',
            'nombre_plural.unique' => 'El nombre en plural ya se encuentra resgistrado. Ingresa un nombre diferente.'
        ];

        return Validator::make($request->all(), $rules, $messages);
    }
}
