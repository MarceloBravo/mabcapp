<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Menu extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $fillable = ['nombre','url','menu_padre_id','posicion','grupos_menus_id'];

    public function pantallas(){
        return $this->hasOne('\App\Models\Pantalla','id','pantalla_id')->get();
    }

    public function gerGrupo(){
        return $this->belongsTo('\App\Models\GrupoMenu','id','grupos_menu_id')->get();
    }
}
