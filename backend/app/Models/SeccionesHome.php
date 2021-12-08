<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SeccionesHome extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $table = 'secciones_home';

    protected $fillable = ['nombre'];

    public function productos(){
        return $this->hasMany(ProductoSeccionHome::class, 'seccion_id')->get();
    }
}
