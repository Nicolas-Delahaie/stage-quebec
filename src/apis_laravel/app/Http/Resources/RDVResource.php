<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RDVResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'horaire' => $this->horaire,
            'jour' => $this->jour,
            'scenario_id' => $this->scenario_id,
            'utilisateur_id' => $this->utilisateur_id,
        ];
    }
}
