<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ModificationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'date_modif' => $this->date_modif,
            'utilisateur_id' => $this->utilisateur_id,
            'scenario_id' => $this->scenario_id,
        ];
    }
}
