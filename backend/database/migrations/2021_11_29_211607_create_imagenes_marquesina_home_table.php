<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateImagenesMarquesinaHomeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('imagenes_marquesina_home', function (Blueprint $table) {
            $table->id();
            $table->string('src_imagen', 500);
            $table->string('texto',200)->nullable();
            $table->string('link',255)->nullable();
            $table->integer('posicion')->unsigned();
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
        Schema::dropIfExists('imagenes_marquesina_home');
    }
}
