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
        // ------- CREATION TABLES --------
        // TABLES 0 DEPENDANCE
        Schema::create("TYPE_UTILISATEUR", function (Blueprint $table) {
            $table->id();

            $table->string("nom", 255)->unique();
            $table->timestamps();
        });
        Schema::create("COURS", function(Blueprint $table){
            $table->id();

            $table->string("nom", 255)->unique();
        });
        Schema::create("LIBERATION", function(Blueprint $table){
            $table->id();

            $table->string("motif", 255)->unique();
        });

        // TABLES 1 DEPENDANCE
        Schema::table("users", function (Blueprint $table) {
            // Modification de users
            $table->string("contraintes", 255)->nullable();
            $table->foreignId("type_utilisateur_id")->references("id")->on("TYPE_UTILISATEUR");
                // ->constrained()
                // ->onDelete("set null")
                // ->onUpdate("cascade");
        });
        Schema::create("DEPARTEMENT", function (Blueprint $table) {
            $table->id();

            $table->string("nom", 255)->unique();
            $table->foreignId("coordonnateur_id")->references("id")->on("users");
                // ->onDelete("SET NULL")
                // ->onUpdate("CASCADE");
        });
        Schema::create("SCENARIO", function (Blueprint $table) {
            $table->id();

            $table->boolean("aEteValide")->default(false);
            $table->foreignId("proprietaire_id")->references("id")->on("users");
                // ->onDelete("SET NULL")
                // ->onUpdate("CASCADE");
            $table->foreignId("departement_id")->references("id")->on("DEPARTEMENT");
                // ->onDelete("CASCADE")
                // ->onUpdate("CASCADE");
            $table->timestamps();
        });        
        Schema::create("RDV", function(Blueprint $table){
            $table->id();

            $table->time("horaire");
            $table->date("jour");
            $table->foreignId("scenario_id")->references("id")->on("SCENARIO");
                // ->onDelete("CASCADE")
                // ->onUpdate("CASCADE");
            $table->timestamps();
        });
        
        
        // TABLES 2 DEPENDANCE
        Schema::create("MODIFICATION", function(Blueprint $table){
            $table->id();

            $table->foreignId("utilisateur_id")->references("id")->on("users");
                // ->onDelete("SET NULL")
                // ->onUpdate("CASCADE");
            $table->foreignId("scenario_id")->references("id")->on("SCENARIO");
                // ->onDelete("SET NULL")
                // ->onUpdate("CASCADE");
            $table->timestamps();
        });
        Schema::create("PROPOSER", function (Blueprint $table){
            $table->foreignId("cours_id")->references("id")->on("COURS");
                // ->onDelete("CASCADE")
                // ->onUpdate("CASCADE");
            $table->foreignId("departement_id")->references("id")->on("DEPARTEMENT");
                // ->onDelete("CASCADE")
                // ->onUpdate("CASCADE");
            $table->unique(["cours_id", "departement_id"]);

            $table->float("ponderation");
            $table->unsignedSmallInteger("nbEleves")->default(0);
            $table->unsignedTinyInteger("nbGroupes")->default(0);
        });
        Schema::create("ENSEIGNER", function(Blueprint $table){
            $table->foreignId("cours_id")->references("id")->on("COURS");
                // ->onDelete("CASCADE")
                // ->onUpdate("CASCADE");
            $table->foreignId("utilisateur_id")->references("id")->on("users");
                // ->onDelete("CASCADE")
                // ->onUpdate("CASCADE");
            $table->unique(["cours_id", "utilisateur_id"]);
        });
        Schema::create("ALOUER", function(Blueprint $table){
            $table->foreignId("utilisateur_id")->references("id")->on("users");
                // ->onDelete("CASCADE")
                // ->onUpdate("CASCADE");
            $table->foreignId("liberation_id")->references("id")->on("LIBERATION");
                // ->onDelete("CASCADE")
                // ->onUpdate("CASCADE");
            $table->unique(["utilisateur_id", "liberation_id"]);	

            $table->unsignedDecimal("tempsAloue", 5, 5);
            $table->unsignedSmallInteger("annee")->nullable();
            $table->unsignedTinyInteger("semestre")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // SUPPRESSION MODIFICATIONS
        if (Schema::hasColumn("users", "contraintes")){
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('contraintes'); 
            });
        }
        if (Schema::hasColumn("users", "type_utilisateur_id")){
            Schema::table('users', function (Blueprint $table) {
                $table->dropForeign(['type_utilisateur_id']);
                $table->dropColumn('type_utilisateur_id');
            });
        }

        // SUPPRESSION TABLES
        $tablesPriority1 = array("proposer", "enseigner", "modification", "alouer");
        $tablesPriority2 = array("cours", "liberation", "organiser", "type_utilisateur");
        $tablesPriority3 = array("departement");
        $tablesPriority4 = array("scenario");
        foreach($tablesPriority1 as $nomTable){Schema::dropIfExists($nomTable);}
        foreach($tablesPriority2 as $nomTable){Schema::dropIfExists($nomTable);}
        foreach($tablesPriority3 as $nomTable){Schema::dropIfExists($nomTable);}
        foreach($tablesPriority4 as $nomTable){Schema::dropIfExists($nomTable);}
    }
};