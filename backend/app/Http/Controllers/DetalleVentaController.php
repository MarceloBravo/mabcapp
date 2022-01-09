<?php

namespace App\Http\Controllers;

use App\Models\DetalleVenta;
use App\Models\Producto;
use Illuminate\Http\Request;
use Validator;
use DB;

class DetalleVentaController extends Controller
{
    private $rowsPerPage = 10;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($ventaId, $pag)
    {
        $records = DetalleVenta::join('productos','detalle_ventas.producto_id','=','productos.id')
                                ->select(
                                    'detalle_ventas.*',
                                    'productos.nombre'
                                )
                                ->where('venta_id','=',$ventaId);

        $totRows = count($records->get());

        $data = $records->skip($this->rowsPerPage * $pag)
                        ->take($this->rowsPerPage)
                        ->get();

        return response()->json(['data' => $data, 'rrowsPerPage' => $this->rowsPerPage, 'rows' => $totRows, 'page' => $pag]);
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
    public function store($id)
    {

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\DetalleVenta  $detalleVenta
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $data = DetalleVenta::find($id);

        return response()->json($data);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\DetalleVenta  $detalleVenta
     * @return \Illuminate\Http\Response
     */
    public function edit(DetalleVenta $detalleVenta)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\DetalleVenta  $detalleVenta
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, DetalleVenta $detalleVenta)
    {
        //
    }


    public function updateStockSold(Request $request)
    {
        try{
            DB::beginTransaction();
            $carrito = $request['carrito'];
            foreach($request->all() as $item){
                $producto = Producto::find($item['producto_id']);
                if(!is_null($producto)){
                    $producto->stock = $producto->stock - $item['cantidad'];
                    if(!$producto->save()){
                        throw new Exception('No fue posible actualizar el stock del producto '.$item['id'].' '.$item['nombre']);
                    }
                }
            }
            $mensaje = 'El stock ha sido actualizado';
            $tipoMensaje = 'success';
            DB::commit();
        }catch(\PDOException $e){
            DB::rollBack();
            $mensaje = 'Ocurrió un error al intentar actualizar el stock: '.$e->getMessage();
            $tipoMensaje = 'danger';
        }
        return response()->json(['mensaje' => $mensaje, 'tipoMensaje' => $tipoMensaje]);
    }




    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\DetalleVenta  $detalleVenta
     * @return \Illuminate\Http\Response
     */
    public function destroy(DetalleVenta $detalleVenta)
    {
        //
    }
}
