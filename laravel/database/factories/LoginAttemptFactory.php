<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class LoginAttemptFactory extends Factory
{
    public function definition(): array
    {
        return [
            'citizen_id' => $this->faker->boolean(50) ? \App\Models\Citizen::factory() : null,
            'employee_id' => $this->faker->boolean(50) ? \App\Models\Employee::factory() : null,
            'email' => $this->faker->safeEmail(),
            'ip_address' => $this->faker->ipv4(),
            'success' => $this->faker->boolean(70),
            'attempt_time' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }

    public function successful(): static
    {
        return $this->state(fn (array $attributes) => [
            'success' => true,
        ]);
    }

    public function failed(): static
    {
        return $this->state(fn (array $attributes) => [
            'success' => false,
        ]);
    }
}