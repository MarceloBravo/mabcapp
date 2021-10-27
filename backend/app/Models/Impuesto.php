<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Impuesto extends Model
{
    use SoftDeletes;

    use HasFactory;

    protected $table = "impuestos";

    protected $fillable = ['nombre', 'sigla', 'porcentaje'];
}
