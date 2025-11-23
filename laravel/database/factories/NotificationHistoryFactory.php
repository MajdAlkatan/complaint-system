<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class NotificationHistoryFactory extends Factory
{
    public function definition(): array
    {
        $types = ['status_change', 'info_request', 'general', 'assignment'];

        return [
            'citizen_id' => \App\Models\Citizen::factory(),
            'title' => $this->faker->sentence(),
            'message' => $this->faker->paragraph(),
            'type' => $this->faker->randomElement($types),
            'related_complaint_id' => $this->faker->boolean(70) ? \App\Models\Complaint::factory() : null,
            'is_read' => $this->faker->boolean(60),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }

    public function unread(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_read' => false,
        ]);
    }

    public function read(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_read' => true,
        ]);
    }
}