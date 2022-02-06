<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductoImpuesto extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $table = 'producto_impuesto';

    protected $fillable = ['producto_id','impuesto_id'];
}
