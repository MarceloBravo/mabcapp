<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DetalleVenta extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'detalle_ventas';

    protected $fillable = ['venta_id','producto_id','precio_neto','impuestos','JSON_impuestos',
                            'precio_venta','cantidad','total_producto'];

    public function productos(){
        return $this->hasMany(Producto::class,'id','producto_id')->get();

    }

    public function venta(){
        return $this->hasOne(Venta::class,'id','venta_id')->get();
    }
}
