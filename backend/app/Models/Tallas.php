<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tallas extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $table = 'tallas';

    protected $fillable = ['sub_categoria_id','talla'];

    public function subCategoria(){
        return $this->hasOne(SubCategoria::class,'id','sub_categoria_id')->get();
    }
}
