<?php

/**
 * @todo Mettre les ondelete et onedit sur les foreign key +
 * @todo Gerer l'ordre de suppression dans le down() pour que les tables soient bien supprimees
 */
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        // ------------------------------------------------------ //
        //        M O D I F I C A T I O N S   T A B L E S         //
        // ------------------------------------------------------ //
        Schema::table("users", function (Blueprint $table) {
            // Modification de users
            $table->unsignedBigInteger("type_utilisateur_id")->before("email_verified_at");
        });



        // -------------------------------------------- //
        //        C R E A T I O N   T A B L E S         //
        // -------------------------------------------- //
        Schema::create("detail_modification", function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger("oldPonderation")->nullable();
            $table->unsignedTinyInteger("newPonderation")->nullable();
            $table->unsignedBigInteger("professeur_id");
            $table->unsignedBigInteger("cours_propose_id");
            $table->unsignedBigInteger("modification_id");
        });
        Schema::create("type_utilisateur", function (Blueprint $table) {
            $table->id();
            $table->string("nom", 255)->unique();
        });
        Schema::create("cours", function(Blueprint $table){
            $table->id();
            $table->string("nom", 255)->unique();
        });
        Schema::create("liberation", function(Blueprint $table){
            $table->id();
            $table->string("motif", 255)->unique();
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
        Schema::create("rdv", function(Blueprint $table){
            $table->id();
            $table->time("horaire");
            $table->date("jour");
            $table->timestamps();
            $table->unsignedBigInteger("scenario_id");
        });
        Schema::create("modification", function(Blueprint $table){
            $table->id();
            $table->date("date_modif");
            $table->unsignedBigInteger("utilisateur_id")->nullable();
            $table->unsignedBigInteger("scenario_id");
        });
        Schema::create("cours_propose", function (Blueprint $table){
            $table->id();
            $table->unsignedTinyInteger("ponderation");
            $table->unsignedTinyInteger("tailleGroupes")->default(0);
            $table->unsignedSmallInteger("nbGroupes")->default(0);
            $table->unsignedBigInteger("cours_id");
            $table->unsignedBigInteger("departement_id");
            $table->unique(["cours_id", "departement_id"]);
        });
        Schema::create("enseigner", function(Blueprint $table){
            $table->id();
            $table->unsignedTinyInteger("nbGroupes")->default(0);
            $table->unsignedBigInteger("cours_propose_id");
            $table->unsignedBigInteger("professeur_id");
            $table->unique(["cours_propose_id", "professeur_id"]);
        });
        Schema::create("alouer", function(Blueprint $table){
            $table->id();
            $table->unsignedBigInteger("utilisateur_id");
            $table->unsignedBigInteger("liberation_id");
            $table->unsignedSmallInteger("annee")->nullable();
            $table->unsignedTinyInteger("semestre")->nullable();
            $table->unique(["utilisateur_id", "liberation_id", "annee", "semestre"]);
            $table->unsignedDecimal("tempsAloue", 5, 5);
            $table->timestamps();
        });
    


        // -------------------------------------------- //
        //       A J O U T   R E F E R E N C E S       //
        // -------------------------------------------- //
        Schema::table("detail_modification", function (Blueprint $table) {
            $table->foreign("professeur_id")->references("id")->on("users")
                ->onDelete("cascade");
            $table->foreign("cours_propose_id")->references("id")->on("cours_propose")
                ->onDelete("cascade");
            $table->foreign("modification_id")->references("id")->on("modification")
                ->onDelete("cascade");
        });
        Schema::table("users", function (Blueprint $table) {
            $table->foreign("type_utilisateur_id")->references("id")->on("type_utilisateur")
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
        Schema::table("rdv", function(Blueprint $table){
            $table->foreign("scenario_id")->references("id")->on("scenario")
                ->onDelete("CASCADE");
        });
        Schema::table("modification", function(Blueprint $table){
            $table->foreign("utilisateur_id")->references("id")->on("users")
                ->onDelete("SET NULL");
            $table->foreign("scenario_id")->references("id")->on("scenario")
                ->onDelete("CASCADE");
        });
        Schema::table("cours_propose", function (Blueprint $table){
            $table->foreign("cours_id")->references("id")->on("cours")
                ->onDelete("CASCADE");
            $table->foreign("departement_id")->references("id")->on("departement")
                ->onDelete("CASCADE");
        });
        Schema::table("enseigner", function(Blueprint $table){
            $table->foreign("cours_propose_id")->references("id")->on("cours_propose")
                ->onDelete("CASCADE");
            $table->foreign("professeur_id")->references("id")->on("users")
                ->onDelete("CASCADE");
        });
        Schema::table("alouer", function(Blueprint $table){
            $table->foreign("utilisateur_id")->references("id")->on("users")
                ->onDelete("CASCADE");
            $table->foreign("liberation_id")->references("id")->on("liberation")
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
        $nomsTables = array("details_modification", "alouer", "liberation", "cours", "cours_propose", "enseigner", "rdv",  "modification", "organiser", "type_utilisateur","departement","scenario");
        foreach($nomsTables as $nomTable){Schema::dropIfExists($nomTable);}

        
        // SUPPRESSION MODIFICATIONS
        if (Schema::hasColumn("users", "type_utilisateur_id")){
            Schema::table('users', function (Blueprint $table) {
                $table->dropForeign(['type_utilisateur_id']);
                $table->dropColumn('type_utilisateur_id');
            });
        }
    }
};