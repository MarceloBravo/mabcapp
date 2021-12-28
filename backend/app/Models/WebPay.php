<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WebPay extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'web_pay';

    protected $fillable = ['venta_id','vci','ammount','buy_order','status','session_id','card_number',
                        'card_detail','account_date','transaccion_date','authorization_code',
                        'payment_type_code','response_code','installments_numbers'];
}
