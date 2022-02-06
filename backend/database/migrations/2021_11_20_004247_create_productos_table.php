<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 255);
            $table->string('descripcion', 1000);
            $table->bigInteger('precio_venta_normal')->unsigned();
            $table->integer('stock')->unsigned();
            $table->bigInteger('unidad_id')->references('unidades')->on('id');
            $table->bigInteger('marca_id')->references('marcas')->on('id');
            $table->bigInteger('categoria_id')->references('categorias')->on('id');
            $table->bigInteger('sub_categoria_id')->references('sub_categorias')->on('id');
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
        Schema::dropIfExists('productos');
    }
}
