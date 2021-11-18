<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cliente extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $table = 'clientes';

    protected $fillable = [
        'rut','nombres','apellido1','apellido2','cod_region','cod_provincia','cod_comuna',
        'ciudad','direccion','password','email','fono','foto','casa_num','block_num',
        'referencia'
    ];

    public function setPasswordAttribute($value)
	{
		$this->attributes['password'] = bcrypt($value);
	}


    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}
