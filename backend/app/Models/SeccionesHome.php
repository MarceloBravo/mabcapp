<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use DB;

class SeccionesHome extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $table = 'secciones_home';

    protected $fillable = ['nombre'];

    public function productos(){
        return $this->hasMany(ProductoSeccionHome::class, 'seccion_id')->get();
    }


    //Tiene muchos a través de (Has Many Through): https://laravel.com/docs/7.x/eloquent-relationships#has-many-through
    public function detalleProductos()
    {
        //return $this->hasManyThrough(Producto::class, ProductoSeccionHome::class,'seccion_id','id','id','producto_id')

        return $this->join('productos_secciones_home','secciones_home.id','=','productos_secciones_home.seccion_id')
                ->join('productos','productos_secciones_home.producto_id','=','productos.id')
                ->join('marcas','productos.marca_id','=','marcas.id')
                ->join(DB::raw('(SELECT
                                    source_image, producto_id, id
                                FROM `imagenes_producto` WHERE imagen_principal AND deleted_at IS NULL
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
                            ->join(DB::raw('(SELECT producto_id, SUM(porcentaje) as promedio_impuestos FROM `impuestos`
                                        INNER JOIN producto_impuesto
                                        ON impuestos.id = producto_impuesto.impuesto_id
                                        GROUP BY producto_id
                                        )
                                porcentaje_impuestos'),
                            function($join)
                            {
                                $join->on('productos.id', '=', 'porcentaje_impuestos.producto_id');
                            })
                ->where('secciones_home.id','=',$this->id)
                ->whereNull('productos_secciones_home.deleted_at')
                ->select(
                    'imagen_producto.source_image',
                    'productos.*',
                    'porcentaje_impuestos.promedio_impuestos',
                    'productos_secciones_home.texto1',
                    'productos_secciones_home.texto2',
                    'marcas.nombre as marca'
                    )
                ->get();
    }

}
