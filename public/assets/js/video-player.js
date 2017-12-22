// Opera 8.0+
var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]"
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

// Internet Explorer 6-11
var isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;

// Blink engine detection
var isBlink = (isChrome || isOpera) && !!window.CSS;

var overview = false;
var qa = false;
var queryString = window.location.search;
queryString = queryString.substring(1);
var queries = queryString.split("=");

$(document).ready(function() {
  var defaultVolume = 1;
  if (!isSafari) {
    $("#videoPlayer")[0].play();
    $(".fa-play").attr("class", "fa fa-pause");
  }
  var fadeout = null;
  $("html").mousemove(function() {
    $(".videoControls").fadeIn("medium");
    $(".videoLabels").children().not("#myModal").fadeIn("medium");
    if (fadeout != null) {
      clearTimeout(fadeout);
    }
    fadeout = setTimeout(hide_playlist, 3000);
  });
  function hide_playlist() {
    $(".videoControls").stop().fadeOut("medium");
    $(".videoLabels").children().not("#myModal").stop().fadeOut("medium");
  }
  $(".btnPlay").click(function() {
    if ($("#videoPlayer")[0].paused) {
      $("#videoPlayer")[0].play();
      $(".fa-play").attr("class", "fa fa-pause");
    } else {
      $("#videoPlayer")[0].pause();
      $(".fa-pause").attr("class", "fa fa-play");
    }
    return false;
  });
  $("#videoPlayer").on("timeupdate", function() {
    $(".current").text(toClockTime(Math.round($("#videoPlayer")[0].currentTime)));
  });
  $("#videoPlayer").on("loadedmetadata", function() {
    if (queries[0] === "start" && queries[1] >= 0 && queries[1] <= $("#videoPlayer")[0].duration) {
      $("#videoPlayer")[0].currentTime = queries[1];
    }
    $(".duration").text(toClockTime(Math.round($("#videoPlayer")[0].duration)));
  });
  $(".btnMute").click(function(e) {
    if (!$("#videoPlayer")[0].muted) {
      $("#videoPlayer")[0].muted = true;
      defaultVolume = $("#volume-bar").val();
      $("#videoPlayer")[0].volume = 0;
      $("#volume-bar").val(0);
      $(".fa-volume-up").attr("class", "fa fa-volume-off");
    } else {
      $("#videoPlayer")[0].muted = false;
      $("#videoPlayer")[0].volume = defaultVolume;
      $("#volume-bar").val(defaultVolume);
      $(".fa-volume-off").attr("class", "fa fa-volume-up");
    }
    e.preventDefault();
  });

  $(".btnFullscreen").on("click", function(e) {
    e.preventDefault();
    var elem = $("#videoPlayer")[0];
    if( window.innerHeight == screen.height) {
      elem.webkitExitFullscreen();
      // elem.mozCancelFullscreen();
    } else {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      }
    }
    return false;
  });

  document.addEventListener('webkitfullscreenchange', exitHandler, false);
  document.addEventListener('mozfullscreenchange', exitHandler, false);
  document.addEventListener('fullscreenchange', exitHandler, false);
  document.addEventListener('MSFullscreenChange', exitHandler, false);

  function exitHandler() {
    if (document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement) {
      $('#overview-btn').addClass("hidden");
      $('#QA-btn').addClass("hidden");
    } else if (!document.webkitIsFullScreen || !document.mozFullScreen || !document.msFullscreenElement) {
      $('#overview-btn').removeClass("hidden");
      $('#QA-btn').removeClass("hidden");
    }
  }

  if($("#videoPlayer")) {
    $("#videoPlayer").on('timeupdate', updateProgressBar);
  }

  function updateProgressBar() {
    var percentage = Math.floor((100 / $("#videoPlayer")[0].duration) * $("#videoPlayer")[0].currentTime);
    if (percentage) {
      $("#progress-bar").val(percentage);
    }
    $("#progress-bar").html(percentage + '% played');
    if ($("#videoPlayer")[0].currentTime === $("#videoPlayer")[0].duration) {
      $(".fa-pause").attr("class", "fa fa-play");
    }
  }

  $("#progress-bar").on("click", seek);

  function seek(e) {
    var shouldPlay = true;
    if ($("#videoPlayer")[0].paused) {
      $(".fa-pause").attr("class", "fa fa-play");
      shouldPlay = false;
    } else {
      $("#videoPlayer")[0].pause();
    }
    var percent = e.offsetX / $("#progress-bar").width();
    $("#progress-bar").val(percent*100);
    $("#videoPlayer")[0].currentTime = percent * $("#videoPlayer")[0].duration;
    if (shouldPlay) {
      $(".fa-play").attr("class", "fa fa-pause");
      $("#videoPlayer")[0].play();
    }
  }


  var volumeBar = $("#volume-bar");
  volumeBar.on("click", seekVolume);

  function seekVolume(e) {
    if ($("#videoPlayer")[0].muted) {
      $("#videoPlayer")[0].muted = false;
      $(".fa-volume-off").attr("class", "fa fa-volume-up");
    }
    var volume = e.offsetX / volumeBar.width();
    volumeBar.val(volume);
    $("#videoPlayer")[0].volume = volume;
  }


  $(".medium-quality").click(function(e) {
    $("#videoPlayer")[0].playbackRate = 1.0;
    var time = $("#videoPlayer")[0].currentTime;
    var videoFile = "/assets/videos/small.mp4"
    $('#$("#videoPlayer") source').attr("src", videoFile);
    $("#videoPlayer")[0].load();
    $("#videoPlayer")[0].currentTime = time;
    $("#videoPlayer")[0].play();
    e.preventDefault();
  });
  $(".high-quality").click(function(e) {
    $("#videoPlayer")[0].playbackRate = 1.0;
    var time = $("#videoPlayer")[0].currentTime;
    var videoFile = "/assets/videos/test.mp4"
    $('#$("#videoPlayer") source').attr("src", videoFile);
    $("#videoPlayer")[0].load();
    $("#videoPlayer")[0].currentTime = time;
    $("#videoPlayer")[0].play();
    e.preventDefault();
  });
  $(".btnBack").click(function(e) {
    var time = $("#videoPlayer")[0].currentTime - 15;
    if (time < 0) time = 0;
    $("#videoPlayer")[0].currentTime = time;
    e.preventDefault();
  });
  $(".btnForward").click(function(e) {
    var time = $("#videoPlayer")[0].currentTime + 15;
    if (time > $("#videoPlayer")[0].duration) time = $("#videoPlayer")[0].duration;
    $("#videoPlayer")[0].currentTime = time;
    e.preventDefault();
  });
  $(".super-fast").click(function(e) {
    $("#videoPlayer")[0].playbackRate = 2.0;
    e.preventDefault();
  });
  $(".fast").click(function(e) {
    $("#videoPlayer")[0].playbackRate = 1.5;
    e.preventDefault();
  });
  $(".slightly-fast").click(function(e) {
    $("#videoPlayer")[0].playbackRate = 1.25;
    e.preventDefault();
  });
  $(".normal").click(function(e) {
    $("#videoPlayer")[0].playbackRate = 1.0;
    e.preventDefault();
  });
  $(".slow").click(function(e) {
    $("#videoPlayer")[0].playbackRate = 0.75;
    e.preventDefault();
  });
  $(".super-slow").click(function(e) {
    $("#videoPlayer")[0].playbackRate = 0.50;
    e.preventDefault();
  });
  function toClockTime(timeInSec) {
      var min = Math.floor(timeInSec/60);
      var sec = Math.floor(timeInSec % 60);
      if (sec < 10) sec = "0" + sec;
      var time = "";
      time = time + min + ":" + sec;
      return time;
  }
  // var $video  = $('video'),
  // $window = $(window);
  // $(window).resize(function(){
  //     $("#videoPlayer")[0].pause();
  //     var height = $window.height();
  //     $video.css('height', height);
  //     var videoWidth = $video.width(),
  //         windowWidth = $window.width(),
  //     marginLeftAdjust =   (windowWidth - videoWidth) / 2;
  //     $video.css({
  //         'height': height,
  //         'marginLeft' : marginLeftAdjust
  //     });
  //     if ((qa || overview) && $(window).width() < 960) {
  //       $('.control-wrapper').addClass("hidden");
  //     }
  //     if ((qa || overview) && $(window).width() >= 960) {
  //       $('.control-wrapper').removeClass("hidden");
  //     }
  //     if ((qa || overview) && $(window).width() < 1100) {
  //       $(".videoTime").addClass("tiny");
  //     } else {
  //       $(".videoTime").removeClass("tiny");
  //     }
  // }).resize();
  // $("#videoPlayer").on("ended", () => {
  //   $("#done").trigger('click');
  // });

  // var myTag = $("script").last();
  // var src = myTag[myTag.length-1].src;
  // var link = src.split("?")[1].split("&")[0];
  // var nextVidCode = src.split("?")[1].split("&")[1];
  // if (!nextVidCode) {
  //   $(".nextVideo a").text("End Part");
  // }
  // $(".nextVideo a").attr("href", link);
  $("body").click(function(e) {
    if (e.clientY > $(".videoLabels").outerHeight(true) && e.clientY < $(window).height() - 20 - ($(".videoControls").outerHeight(true))) {
      if(!$("#videoPlayer")[0].paused) {
        $("#videoPlayer")[0].pause();
        $(".fa-pause").attr("class", "fa fa-play");
      } else {
        $("#videoPlayer")[0].play();
        $(".fa-play").attr("class", "fa fa-pause");
      }
    }
  });
  $("#overview-btn").on("click", () => {
    if (!overview) {
      overview = true;
      if (qa) {
        qa = false;
        $(".questions-and-answers").removeClass("opened");
        $(".inner-right").removeClass("wrapper-right-opened");
        $(".video-content").removeClass("content-small");
      }
      $(".course-overview").addClass("opened");
      $(".inner-left").addClass("wrapper-left-opened");
      $(".video-content").addClass("content-small");
    } else {
      overview = false;
      $(".course-overview").removeClass("opened");
      $(".inner-left").removeClass("wrapper-left-opened");
      $(".video-content").removeClass("content-small");
    }
  });
  $("#QA-btn").on("click", () => {
    if (!qa) {
      qa = true;
      if (overview) {
        overview = false;
        $(".course-overview").removeClass("opened");
        $(".inner-left").removeClass("wrapper-left-opened");
        $(".video-content").removeClass("content-small");
      }
      $(".questions-and-answers").addClass("opened");
      $(".inner-right").addClass("wrapper-right-opened");
      $(".video-content").addClass("content-small");
    } else {
      qa = false;
      $(".questions-and-answers").removeClass("opened");
      $(".inner-right").removeClass("wrapper-right-opened");
      $(".video-content").removeClass("content-small");
    }
  });
  // $(".course-overview").on("click", () => {
  //   overview = false;
  //   qa = false;
  //   $(".course-overview").removeClass("opened");
  //   $(".video-content").removeClass("content-small");
  // });
  // $(".questions-and-answers").on("click", () => {
  //   overview = false;
  //   qa = false;
  //   $(".questions-and-answers").removeClass("opened");
  //   $(".video-content").removeClass("content-small");
  // });

  // $("#dashboard-btn").on("click", function(e) {
  //   e.preventDefault();
  //   $(".loader-wrapper").removeClass("hidden");
  //   var videoCode = (window.location.href.split("videos/")[1]).split("/learn")[0];
  //   var url = "/api/users/videos/" + videoCode;
  //   var body = {
  //     start: $("#$("#videoPlayer")")[0].currentTime
  //   };
  //   setTimeout(() => {
  //     $.post(url, body).done((data) => {
  //       console.log(data);
  //       window.location.href = $("#dashboard-btn").attr("href");
  //     }).fail((err) => {
  //       console.log(err);
  //     });
  //   }, 200);
  // });
    // $(window).on("unload", () => {
    //   $(".loader-wrapper").removeClass("hidden");
    //   var videoCode = (window.location.href.split("videos/")[1]).split("/learn")[0];
    //   var url = "/api/users/videos/" + videoCode;
    //   var body = {
    //     start: $("#$("#videoPlayer")")[0].currentTime
    //   };
    //   $.ajax({
    //     type: 'POST',
    //     url,
    //     data: body,
    //     dataType: json,
    //     async: false,
    //   }).done((data) => {
    //     console.log(data);
    //   }).fail((err) => {
    //     console.log(err);
    //   });
    // });
    // if($('.body')) {
    //   $('.body').parent().parent().removeClass("container");
    //   $('.body').parent().parent().removeClass("mt-4");
    //   $('.body').parent().parent().removeClass("mb-4");
    // } else {
    //   $('.body').parent().parent().addClass("container");
    //   $('.body').parent().parent().addClass("mt-4");
    //   $('.body').parent().parent().addClass("mb-4");
    // }
});
