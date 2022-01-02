<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDespachosVentasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('despachos_ventas', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('venta_id')->unsigned();
            $table->foreign('venta_id')->references('id')->on('ventas');
            $table->string('direccion',255);
            $table->string('region',10);
            $table->string('provincia',10);
            $table->string('comuna',10);
            $table->string('ciudad',20);
            $table->string('casa_num',10);
            $table->string('block_num',10);
            $table->string('referencia',255)->nullable();
            $table->bigInteger('shipping_cod');
            $table->timestamp('fecha_despacho')->nullable();
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
        Schema::dropIfExists('despachos_ventas');
    }
}
