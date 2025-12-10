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
        Schema::create('government_entities', function (Blueprint $table) {
            // PK: government_entities_id
            // نستخدم هذا الاسم بدلاً من id الافتراضي كما هو مطلوب في المخطط
            $table->id('government_entities_id');

            // name VARCHAR(255) NOT NULL UNIQUE
            $table->string('name')->unique();

            // description TEXT
            $table->text('description')->nullable();

            // contact_email VARCHAR(255)
            $table->string('contact_email')->nullable();

            // contact_phone VARCHAR(20)
            $table->string('contact_phone', 20)->nullable();

            // created_at TIMESTAMPTZ DEFAULT NOW()
            // في المخطط يوجد created_at فقط، ولا يوجد updated_at
            // لذا نستخدم timestampTz ونحدد useCurrent
            $table->timestampTz('created_at')->useCurrent();
            
            // إذا كنت تريد إضافة updated_at أيضاً (وهو الأفضل في لارافيل) يمكنك استخدام:
            // $table->timestampsTz(); 
            // لكن سألتزم بالمخطط وأضيف created_at فقط
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('government_entities');
    }
};
