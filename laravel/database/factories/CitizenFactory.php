<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class CitizenFactory extends Factory
{
    public function definition(): array
    {
        return [
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'password_hash' => Hash::make('password'),
            'full_name' => $this->faker->name(),
            'is_verified' => $this->faker->boolean(80),
            'failed_login_attempts' => $this->faker->numberBetween(0, 5),
            'locked_until' => $this->faker->boolean(10) ? $this->faker->dateTimeBetween('now', '+1 hour') : null,
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_verified' => false,
        ]);
    }

    public function locked(): static
    {
        return $this->state(fn (array $attributes) => [
            'locked_until' => $this->faker->dateTimeBetween('+1 hour', '+24 hours'),
        ]);
    }
}