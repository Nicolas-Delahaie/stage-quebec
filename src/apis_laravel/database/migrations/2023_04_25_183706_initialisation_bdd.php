<?php

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
            $table->unsignedDecimal("temps_aloue", 5, 5);
            $table->timestamps();
        });
        Schema::create("liberation", function (Blueprint $table) {
            $table->id();
            $table->string("motif", 255)->unique();
        });
        Schema::create("cours", function (Blueprint $table) {
            $table->id();
            $table->string("nom", 255);
            $table->unsignedTinyInteger("nb_groupes");
            $table->unsignedFloat("taille_groupes");
            $table->unsignedSmallInteger("ponderation");
            $table->unsignedBigInteger("departement_id");
            $table->unique(["nom", "departement_id"]);
        });
        Schema::create("cours_enseigne", function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger("nb_groupes");
            $table->unsignedBigInteger("cours_id");
            $table->unsignedBigInteger("user_id");
            $table->unsignedBigInteger("scenario_id");
            $table->unique(["cours_id", "user_id", "scenario_id"]);
        });
        Schema::create("type_utilisateur", function (Blueprint $table) {
            $table->id();
            $table->string("nom", 255)->unique();
        });
        Schema::create("modification", function (Blueprint $table) {
            $table->id();
            $table->date("date_modif");
            $table->text("explications");
            $table->unsignedBigInteger("utilisateur_id")->nullable();
            $table->unsignedBigInteger("scenario_id");
        });
        Schema::create("detail_modification", function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger("old_valeur")->nullable();
            $table->unsignedTinyInteger("new_valeur")->nullable();
            $table->unsignedBigInteger("cours_enseigne_id");
            $table->unsignedBigInteger("modification_id");
        });
        Schema::create("departement", function (Blueprint $table) {
            $table->id();
            $table->string("nom", 255)->unique();
            $table->smallInteger("nb_eleves");
            $table->unsignedBigInteger("coordonnateur_id")->nullable();
        });
        Schema::create("scenario", function (Blueprint $table) {
            $table->id();
            $table->boolean("aEteValide")->default(false);
            $table->unsignedSmallInteger("annee");
            $table->unsignedTinyInteger("session");
            $table->timestamps();
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
        Schema::table("cours", function (Blueprint $table) {
            $table->foreign("departement_id")->references("id")->on("departement")
                ->onDelete("cascade");
        });
        Schema::table("cours_enseigne", function (Blueprint $table) {
            $table->foreign("cours_id")->references("id")->on("cours")
                ->onDelete("cascade");
            $table->foreign("user_id")->references("id")->on("users")
                ->onDelete("cascade");
            $table->foreign("scenario_id")->references("id")->on("scenario")
                ->onDelete("cascade");
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
        $nomsTables = array("alouer", "liberation", "cours", "cours_enseigne", "type_utilisateur", "modification", "detail_modification", "departement", "scenario", "rdv");
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