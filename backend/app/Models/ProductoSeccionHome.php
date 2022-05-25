<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use DB;

class ProductoSeccionHome extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $table = 'productos_secciones_home';

    protected $fillable = ['producto_id','seccion_id','texto1','texto2'];

    public function seccion()
    {
        return $this->belongsTo(SeccionesHome::class, 'seccion_id', 'id')->get();
    }

    public function producto(){
        return $this->belongsTo(Producto::class,'producto_id')->get();
    }
}
