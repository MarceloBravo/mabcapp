<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GrupoMenu extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'grupos_menus';

    protected $fillable = ['nombre','posicion'];

    public function getMenus()
    {
        return $this->hasMany('\App\Models\Menu','grupos_menus_id','id')->get();
    }
}
