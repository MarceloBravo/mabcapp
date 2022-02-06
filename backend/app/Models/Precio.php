<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Precio extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $table = 'precios';

    protected $fillable = ['producto_id','precio','descuento','fecha_desde','fecha_hasta'];

    public function productos(){
        return $this->belongsToMany(Producto::class,'id')->get();
    }
}
