<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Producto extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $table = 'productos';

    protected $fillable = [
        'nombre','descripcion','precio_venta_normal',
        'stock','unidad_id','marca_id','categoria_id',
        'sub_categoria_id'
    ];

    public function unidad()
    {
        return $this->belongsTo(Unidad::class,'unidad_id','id')->get();
    }

    public function marca()
    {
        return $this->belongsTo(Marca::class,'marca_id','id')->get();
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class,'categoria_id','id')->get();
    }

    public function subCategoria()
    {
        return $this->belongsTo(SubCategoria::class,'sub_categoria_id','id')->get();
    }

    public function impuestos()
    {
        return $this->belongsToMany(Impuesto::class, 'producto_impuesto')->get();
    }

    public function imagenes()
    {
        return $this->hasMany(ImagenProducto::class, 'producto_id')->get();
    }
}
