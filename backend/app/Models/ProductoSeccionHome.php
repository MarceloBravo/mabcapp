<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductoSeccionHome extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $table = 'productos_secciones_home';

    protected $fillable = ['producto_id','seccion_id','texto1','texto2'];

    public function seccion()
    {
        return $this->hasMany(SeccionesHome::class, 'id')->get();
    }
}
