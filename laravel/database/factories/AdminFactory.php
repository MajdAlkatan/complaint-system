<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class AdminFactory extends Factory
{
    public function definition(): array
    {
        return [
            'email' => $this->faker->unique()->safeEmail(),
            'password_hash' => Hash::make('password'),
            'failed_login_attempts' => $this->faker->numberBetween(0, 3),
            'locked_until' => $this->faker->boolean(5) ? $this->faker->dateTimeBetween('now', '+1 hour') : null,
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }

    public function locked(): static
    {
        return $this->state(fn (array $attributes) => [
            'locked_until' => $this->faker->dateTimeBetween('+1 hour', '+24 hours'),
        ]);
    }
}