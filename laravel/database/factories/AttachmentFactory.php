<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class AttachmentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'complaint_id' => \App\Models\Complaint::factory(),
            'file_path' => $this->faker->filePath(),
            'file_type' => $this->faker->randomElement(['jpg', 'png', 'pdf', 'docx']),
            'uploaded_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}