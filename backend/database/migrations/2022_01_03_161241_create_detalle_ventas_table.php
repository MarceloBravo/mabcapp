<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDetalleVentasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('detalle_ventas', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('venta_id')->unsigned();
            $table->foreign('venta_id')->references('id')->on('ventas');
            $table->bigInteger('producto_id')->unsigned();
            $table->foreign('producto_id')->references('id')->on('productos');
            $table->bigInteger('precio_neto')->comment('Precio unitario neto, sin impuestos');
            $table->bigInteger('impuestos')->comment('Promedio del porcentaje de los impuestos');
            $table->string('JSON_impuestos',300)->nullable();
            $table->bigInteger('precio_venta')->comment('Precio unitario con impuestos');
            $table->bigInteger('cantidad');
            $table->bigInteger('total_producto')->comment('Precio del producto con impuestos * cantidad');
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
        Schema::dropIfExists('detalle_ventas');
    }
}
