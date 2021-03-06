! function (e, k) {
    var f = new(e.AudioContext || e.webkitAudioContext),
        b = {},
        h = function (a, c, g) {
            f.decodeAudioData(c, function (c) {
                b[a] = {};
                b[a].data = c;
                b[a].loop = !1;
                g && g(a)
            }, function (a) {
                console.error("Audio decoding error: " + a.err)
            })
        };
    e[k] = {
        setLooping: function (a, c) {
            c = void 0 === c ? !0 : !!c;
            if (null === a)
                for (a in b) b[a].loop = c;
            else a in b && (b[a].loop = c)
        },
        load: function (a, c, b, d) {
            c.big ? (d = new XMLHttpRequest, d.open("GET", c, !0), d.responseType = "arraybuffer", d.onload = function () {
                h(a, d.response, b)
            }, d.send()) : (d = new FileReader, d.onload = function () {
                h(a, d.result, b)
            }, d.readAsArrayBuffer(c))
        },
        unload: function (a) {
            delete b[a]
        },
        start: function (a, c) {
            a in b && ("node" in b[a] && b[a].node.stop(0), c = f.createBufferSource(), c.buffer = b[a].data, c.connect(f.destination), c.loop = b[a].loop, c.start(0), b[a].node = c)
        },
        stop: function (a) {
            a in b && b[a].node && b[a].node.stop(0)
        }
    }
}(self, "samples");
! function (b, h, k, f) {
    if (!("AudioContext" in b || "webkitAudioContext" in b)) return b.alert("Sorry, your browser does not implement the APIs required to run numLaunchpad.\nPlease use Chrome, Firefox or recent Opera for best results."), b.location.assign("http://www.mozilla.org/firefox/"), !1;
    var c = {},
        l = function (a) {
            a = document.documentElement;
            a.requestFullscreen ? a.requestFullscreen() : a.msRequestFullscreen ? a.msRequestFullscreen() : a.mozRequestFullScreen ? a.mozRequestFullScreen() : a.webkitRequestFullscreen && a.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
        },
        m = function (a) {
            f || (f = "wav");
            for (a = 1; 10 > a; a++) samples.load(a, k + "/" + a + "." + f, function (a) {
                samples.setLooping(a, h)
            })
        },
        g = function (a) {
            "padIndex" in a.target.dataset && (a.preventDefault(), a = a.target.dataset.padIndex | 0, samples.start(a), c[a].classList.add("active"))
        },
        e = function (a) {
            "padIndex" in a.target.dataset && (a.preventDefault(), a = a.target.dataset.padIndex | 0, samples.stop(a), c[a].classList.remove("active"))
        },
        n = function (a) {
            if (a.target.files.length) {
                var d = b.prompt("Enter the pad number (1 to 9) to load the sample file") | 0;
                if (0 < d && 10 > d) {
                    var c = a.target.files[0];
                    samples.load(d, c, function (a) {
                        samples.setLooping(a, b.confirm("Sample " + c.name + " loaded into pad " + a + ". Enable looping?"))
                    })
                } else b.alert("Invalid pad number!")
            }
        };
    b.addEventListener("keydown", function (a) {
        var b = a.which - 96;
        1 > b || 9 < b || c[b].classList.contains("active") || (a.preventDefault(), samples.start(b), c[b].classList.add("active"))
    }, !1);
    b.addEventListener("keyup", function (a) {
        var b = a.which - 96;
        1 > b || 9 < b || (a.preventDefault(), samples.stop(b), c[b].classList.remove("active"))
    }, !1);
    b.addEventListener("mousedown", g, !1);
    b.addEventListener("mouseup", e, !1);
    b.addEventListener("mouseleave", e, !1);
    b.addEventListener("touchstart", g, !1);
    b.addEventListener("touchend", e, !1);
    b.addEventListener("touchcancel", e, !1);
    b.addEventListener("dblclick", function (a) {
        "dataset" in a.target && "padIndex" in a.target.dataset || (a.preventDefault(), document.getElementById("notes").classList.toggle("hidden-digits"))
    }, !1);
    b.addEventListener("DOMContentLoaded", function () {
        m();
        var a, d = document.querySelectorAll("[data-pad-index]");
        for (a = 0; a < d.length; a++) c[d[a].dataset.padIndex | 0] = d[a];
        document.getElementById("goFS").onclick = l;
        document.getElementById("help").onclick = function () {
            b.alert('This is drum maschine')
        };
        document.getElementById("loadSample").onchange = n
    }, !1)
}(self, !1, "samples", "wav")