<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConfigOfertaPrincipal extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $table = 'config_oferta_principal';

    protected $fillable = ['texto1','texto2','texto_boton','src_imagen','link','posicion_horizontal','posicion_vertical'];
}
