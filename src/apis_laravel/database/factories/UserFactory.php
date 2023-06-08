<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = \App\Models\TypeUtilisateur::inRandomOrder()->first();
        $departement_id = $type->nom === 'professeur' ? \App\Models\Departement::inRandomOrder()->first()->id : null;
        return [
            'prenom' => fake()->firstName(),
            'nom' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
            // password
            'statut' => fake()->randomElement(['P', 'TP']),
            'contraintes' => fake()->paragraphs(1, true),
            'type_utilisateur_id' => $type->id,
            'departement_id' => $departement_id,
            'remember_token' => Str::random(10),
            'departement_id' => fake()->numberBetween(1, \App\Models\Departement::count()),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}