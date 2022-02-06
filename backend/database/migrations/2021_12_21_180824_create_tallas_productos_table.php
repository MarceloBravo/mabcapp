<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTallasProductosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tallas_productos', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('talla_id')->unsigned();
            $table->foreign('talla_id')->references('id')->on('tallas');
            $table->bigInteger('sub_categoria_id')->unsigned();
            $table->foreign('sub_categoria_id')->references('id')->on('sub_categorias');
            $table->bigInteger('producto_id')->unsigned();
            $table->foreign('producto_id')->references('id')->on('productos');
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
        Schema::dropIfExists('tallas_productos');
    }
}
