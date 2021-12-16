<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Categoria extends Model
{
    use SoftDeletes;

    use HasFactory;

    protected $table = 'categorias';

    protected $fillable = ['nombre','src_imagen','link'];

    public function subCategorias(){
        return $this->hasMany(SubCategoria::class,'categoria_id','id')->get();
    }

    public function productos()
    {
        return $this->hasMany(Producto::class, 'id')->get();
    }

}
