<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TallasProducto extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $table = 'tallas_productos';

    protected $fillable = ['talla_id','sub_categoria_id','producto_id'];

    public function productos(){
        return $this->hasMany(Producto::class,'id','producto_id')->get();
    }

    public function subCategorias(){
        return $this->hasMany(SubCategoria::class,'id','sub_categoria_id')->get();
    }
}
