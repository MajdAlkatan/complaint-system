<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ComplaintFactory extends Factory
{
    public function definition(): array
    {
        $statuses = ['new', 'pending', 'in_progress', 'completed', 'rejected'];
        
        return [
            'reference_number' => $this->faker->uuid(),
            'citizen_id' => \App\Models\Citizen::factory(),
            'entity_id' => \App\Models\GovernmentEntity::factory(),
            'complaint_type' => $this->faker->word(),
            'location' => $this->faker->address(),
            'description' => $this->faker->paragraphs(3, true),
            'status' => $this->faker->randomElement($statuses),
            'completed_at' => $this->faker->boolean(30) ? $this->faker->dateTimeBetween('-6 months', 'now') : null,
            'locked' => $this->faker->boolean(10),
            'locked_by_employee_id' => $this->faker->boolean(10) ? \App\Models\Employee::factory() : null,
            'locked_at' => $this->faker->boolean(10) ? $this->faker->dateTimeBetween('-1 month', 'now') : null,
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'completed_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ]);
    }

    public function locked(): static
    {
        return $this->state(fn (array $attributes) => [
            'locked' => true,
            'locked_by_employee_id' => \App\Models\Employee::factory(),
            'locked_at' => $this->faker->dateTimeBetween('-1 week', 'now'),
        ]);
    }
}