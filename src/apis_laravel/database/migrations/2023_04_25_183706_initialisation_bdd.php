<?php

/**
 * @todo Mettre les ondelete et onedit sur les foreign key +
 * @todo Gerer l'ordre de suppression dans le down() pour que les tables soient bien supprimees
 */
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // -------------------------------------------- //
        //        C R E A T I O N   T A B L E S         //
        // -------------------------------------------- //
        Schema::create("alouer", function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("utilisateur_id");
            $table->unsignedBigInteger("liberation_id");
            $table->unsignedSmallInteger("annee")->nullable();
            $table->unsignedTinyInteger("semestre")->nullable();
            $table->unique(["utilisateur_id", "liberation_id", "annee", "semestre"]);
            $table->unsignedDecimal("tempsAloue", 5, 5);
            $table->timestamps();
        });
        Schema::create("liberation", function (Blueprint $table) {
            $table->id();
            $table->string("motif", 255)->unique();
        });
        Schema::create("cours", function (Blueprint $table) {
            $table->id();
            $table->string("nom", 255)->unique();
        });
        Schema::create("type_utilisateur", function (Blueprint $table) {
            $table->id();
            $table->string("nom", 255)->unique();
        });
        Schema::create("modification", function (Blueprint $table) {
            $table->id();
            $table->date("date_modif");
            $table->unsignedBigInteger("utilisateur_id")->nullable();
            $table->unsignedBigInteger("scenario_id");
        });
        Schema::create("detail_modification", function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger("oldPonderation")->nullable();
            $table->unsignedTinyInteger("newPonderation")->nullable();
            $table->unsignedBigInteger("professeur_id");
            $table->unsignedBigInteger("cours_id");
            $table->unsignedBigInteger("modification_id");
        });
        Schema::create("departement", function (Blueprint $table) {
            $table->id();
            $table->string("nom", 255)->unique();
            $table->smallInteger("nbEleves");
            $table->unsignedBigInteger("coordonnateur_id")->nullable();
        });
        Schema::create("scenario", function (Blueprint $table) {
            $table->id();
            $table->boolean("aEteValide")->default(false);
            $table->unsignedSmallInteger("annee");
            $table->timestamps();
            $table->unsignedBigInteger("proprietaire_id")->nullable();
            $table->unsignedBigInteger("departement_id");
        });
        Schema::create("rdv", function (Blueprint $table) {
            $table->id();
            $table->time("horaire");
            $table->date("jour");
            $table->timestamps();
            $table->unsignedBigInteger("scenario_id");
        });



        // -------------------------------------------- //
        //       A J O U T   R E F E R E N C E S       //
        // -------------------------------------------- //
        Schema::table("alouer", function (Blueprint $table) {
            $table->foreign("utilisateur_id")->references("id")->on("users")
                ->onDelete("CASCADE");
            $table->foreign("liberation_id")->references("id")->on("liberation")
                ->onDelete("CASCADE");
        });
        Schema::table("users", function (Blueprint $table) {
            $table->foreign("type_utilisateur_id")->references("id")->on("type_utilisateur")
                ->onDelete("cascade");
            $table->foreign("departement_id")->references("id")->on("departement")
                ->onDelete("cascade");
        });
        Schema::table("modification", function (Blueprint $table) {
            $table->foreign("utilisateur_id")->references("id")->on("users")
                ->onDelete("SET NULL");
            $table->foreign("scenario_id")->references("id")->on("scenario")
                ->onDelete("CASCADE");
        });
        Schema::table("detail_modification", function (Blueprint $table) {
            $table->foreign("professeur_id")->references("id")->on("users")
                ->onDelete("cascade");
            $table->foreign("cours_enseigne_id")->references("id")->on("cours_enseigne")
                ->onDelete("cascade");
            $table->foreign("modification_id")->references("id")->on("modification")
                ->onDelete("cascade");
        });
        Schema::table("departement", function (Blueprint $table) {
            $table->foreign("coordonnateur_id")->references("id")->on("users")
                ->onDelete("SET NULL");
        });
        Schema::table("scenario", function (Blueprint $table) {
            $table->foreign("proprietaire_id")->references("id")->on("users")
                ->onDelete("SET NULL");
            $table->foreign("departement_id")->references("id")->on("departement")
                ->onDelete("CASCADE");
        });
        Schema::table("rdv", function (Blueprint $table) {
            $table->foreign("scenario_id")->references("id")->on("scenario")
                ->onDelete("CASCADE");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // DESACTIVATION REFERENCES
        Schema::disableForeignKeyConstraints();

        // SUPPRESSION TABLES CREES
        $nomsTables = array("alouer", "liberation", "cours", "type_utilisateur", "modification", "detail_modification", "departement", "scenario", "rdv");
        foreach ($nomsTables as $nomTable) {
            Schema::dropIfExists($nomTable);
        }

        // SUPPRESSION CLES ETRANGERES AJOUTEES SEULES
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['type_utilisateur_id']);
            $table->dropForeign(['departement_id']);
            $table->dropColumn('type_utilisateur_id');
            $table->dropColumn('departement_id');
        });
    }
};