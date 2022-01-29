<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Producto;
use App\Models\Venta;
use App\Models\DetalleVenta;
use App\Models\DespachosVentas;
use DB;

class CuadroMandoController extends Controller
{

    public function lastMonthSale()
    {
        $fecha = Date('Y-m-d', strtotime(" - 1 month"));
        $data = Venta::whereDate('created_at','>=',$fecha)
                                ->select(DB::raw('SUM(Total) as total'))
                                ->first();

        return response()->json( $data);
    }


    public function lastYearSale()
    {
        $fecha = Date('Y-m-d', strtotime(" - 1 year"));
        $data = Venta::whereDate('created_at','>=',$fecha)
                                ->select(DB::raw('SUM(Total) as total'))
                                ->first();

        return response()->json( $data);
    }


    public function soldUnits()
    {
        $fecha = Date('Y-m-d', strtotime(" - 1 month"));
        $data = DetalleVenta::whereDate('created_at','>=', $fecha)
                            ->select(DB::raw('sum(cantidad) as unidades'))
                            ->first();

        return response()->json($data);
    }


    public function soldUnitsByMoths($meses)
    {
        $fecha = Date('Y-m-d', strtotime(" - $meses month"));
        $data = DetalleVenta::whereDate('detalle_ventas.created_at','>=',$fecha)
                            ->select(
                                DB::raw("SUM(detalle_ventas.cantidad) as cantidad"),
                                DB::raw("MONTH(detalle_ventas.created_at) as mes")
                            )
                            ->groupBy('mes')
                            ->get();

        return response()->json($data);
    }


    public function pendingShipments()
    {
        $despachos = DespachosVentas::whereNull('fecha_despacho')
                                    ->select(DB::raw('count(*) as cantidad'))
                                    ->first();

        return response()->json($despachos);
    }


    public function TypesCustomersPerSale()
    {
        $data = Venta::leftJoin('ventas_cliente_tienda','ventas.id','=','ventas_cliente_tienda.venta_id')
                    ->leftJoin('ventas_cliente_invitado','ventas.id','=','ventas_cliente_invitado.venta_id')
                    ->select(
                        DB::raw('SUM(CASE WHEN NOT ventas_cliente_tienda.id IS NULL THEN 1 ELSE 0 END) as cliente_tienda'),
                        DB::raw('SUM(CASE WHEN NOT ventas_cliente_invitado.id IS NULL THEN 1 ELSE 0 END) as cliente_invitado')
                    )
                    ->first();

        return response()->json($data);
    }


    public function refusedSalesLastMonth()
    {
        $fecha = Date('Y-m-d', strtotime(" - 1 month"));
        $data = Venta::onlyTrashed()
                    ->whereDate('deleted_at','>=',$fecha)
                    ->select(DB::raw('count(*) as rechazadas'))
                    ->first();

        return response()->json($data);
    }

    public function refusedSalesLastYear()
    {
        $fecha = Date('Y-m-d', strtotime(" - 1 year"));
        $data = Venta::onlyTrashed()
                    ->whereDate('deleted_at','>=',$fecha)
                    ->select(DB::raw('count(*) as rechazadas'))
                    ->first();

        return response()->json($data);
    }


    public function lastShipment()
    {
        $data = DespachosVentas::whereNotNull('fecha_despacho')->orderBy('fecha_despacho','asc')->first();

        return response()->json($data);
    }


    public function bestSellers($limit)
    {
        $fecha = Date('Y-m-d', strtotime(" - 1 year"));
        $data = DetalleVenta::join('productos','detalle_ventas.producto_id','=','productos.id')
                            ->join(
                                DB::raw(
                                    '(SELECT imagenes_producto.producto_id, source_image as imagen FROM imagenes_producto WHERE imagen_principal AND deleted_at IS NULL) as imagenes_producto'
                                ),'productos.id','=','imagenes_producto.producto_id')
                            ->SELECT(
                                'productos.nombre as producto',
                                DB::raw('SUM(cantidad) as cantidad'),
                                'imagen'
                            )
                            ->whereDate('detalle_ventas.updated_at','>',$fecha)
                            ->groupBy('productos.id', 'imagen')
                            ->orderBy('cantidad','desc')
                            ->take($limit)
                            ->get();

        return response()->json($data);
    }


    public function detailsPendingShipments($limit)
    {
        $data = Venta::join('despachos_ventas','ventas.id','=','despachos_ventas.venta_id')
                    ->join('detalle_ventas','ventas.id','=','detalle_ventas.venta_id')
                    ->select(
                        'ventas.id as venta_id',
                        'ventas.fecha_venta_tienda as fecha_venta',
                        'despachos_ventas.ciudad',
                        DB::raw("SUM(detalle_ventas.cantidad) as cantidad"),
                        'despachos_ventas.id as despacho_id'
                    )
                    ->whereNull('fecha_despacho')
                    ->groupBy('despachos_ventas.id','ventas.id','ventas.fecha_venta_tienda', 'despachos_ventas.ciudad')
                    ->take($limit)
                    ->get();

            foreach($data as $item){
                $imgs = DetalleVenta::where('venta_id','=',$item->venta_id)
                                    ->join('productos','detalle_ventas.producto_id','=','productos.id')
                                    ->join(
                                       DB::raw("(SELECT producto_id, source_image as imagen FROM imagenes_producto WHERE imagen_principal AND deleted_at IS NULL) AS imagenes_producto "
                                    ),'productos.id','=','imagenes_producto.producto_id'
                                    )
                                    ->select(
                                        'productos.nombre as producto',
                                        'imagen'
                                    )
                                    ->get()
                                    ->toArray();

                $item['producto'] = $imgs;
            }

        return response()->json($data);
    }
}
