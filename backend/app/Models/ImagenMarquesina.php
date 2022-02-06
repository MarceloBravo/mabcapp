<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class ImagenMarquesina extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $table = 'imagenes_marquesina_home';

    protected $fillable = [
        'src_imagen','texto','texto2','texto_boton',
        'link','posicion','posicion_horizontal','posicion_vertical'
    ];
}
