<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Permisos extends Model
{
    use HasFactory, softDeletes;

    protected $table = 'permisos';

    protected $fillable = ['roles_id','pantallas_id','acceder','crear','modificar','eliminar'];

    public function roles()
    {
        return $this->belongsToMany('app/Models/Role','id');
    }

    public function pantallas()
    {
        return $this->belongsToMany('app\Models\Pantalla','id');
    }
}
