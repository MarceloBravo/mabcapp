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
        "ordenar_por": "precio_menor",   -> 0 = por_nombre, 1 = precio_menor, 2 = precio_mayor , 3 = nuevos_primero, 4 = mas_vendidos
        "rango_precio": {desde: 0, hasta: 100000},
        "filtro": ''
    }
    */
    public function catalogo(Request $request, $pag){
        $ordenarPor = $request->ordenar_por === 0 ? 'nombre' :
                            ($request->ordenar_por === 1 || $request->ordenar_por === 2) ? 'precio_venta_normal' :
                        ($request->ordenar_por === 3 ? 'created_at' : 'id');

        $tipoOrden = $request->ordenar_por === 2 ? 'DESC' : 'ASC';
        $rangoPrecioDesde = $request->rango_precio['desde'];
        $rangoPrecioHasta = $request->rango_precio['hasta'];
        $whereCount = false;
        $data = Producto::join('marcas','productos.marca_id','=','marcas.id')
                        ->leftJoin(
                            DB::raw("(SELECT producto_id, precio, descuento FROM precios WHERE fecha_desde <= '".date('Y-m-d')."' AND fecha_hasta >= '".date('Y-m-d')."') as p"), 'productos.id','=','p.producto_id'
                        )
                        ->join(DB::raw('(SELECT source_image, producto_id, id FROM `imagenes_producto` WHERE imagen_principal AND deleted_at IS NULL
                                        UNION
                                        SELECT source_image, producto_id, min(id) FROM `imagenes_producto`
                                        WHERE NOT imagen_principal
                                        AND producto_id NOT IN (SELECT producto_id FROM `imagenes_producto` WHERE imagen_principal AND deleted_at IS NULL)
                                        AND deleted_at IS NULL
                                        GROUP BY source_image, producto_id
                                        )
                                imagen_producto'),
                            function($join)
                            {
                                $join->on('productos.id', '=', 'imagen_producto.producto_id');
                            })
                            ->join(DB::raw('(SELECT producto_id, SUM(porcentaje) as impuesto FROM `impuestos`
                                        INNER JOIN producto_impuesto
                                        ON impuestos.id = producto_impuesto.impuesto_id
                                        GROUP BY producto_id
                                        )
                                porcentaje_impuestos'),
                            function($join)
                            {
                                $join->on('productos.id', '=', 'porcentaje_impuestos.producto_id');
                            })
                        ->select(
                            'productos.*',
                            'porcentaje_impuestos.impuesto',
                            'marcas.nombre as marca',
                            DB::raw('(CASE WHEN NOT p.precio IS NULL THEN p.precio ELSE precio_venta_normal END) AS precio_venta'),
                            'p.descuento',
                            'imagen_producto.source_image as imagen_principal'
                        );

        if(!is_null($request->filtro) && $request->filtro !== ''){
            $data = $data->where('productos.nombre','like','%'.$request->filtro.'%')
                        ->orWhere('marcas.nombre','like','%'.$request->filtro.'%');
        }

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
            if($request->filtro){
                $data = $data->orHavingRaw("CONVERT(p.descuento, CHAR) like '%".$request->filtro."%'");
            }
        }else{
            if($request->filtro){
                $data = $data->havingRaw("CONVERT(p.descuento, CHAR) like '%".$request->filtro."%'");
            }
        }

        $data = $data->orderBy($ordenarPor, $tipoOrden);
        //dd($data->toSql());
        $totRows = count($data->get());

        $data = $data->skip($request->productos_por_pagina * $pag)
                    ->take($request->productos_por_pagina)
                    ->get();

        return response()->json(['data' => $data, 'rowsPerPage' => $request->productos_por_pagina, 'page' => $pag, 'rows' => $totRows]);
    }


    public function minMaxPrice(){
        $data = Producto::leftJoin(
                            DB::raw("(SELECT producto_id, precio, descuento FROM precios WHERE fecha_desde <= '".date('Y-m-d')."' AND fecha_hasta >= '".date('Y-m-d')."') as p"), 'productos.id','=','p.producto_id'
                        )
                        ->select(
                            DB::raw('MIN(CASE WHEN NOT p.precio IS NULL THEN p.precio ELSE precio_venta_normal END) AS precio_min'),
                            DB::raw('MAX(CASE WHEN NOT p.precio IS NULL THEN p.precio ELSE precio_venta_normal END) AS precio_max'),
                        )
                        ->get();

        return response()->json($data);
    }

}
