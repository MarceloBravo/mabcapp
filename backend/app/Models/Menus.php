<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Menus extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $fillable = ['nombre'];

    public function pantallas(){
        return $this->hasOne('\App\Models\Pantalla','id','pantalla_id')->get();
    }
}
