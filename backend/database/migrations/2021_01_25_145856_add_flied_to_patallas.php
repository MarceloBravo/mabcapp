<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFliedToPatallas extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pantallas', function (Blueprint $table) {
            $table->bigInteger('menus_id')->unsigned();
            $table->foreign('menus_id')->references('id')->on('menus');
            //
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('patallas', function (Blueprint $table) {
            //
        });
    }
}
