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
            $table->bigInteger('talla_id')->references('tallas')->on();
            $table->bigInteger('sub_categoria_id')->references('sub_categorias')->on('id');
            $table->bigInteger('producto_id')->references('productos')->on('id');
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
