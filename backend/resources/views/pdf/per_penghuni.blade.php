<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 6px; text-align: center; }
        th { background: #f3f4f6; }
    </style>
</head>
<body>

<h2>LAPORAN IURAN PENGHUNI</h2>

<p>Nama: <b>{{ $penghuni->nama_lengkap }}</b></p>
<p>Tahun: {{ $tahun }}</p>

<table>
    <thead>
        <tr>
            <th>Bulan</th>
            <th>Jenis</th>
            <th>Keterangan</th>
        </tr>
    </thead>
    <tbody>
        @foreach($data as $d)
        <tr>
            <td>
                {{ \Carbon\Carbon::create()->month($d['bulan'])->translatedFormat('F') }}
            </td>

            <td style="text-align:left;">
                Satpam :
                Rp {{ number_format($d['satpam']['jumlah']) }}
                ({{ strtoupper($d['satpam']['status']) }})
                <br>

                Kebersihan :
                Rp {{ number_format($d['kebersihan']['jumlah']) }}
                ({{ strtoupper($d['kebersihan']['status']) }})
            </td>

            <td>
                {{ $d['keterangan'] }}
            </td>
        </tr>
        @endforeach
    </tbody>
</table>
<br>

<h3>Total Lunas: Rp {{ number_format($total_lunas) }}</h3>

<br><br>

<div style="text-align:right;">
    Mengetahui,<br><br><br><br>
    <b>{{ $ketua_rt }}</b>
</div>

</body>
</html>