<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Producto;
use App\Models\ImagenProducto;
use App\Models\ProductoImpuesto;
use Illuminate\Support\Facades\DB;
use Validator;


class CatalogoProductosController extends Controller
{
    /*
    Retorna los productos a mostrar en una página del catálogo.
    Formato del objeto json esperado por el parametro $request:
    {
        "marca_id": 2,
        "catagoria_id": 9,
        "sub_categoria_id": 6,
        "productos_por_pagina: 10,
        "ordenar_por": "precio_menor",   -> por_nombre, precio_menor, precio_mayor, nuevos_primero, mas_vendidos
        "rango_precio": {desde: 0, hasta: 100000},
    }
    */
    public function catalogo(Request $request, $pag){
        $ordenarPor = $request->ordenar_por === 'por_nombre' ? 'nombre' :
                            ($request->ordenar_por === 'precio_menor' || $request->ordenar_por === 'precio_mayor') ? 'precio_venta_normal' :
                                ($request->ordenar_por === 'nuevos_primeros' ? 'created_at' : '');

        $tipoOrden = $request->ordenar_por === 'precio_mayor' ? 'DESC' : 'ASC';
        $rangoPrecioDesde = $request->rango_precio['desde'];
        $rangoPrecioHasta = $request->rango_precio['hasta'];
        $whereCount = false;
        $data = Producto::leftJoin(
                            DB::raw("(SELECT producto_id, precio, descuento FROM precios WHERE fecha_desde <= '".date('Y-m-d')."' AND fecha_hasta >= '".date('Y-m-d')."') as p"), 'productos.id','=','p.producto_id'
                        )
                        ->select('productos.*',
                        DB::raw('(CASE WHEN NOT p.precio IS NULL THEN p.precio ELSE precio_venta_normal END) AS precio_venta'),
                        'p.descuento');

        if(!is_null($request->marca_id)){
            $data = $data->orWhere('marca_id','=',$request->marca_id);
            $whereCount = true;
        }
        if(!is_null($request->categoria_id)){
            if($whereCount){
                $data = $data->where('categoria_id','=',$request->categoria_id);
            }else{
                $data = $data->orWhere('categoria_id','=',$request->categoria_id);
                $whereCount = true;
            }

        }
        if(!is_null($request->sub_categoria_id)){
            if($whereCount){
                $data = $data->where('sub_categoria_id','=',$request->sub_categoria_id);
            }else{
                $data = $data->orWhere('sub_categoria_id','=',$request->sub_categoria_id);
                $whereCount = true;
            }
        }
        if(!is_null($rangoPrecioDesde)){
            $data = $data->havingRaw('precio_venta BETWEEN ? AND ?',[$rangoPrecioDesde, $rangoPrecioHasta]);
        }
        $totRows = count($data->get());

        $data = $data->skip($request->productos_por_pagina * $pag)
                    ->take($request->productos_por_pagina)
                    ->get();

        return response()->json(['data' => $data, 'rowsPerPage' => $request->productos_por_pagina, 'page' => $pag, 'row' => $totRows]);
    }
}
