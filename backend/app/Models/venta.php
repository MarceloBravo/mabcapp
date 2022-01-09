<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class venta extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'ventas';

    protected $fillable = ['fecha_venta_tienda','total','fecha_anulacion'];

    public function clienteInvitado(){
        //return $this->hasOne(VentasClienteInvitado::class, 'venta_id' ,'id')->get();
        return $this->hasOne(VentasClienteInvitado::class, 'venta_id' ,'id')->first();
    }

    public function clienteTienda(){
        return $this->hasOne(VentasClienteTienda::class, 'venta_id' ,'id')
                    ->join('clientes','ventas_cliente_tienda.cliente_id','=','clientes.id')
                    ->first();
    }

    public function detalle(){
        return $this->hasMany(DetalleVenta::class, 'venta_id','id')->get();
    }
}
