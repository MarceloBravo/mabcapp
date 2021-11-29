<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Precio;
use Illuminate\Support\Facades\DB;
use Validator;

class PreciosController extends Controller
{
    private $rowsPerPage = 10;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($pag)
    {
        $allReg = Precio::join('productos','precios.producto_id','=','productos.id')
                        ->join('marcas','productos.marca_id','=','marcas.id')
                        ->join('unidades','productos.unidad_id','=','unidades.id')
                        ->join('categorias','productos.categoria_id','=','categorias.id')
                        ->join('sub_categorias','productos.sub_categoria_id','=','sub_categorias.id')
                        ->select(
                            'productos.nombre as producto',
                            'productos.precio_venta_normal',
                            'productos.stock',
                            'productos.descuento_maximo',
                            'marcas.nombre as marca',
                            'unidades.nombre as unidad',
                            'categorias.nombre as categoria',
                            'sub_categorias.nombre as sub_categoria',
                            'precios.*'
                        )
                        ->orderBy('created_at','asc');

        $totRows = count($allReg->get());

        $data = $allReg->skip($this->rowsPerPage * $pag)
                    ->take($this->rowsPerPage)
                    ->get();

        return response()->json(['data' => $data, 'rows' => $totRows, 'rowsPerPage' => $this->rowsPerPage, 'page' => $pag]);
    }




    public function masiveStore(Request $request)
    {
        $errores = $this->validaDatos($request->data);
        if(!is_null($errores)){
            return response()->json(['mensaje' => 'Datos incompletos o no válidos.','tipoMensaje' => 'danger', 'errores' => $errores]);
        }
        $res = true;
        try{
            DB::beginTransaction();
            if(count($request->data) > 0){
                $res = $this->grabar($request->data);
            }
            if(count($request->deleted) > 0){
                $res = $this->eliminar($request->deleted);
            }

            if($res){
                DB::commit();
                $mensaje = 'Los precios han sido actualizados.';
                $tipoMensaje = 'danger';
                $id = 0;
            }else{
                DB::rollback();
                $mensaje = 'No fue posible actualizar los precios. La acción ha sido cancelada.';
                $tipoMensaje = 'danger';
                $id = -1;
            }

        }catch(\PDOException $e){
            $mensaje = 'Error al actualizar los precios: '.$e->getMessage();
            $tipoMensaje = 'danger';
            $id = -1;
            DB::rollback();
        }

        return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
     }



    private function grabar($precios){
        foreach($precios as $item){
            $precio = Precio::find($item['id']);
            if(is_null($precio)){
                $precio = new Precio();
            }
            $res = $precio->fill($item)->save();
            if(!$res){
                return false;
            }
        }
        return true;
    }


    private function eliminar($eliminados){
        foreach($eliminados as $idEliminado){
            $precio = Precio::find($idEliminado);
            if(!is_null($precio)){
                $res = $precio->delete();
                if(!$res){
                    return false;
                }
            }
        }
        return true;
    }


    public function filter($texto, $pag)
    {
        $allReg = Precio::join('productos','precios.producto_id','=','productos.id')
                        ->join('marcas','productos.marca_id','=','marcas.id')
                        ->join('unidades','productos.unidad_id','=','unidades.id')
                        ->join('categorias','productos.categoria_id','=','categorias.id')
                        ->join('sub_categorias','productos.sub_categoria_id','=','sub_categorias.id')

                        ->where('productos.nombre','like','%'.$texto.'%')
                        ->orWhere('productos.precio_venta_normal','like','%'.$texto.'%')
                        ->orWhere('productos.stock','like','%'.$texto.'%')
                        ->orWhere('marcas.nombre','like','%'.$texto.'%')
                        ->orWhere('unidades.nombre','like','%'.$texto.'%')
                        ->orWhere('categorias.nombre','like','%'.$texto.'%')
                        ->orWhere('sub_categorias.nombre','like','%'.$texto.'%')
                        ->orWhere('precios.precio','like','%'.$texto.'%')
                        ->orWhere('precios.descuento','like','%'.$texto.'%')
                        ->orWhere('precios.descuento_maximo','like','%'.$texto.'%')
                        ->orWhere('precios.fecha_desde','like','%'.$texto.'%')
                        ->orWhere('precios.fecha_hasta','like','%'.$texto.'%')

                        ->select(
                            'productos.nombre as producto',
                            'productos.precio_venta_normal',
                            'productos.stock',
                            'productos.descuento_maximo',
                            'marcas.nombre as marca',
                            'unidades.nombre as unidad',
                            'categorias.nombre as categoria',
                            'sub_categorias.nombre as sub_categoria',
                            'precios.*'
                        )
                        ->orderBy('created_at','asc');

        $totRows = count($allReg->get());

        $data = $allReg->skip($this->rowsPerPage * $pag)
                    ->take($this->rowsPerPage)
                    ->get();

        return response()->json(['data' => $data, 'rows' => $totRows, 'rowsPerPage' => $this->rowsPerPage, 'page' => $pag]);
    }

    private function validaDatos($data){
        foreach($data as $item){
            $res = $this->validarCampos($item);
            if($res->fails()){
                return $res->errors();
            }
        }
        return null;
    }


    private function validarCampos($item){

        $rules = [
                "producto_id" => 'required|exists:productos,id',
                "precio" => 'required|min:0',
                "descuento" => "required|min:0",
                "fecha_desde" => "required",
                "fecha_hasta" => "required",
                ];

        $messages = [
            'producto_id.required' => 'Debe indicar el producto al cual se está configurando el precio.',
            'producto_id.exists' => 'El producto no existe o no fue encontrado. Ingresa un producto diferente.',

            'precio.required' => 'Debe ingresar el precio del producto',
            'precio.min' => 'El precio debe ser un número positivo.',

            'descuento.required' => 'Debe especificar el porcentaje de descuento a aplicar al producto.',
            'descuento.min' => 'El porcentaje de descuento debe ser un número positivo.',

            'fecha_desde.required' => 'La fecha desde es obligatoria.',
            'fecha_hasta.required' => 'La fecha hasta es obligatoria.',
        ];

        return Validator::make($item, $rules, $messages);
    }
}
