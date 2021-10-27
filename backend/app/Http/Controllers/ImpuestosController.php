<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Impuesto;
use Validator;

class ImpuestosController extends Controller
{
    private $rowsPerPage = 10;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($pag)
    {
        $data = Impuesto::orderBy('nombre','asc');

        $totRows = count($data->get());

        $impuestos = $data->skip($this->rowsPerPage * $pag)
                        ->take($this->rowsPerPage)
                        ->get();

        return response()->json(['data' => $impuestos, 'rowsPerPage' => $this->rowsPerPage, 'page' => $pag, 'rows' => $totRows]);
    }


    public function getAll(){
        $data = Impuesto::orderBy('nombre','asc')->get();

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
        $validator = $this->validaDatos($request);
        if($validator->fails()){
            return response()->json(['mensaje' => 'Datos no válidos o incompletos!', 'tipoMensaje' => 'danger', 'errors' => $validators->errors()]);
        }
        $impuesto = new Impuesto();
        $res = $impuesto->fill($request->all())->save();
        $newId = $res ? $impuesto->id : -1;
        $mensaje = $res ? 'El registro ha sido creado exitosamente.' : 'Ocurrió un error al intentar crear el registro!';
        $tipoMensaje = $res ? 'success' : 'danger';

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
        $data = Impuesto::find($id);

        return response()->json($data);
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
            return response()->json(['mensaje' => 'Datos no válidos o incompletos!', 'tipoMensaje' => 'danger', 'errors' => $validator->errors()]);
        }
        $impuesto = Impuesto::find($id);
        if($impuesto){
            $res = $impuesto->fill($request->all())->save();
            $mensaje = $res ? 'El registro ha sido actualizado exitosamente.' : 'Ocurrió un error al intentar actualizar el registro!';
            $tipoMensaje = $res ? 'success' : 'danger';
        }else{
            $mensaje = 'El registro no ha sido encontrado.';
            $tipoMensaje = 'danger';
        }

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
        $impuesto = Impuesto::find($id);
        $res = $impuesto->delete();
        $mensaje = $res ? 'El registro ha sido eliminado exitosamente.' : 'Ocurrió un error al intentar eliminar el registro!';
        $tipoMensaje = $res ? 'success' : 'danger';

        return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
    }


    public function filter($texto, $pag){
        $data = Impuesto::orderBy('nombre','asc')
                        ->where('nombre','like','%'.$texto.'%')
                        ->orWhere('sigla','like','%'.$texto.'%')
                        ->orWhere('porcentaje','like','%'.$texto.'%');

        $totRows = count($data->get());
        $result = $data->skip($this->rowsPerPage * $pag)
                        ->take($this->rowsPerPage)
                        ->get();

        return response()->json(['data' => $result, 'rowsPerPage' => $this->rowsPerPage, 'page' => $pag, 'rows' => $totRows]);
    }


    private function validaDatos(Request $request, $id = null){
        $rules = [
            'nombre' => 'required|min:3|max:50|unique:impuestos,nombre,'.$id,
            'sigla' => 'required|min:2|max:15',
            'porcentaje' => 'required|min:0|max:100'
        ];

        $messages = [
            'nombre.required' => 'Debe ingresar el nombre del impuesto.',
            'nombre.min' => 'El nombre del impuesto debe tener almenos 3 carácteres. Ingrese un nombre más largo.',
            'nombre.max' => 'El nombre del impuesto debe tener hasta 50 carácteres. Ingrese un nombre más corto.',
            'nombre.required' => 'El nombre ingresado ya se encuentra registrado. Ingrese un nombre diferente.',

            'sigla.required' => 'Debe ingresar la sigla para impuesto.',
            'sigla.min' => 'La sigla debe tener almenos 2 carácteres. Ingrese una sigla más larga.',
            'sigla.max' => 'La sigla debe tener hasta 15 carácteres. Ingrese una sigla más corta.',

            'porcentaje.required' => 'Debe ingresar el porcentaje del impuesto.',
            'sigla.min' => 'El porcentaje debe ser un número positivo. Ingrese un valor sobre cero.',
            'sigla.max' => 'El porcentaje no debe ser mayor que el número 100.',
        ];

        return Validator::make($request->all(), $rules, $messages);
    }
}
