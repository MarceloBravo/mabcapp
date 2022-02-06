<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductosSeccionesHomeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('productos_secciones_home', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('seccion_id')->references('secciones_home')->on('id');
            $table->bigInteger('producto_id')->references('productos')->on('id');
            $table->string('texto1',100)->nullable();
            $table->string('texto2',100)->nullable();
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
        Schema::dropIfExists('productos_secciones_home');
    }
}
