<?php

namespace App\Http\Controllers;

use App\Models\DespachosVentas;
use App\Models\DetalleVenta;
use Illuminate\Http\Request;
use Validator;
use Illuminate\Support\Facades\DB;

class DespachosVentasController extends Controller
{
    private $rowsPerPage = 10;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($idVenta, $pag)
    {
        $data = DespachosVentas::leftJoin(
                        DB::raw(
                                    "(
                                    SELECT venta_id, rut, nombres, apellido1, apellido2 FROM `ventas_cliente_tienda`
                                    INNER JOIN clientes ON ventas_cliente_tienda.cliente_id = clientes.id
                                    UNION
                                    SELECT venta_id, rut, nombres, apellido1, apellido2 FROM ventas_cliente_invitado
                                    ) as ventas_cliente"
                                ),'ventas_cliente.venta_id','=','despachos_ventas.venta_id')
                            ->join('web_pay','despachos_ventas.venta_id','=','web_pay.venta_id')
                            ->where('despachos_ventas.venta_id','=',$idVenta)
                            ->select(
                                'despachos_ventas.*',
                                'web_pay.buy_order as orden_compra',
                                'ventas_cliente.rut',
                                DB::raw("CONCAT(ventas_cliente.nombres,' ',ventas_cliente.apellido1,' ',ventas_cliente.apellido2) as cliente")
                                )
                            ->orderBy('created_at','asc');
        dd($data->toSql());
        $totRows = count($data->get());

        $datos = $data->skip($this->rowsPerPage * $pag)
                    ->take($this->rowsPerPage)
                    ->get();

        return response()->json(['data' => $datos, 'rowsPerPage' => $this->rowsPerPage, 'rows' => $totRows, 'page'=>$pag, ]);
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
        try{
            $validacion = $this->validaDatos($request);
            if($validacion->fails()){
                return response()->json(['mensaje' => 'Datos incopmpletos o no válidos.', 'tipoMensaje' => 'danger', 'errores' => $valicaion->errors()]);
            }
            DB::beginTransaction();
                $despacho = new DespachosVentas();
                $res = $despacho->fill($request->all()['despacho'])->save();
                $mensaje = $res ? 'El despacho ha sido ingresado exitosamente.' : 'Ocurrió un error al intentar registrar el despacho.';
                $tipoMensaje = $res ? 'success' : 'danger';
                $id = $res ? $despacho->id : -1;
                if($res){
                    $res = $this->grabarDetalle($despacho->venta_id, $request->all()['detalle']);
                    if(!$res){
                        $mensaje = 'Ocurrio un error al registrar el detalle de la compra';
                        $tipoMensaje = 'danger';
                    }
                }
                if($res){
                    DB::commit();
                }else{
                    DB::rollBack();
                }

                return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
        }catch(\PDOException $e){
            DB::rollBack();
            return response()->json(['mensaje' => 'Ocurrió un ertor al intentar registrar los datos del despacho: '.$e->getMessage(), 'tipoMensaje' => 'danger', 'id' => -1]);
        }
    }


    private function grabarDetalle($id, $detalle){
        $arrIds = [];
        foreach($detalle as $item){
            array_push($arrIds, $item['id']);
            $item['venta_id'] = $id;
            if($item['id']){
                $res = $this->actualizarDetalle($item);
            }else{
                $res = $this->ingresarDetalle($item);
            }
            if(!$res){
                return false;
            }
        }
        return $this->eliminarDetalle($id, $arrIds);
    }


    private function ingresarDetalle($item){
        $detalle = new DetalleVenta();
        $detalle->fill($item);
        $detalle->total_producto = $this->calcularTotalProducto($item['precio_venta'], $item['impuestos'], $item['cantidad']);
        $res = $detalle->save();

        return $res;
    }


    private function calcularTotalProducto($precioVenta, $impuestos, $cantidad)
    {
        $total_impuestos = $precioVenta * $impuestos / 100;         //Monto en impuestos por unidad de producto
        return ($precioVenta + $total_impuestos) * $cantidad;       //Precio con impuestos por producto multiplicadonpor la cantidad de unidades
    }

    /*
    private function camposAdicionales($detalle, $item){
        dd($detalle, $item);
        //$detalle->impuesto = $item['impuestos'];                                    //Promedio del porcentaje de impuestos
        ////$detalle->precio_neto = $item['precio_venta_normal'];                       //Precio sin impuestos
        //$detalle->precio_venta = $item['precio_venta'];                             //Precio venta con impuestos
        $detalle_total_impuestos = $item['precio_venta'] * $item['impuestos'] / 100;//Monto en impuestos
        $detalle->total_producto = $item['precio_venta'] * $item['cantidad'];       //Precio con impuestos * cantidad
    }
    */

    private function actualizarDetalle($item){
        $detalle = DetalleVenta::find($item['id']); //Busca entre los eliminado y los no eliminados
        if($detalle){
            $detalle->fill($item);
            $detalle->total_producto = $this->calcularTotalProducto($item['precio_venta'], $item['impuestos'], $item['cantidad']);
            $res = $detalle->save();
            return $res;
        }

        return true;
    }



    private function eliminarDetalle($id, $arrIds = []){
        //dd($id, $arrIds);
        $detalle = DetalleVenta::where('venta_id','=',$id)
                                ->whereNotIn('id',$arrIds);

        if(count($detalle->get()) > 0){
            return $detalle->delete();
        }
        return true;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\DespachosVentas  $despachosVentas
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try{
            $despacho = DespachosVentas::find($id);
            return response()->json($despacho);
        }catch(\PDOException $e){
            return response()->json(['mensaje' => 'Ocurrió un ertor al buscar los datos del despacho: '.$e->getMessage(), 'tipoMensaje' => 'danger', 'id' => $id]);
        }
    }

    public function showBySale($idVenta)
    {
        try{
            $despacho = DespachosVentas::where('venta_id','=',$idVenta)->first();
            return response()->json($despacho);
        }catch(\PDOException $e){
            return response()->json(['mensaje' => 'Ocurrió un error al buscar los datos del despacho de la venta: '.$e->getMessage(), 'tipoMensaje' => 'danger', 'id' => $id]);
        }
    }
    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\DespachosVentas  $despachosVentas
     * @return \Illuminate\Http\Response
     */
    public function edit(DespachosVentas $despachosVentas)
    {
        //
    }

    public function actualizarEstadoDespacho($idVenta)
    {
        $despacho = DespachosVentas::where('venta_id','=',$idVenta);
        $res = $despacho->update(['fecha_despacho' => Date('Y-m-d')]);
        $mensaje = $res ? 'El estado del despacho ha sido actualizado.' : 'Ha ocurrido un error al intentar actualizar el estado del despacho.';
        $tipoMensaje = $res ? 'success' : 'danger';

        return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $idVenta]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\DespachosVentas  $despachosVentas
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //dd($id, $request->all());
        try{
            $validacion = $this->validaDatos($request, $id);
            if($validacion->fails()){
                return response()->json(['mensaje' => 'Datos incompletos o no válidos.', 'tipoMensaje' => 'danger', 'errores' => $valicaion->errors()]);
            }
            DB::beginTransaction();
                $despacho = DespachosVentas::find($id);
                $res = $despacho->fill($request->all()['despacho'])->save();
                $mensaje = $res ? 'El despacho ha sido actualizado exitosamente.' : 'Ocurrió un error al intentar actualizar el despacho.';
                $tipoMensaje = $res ? 'success' : 'danger';
                $id = $res ? $despacho->id : -1;
                if($res){
                    $res = $this->grabarDetalle($despacho->venta_id, $request->all()['detalle']);
                    if(!$res){
                        $mensaje = 'Ocurrio un error al actualizar el detalle de la compra';
                        $tipoMensaje = 'danger';
                    }
                }
                if($res){
                    DB::commit();
                }else{
                    DB::rollback();
                }

                return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
        }catch(\PDOException $e){
            DB::rollback();
            return response()->json(['mensaje' => 'Ocurrió un ertor al intentar actualizar los datos del despacho: '.$e->getMessage(), 'tipoMensaje' => 'danger', 'id' => -1]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\DespachosVentas  $despachosVentas
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try{
            $despacho = DespachosVentas::find($id);
            $res = $despacho->delete();
            $mensaje = $res ? 'El despacho ha sido eliminado exitosamente.' : 'Ocurrió un error al intentar eliminar el despacho.';
            $tipoMensaje = $res ? 'success' : 'danger';

            return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje, 'id' => $id]);
        }catch(\PDOException $e){
            return response()->json(['mensaje' => 'Ocurrió un ertor al intentar eliminar los datos del despacho: '.$e->getMessage(), 'tipoMensaje' => 'danger', 'id' => -1]);
        }
    }


    public function filter($texto, $pag)
    {
        $texto = str_replace(env('CARACTER_COMODIN_BUSQUEDA'),'/',$texto);
        try{
            $data = DespachosVentas::leftJoin(
                DB::raw(
                            "(
                            SELECT venta_id, rut, nombres, apellido1, apellido2 FROM `ventas_cliente_tienda`
                            INNER JOIN clientes ON ventas_cliente_tienda.cliente_id = clientes.id
                            UNION
                            SELECT venta_id, rut, nombres, apellido1, apellido2 FROM ventas_cliente_invitado
                            ) as ventas_cliente"
                        ),'ventas_cliente.venta_id','=','despachos_ventas.venta_id')
                    ->join('web_pay','despachos_ventas.venta_id','=','web_pay.venta_id')
                                ->orWhere('despachos_ventas.venta_id','like','%'.$texto.'%')
                                ->orWhere('direccion','like','%'.$texto.'%')
                                ->orWhere('rut','like','%'.$texto.'%')
                                ->orWhere('nombres','like','%'.$texto.'%')
                                ->orWhere('apellido1','like','%'.$texto.'%')
                                ->orWhere('apellido2','like','%'.$texto.'%')
                                ->orWhere('ciudad','like','%'.$texto.'%')
                                ->orWhere('casa_num','like','%'.$texto.'%')
                                ->orWhere('block_num','like','%'.$texto.'%')
                                ->orWhere('referencia','like','%'.$texto.'%')
                                ->orWhere('ciudad','like','%'.$texto.'%')
                                ->orWhere(DB::raw('DATE_FORMAT(despachos_ventas.created_at, "%d/%m/%Y")'),'Like','%'.$texto.'%')
                                ->orWhere(DB::raw('DATE_FORMAT(despachos_ventas.updated_at, "%d/%m/%Y")'),'Like','%'.$texto.'%')
                                ->select(
                                    'despachos_ventas.*',
                                    'web_pay.buy_order as orden_compra',
                                    'ventas_cliente.rut',
                                    DB::raw("CONCAT(ventas_cliente.nombres,' ',ventas_cliente.apellido1,' ',ventas_cliente.apellido2) as cliente")
                                    )
                                ->orderBy('created_at','asc');

            $totRows = count($data->get());

            $datos = $data->skip($this->rowsPerPage * $pag)
                        ->take($this->rowsPerPage)
                        ->get();

            return response()->json(['data' => $datos, 'rowsPerPage' => $this->rowsPerPage, 'rows' => $totRows, 'page'=>$pag, ]);
        }catch(\PDOException $e){
            return response()->json(['data' => [], 'rowsPerPage' => $this->rowsPerPage, 'rows' => 0, 'page'=>$pag, ]);
        }
    }


    private function validaDatos(Request $request){
        $rules = [
            'venta_id' => 'required|exits:ventas,id',
            'direccion' => 'required|min:5|max:255',
            'region' => 'required|max:10',
            'provincia' => 'required|max:10',
            'comuna' => 'required|max:10',
            'ciudad' => 'required|max:20',
            'casa_num' => 'required|max:10',
            'block_num' => 'max:10',
            'referencia' => 'min:5|max:255'
        ];

        $messages = [
            'venta_id.required' => 'El código de la venta es obligatorio. El despacho no está asociado a ningina venta.',
            'venta_id.exists' => 'El código de la venta no es válido o la venta no exioste.',

            'direccion.required' => 'La dirección de despacho es obligatoria.',
            'direccion.min' => 'La dirección debe tener almenos 5 carácteres. Ingresa una dirección más larga.',
            'direccion.max' => 'La dirección debe tener hasta 255 carácteres. Ingresa una dirección más corta.',

            'region.required' => 'Debe seleccionar la región de despacho.',
            'region.max' => 'El código de la región debe tener hasta 10 carácteres. Ingresa una código más corto.',

            'provincia.required' => 'Debe seleccionar la provincia de despacho.',
            'provincia.max' => 'El código de la provincia debe tener hasta 10 carácteres. Ingresa una código más corto.',

            'comuna.required' => 'Debe seleccionar la comuna de despacho.',
            'comuna.max' => 'El código de la comuna debe tener hasta 10 carácteres. Ingresa una código más corto.',

            'ciudad.required' => 'Debe ingresar la ciudad de despacho.',
            'ciudad.max' => 'La ciudad debe tener hasta 20 carácteres. Ingresa un nombre de ciudad más corto.',

            'casa_num.required' => 'El númerop de casa es obligatorio.',
            'casa_num.max' => 'El número de casa debe tener un máximo de 10 carácteres. Ingresa un número de casa más corto.',

            'block_num.max' => 'El número de block debe tener un máximo de 10 carácteres. Ingresa un número de block más corto.',

            'referencia.min' => 'La referencia debe tener almenos 5 carácteres. Ingresa una referencia más larga.',
            'referencia.max' => 'La referencia debe tener hasta 255 carácteres. Ingresa una referencia más corta.',
        ];

        return Validator::make($rules, $messages, $request->all());
    }
}
