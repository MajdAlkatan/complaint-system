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
        Schema::create('citizen', function (Blueprint $table) {
            // PK: employee_id
            // استخدمنا هذا الاسم بدلاً من id الافتراضي ليطابق الصورة
            $table->id('citizen_id');

            // Basic Info
            $table->string('email')->unique();
            $table->string('password_hash'); // يفضل استخدام password ولكن التزمت بالتسمية في الصورة
            $table->string('full_name')->unique();
            $table->boolean('is_verified');
            

            // Login Logic
            $table->integer('failed_login_attempts')->default(0);
            $table->timestampTz('locked_until')->nullable(); // استخدمنا timestampTz لأن الصورة تطلب TIMESTAMPTZ

            // created_at & updated_at (TIMESTAMPTZ)
            // في لارافيل timestamps() تنشئ الحقلين معاً
            $table->timestampsTz(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('citizen');
    }
};
