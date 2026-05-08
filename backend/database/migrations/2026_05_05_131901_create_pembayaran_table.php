<?php

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
        Schema::create('pembayaran', function (Blueprint $table) {
            $table->id();
            $table->foreignId('penghuni_id')->constrained('penghuni')->cascadeOnDelete();
            $table->foreignId('rumah_id')->constrained('rumah')->cascadeOnDelete();
            $table->enum('jenis_iuran', ['kebersihan', 'satpam']);
            $table->integer('bulan');
            $table->integer('tahun');
            $table->decimal('jumlah', 10, 2);
            $table->enum('status', ['lunas', 'belum'])->default('belum');
            $table->date('tanggal_bayar')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayaran');
    }
};
