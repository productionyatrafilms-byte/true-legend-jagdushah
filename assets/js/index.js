$(function () {
    var $stage = $("#stage");
    var $controls = $(".video-controls");
    var video = document.getElementById("video");
    var $seek = $("#videoSeek");
    var $volume = $("#videoVolume");
    var $muteBtn = $("#btnMute");
    var frame = $(".video-frame")[0];

    var videoSources = {
        English: "./assets/videos/video.webm",
        Hindi: "./assets/videos/videohi.webm",
        Gujrati: "./assets/videos/videohi.webm"
    };

    var sounds = {
        pop: new Audio("./assets/audio/pop.mp3"),
        click: new Audio("./assets/audio/click.mp3"),
        English: new Audio("./assets/audio/Eng.mpeg"),
        Hindi: new Audio("./assets/audio/Hin.mpeg"),
        Gujrati: new Audio("./assets/audio/Guj.mpeg")
    };
    Object.keys(sounds).forEach(function (key) {
        sounds[key].preload = "auto";
    });

    function stopLanguageSounds() {
        ["English", "Hindi", "Gujrati"].forEach(function (key) {
            sounds[key].pause();
            sounds[key].currentTime = 0;
        });
    }

    function playSound(name) {
        var sound = sounds[name];
        if (!sound) {
            return;
        }
        sound.currentTime = 0;
        var result = sound.play();
        if (result && result.catch) {
            result.catch(function () {});
        }
    }

    function formatTime(seconds) {
        if (!isFinite(seconds)) {
            seconds = 0;
        }
        var whole = Math.floor(seconds);
        var m = Math.floor(whole / 60);
        var s = whole % 60;
        return m + ":" + (s < 10 ? "0" : "") + s;
    }

    function setFill($range, ratio) {
        $range[0].style.setProperty("--fill", (ratio * 100) + "%");
    }

    function updateTime() {
        var duration = video.duration || 0;
        $("#videoTime").text(formatTime(video.currentTime) + " / " + formatTime(duration));
        var ratio = duration ? video.currentTime / duration : 0;
        $seek.val(Math.round(ratio * 1000));
        setFill($seek, ratio);
    }

    function updateVolume() {
        var level = video.muted ? 0 : video.volume;
        $volume.val(level);
        setFill($volume, level);
        $muteBtn.toggleClass("is-muted", video.muted || video.volume === 0);
    }

    function setPlayState(playing, ended) {
        var paused = !playing && !ended && video.currentTime > 0;
        $stage.toggleClass("is-playing", playing).toggleClass("is-ended", ended).toggleClass("is-paused", paused);
        $controls.toggleClass("is-playing", playing);
    }

    function togglePlay() {
        if (video.ended) {
            video.currentTime = 0;
        }
        if (video.paused || video.ended) {
            video.preload = "auto";
            video.play();
        } else {
            video.pause();
        }
    }

    var shownLang = null;

    function applyLanguageVideo() {
        var lang = sessionStorage.getItem("lang") || "English";
        var next = videoSources[lang] || videoSources.English;
        var current = video.getAttribute("src");
        if (lang === shownLang) {
            return;
        }
        shownLang = lang;
        video.pause();
        if (current !== next) {
            video.setAttribute("src", next);
        }
        video.preload = "none";
        video.load();
        setPlayState(false, false);
        $stage.removeClass("is-paused");
        updateTime();
    }

    function showIntro() {
        $stage.addClass("is-intro");
    }

    $(".mascot").one("mouseenter touchstart", showIntro);

    $("#introClick, .intro-title").on("click", function () {
        playSound("click");
        $stage.addClass("is-intro is-video");
        setTimeout(function () {
            $stage.addClass("is-ready");
        }, 3600);
    });

    $(".back-btn").on("click", function (event) {
        var href = this.getAttribute("href");
        event.preventDefault();
        playSound("pop");
        setTimeout(function () {
            window.location.href = href;
        }, 250);
    });

    $("#language input").on("click", function () {
        stopLanguageSounds();
        playSound(this.value);
    });

    $("#videoPlay, #btnToggle, #videoReplay").on("click", function () {
        playSound("click");
    });

    $("#videoPlay, #btnToggle").on("click", togglePlay);
    $(video).on("click", togglePlay);

    $("#videoReplay").on("click", function () {
        video.preload = "auto";
        video.currentTime = 0;
        video.play();
    });

    $muteBtn.on("click", function () {
        video.muted = !video.muted;
    });

    $volume.on("input", function () {
        video.volume = parseFloat(this.value);
        video.muted = video.volume === 0;
    });

    $seek.on("input", function () {
        if (video.duration) {
            video.currentTime = (this.value / 1000) * video.duration;
        }
    });

    $("#btnFull").on("click", function () {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else if (frame.requestFullscreen) {
            frame.requestFullscreen();
        }
    });

    $(video).on("play playing", function () {
        setPlayState(true, false);
    });
    $(video).on("pause", function () {
        if (!video.ended) {
            setPlayState(false, false);
        }
    });
    $(video).on("ended", function () {
        setPlayState(false, true);
    });
    $(video).on("timeupdate loadedmetadata durationchange", updateTime);
    $(video).on("volumechange", updateVolume);

    $("#language input").on("click", applyLanguageVideo);

    applyLanguageVideo();
    updateTime();
    updateVolume();
});
