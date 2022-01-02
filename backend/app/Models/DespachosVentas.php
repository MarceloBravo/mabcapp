<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DespachosVentas extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'despachos_ventas';

    protected $fillable = ['venta_id',
                            'direccion',
                            'region',
                            'provincia',
                            'comuna',
                            'ciudad',
                            'casa_num',
                            'block_num',
                            'referencia',
                            'shipping_cod',
                            'fecha_despacho'];

    public function venta(){
        return $this->hasOne(Venta::class,'id','venta_id')->get();
    }
}
