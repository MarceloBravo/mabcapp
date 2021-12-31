<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWebPaysTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('web_pay', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('venta_id')->unsigned();
            $table->string('vci', 10)->nullable();
            $table->bigInteger('ammount')->comment('monto');
            $table->string('buy_order', 15)->nullable();
            $table->string('status', 15)->nullable();
            $table->string('session_id',61);
            $table->string('card_number', 20)->nullable();
            $table->string('card_detail',1000)->nullable();
            $table->string('account_date', 10)->nullable();
            $table->string('transaccion_date',30)->nullable();
            $table->string('authorization_code',15)->nullable();
            $table->string('payment_type_code', 10)->nullable();
            $table->integer('response_code')->nullable();
            $table->integer('installments_numbers')->unsigned()->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('web_pay');
    }
}
