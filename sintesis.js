/*
  Bunyi terbina dalam (dijana dengan Web Audio, tiada fail diperlukan).
  Ini bunyi ganti sementara. Bunyi sebenar di bunyi/<id>.wav akan diutamakan oleh game.
  Guna: const r = Sintesis.main('kucing', audioContext);  r.dur (saat), r.stop()
*/
(function () {
  var nb = null;
  function hingarBuf(ac) {
    if (nb && nb.sampleRate === ac.sampleRate) return nb;
    var b = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return (nb = b);
  }
  function lengkung(param, t, dur, titik) {
    if (typeof titik === 'number') { param.setValueAtTime(titik, t); return; }
    titik.forEach(function (p, i) {
      if (i === 0) param.setValueAtTime(p[1], t + p[0] * dur);
      else param.linearRampToValueAtTime(p[1], t + p[0] * dur);
    });
  }
  function sampul(g, t, dur, a, puncak, r) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(puncak, t + a);
    g.gain.setValueAtTime(puncak, t + Math.max(a, dur - r));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  }
  function vibrato(ac, param, t, dur, v) {
    if (!v) return;
    var lfo = ac.createOscillator(), lg = ac.createGain();
    lfo.frequency.value = v[0]; lg.gain.value = v[1];
    lfo.connect(lg).connect(param); lfo.start(t); lfo.stop(t + dur + 0.05);
  }
  // Suara bervokal (haiwan / manusia): gelombang gigi gergaji + penapis forman
  function suara(ac, out, t, dur, o) {
    var src = ac.createOscillator(); src.type = o.jenis || 'sawtooth';
    lengkung(src.frequency, t, dur, o.f0);
    vibrato(ac, src.frequency, t, dur, o.vib);
    var e = ac.createGain(); sampul(e, t, dur, o.a || 0.05, o.vol || 0.5, o.r || 0.15); e.connect(out);
    o.formant.forEach(function (fm) {
      var bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = fm.q || 6;
      lengkung(bp.frequency, t, dur, fm.f);
      var g = ac.createGain(); g.gain.value = fm.g || 1;
      src.connect(bp).connect(g).connect(e);
    });
    src.start(t); src.stop(t + dur + 0.05);
  }
  function ton(ac, out, t, dur, o) {
    var os = ac.createOscillator(); os.type = o.jenis || 'sine';
    lengkung(os.frequency, t, dur, o.f);
    vibrato(ac, os.frequency, t, dur, o.vib);
    var g = ac.createGain(); sampul(g, t, dur, o.a || 0.01, o.vol || 0.3, o.r || 0.05);
    os.connect(g).connect(out); os.start(t); os.stop(t + dur + 0.05);
  }
  function hingar(ac, out, t, dur, o) {
    var s = ac.createBufferSource(); s.buffer = hingarBuf(ac); s.loop = true;
    var f = ac.createBiquadFilter(); f.type = o.penapis || 'bandpass'; f.frequency.value = o.f; f.Q.value = o.q || 1;
    var g = ac.createGain();
    if (o.reput) { g.gain.setValueAtTime(o.vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); }
    else sampul(g, t, dur, o.a || 0.02, o.vol, o.r || 0.08);
    s.connect(f).connect(g).connect(out);
    s.start(t, Math.random()); s.stop(t + dur + 0.05);
  }
  function lowpass(ac, out, hz) { var lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = hz; lp.connect(out); return lp; }

  var RESEPI = {
    kucing: function (ac, o, t) {
      [0, 1.0].forEach(function (s) {
        suara(ac, o, t + s, 0.75, { f0: [[0, 520], [0.35, 720], [1, 430]], vib: [6, 8], a: 0.08, r: 0.25, vol: 0.6,
          formant: [{ f: [[0, 400], [0.3, 900], [1, 600]], q: 5, g: 4 }, { f: [[0, 1600], [0.3, 2200], [1, 1100]], q: 6, g: 3 }] });
      });
      return 1.85;
    },
    lembu: function (ac, o, t) {
      [0, 2.0].forEach(function (s, i) {
        var d = i ? 1.3 : 1.7;
        suara(ac, o, t + s, d, { f0: [[0, 100], [0.25, 125], [0.75, 118], [1, 92]], vib: [5, 3], a: 0.25, r: 0.5, vol: 0.8,
          formant: [{ f: [[0, 250], [0.3, 520], [1, 420]], q: 4, g: 5 }, { f: [[0, 700], [0.35, 950], [1, 780]], q: 5, g: 3 }] });
      });
      return 3.4;
    },
    burung: function (ac, o, t) {
      var x = 0;
      [[2600, 4200], [3000, 4600], [2400, 3900]].forEach(function (p) {
        for (var i = 0; i < 5; i++) { ton(ac, o, t + x, 0.07, { f: [[0, p[0] + i * 80], [1, p[1] + i * 80]], vol: 0.35, a: 0.005, r: 0.03 }); x += 0.1; }
        x += 0.3;
      });
      return x;
    },
    kambing: function (ac, o, t) {
      [0, 1.05].forEach(function (s) {
        suara(ac, o, t + s, 0.85, { f0: [[0, 320], [0.15, 380], [1, 330]], vib: [11, 28], a: 0.04, r: 0.25, vol: 0.65,
          formant: [{ f: [[0, 300], [0.15, 500], [1, 480]], q: 5, g: 4 }, { f: [[0, 1500], [0.15, 1850], [1, 1750]], q: 6, g: 3 }] });
      });
      return 1.95;
    },
    tepuk: function (ac, o, t) {
      var n = 9;
      for (var i = 0; i < n; i++) {
        var s = t + i * 0.32 + (i % 2 ? 0.02 : 0);
        [0, 0.007, 0.015].forEach(function (d) { hingar(ac, o, s + d, 0.025, { f: 1100, q: 0.6, vol: 3, reput: true }); });
        hingar(ac, o, s + 0.02, 0.16, { f: 1400, q: 0.5, vol: 1.2, reput: true });
      }
      return n * 0.32 + 0.2;
    },
    siul: function (ac, o, t) {
      ton(ac, o, t, 0.4, { f: [[0, 1000], [0.8, 2300], [1, 2350]], vib: [5, 10], vol: 0.4, a: 0.03, r: 0.06 });
      ton(ac, o, t + 0.55, 0.65, { f: [[0, 1200], [0.3, 2100], [1, 850]], vib: [5, 10], vol: 0.4, a: 0.03, r: 0.1 });
      hingar(ac, o, t, 1.2, { f: 2200, q: 2, vol: 0.03 });
      var not = [784, 988, 1175, 988, 784, 988, 1175, 1568];
      not.forEach(function (f, i) { ton(ac, o, t + 1.5 + i * 0.22, 0.2, { f: [[0, f * 0.99], [0.2, f], [1, f]], vib: [6, 8], vol: 0.38, a: 0.02, r: 0.05 }); });
      return 1.5 + not.length * 0.22 + 0.1;
    },
    ketawa: function (ac, o, t) {
      var x = 0;
      [6, 4].forEach(function (n, g) {
        for (var i = 0; i < n; i++) {
          var s = t + x, f = 270 - i * 10 - g * 15;
          hingar(ac, o, s, 0.06, { f: 1600, q: 1, vol: 0.25, reput: true });
          suara(ac, o, s + 0.02, 0.13, { f0: [[0, f], [1, f * 0.85]], a: 0.015, r: 0.06, vol: 0.7,
            formant: [{ f: [[0, 780], [1, 720]], q: 5, g: 4 }, { f: [[0, 1250], [1, 1150]], q: 6, g: 3 }] });
          x += 0.2;
        }
        x += 0.35;
      });
      return x;
    },
    bayi: function (ac, o, t) {
      [0, 1.45].forEach(function (s) {
        suara(ac, o, t + s, 1.15, { f0: [[0, 430], [0.2, 570], [0.7, 540], [1, 380]], vib: [7, 22], a: 0.06, r: 0.35, vol: 0.7,
          formant: [{ f: [[0, 400], [0.15, 950], [1, 780]], q: 4, g: 4 }, { f: [[0, 1100], [0.15, 1650], [1, 1400]], q: 5, g: 3 }, { f: 2850, q: 6, g: 1.5 }] });
      });
      return 2.65;
    },
    kereta: function (ac, o, t) {
      var lp = lowpass(ac, o, 2200);
      [[0, 0.22], [0.32, 0.8]].forEach(function (p) {
        [415, 523].forEach(function (f) { ton(ac, lp, t + p[0], p[1], { f: f, jenis: 'square', vol: 0.18, a: 0.01, r: 0.04 }); });
      });
      return 1.2;
    },
    ambulans: function (ac, o, t) {
      var dur = 3.2, lp = lowpass(ac, o, 1800);
      var os = ac.createOscillator(); os.type = 'square';
      os.frequency.setValueAtTime(960, t);
      for (var i = 1; i * 0.5 < dur; i++) os.frequency.setTargetAtTime(i % 2 ? 740 : 960, t + i * 0.5, 0.015);
      var g = ac.createGain(); sampul(g, t, dur, 0.03, 0.25, 0.1);
      os.connect(g).connect(lp); os.start(t); os.stop(t + dur + 0.05);
      return dur;
    },
    keretaapi: function (ac, o, t) {
      [[0, 0.45], [0.6, 0.9]].forEach(function (p) {
        [440, 554, 659].forEach(function (f) { ton(ac, o, t + p[0], p[1], { f: f, vol: 0.16, a: 0.06, r: 0.12, vib: [4, 3] }); });
        hingar(ac, o, t + p[0], p[1], { f: 1800, q: 1.5, vol: 0.06 });
      });
      var x = 1.7, jarak = 0.34;
      for (var i = 0; i < 10; i++) {
        hingar(ac, o, t + x, 0.2, { f: 420, q: 0.8, vol: i % 2 ? 0.5 : 0.9, reput: true });
        hingar(ac, o, t + x, 0.12, { f: 2500, q: 0.5, vol: 0.15, reput: true });
        x += jarak; jarak = Math.max(0.2, jarak * 0.93);
      }
      return x + 0.2;
    },
    basikal: function (ac, o, t) {
      [0, 0.14, 0.6, 0.74].forEach(function (s) {
        [[2350, 1, 0.9], [3620, 0.6, 0.6], [5150, 0.4, 0.4], [6900, 0.25, 0.3]].forEach(function (p) {
          var os = ac.createOscillator(); os.frequency.value = p[0];
          var g = ac.createGain();
          g.gain.setValueAtTime(0.0001, t + s);
          g.gain.exponentialRampToValueAtTime(0.3 * p[1], t + s + 0.003);
          g.gain.exponentialRampToValueAtTime(0.0001, t + s + p[2]);
          os.connect(g).connect(o); os.start(t + s); os.stop(t + s + p[2] + 0.05);
        });
      });
      return 1.7;
    }
  };

  window.Sintesis = {
    ada: function (id) { return !!RESEPI[id]; },
    main: function (id, ac, tujuan) {
      var master = ac.createGain(); master.gain.value = 0.9;
      var comp = ac.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 4;
      master.connect(comp).connect(tujuan || ac.destination);
      var t = ac.currentTime + 0.05;
      var dur = RESEPI[id] ? RESEPI[id](ac, master, t) : 0;
      var habis = false;
      function putus() { if (habis) return; habis = true; try { master.disconnect(); comp.disconnect(); } catch (e) {} }
      setTimeout(putus, (dur + 0.6) * 1000);
      return {
        dur: dur,
        stop: function () {
          try { master.gain.cancelScheduledValues(ac.currentTime); master.gain.setTargetAtTime(0, ac.currentTime, 0.02); } catch (e) {}
          setTimeout(putus, 150);
        }
      };
    }
  };
})();
