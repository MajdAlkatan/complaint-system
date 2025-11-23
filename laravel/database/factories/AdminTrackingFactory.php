<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class AdminTrackingFactory extends Factory
{
    public function definition(): array
    {
        $actions = [
            'CREATED_EMP_ACCOUNT',
            'ADD_NOTE_ON_COMPLAINT',
            'REQUESTED_INFO_ON_COMPLAINT',
            'CHANGED_COMPLAINT_STATUS',
            'DELETED_CITIZEN_ACCOUNT',
            'DELETED_EMP_ACCOUNT',
            'EXPORTED_REPORT',
        ];

        return [
            'admin_id' => \App\Models\Admin::factory(),
            'action' => $this->faker->randomElement($actions),
            'employee_id' => $this->faker->boolean(50) ? \App\Models\Employee::factory() : null,
            'complaint_id' => $this->faker->boolean(50) ? \App\Models\Complaint::factory() : null,
            'citizen_id' => $this->faker->boolean(50) ? \App\Models\Citizen::factory() : null,
            'report_id' => $this->faker->boolean(30) ? $this->faker->randomNumber() : null,
            'timestamp' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}