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
    }
    */
    public function catalogo(Request $request, $pag){
        $ordenarPor = $request->ordenar_por === 0 ? 'nombre' :
                            ($request->ordenar_por === 1 || $request->ordenar_por === 2) ? 'precio_venta_normal' :
                                ($request->ordenar_por === 3 ? 'created_at' : 4);

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
                        ->select(
                            'productos.*',
                            'marcas.nombre as marca',
                            DB::raw('(CASE WHEN NOT p.precio IS NULL THEN p.precio ELSE precio_venta_normal END) AS precio_venta'),
                            'p.descuento',
                            'imagen_producto.source_image as imagen_principal'
                        );

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

        return response()->json(['data' => $data, 'rowsPerPage' => $request->productos_por_pagina, 'page' => $pag, 'rows' => $totRows]);
    }


    public function filter($texto, $pag){
        $allRecords = Producto::join('producto_impuesto','productos.id','=','producto_impuesto.producto_id')
                        ->join('impuestos','producto_impuesto.impuesto_id','=','impuestos.id')
                        ->join('marcas','productos.marca_id','=','marcas.id')
                        ->join('categorias','productos.categoria_id','=','categorias.id')
                        ->join('sub_categorias','productos.sub_categoria_id','=','sub_categorias.id')
                        ->join('unidades','productos.unidad_id','=','unidades.id')
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
                        ->where('productos.nombre','like','%'.$texto.'%')
                        ->orWhere('productos.descripcion','like','%'.$texto.'%')
                        ->orWhere('precio_venta_normal','like','%'.$texto.'%')
                        ->orWhere('stock','like','%'.$texto.'%')
                        ->orWhere('marcas.nombre','like','%'.$texto.'%')
                        ->orWhere('categorias.nombre','like','%'.$texto.'%')
                        ->orWhere('sub_categorias.nombre','like','%'.$texto.'%')
                        ->orWhere('impuestos.nombre','like','%'.$texto.'%')
                        ->orWhere('unidades.nombre','like','%'.$texto.'%')
                        ->select(
                            'productos.id',
                            'productos.nombre',
                            'productos.descripcion',
                            'productos.precio_venta_normal',
                            'productos.precio_costo',
                            'productos.stock',
                            'productos.unidad_id',
                            'productos.descuento_maximo',
                            'unidades.nombre as nombre_unidad',
                            'productos.marca_id',
                            'marcas.nombre as nombre_marca',
                            'productos.categoria_id',
                            'categorias.nombre as nombre_categoria',
                            'productos.sub_categoria_id',
                            'sub_categorias.nombre as nombre_sub_categoria',
                            'productos.created_at',
                            'productos.updated_at',
                            'productos.deleted_at',
                            'imagen_producto.source_image as imagen_principal'
                            )
                        ->orderBy('nombre','asc');

        $totReg = count($allRecords->get());

        $data = $allRecords->skip($this->rowsPerPage * $pag)
                            ->take($this->rowsPerPage)
                            ->get();

        return response()->json(['data' => $data,  'rowsPerPage' => $this->rowsPerPage, 'rows' => $totReg, 'page' => $pag]);
    }
}
