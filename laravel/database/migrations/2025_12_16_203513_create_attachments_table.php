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
        Schema::create('attachments', function (Blueprint $table) {
            $table->id('attachments_id');
            $table->foreignId('complaint_id')->constrained('complaints')->references('complaints_id');
            $table->text('file_path')->nullable(false);
            $table->string('file_type')->nullable(false);
            $table->timestampTz('uploaded_at')->default(now());
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attachments');
    }
};
