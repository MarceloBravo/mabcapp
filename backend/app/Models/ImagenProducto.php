<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ImagenProducto extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $table = 'imagenes_producto';

    protected $fillable = ['producto_id','source_image','imagen_principal'];

    public function producto(){
        return $this->belongsTo(Producto::class,'id','producto_id')->get();
    }
}
