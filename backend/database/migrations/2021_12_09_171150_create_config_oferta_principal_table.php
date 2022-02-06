<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateConfigOfertaPrincipalTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('config_oferta_principal', function (Blueprint $table) {
            $table->id();
            $table->string('texto1',50)->nullable();
            $table->string('texto2',50)->nullable();
            $table->string('texto_boton',50)->nullable();
            $table->string('src_imagen',500);
            $table->string('link',500)->nullable();
            $table->string('posicion_horizontal',10)->default('pos_center');
            $table->string('posicion_vertical',10)->default('pos_middle');
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
        Schema::dropIfExists('config_oferta_principal');
    }
}
