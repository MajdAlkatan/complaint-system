<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Storage;
use function Symfony\Component\Clock\now;

class BackupController extends Controller
{
public function index()
{
    // المسار المباشر لمجلد app
    $directory = storage_path('app');
    
    // جلب كافة الملفات الموجودة في المجلد
    $allFiles = File::files($directory);

    $history = collect($allFiles)
        ->filter(function ($file) {
            // تصفية الملفات التي تبدأ بكلمة backup أو manual وتنتهي بـ .sql
            $name = $file->getFilename();
            return (str_starts_with($name, 'backup-') || str_starts_with($name, 'manual_')) 
                   && str_ends_with($name, '.sql');
        })
        ->map(function ($file) {
            return [
                'date' => Carbon::createFromTimestamp($file->getMTime())->format('m/d/Y, h:i:s A'),
                'size' => number_format($file->getSize() / 1048576, 2) . ' MB',
                'duration' => '--',
                'status' => 'SUCCESS',
                'file_name' => $file->getFilename()
            ];
        })
        ->sortByDesc('date')
        ->values();

    return response()->json([
        'stats' => [
            'successful_backups' => $history->count(),
            'schedule' => 'Daily',
            'last_backup_size' => $history->first()['size'] ?? '0 MB',
        ],
        'history' => $history
    ]);
}
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
    
public function download($fileName)
{
    // الحصول على المسار الكامل للملف في المجلد storage/app
    $filePath = storage_path('app/' . $fileName);

    // التحقق من وجود الملف فعلياً على القرص الصلب
    if (file_exists($filePath)) {
        return response()->download($filePath);
    }

    return response()->json([
        'error' => 'File not found',
        'debug_path' => $filePath // سيظهر لك هذا السطر أين يبحث السيرفر بالضبط
    ], 404);
}
}
