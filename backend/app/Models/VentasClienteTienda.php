<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VentasClienteTienda extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'ventas_cliente_tienda';

    protected $fillable = ['venta_id','cliente_id'];

    public function cliente(){
        return $this->hasOne(Cliente::class, 'id')->get();
    }

    public function venta(){
        return $this->hasOne(Venta::class, 'id', 'venta_id')->get();
    }
}
