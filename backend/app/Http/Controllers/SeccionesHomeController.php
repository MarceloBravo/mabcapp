<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SeccionesHome;
use App\Models\ProductoSeccionHome;
use Illuminate\Support\Facades\DB;
use Validator;

class SeccionesHomeController extends Controller
{
    private $rowsPerPage = 10;


    public function index($pag)
    {
        $records = SeccionesHome::orderBy('nombre','asc');

        $totRows = count($records->get());

        $data = $records->skip($this->rowsPerPage * $pag)
                        ->take($this->rowsPerPage)
                        ->get();

        return response()->json(['data' => $data, 'rowsPerPage' => $this->rowsPerPage, 'page' => $pag, 'rows' => $totRows]);
    }



    public function getAll(){
        $data = SeccionesHome::all();

        return response()->json($data->toArray());
    }


    public function show($id){
        $seccion = SeccionesHome::find($id);
        if(!is_null($seccion)){
            $seccion['productos'] = $seccion->productos();
            foreach($seccion['productos'] as $producto){
                $producto['nombre'] = $producto->producto()[0]['nombre'];
                $producto['nombre_marca'] = $producto->producto()[0]->marca()[0]['nombre'];
            }
        }

        return response()->json($seccion);
    }


    public function store(Request $request){
        $validacion = $this->validaDatos($request);
        if($validacion->fails()){
            return response()->json(['mensaje' => 'Datos incompletos o no válidos.', 'tipoMensaje' => 'danger', 'errores' => $validacion->errors()]);
        }
        try{
            DB::beginTransaction();
            $seccion = new SeccionesHome();
            $res = $seccion->fill($request->all())->save();
            $mensaje = $res ? 'La sección ha sido ingresada.' : 'Ocurrió un error al intentar ingresar la sección.';

            if($res && $request['productos']){
                $res = $this->grabarProductosSeccion($request['productos'], $seccion['id']);
                if(!$res)$mensaje = 'Ocurrió un error al intentar grabar los productos de la sección.';
            }
            if($res && count($request['deleted']) > 0){
                $res = $this->eliminarProductosSeccion($request['deleted']);
                if(!$res)$mensaje = 'Ocurrió un error al intentar eliminar productos de la sección.';
            }

            $tipoMensaje = $res ? 'success' : 'danger';
            $newId = $res ? $seccion->id : -1;

            if($res){
                DB::commit();
            }else{
                DB::rollback();
            }

        }catch(\PDOException $e){
            $mensaje = 'Error al intentar crear el registro: '.$e->getMessage();
            $tipoMensaje = 'danger';
            $newId = -1;
            DB::rollback();
        }

        return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $newId]);
    }


    private function grabarProductosSeccion($productos, $idSeccion){
        foreach($productos as $prod){
            $producto = null;
            if(!is_null($prod['id'])){
                $producto = ProductoSeccionHome::find($prod['id']);
            }
            if(is_null($producto)){
                $producto = new ProductoSeccionHome();
            }
            $prod['seccion_id'] = $idSeccion;
            $res = $producto->fill($prod)->save();
            if(!$res){
                return false;
            }
        }
        return true;
    }


    private function eliminarProductosSeccion($arrIdEliminados){
        foreach($arrIdEliminados as $id){
            $prod = ProductoSeccionHome::find($id);
            $res = $prod->delete();
            if(!$res){
                return false;
            }
        }
        return true;
    }


    public function update(Request $request, $id){
        $validacion = $this->validaDatos($request, $id);
        if($validacion->fails()){
            return response()->json(['mensaje' => 'Datos incompletos o no válidos.', 'tipoMensaje' => 'danger', 'errores' => $validacion->errors()]);
        }
        try{
            DB::beginTransaction();
            $seccion = SeccionesHome::find($id);
            $res = $seccion->fill($request->all())->save();
            $mensaje = $res ? 'La sección ha sido actualizada.' : 'Ocurrió un error al intentar actualizar la sección.';

            if($res && $request['productos']){
                $res = $this->grabarProductosSeccion($request['productos'], $seccion['id']);
                if(!$res)$mensaje = 'Ocurrió un error al intentar grabar los productos de la sección.';
            }
            if($res && count($request['deleted']) > 0){
                $res = $this->eliminarProductosSeccion($request['deleted']);
                if(!$res)$mensaje = 'Ocurrió un error al intentar eliminar productos de la sección.';
            }

            $tipoMensaje = $res ? 'success' : 'danger';
            $newId = $res ? $seccion->id : -1;

            if($res){
                DB::commit();
            }else{
                DB::rollback();
            }

        }catch(\PDOException $e){
            dd($e->getMessage());
            $mensaje = 'Error al intentar crear el registro.';
            $tipoMensaje = 'danger';
            $newId = -1;
            DB::rollback();
        }

        return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $newId]);
    }


    public function destroy($id){
        try{
            DB::beginTransaction();
            $seccion = SeccionesHome::find($id);
            $res = $seccion->delete();
            $mensaje = $res ? 'La sección ha sido eliminada.' : 'Ocurrió un error al intentar eliminar la sección.';

            if($res && count(ProductoSeccionHome::where('seccion_id','=',$id)->get()) > 0){
                $res = ProductoSeccionHome::where('seccion_id','=',$id)->delete();
                if(!$res){
                    $mensaje = 'Los productos asociados a la sección no pudieron ser eliminados';
                }
            }

            $tipoMensaje = $res ? 'success' : 'danger';
            if($res){
                DB::commit();
            }else{
                DB::rollback();
            }

        }catch(\PDOException $e){
            $mensaje = 'Error al intentar crear el registro.';
            $tipoMensaje = 'danger';
            $id = -1;
            DB::rollback();
        }

        return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
    }

    public function filter($texto, $pag)
    {
        $records = SeccionesHome::where('nombre','like','%'.$texto.'%')
                                ->orderBy('nombre','asc');

        $totRows = count($records->get());

        $data = $records->skip($this->rowsPerPage * $pag)
                        ->take($this->rowsPerPage)
                        ->get();

        return response()->json(['data' => $data, 'rowsPerPage' => $this->rowsPerPage, 'page' => $pag, 'rows' => $totRows]);
    }


    private function validaDatos(Request $request, $id = null){
        $rules = [
            'nombre' => 'required|min:3|max:100|unique:secciones_home,id,'.$id,
        ];

        $messages = [
            'nombre.required' => 'El nombre de la sección es obligatorio.',
            'nombre.min' => 'El nombre de la sección debe tener un mínimo de 3 carácteres. Ingresa un nombre más largo.',
            'nombre.max' => 'El nombre de la sección debe tener un máximo de 100 carácteres. Ingresa un nombre más corto.',
            'nombre.unique' => 'El nombre de la sección ya se encuentra registrado. Ingresa un nombre diferente.',
        ];

        return Validator::make($request->all(), $rules, $messages);
    }
}
