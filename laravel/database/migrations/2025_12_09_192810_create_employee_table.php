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
        Schema::create('employees', function (Blueprint $table) {
            // PK: employee_id
            // استخدمنا هذا الاسم بدلاً من id الافتراضي ليطابق الصورة
            $table->id('employee_id');

            // Basic Info
            $table->string('email')->unique();
            $table->string('password_hash'); // يفضل استخدام password ولكن التزمت بالتسمية في الصورة
            $table->string('username')->unique();
            $table->boolean('is_verified')->default(false);
            
            // Foreign Key: government_entity_id
            // يفترض أن جدول government_entities موجود مسبقاً
            $table->foreignId('government_entity_id')
                  ->nullable() // جعلته يقبل null تحسباً للأخطاء، يمكنك إزالته إذا كان الحقل إلزامياً
                  ->constrained('government_entities')->references('government_entities_id')
                  ->nullOnDelete();

            // Login Logic
            $table->integer('failed_login_attempts')->default(0);
            $table->timestampTz('locked_until')->nullable(); // استخدمنا timestampTz لأن الصورة تطلب TIMESTAMPTZ

            $table->string('position', 100)->nullable();

            // Audit: created_by
            // يفترض أن جدول admins موجود مسبقاً
            $table->foreignId('created_by')
                  ->nullable()
                  ->constrained('admins')->references('admin_id')
                  ->nullOnDelete();

            // Permissions (Booleans with Defaults)
            $table->boolean('can_add_notes_on_complaints')->default(true);
            $table->boolean('can_request_more_info_on_complaints')->default(true);
            $table->boolean('can_change_complaints_status')->default(true);
            $table->boolean('can_view_reports')->default(false);
            $table->boolean('can_export_data')->default(false);

            // Audit: permissions_updated_by
            $table->foreignId('permissions_updated_by')
                  ->nullable()
                  ->constrained('admins')->references('admin_id')
                  ->nullOnDelete();

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
        Schema::dropIfExists('employee');
    }
};
