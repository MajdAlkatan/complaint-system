<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class InformationRequestFactory extends Factory
{
    public function definition(): array
    {
        return [
            'complaint_id' => \App\Models\Complaint::factory(),
            'requested_by' => \App\Models\Employee::factory(),
            'request_message' => $this->faker->paragraph(),
            'requested_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}