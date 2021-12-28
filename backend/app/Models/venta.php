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
        return $this->hasMany(VentasClienteInvitado::class, 'venta_id' ,'id')->get();
    }

    public function clienteTienda(){
        return $this->hasMany(VentasClienteTienda::class, 'venta_id' ,'id')->get();
    }
}
