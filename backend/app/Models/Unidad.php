<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Unidad extends Model
{
    use HasFactory;

    use SoftDeletes;


    protected $table = 'unidades';

    protected $fillable = ['nombre','nombre_plural'];

    public function productos()
    {
        return $this->hasMany(Producto::class, 'id')->get();
    }
}
