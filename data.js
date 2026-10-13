/*
  Data game "Bunyi Apa Tu?" — Muzik Tahun 1, SK 3.1 (SP 3.1.1 & 3.1.2)
  - BUNYI   : senarai bunyi. Bunyi sebenar boleh diletak di bunyi/<id>.wav
              (rakam / muat naik di rakam-suara.html). Jika tiada, game guna bunyi terbina dalam.
  - FRASA   : ayat arahan Bahasa Melayu. Rakaman disimpan di audio/<kunci>.wav
*/
(function () {
  var KUMPULAN = {
    haiwan:    { nama: 'Haiwan',    emoji: '🐾', warna: '#f08c00' },
    manusia:   { nama: 'Manusia',   emoji: '🧒', warna: '#d6336c' },
    kenderaan: { nama: 'Kenderaan', emoji: '🚌', warna: '#1c7ed6' }
  };
  var BUNYI = [
    { id: 'kucing',    nama: 'Kucing',         kat: 'haiwan',    emoji: '🐱' },
    { id: 'lembu',     nama: 'Lembu',          kat: 'haiwan',    emoji: '🐄' },
    { id: 'burung',    nama: 'Burung',         kat: 'haiwan',    emoji: '🐦' },
    { id: 'kambing',   nama: 'Kambing',        kat: 'haiwan',    emoji: '🐐' },
    { id: 'tepuk',     nama: 'Tepuk tangan',   kat: 'manusia',   emoji: '👏' },
    { id: 'siul',      nama: 'Bersiul',        kat: 'manusia',   emoji: '😗' },
    { id: 'ketawa',    nama: 'Ketawa',         kat: 'manusia',   emoji: '😆' },
    { id: 'bayi',      nama: 'Bayi menangis',  kat: 'manusia',   emoji: '👶' },
    { id: 'kereta',    nama: 'Hon kereta',     kat: 'kenderaan', emoji: '🚗' },
    { id: 'ambulans',  nama: 'Ambulans',       kat: 'kenderaan', emoji: '🚑' },
    { id: 'keretaapi', nama: 'Kereta api',     kat: 'kenderaan', emoji: '🚂' },
    { id: 'basikal',   nama: 'Loceng basikal', kat: 'kenderaan', emoji: '🚲' }
  ];
  // Bunyi yang sesuai untuk aktiviti tiru (3.1.1)
  var TIRU = ['kucing', 'lembu', 'kambing', 'burung', 'ketawa', 'siul', 'tepuk', 'kereta', 'keretaapi', 'bayi'];
  var PUJI = ['Bagus!', 'Hebat!', 'Pandai!', 'Betul!'];

  var F = {};
  F.tulis_nama = 'Tulis nama samaran dahulu.';
  F.soalan_a = 'Dengar bunyi ini. Bunyi apa?';
  F.soalan_b = 'Dengar bunyi ini. Bunyi ini dari kumpulan apa?';
  F.cari_bunyi = 'Cari bunyi';
  PUJI.forEach(function (t, i) { F['puji_' + (i + 1)] = t; });
  BUNYI.forEach(function (b) { F['nama_' + b.id] = b.nama + '.'; });
  Object.keys(KUMPULAN).forEach(function (k) { F['kumpulan_' + k] = KUMPULAN[k].nama + '.'; });
  F.cuba_lagi = 'Cuba lagi. Dengar baik-baik.';
  F.jawapannya = 'Jawapannya,';
  F.tiru_mula = 'Jom tiru bunyi! Dengar dahulu, kemudian tekan butang mikrofon dan tiru bunyi itu.';
  F.tiru_giliran = 'Dengar, kemudian tiru bunyi ini.';
  F.tiru_bagus = 'Bagus! Kamu sudah meniru bunyi. Dengar suara kamu.';
  F.tiru_kuat = 'Suara kamu tidak kedengaran. Cuba lagi dengan lebih kuat.';
  F.tamat_3 = 'Hebat! Kamu dapat tiga bintang.';
  F.tamat_2 = 'Bagus! Kamu dapat dua bintang.';
  F.tamat_1 = 'Syabas kerana mencuba! Mari main lagi.';

  window.KUMPULAN = KUMPULAN;
  window.BUNYI = BUNYI;
  window.TIRU = TIRU;
  window.PUJI = PUJI;
  window.FRASA = F;
})();
