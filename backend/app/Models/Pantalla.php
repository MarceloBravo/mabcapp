<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pantalla extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $fillable = ['nombre','url','menus_id'];

    public function menus(){
        return $this->hasOne(Menus::class,'menus_id')->get();
    }
}
