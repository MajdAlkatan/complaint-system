<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use function Symfony\Component\Clock\now;

class BackupController extends Controller
{
public function run(Request $request) {
    // تحديد المسار الكامل للأداة ومكان حفظ الملف يدوياً لتخطي قيود الحزمة
    $binaryPath = 'C:\xampp\mysql\bin\mysqldump.exe';
    $dbName = env('DB_DATABASE');
    $dbUser = env('DB_USERNAME');
    $dbPass = env('DB_PASSWORD');
    $timestamp = now()->format('Y-m-d-H-i-s');
    $fileName = "backup-{$timestamp}.sql";
    $storagePath = storage_path("app//{$fileName}");
    //$storagePath = storage_path('app//manual_backup.sql');

    // بناء أمر Shell مباشر
    $command = "{$binaryPath} --user={$dbUser} --password={$dbPass} --host=127.0.0.1 {$dbName} > {$storagePath}";

    exec($command, $output, $returnVar);

    if ($returnVar === 0) {
        return response()->json(['message' => 'Manual Backup Succeeded', 'path' => $storagePath]);
    }

    return response()->json(['error' => 'Manual Backup Failed', 'debug' => $output], 500);
}

    public function restore(Request $request){
        try{
            Artisan::call('backup:restore'); 
            return response()->json(['message' => 'Succeeded']);
        }catch(\Exception $e){
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
