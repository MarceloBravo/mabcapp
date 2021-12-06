<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Marca extends Model
{
    use SoftDeletes;

    use HasFactory;

    protected $fillable = ['nombre','src_imagen'];

    public function productos()
    {
        return $this->hasMany(Producto::class, 'id')->get();
    }

}
