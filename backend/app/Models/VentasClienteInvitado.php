<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VentasClienteInvitado extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'ventas_cliente_invitado';

    protected $fillable = ['venta_id','rut','nombres','apellido1','apellido2','fono','email'];

    public function venta(){
        return $this->hasOne(Venta::class,'id','venta_id')->get();
    }
}
