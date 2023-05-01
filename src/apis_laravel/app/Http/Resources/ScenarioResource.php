<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScenarioResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=> $this->id,
            'aEteValide'=> $this->aEteValide,
            'annee'=> $this->annee,
            'created_at'=> $this->created_at,
            'updated_at'=> $this->updated_at,
            'proprietaire_id'=> $this->proprietaire_id,
            'departement_id'=> $this->departement_id,
        ];
    }
}
