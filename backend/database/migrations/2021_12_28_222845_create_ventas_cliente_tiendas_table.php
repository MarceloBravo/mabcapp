<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVentasClienteTiendasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ventas_cliente_tiendas', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('venta_id')->unsigned()->references('ventas')->on('id');
            $table->bigInteger('cliente_id')->unsigned()->references('clientes')->ob('id');
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
        Schema::dropIfExists('ventas_cliente_tiendas');
    }
}
