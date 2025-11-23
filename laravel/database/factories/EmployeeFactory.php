<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class EmployeeFactory extends Factory
{
    public function definition(): array
    {
        return [
            'email' => $this->faker->unique()->safeEmail(),
            'password_hash' => Hash::make('password'),
            'username' => $this->faker->unique()->userName(),
            'is_verified' => $this->faker->boolean(90),
            'government_entity_id' => \App\Models\GovernmentEntity::factory(),
            'failed_login_attempts' => $this->faker->numberBetween(0, 5),
            'locked_until' => $this->faker->boolean(10) ? $this->faker->dateTimeBetween('now', '+1 hour') : null,
            'position' => $this->faker->jobTitle(),
            'created_by' => \App\Models\Admin::factory(),
            'can_add_notes_on_complaints' => $this->faker->boolean(80),
            'can_request_more_info_on_complaints' => $this->faker->boolean(80),
            'can_change_complaints_status' => $this->faker->boolean(70),
            'can_view_reports' => $this->faker->boolean(50),
            'can_export_data' => $this->faker->boolean(30),
            'permissions_updated_by' => \App\Models\Admin::factory(),
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

    public function withFullPermissions(): static
    {
        return $this->state(fn (array $attributes) => [
            'can_add_notes_on_complaints' => true,
            'can_request_more_info_on_complaints' => true,
            'can_change_complaints_status' => true,
            'can_view_reports' => true,
            'can_export_data' => true,
        ]);
    }
}