<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class GovernmentEntityFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->company() . ' Department',
            'description' => $this->faker->paragraph(),
            'contact_email' => $this->faker->companyEmail(),
            'contact_phone' => $this->faker->phoneNumber(),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}