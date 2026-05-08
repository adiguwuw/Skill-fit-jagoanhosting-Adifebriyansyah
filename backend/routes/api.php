<?php

use App\Http\Controllers\API\PembayaranController;
use App\Http\Controllers\API\PengeluaranController;
use App\Http\Controllers\API\PenghuniController;
use App\Http\Controllers\API\ReportController;
use App\Http\Controllers\API\RumahController;
use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return response()->json([
        'message' => 'API jalan'
    ]);
});

Route::apiResource('penghuni', PenghuniController::class);
Route::apiResource('rumah', RumahController::class);
Route::apiResource('pembayaran', PembayaranController::class);

Route::post('rumah/{id}/assign', [RumahController::class, 'assignPenghuni']);
Route::get('rumah/{id}/history', [RumahController::class, 'history']);
Route::get('/rumah/{id}', [RumahController::class, 'show']);
Route::get('report/summary', [ReportController::class, 'summary']);
Route::get('report/monthly', [ReportController::class, 'monthly']);
Route::get('report/penghuni/{id}', [ReportController::class, 'penghuniDetail']);
Route::get('dashboard', [ReportController::class, 'dashboard']);
Route::get('report/pdf', [ReportController::class, 'pdf']);
Route::get('report/penghuni/pdf/{id}', [ReportController::class, 'pdfPerPenghuni']);
Route::get('report/pdf-tahunan', [ReportController::class, 'pdfTahunan']);
Route::get('/pengeluaran', [PengeluaranController::class, 'index']);
Route::post('/pengeluaran', [PengeluaranController::class, 'store']);
Route::delete('/pengeluaran/{id}', [PengeluaranController::class, 'destroy']);