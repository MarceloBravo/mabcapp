<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubCategoria extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $table =  'sub_categoria';

    protected $fillable = ['nombre', 'categoria_id'];

    public function categoria(){
        return $this->hasOne(Categoria::class,'categoria_id')->get();
    }
}
