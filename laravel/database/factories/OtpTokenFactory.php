<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class OtpTokenFactory extends Factory
{
    public function definition(): array
    {
        return [
            'token' => $this->faker->numerify('######'),
            'expires_at' => $this->faker->dateTimeBetween('+30 minutes', '+1 hour'),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }

    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'expires_at' => $this->faker->dateTimeBetween('-1 hour', '-1 minute'),
        ]);
    }
}