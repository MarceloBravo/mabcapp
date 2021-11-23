<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SubCategoria;
use Validator;

class SubCategoriasController extends Controller
{
    private $rowsPerPage = 10;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($pag)
    {
        $data = SubCategoria::join('categorias','sub_categoria.categoria_id','=','categorias.id')
                            ->orderBy('sub_categoria.nombre','asc')
                            ->select('sub_categoria.*','categorias.nombre as nombre_categoria');

        $totRows = count($data->get());

        $dataPage = $data->skip($this->rowsPerPage * $pag)
                        ->take($this->rowsPerPage)
                        ->get();

        return response()->json(['data'=> $dataPage, 'rowsPerPage'=> $this->rowsPerPage, 'rows'=>$totRows, 'page'=>$pag]);
    }


    public function getAll(){
        $data = SubCategoria::all();

        return response()->json($data->toArray());
    }

    public function getAllByCategoria($id){
        $data = SubCategoria::where('categoria_id','=',$id)->get();

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
            return response()->json(['mensaje'=>'Existen datos incompletos o no válidos.', 'tipoMensaje'=>'danger','errores'=>$validacion->errors()]);
        }
        $subCategoria = new SubCategoria();
        $res = $subCategoria->fill($request->all())->save();
        $mensaje = $res ? 'El registro ha sido creado exitosamente.' : 'Ocurrió un error al intentar ingresar el registro.';
        $tipoMensaje = $res ? 'success' : 'danger';
        $newId = $res ? $subCategoria->id : -1;

        return response()->json(['mensaje'=> $mensaje, 'tipoMensaje'=>$tipoMensaje, 'id'=>$newId]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $data = SubCategoria::find($id);

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
        $subCategoria = SubCategoria::find($id);

        return response()->json($subCategoria);
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
            return response()->json(['mensaje'=>'Existen datos incompletos o no válidos.', 'tipoMensaje'=>'danger','errores'=>$validacion->errors()]);
        }
        $subCategoria = SubCategoria::find($id);
        $res = $subCategoria->fill($request->all())->save();
        $mensaje = $res ? 'El registro ha sido actualizado exitosamente.' : 'Ocurrió un error al intentar actualizar el registro.';
        $tipoMensaje = $res ? 'success' : 'danger';

        return response()->json(['mensaje'=> $mensaje, 'tipoMensaje'=>$tipoMensaje, 'id'=>$id]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $subCategoria = SubCategoria::find($id);
        $res = $subCategoria->delete();
        $mensaje = $res ? 'El registro ha sido eliminado exitosamente.' : 'Ocurrió un error al intentar eliminar el registro.';
        $tipoMensaje = $res ? 'success' : 'danger';

        return response()->json(['mensaje'=> $mensaje, 'tipoMensaje'=>$tipoMensaje, 'id'=>$id]);
    }


    public function filter($texto, $pag){
        $data = SubCategoria::join('categorias','sub_categoria.categoria_id','=','categorias.id')
                            ->orderBy('nombre','asc')
                            ->select('sub_categoria.*','categorias.nombre as nombre_categoria')
                            ->where('sub_categoria.nombre','like','%'.$texto.'%');

        $totRows = count($data->get());

        $dataPage = $data->skip($this->rowsPerPage * $pag)
                        ->take($this->rowsPerPage)
                        ->get();

        return response()->json(['data'=> $dataPage, 'rowsPerPage'=> $this->rowsPerPage, 'rows'=>$totRows, 'page'=>$pag]);
    }


    private function validaDatos(Request $request, $id = null){
        $rules = [
            'nombre' => 'required|min:3|max:50|unique:sub_categoria,id,'.$id,
            'categoria_id' => 'required|exists:categorias,id'
        ];

        $messages = [
            'nombre.required' => 'El nombre de la subcategoría es obligatorio.',
            'nombre.min' => 'El nombre de la subcategoría debe tener almenos 3 carácteres. Ingresa un nombre más largo.',
            'nombre.max' => 'El nombre de la subcategoría debe tener hasta 50 carácteres. Ingresa un nombre más corto.',
            'nombre.required' => 'El nombre de la subcategoría ya se encuentra registrado. Ingresa un nombre diferente.',

            'categoria_id.required' => 'Debes seleccionar una categoría.',
            'categoria_id.exists' =>'La categoría seleccionada no es válida o no existe.',
        ];

        return Validator::make($request->all(), $rules, $messages);
    }
}
