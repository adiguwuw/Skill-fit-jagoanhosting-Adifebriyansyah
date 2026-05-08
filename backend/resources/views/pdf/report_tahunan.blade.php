<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        h2 { margin-bottom: 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 6px; text-align: center; }
        th { background: #f3f4f6; }
    </style>
</head>
<body>

<h2>LAPORAN TAHUNAN PEMBAYARAN</h2>
<p>Tahun: <b>{{ $tahun }}</b></p>

<table>
    <thead>
        <tr>
            <th>Bulan</th>
            <th>Total Penghuni</th>
            <th>Satpam</th>
            <th>Kebersihan</th>
            <th>Total</th>
        </tr>
    </thead>

    <tbody>
        @foreach($rekap as $r)
        <tr>
            <td>
                {{ \Carbon\Carbon::create()->month($r['bulan'])->translatedFormat('F') }}
            </td>

            <td>{{ $r['total_penghuni'] }}</td>

            <td>Rp {{ number_format($r['satpam']) }}</td>

            <td>Rp {{ number_format($r['kebersihan']) }}</td>

            <td><b>Rp {{ number_format($r['total']) }}</b></td>
        </tr>
        @endforeach
    </tbody>
</table>
<br>

<h3>Total Pemasukan: Rp {{ number_format($grand_total) }}</h3>

<br><br>

<div style="text-align:right;">
    Mengetahui,<br><br><br><br>
    <b>{{ $ketua_rt }}</b>
</div>

</body>
</html>