<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tallas;
use Validator;

class TallasController extends Controller
{
    private $rowsPerPage = 10;
    //

    public function index($pag){
        $tallas = Tallas::join('sub_categorias','tallas.sub_categoria_id','=','sub_categorias.id')
                        ->orderBy('sub_categorias.nombre','asc')
                        ->orderBy('talla','asc')
                        ->select('tallas.*','sub_categorias.nombre as sub_categoria');

        $totRows = count($tallas->get());

        $data = $tallas->skip($this->rowsPerPage * $pag)
                        ->take($this->rowsPerPage)
                        ->get();

        return response()->json(['data' => $data, 'rowsPerPage' => $this->rowsPerPage, 'rows' => $totRows, 'page' => $pag]);
    }


    public function getAll(){
        $tallas = Tallas::all();

        return response()->json($tallas->toArray());
    }


    public function getAllByCategory($idSubCategoria){
        $tallas = Tallas::where('sub_categoria_id','=',$idSubCategoria)->get();

        return response()->json($tallas->toArray());
    }


    public function show($id){
        $talla = Tallas::find($id);
        $subCategoria = null;
        if(!is_null($talla)){
            $subCategoria =  $talla->subCategoria();
        }
        $talla['sub_categoria'] = !is_null($subCategoria) ? $subCategoria[0] : null;

        return response()->json($talla);
    }


    public function store(Request $request){
        $validacion = $this->validaDatos($request);
        if($validacion->fails()){
            return response()->json(['mensaje' => 'Datos incompletos o no válidos.', 'tipoMensaje' => 'danger', 'errores' => $validacion->errors()]);
        }
        try{
            $talla = new Tallas();
            $res = $talla->fill($request->all())->save();
            $tipoMensaje = $res ? 'success' : 'danger';
            $mensaje = $res ? 'El registro ha sido creado existosamente.' : 'Ocurrió un error al intentar crear el registro.';
            $newId = $res ? $talla->id : -1;

        }catch(\PDOException $e){
            $mensaje = 'Ocurrió un error al ingresar el registro: '.$e->getMessage();
            $tipoMensaje = 'danger';
            $newId = -1;
        }

        return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $newId]);
    }


    public function update(Request $request, $id){
        $validacion = $this->validaDatos($request, $id);
        if($validacion->fails()){
            return response()->json(['mensaje' => 'Datos incompletos o no válidos.', 'tipoMensaje' => 'danger', 'errores' => $validacion->errors()]);
        }
        try{
            $talla = Tallas::find($id);
            $res = $talla->fill($request->all())->save();
            $tipoMensaje = $res ? 'success' : 'danger';
            $mensaje = $res ? 'El registro ha sido actualizado existosamente.' : 'Ocurrió un error al intentar actualizar el registro.';

        }catch(\PDOException $e){
            $mensaje = 'Ocurrió un error al actualizar el registro: '.$e->getMessage();
            $tipoMensaje = 'danger';
        }

        return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
    }


    public function destroy($id){
        try{
            $talla = Tallas::find($id);
            $res = $talla->delete();
            $tipoMensaje = $res ? 'success' : 'danger';
            $mensaje = $res ? 'El registro ha sido eliminado existosamente.' : 'Ocurrió un error al eliminar crear el registro.';

        }catch(\PDOException $e){
            $mensaje = 'Ocurrió un error al eliminar el registro: '.$e->getMessage();
            $tipoMensaje = 'danger';
        }

        return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
    }


    public function filter($texto, $pag){
        $tallas = Tallas::join('sub_categorias','tallas.sub_categoria_id','=','sub_categorias.id')
                        ->orderBy('sub_categorias.nombre','asc')
                        ->orderBy('talla','asc')
                        ->where('sub_categorias.nombre','like','%'.$texto.'%')
                        ->orWhere('tallas.talla','like','%'.$texto.'%')
                        ->orWhereDate("tallas.created_at",'like','%'.$texto.'%')
                        ->orWhereDate("tallas.created_at",'like','%'.$texto.'%')
                        ->select('tallas.*','sub_categorias.nombre as sub_categoria');

        $totRows = count($tallas->get());

        $data = $tallas->skip($this->rowsPerPage * $pag)
                        ->take($this->rowsPerPage)
                        ->get();

        return response()->json(['data' => $data, 'rowsPerPage' => $this->rowsPerPage, 'rows' => $totRows, 'page' => $pag]);
    }


    private function validaDatos(Request $request, $id = null){
        $rules = [
            'sub_categoria_id' => 'required|exists:sub_categorias,id',
            'tallas' => 'required|max:10|unique:tallas,talla,'.$id.',id,sub_categoria_id,'.$request->all()['sub_categoria_id'],
        ];

        $messages = [
            'sub_categoria_id.required' => 'Debe seleccionar una categoría.',
            'sub_categoria_id.existes' => 'La categoría seleccionada no existe.',

            'tallas.required' => 'Debe ingresar la talla del producto.',
            'tallas.max' => 'La talla debe tener hasta 10 carácteres. Ingreesa in texto más largo.',
            'tallas.unique' => 'La talla ingresada ya existe para la categoría. Ingresa una talla diferente.',
        ];

        return Validator::make($rules, $messages, $request->all());
    }
}
