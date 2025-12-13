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
        Schema::create('complaints', function (Blueprint $table) {
           // PK: complaints_id
            $table->id('complaints_id');

            // reference_number (UUID)
            // الصورة تطلب VARCHAR(50) ولكن بما أنها UUID يفضل استخدام دالة uuid()
            $table->uuid('reference_number')->unique();

            // Foreign Key: citizen_id -> users(id)
            $table->foreignId('citizen_id')
                  ->constrained('citizens')->references('citizen_id')
                  ->cascadeOnDelete(); // أو restrictOnDelete حسب منطق العمل

            // Foreign Key: entity_id -> government_entities(id)
            $table->foreignId('entity_id')
                  ->constrained('government_entities')->references('government_entities_id')
                  ->noActionOnDelete();

            // Foreign Key: complaint_type -> complaint_types(id)
            // ملاحظة: الصورة تقول complaint_type REFERENCES complaint_types
            // غالباً المقصود هو complaint_type_id، لكن سألتزم بالاسم complaint_type كما في الصورة
            $table->foreignId('complaint_type')
                  ->constrained('complaint_types') 
                  ->cascadeOnDelete();

            // location TEXT
            $table->text('location')->nullable(); // جعلته nullable لأنه غير محدد كـ NOT NULL بوضوح في كل الحالات

            // description TEXT NOT NULL
            $table->text('description');

            // status ENUM ('new', 'pending', 'in_progress', 'completed', 'rejected')
            // Default: 'new'
            $table->enum('status', ['new', 'pending', 'in_progress', 'completed', 'rejected'])
                  ->default('new');

            // completed_at TIMESTAMPTZ
            $table->timestampTz('completed_at')->nullable();

            // locked BOOLEAN DEFAULT 'false'
            $table->boolean('locked')->default(false);

            // Foreign Key: locked_by_employee_id -> employees(id)
            $table->foreignId('locked_by_employee_id')
                  ->nullable() // يجب أن يكون nullable لأن الشكوى قد لا تكون مقفلة
                  ->constrained('employees')->references('employee_id')
                  ->nullOnDelete();

            // locked_at TIMESTAMPTZ DEFAULT NOW()
            // ملاحظة: usually locked_at should be null by default until it is locked
            // ولكن الصورة تطلب DEFAULT NOW()، وهذا قد يعني وقت الإنشاء. 
            // سأضعه nullable ليكون أكثر منطقية برمجياً إلا إذا كنت تريد إجبار وقت
            $table->timestampTz('locked_at')->nullable(); // أو useCurrent() إذا أردت الالتزام بالصورة حرفياً

            // created_at & updated_at (TIMESTAMPTZ)
            $table->timestampsTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
