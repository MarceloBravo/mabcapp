<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Marca;
use Validator;

class MarcasController extends Controller
{

    private $rowsPerPage = 10;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($pag = 0)
    {
        $data = Marca::orderBy('nombre','asc');

        $totRows = count($data->get());

        $marcas = $data->skip($this->rowsPerPage * $pag)
                    ->take($this->rowsPerPage)
                    ->get();

        return response()->json(['data' => $marcas, 'rowsPerPage' => $this->rowsPerPage, 'rows' => $totRows, 'page' => $pag]);
    }


    public function getAll(){
        $marcas = Marca::orderBy('nombre', 'asc')->get();

        return response()->json($marcas->toArray());
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
        $marca = new Marca();
        $res = $marca->fill($request->all())->save();
        $id = $res ? $marca->id : -1;
        $mensaje = $res ? 'El registro ha sido ingresado.' : 'Ocurrió un error al ingresar el registro.';
        $tipoMensaje = $res ? 'success' : 'danger';

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
        $marca = Marca::find($id);

        return response()->json($marca);
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
        $marca = Marca::find($id);
        if($marca){
            $res = $marca->fill($request->all())->save();
            $mensaje = $res ? 'El registro ha sido ingresado.' : 'Ocurrió un error al ingresar el registro.';
            $tipoMensaje = $res ? 'success' : 'danger';
        }else{
            $mensaje = 'El registro no fue encontrado o no existe. Imposible actualizar';
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
        $marca = Marca::find($id);
        $res = $marca->delete();
        $mensaje = $res ? 'El registro ha sido eliminado.' : 'Ocurrió un error al eliminar el registro.';
        $tipoMensaje = $res ? 'success' : 'danger';

        return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
    }


    public function filter($texto, $pag){
        $data = Marca::orderBy('nombre','asc')
                        ->where('nombre','Like','%'.$texto.'%');

        $totRows = count($data->get());

        $marcas = $data->skip($this->rowsPerPage * $pag)
                        ->take($this->rowsPerPage)
                        ->get();

        return response()->json(['data' => $marcas, 'rowsPerPage' => $this->rowsPerPage, 'rows' => $totRows, 'page' => $pag]);
    }


    private function validaDatos(Request $request, $id = null){
        $rules = [
            'nombre' => 'required|min:2|max:50|unique:marcas,nombre,'.$id
        ];

        $messages = [
            'nombre.required' => 'Debe ingresar el nombre de la marca.',
            'nombre.min' => 'El nombre ingresado debe tener almenos 2 carácteres. Ingrese un nombre más largo.',
            'nombre.max' => 'El nombre ingresado debe tener hasta 50 carácteres. Ingrese un nombre más corto.',
            'nombre.unique' => 'El nombre ingresado ya se encuentra registrado. Ingrese un nombre diferente.'
        ];

        return Validator::make($request->all(), $rules, $messages);
    }
}
