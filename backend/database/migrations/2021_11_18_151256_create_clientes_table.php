<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClientesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clientes', function (Blueprint $table) {
            $table->id();
            $table->string('nombres',50);
            $table->string('apellido1',50);
            $table->string('apellido2',50)->nullable();
            $table->string('cod_region',10);
            $table->string('cod_provincia',10);
            $table->string('cod_comuna',10);
            $table->string('ciudad',20);
            $table->string('direccion',255);
            $table->string('password',70);
            $table->string('email',255);
            $table->string('fono',20);
            $table->string('foto',255)->nullable();
            $table->string('casa_num',10);
            $table->string('block_num',10)->nullable();
            $table->string('referencia',255)->nullable();
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
        Schema::dropIfExists('clientes');
    }
}
