<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('admins', function (Blueprint $table) {

            $table->id('admin_id');

            // Basic Info
            $table->string('email')->unique();
            $table->string('password_hash'); // يفضل استخدام password ولكن التزمت بالتسمية في الصورة


            // Login Logic
            $table->integer('failed_login_attempts')->default(0);
            $table->timestampTz('locked_until')->nullable(); // استخدمنا timestampTz لأن الصورة تطلب TIMESTAMPTZ

            $table->timestampsTz(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admins');
    }
};
