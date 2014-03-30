var BUBBLE_BORDER, BUBBLE_OPTIONS, BUBBLE_RADIUS, CONTAINER_BORDER, DEFAULT_ROWS, DROP_MULTIPLER, DROP_TIME_MULTIPLER, MAX_ANGLE, MAX_ROW_NUM, ROW_COUNTER_CEILING, ROW_COUNTER_INTERVAL, SPEED, addRow, addRowCounter, addRowCounterSecs, addRows, bubbleMatrix, bubbleMatrixOne, bubbleMatrixTwo, checkCluster, checkIfWon, currMatrix, drop, findClosestInMatrix, gameOver, getColor, getDivFromLoc, getPointAtT, getPointAtY, getSlope, isGameOver, isMatrixLocEmpty, isPaused, isWon, lookAround, moveBubble, noticeFlash, pause, scoochAllDown, shooting, stringifyLoc, toggleMatrixPosition, unpause, win;

BUBBLE_BORDER = 5;

BUBBLE_RADIUS = 25;

CONTAINER_BORDER = 5;

SPEED = 20;

MAX_ANGLE = 75;

BUBBLE_OPTIONS = ["red", "green", "yellow", "blue"];

ROW_COUNTER_CEILING = 10000;

ROW_COUNTER_INTERVAL = 15;

MAX_ROW_NUM = 10;

DROP_MULTIPLER = 1.2;

DROP_TIME_MULTIPLER = 0.5;

DEFAULT_ROWS = 3;

addRowCounter = 0;

shooting = false;

currMatrix = "";

isGameOver = false;

isPaused = true;

isWon = false;

bubbleMatrix = [];

bubbleMatrixOne = [];

bubbleMatrixTwo = [];

addRowCounterSecs = ROW_COUNTER_INTERVAL;

$(document).ready(function() {
  var currColor, currColorClass, gameoverlay, h, i, j, margin, noticeoverlay, pauseoverlay, rand, refresh, shooter, shooterbase, shootercontrol, shooteroverlay, startoverlay, w, winoverlay, x, xNum, y, yNum;
  $("#addrowmeter").css("width", "100%");
  $("#timer").text(ROW_COUNTER_INTERVAL);
  shooter = $("<div class='popper-shooter'></div>");
  shootercontrol = $("<div id='shooter-control'></div>");
  shooterbase = $("<div id='shooter-base'></div>");
  startoverlay = $("<div id='startscreen' class='overlay'></div>");
  startoverlay.append("<p>Clear the board.<br /><br />\nConnect 3 or more of the similar colors to POP them.<br /><br />\n..eh.. you'll figure out the rest.<br /><br />\n<button class=\"btn btn-primary btn-large\" id=\"startplaying\">Start Playing</button></p>");
  gameoverlay = $("<div id='gameover' class='overlay'></div>");
  gameoverlay.append("<p>Game Over <i class='fa fa-frown-o'></i></p>");
  pauseoverlay = $("<div id='pause' class='overlay'></div>");
  pauseoverlay.append("<p>Paused. o_O</p>");
  winoverlay = $("<div id='victory' class='overlay'></div>");
  winoverlay.append("<p>VICTORY! <i class='fa fa-smile-o'></p>");
  noticeoverlay = $("<div id='notice-overlay'></div>");
  shooteroverlay = $("<div id='shooter-control-overlay'></div>");
  $("#popper-container").append(shootercontrol);
  $("#popper-container").append(shooterbase);
  $("#popper-container").append(shooteroverlay);
  $("#popper-container").append(gameoverlay);
  $("#popper-container").append(pauseoverlay);
  $("#popper-container").append(winoverlay);
  $("#popper-container").append(shooter);
  $("#popper-container").append(noticeoverlay);
  $("#popper-container").append(startoverlay);
  rand = Math.floor(Math.random() * BUBBLE_OPTIONS.length);
  currColor = BUBBLE_OPTIONS[rand];
  currColorClass = "popper-" + currColor;
  $(".popper-shooter").addClass(currColorClass);
  shooteroverlay.mousemove(function(e) {
    var rotatedeg;
    if (!(isGameOver || isPaused || isWon)) {
      rotatedeg = (e.pageX - $(this).offset().left) / $(this).outerWidth() * 160 - MAX_ANGLE;
      rotatedeg = Math.max(-MAX_ANGLE, rotatedeg);
      rotatedeg = Math.min(MAX_ANGLE, rotatedeg);
      $(".popper-shooter").data("rotatedeg", rotatedeg);
      $(".popper-shooter").css("transform", "rotate(" + rotatedeg + "deg" + ")");
      $("#shooter-rotate-deg").text("Shooter at " + Math.round(rotatedeg * 10) / 10);
    }
  });
  shooteroverlay.bind("touchmove", function(e) {
    var rotatedeg;
    if (!(isGameOver || isPaused || isWon)) {
      e.preventDefault();
      rotatedeg = (e.originalEvent.touches[0].pageX - $(this).offset().left) / $(this).outerWidth() * 160 - MAX_ANGLE;
      rotatedeg = Math.max(-MAX_ANGLE, rotatedeg);
      rotatedeg = Math.min(MAX_ANGLE, rotatedeg);
      $(".popper-shooter").data("rotatedeg", rotatedeg);
      $(".popper-shooter").css("transform", "rotate(" + rotatedeg + "deg" + ")");
      $("#shooter-rotate-deg").text("Shooter at " + Math.round(rotatedeg * 10) / 10);
    }
  });
  shooteroverlay.click(function(e) {
    var i, rotatedeg;
    if (!shooting && !isGameOver && !isPaused && !isWon) {
      rotatedeg = Number($(".popper-shooter").data("rotatedeg"));
      $("#shoot-at-deg").text("Shoot at: " + Math.round(rotatedeg * 10) / 10);
      $("#popper-container").createBubble().addClass(currColorClass).attr("data-color", currColor).shoot(rotatedeg);
      addRowCounter += Math.floor(Math.random() * 2) + 1;
      if (addRowCounter > ROW_COUNTER_CEILING) {
        addRow();
        addRowCounter = 0;
      }
      i = 0;
      while (i < BUBBLE_OPTIONS.length) {
        $(".popper-shooter").removeClass("popper-" + BUBBLE_OPTIONS[i]);
        i++;
      }
      rand = Math.floor(Math.random() * BUBBLE_OPTIONS.length);
      currColor = BUBBLE_OPTIONS[rand];
      currColorClass = "popper-" + currColor;
      $(".popper-shooter").addClass(currColorClass);
    }
  });
  shooteroverlay.bind("touchend", function(e) {
    var i, rotatedeg;
    if (!shooting && !isGameOver && !isPaused && !isWon) {
      e.preventDefault();
      rotatedeg = Number($(".popper-shooter").data("rotatedeg"));
      $("#shoot-at-deg").text("Shoot at: " + Math.round(rotatedeg * 10) / 10);
      $("#popper-container").createBubble().addClass(currColorClass).attr("data-color", currColor).shoot(rotatedeg);
      addRowCounter += Math.floor(Math.random() * 2) + 1;
      if (addRowCounter > ROW_COUNTER_CEILING) {
        addRow();
        addRowCounter = 0;
      }
      i = 0;
      while (i < BUBBLE_OPTIONS.length) {
        $(".popper-shooter").removeClass("popper-" + BUBBLE_OPTIONS[i]);
        i++;
      }
      rand = Math.floor(Math.random() * BUBBLE_OPTIONS.length);
      currColor = BUBBLE_OPTIONS[rand];
      currColorClass = "popper-" + currColor;
      return $(".popper-shooter").addClass(currColorClass);
    }
  });
  w = $("#popper-container").width();
  h = $("#popper-container").outerHeight() - BUBBLE_RADIUS * 2 - BUBBLE_BORDER * 2;
  xNum = Math.floor(w / (BUBBLE_RADIUS * 2) - 0.5);
  yNum = Math.floor(h / (BUBBLE_RADIUS * 2) - 0.5) * 1.5 - 1;
  margin = (w - (xNum + 0.5) * BUBBLE_RADIUS * 2) / 2;
  bubbleMatrixOne = [];
  bubbleMatrix = [];
  j = 0;
  while (j < yNum) {
    bubbleMatrixOne[j] = [];
    bubbleMatrix[j] = [];
    i = 0;
    while (i < xNum) {
      if (j % 2 === 0) {
        x = i * BUBBLE_RADIUS * 2 + margin;
        y = h;
      } else {
        x = i * BUBBLE_RADIUS * 2 + BUBBLE_RADIUS + margin;
      }
      y = h - BUBBLE_RADIUS * j * 1.7;
      bubbleMatrixOne[j][i] = {
        x: x,
        y: y
      };
      bubbleMatrix[j][i] = {
        x: x,
        y: y
      };
      i++;
    }
    j++;
  }
  currMatrix = "one";
  bubbleMatrixTwo = [];
  j = 0;
  while (j < yNum) {
    bubbleMatrixTwo[j] = [];
    i = 0;
    while (i < xNum) {
      if (j % 2 === 1) {
        x = i * BUBBLE_RADIUS * 2 + margin;
        y = h;
      } else {
        x = i * BUBBLE_RADIUS * 2 + BUBBLE_RADIUS + margin;
      }
      y = h - BUBBLE_RADIUS * j * 1.7;
      bubbleMatrixTwo[j][i] = {
        x: x,
        y: y
      };
      i++;
    }
    j++;
  }
  addRows(DEFAULT_ROWS);
  addRowCounterSecs = ROW_COUNTER_INTERVAL;
  refresh = .1;
  window.addrow = setInterval((function() {
    if (isPaused === false) {
      $("#timer").text(Math.ceil(addRowCounterSecs - 1 * refresh));
      $("#addrowmeter").css("width", (addRowCounterSecs - 1 * refresh) / ROW_COUNTER_INTERVAL * 100 + "%");
      addRowCounterSecs = addRowCounterSecs - 1 * refresh;
      if (addRowCounterSecs < 1) {
        addRow();
        return addRowCounterSecs = ROW_COUNTER_INTERVAL;
      }
    }
  }), 1000 * refresh);
  $("#pause-button").click(function() {
    if (isPaused === false) {
      pause();
      return $(this).text("Unpause");
    } else {
      unpause();
      return $(this).text("Pause");
    }
  });
  return $("#startplaying").click(function() {
    $("#startscreen").hide();
    unpause();
    return $("#popper-container").css("cursor", "none");
  });
});

noticeFlash = function(str) {
  return $("#notice-overlay").html(str).show().fadeOut({
    duration: 1500
  });
};


/* The next set of functions are for getting the bubble to shoot */

getSlope = function(startDeg) {
  var aDeg, aRad, m;
  aDeg = 90 - Math.abs(startDeg);
  aRad = aDeg * Math.PI / 180;
  m = Math.tan(aRad);
  return m;
};

getPointAtT = function(t, startDeg) {
  var dir, k, m, point, w, x, y;
  w = $("#popper-container").outerWidth() - BUBBLE_RADIUS * 2 - BUBBLE_BORDER * 2;
  m = getSlope(startDeg);
  x = t / Math.pow(1 + m * m, 0.5);
  y = x * m;
  if (startDeg === 0) {
    x = 0;
    y = t;
  } else {
    dir = Math.ceil((x + w / 2) / w);
    k = Math.floor((x / w + 0.5) / 2) * 2;
    if (dir % 2 === 1) {
      x = x - w * k;
    } else {
      x = w - (x - w * k);
    }
    if (startDeg < 0) {
      x = -x;
    }
  }
  x = x + w / 2;
  y = y - BUBBLE_RADIUS;
  point = {
    x: x,
    y: y
  };
  return point;
};

getPointAtY = function(y, startDeg) {
  var m, t, w, x;
  w = $("#popper-container").outerWidth() - BUBBLE_RADIUS * 2 - BUBBLE_BORDER * 2;
  m = getSlope(startDeg);
  x = y / m;
  t = x * Math.pow(1 + m * m, 0.5);
  return getPointAtT(t, startDeg);
};

findClosestInMatrix = function(x, y) {
  var i, j, minDistance, minMatrix, minMatrixCoords, thisDistance;
  minDistance = 5000;
  minMatrixCoords = {
    x: "",
    y: ""
  };
  minMatrix = {
    row: "",
    num: ""
  };
  i = 0;
  while (i < bubbleMatrix.length) {
    j = 0;
    while (j < bubbleMatrix[0].length) {
      thisDistance = Math.pow(Math.pow(bubbleMatrix[i][j].x - x, 2) + Math.pow(bubbleMatrix[i][j].y - y, 2), 0.5);
      if (thisDistance < minDistance) {
        minMatrixCoords.x = bubbleMatrix[i][j].x;
        minMatrixCoords.y = bubbleMatrix[i][j].y;
        minMatrix.row = i;
        minMatrix.num = j;
        minDistance = thisDistance;
      }
      j++;
    }
    i++;
  }
  return minMatrix;
};


/* The next set of functions are for adding bubbles */

addRows = function(n) {
  var i, _results;
  i = 0;
  _results = [];
  while (i < n) {
    addRow();
    _results.push(i++);
  }
  return _results;
};

addRow = function(colors) {
  var color, div, i, loc, num, rand, _i, _j, _len, _len1, _ref, _results;
  scoochAllDown();
  if (colors === void 0) {
    colors = [];
    _ref = bubbleMatrix[0];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      rand = Math.floor(Math.random() * BUBBLE_OPTIONS.length);
      colors.push(BUBBLE_OPTIONS[rand]);
    }
  } else if (colors.length < bubbleMatrix[0].length) {
    i = colors.length;
    while (i < bubbleMatrix[0].length) {
      rand = Math.floor(Math.random() * BUBBLE_OPTIONS.length);
      colors.push(BUBBLE_OPTIONS[rand]);
      i++;
    }
  }
  num = 0;
  _results = [];
  for (_j = 0, _len1 = colors.length; _j < _len1; _j++) {
    color = colors[_j];
    div = $("#popper-container").createBubble(color).addClass("popper-" + color).text('0,' + num);
    loc = {
      row: 0,
      num: num
    };
    div.putInMatrix(loc, false);
    div.hide().fadeIn({
      duration: 200
    });
    _results.push(num++);
  }
  return _results;
};

scoochAllDown = function(n) {
  var furthestRow, furthestRowReached, r;
  furthestRow = 0;
  furthestRowReached = false;
  r = bubbleMatrix.length;
  while (r > 0) {
    r--;
    n = bubbleMatrix[r].length;
    while (n > 0) {
      n--;
      if (!isMatrixLocEmpty({
        row: r,
        num: n
      })) {
        moveBubble({
          row: r,
          num: n
        }, {
          row: r + 1,
          num: n
        });
        if (furthestRowReached === false) {
          furthestRowReached = true;
          furthestRow = r + 1;
        }
      }
    }
  }
  toggleMatrixPosition();
  if (furthestRow > MAX_ROW_NUM) {
    return gameOver();
  }
};

moveBubble = function(oldloc, newloc) {
  var div;
  div = getDivFromLoc(oldloc);
  div.attr("data-matrow", newloc.row).attr("data-matnum", newloc.num);
  div.css("bottom", bubbleMatrix[newloc.row][newloc.num].y);
  div.css("left", bubbleMatrix[newloc.row][newloc.num].x);
  div.text(newloc.row + "," + newloc.num);
  bubbleMatrix[newloc.row][newloc.num].div = bubbleMatrix[oldloc.row][oldloc.num].div;
  bubbleMatrix[newloc.row][newloc.num].color = bubbleMatrix[oldloc.row][oldloc.num].color;
  bubbleMatrix[oldloc.row][oldloc.num].div = void 0;
  return bubbleMatrix[oldloc.row][oldloc.num].color = void 0;
};

toggleMatrixPosition = function() {
  var bm, div, n, r;
  if (currMatrix === "one") {
    bm = bubbleMatrixTwo;
    currMatrix = "two";
  } else {
    bm = bubbleMatrixOne;
    currMatrix = "one";
  }
  r = 0;
  while (r < bm.length) {
    n = 0;
    while (n < bm[r].length) {
      bubbleMatrix[r][n].x = bm[r][n].x;
      bubbleMatrix[r][n].y = bm[r][n].y;
      if (!isMatrixLocEmpty({
        row: r,
        num: n
      })) {
        div = $(".point[data-matrow='" + r + "'][data-matnum='" + n + "']");
        div.css("left", bm[r][n].x + "px").css("bottom", bm[r][n].y);
      }
      n++;
    }
    r++;
  }
};


/* The next set of functions are for returning clusters of color */

checkCluster = function(loc, checkColor, n, checkedBefore) {
  var arr, enviro, l, _i, _len;
  if (checkColor === void 0) {
    checkColor = true;
  }
  if (n === void 0) {
    n = 0;
  } else {
    n++;
  }
  if (checkedBefore === void 0) {
    checkedBefore = [];
  }
  checkedBefore.push(stringifyLoc(loc));
  arr = [loc];
  if (n < 1000) {
    enviro = lookAround(loc);
    for (_i = 0, _len = enviro.length; _i < _len; _i++) {
      l = enviro[_i];
      if ($.inArray(stringifyLoc(l), checkedBefore) === -1) {
        checkedBefore.push(stringifyLoc(l));
        if (checkColor) {
          if (getColor(l) === getColor(loc)) {
            arr = arr.concat(checkCluster(l, checkColor, n, checkedBefore));
          }
        } else {
          arr = arr.concat(checkCluster(l, checkColor, n, checkedBefore));
        }
      }
    }
    return arr;
  }
};

isMatrixLocEmpty = function(loc) {
  if (loc.row < 0 || loc.row > bubbleMatrix.length - 1 || loc.num < 0 || loc.num > bubbleMatrix[0].length - 1) {
    return true;
  } else {
    return bubbleMatrix[loc.row][loc.num].div === undefined;
  }
};

stringifyLoc = function(loc) {
  return loc.row + "," + loc.num;
};

getColor = function(row, num) {
  if (row.row === void 0) {
    return bubbleMatrix[row][num].color;
  } else {
    return bubbleMatrix[row.row][row.num].color;
  }
};

lookAround = function(loc) {
  var alt, div, enviro, enviro2, l, num, row, _i, _len;
  div = $(this[0]);
  row = loc.row;
  num = loc.num;
  enviro = [];
  if (currMatrix === "one") {
    if (row % 2 === 0) {
      alt = -1;
    } else {
      alt = 0;
    }
  } else {
    if (row % 2 === 1) {
      alt = -1;
    } else {
      alt = 0;
    }
  }
  enviro.push({
    row: row - 1,
    num: num + alt
  });
  enviro.push({
    row: row - 1,
    num: num + alt + 1
  });
  enviro.push({
    row: row,
    num: num - 1
  });
  enviro.push({
    row: row,
    num: num + 1
  });
  enviro.push({
    row: row + 1,
    num: num + alt
  });
  enviro.push({
    row: row + 1,
    num: num + alt + 1
  });
  enviro2 = [];
  for (_i = 0, _len = enviro.length; _i < _len; _i++) {
    l = enviro[_i];
    if (!isMatrixLocEmpty(l)) {
      enviro2.push(l);
    }
  }
  return enviro2;
};

drop = function(locs, type, callback) {
  var delta, i, l, ldiv, multipler, target, topRow, topRowDFB, toploc, _i, _len;
  if (locs === void 0) {
    return;
  } else {
    if (locs instanceof Array) {
      if (locs.length === 0) {
        return;
      } else {
        locs = locs;
      }
    } else {
      locs = [locs];
    }
    if (type === "drop") {
      toploc = _.min(locs, function(d) {
        return d.row;
      });
      topRow = toploc.row;
      topRowDFB = bubbleMatrix[topRow][0].y - $("#popper-container").height();
    }
    i = 0;
    for (_i = 0, _len = locs.length; _i < _len; _i++) {
      l = locs[_i];
      bubbleMatrix[l.row][l.num].color = void 0;
      bubbleMatrix[l.row][l.num].div = void 0;
      ldiv = getDivFromLoc(l);
      if (type === "drop") {
        target = topRowDFB;
        multipler = Math.pow(l.row - topRow + 1, 1.1);
        delta = -50 * multipler;
        target = target + delta;
        if (i === locs.length - 1) {
          ldiv.animate({
            bottom: target + "px"
          }, {
            duration: 600,
            complete: function() {
              if (callback !== void 0) {
                return callback();
              }
            }
          });
        } else {
          ldiv.animate({
            bottom: target + "px"
          }, {
            duration: 600
          });
        }
      } else {
        if (i === locs.length - 1) {
          ldiv.fadeOut({
            duration: 150,
            complete: function(i) {
              if (callback !== void 0) {
                return setTimeout((function() {
                  return callback();
                }), 10);
              }
            }
          });
        } else {
          ldiv.fadeOut({
            duration: 150
          });
        }
      }
      i++;
    }
  }
};

getDivFromLoc = function(loc) {
  var div;
  div = $(".point[data-matrow=" + loc.row + "][data-matnum=" + loc.num + "]");
  return div;
};

gameOver = function() {
  $("#gameover").show();
  isGameOver = true;
  clearInterval(window.addrow);
  shooting = false;
  return $("#pause-button").addClass("disabled");
};

pause = function() {
  $("#pause").show();
  return isPaused = true;
};

unpause = function() {
  $("#pause").hide();
  return isPaused = false;
};

win = function() {
  $("#victory").show();
  clearInterval(window.addrow);
  isWon = true;
  shooting = false;
  return $("#pause-button").addClass("disabled");
};

checkIfWon = function() {
  var didIWin, l, n, r;
  didIWin = true;
  r = 0;
  while (r < bubbleMatrix.length) {
    n = 0;
    while (n < bubbleMatrix[r].length) {
      l = {
        row: r,
        num: n
      };
      if (!isMatrixLocEmpty(l)) {
        didIWin = false;
        break;
      }
      n++;
    }
    r++;
  }
  return didIWin;
};


/* jQuery add ons, mostly relatied to shooting a bubble */

jQuery.fn.createBubble = function(color) {
  var div;
  div = $("<div class='point'></div>");
  div.css("width", BUBBLE_RADIUS * 2 + "px").css("height", BUBBLE_RADIUS * 2 + "px").css("border-width", BUBBLE_BORDER + "px");
  if (color !== void 0) {
    div.attr("data-color", color);
  }
  $(this[0]).append(div);
  return div;
};

jQuery.fn.putInMatrix = function(loc, pop) {
  var coords, deltaScore, div, oldScore, sameColorLocs;
  if (pop === void 0) {
    pop = true;
  }
  div = $(this[0]);
  bubbleMatrix[loc.row][loc.num].div = div;
  bubbleMatrix[loc.row][loc.num].color = div.attr("data-color");
  coords = bubbleMatrix[loc.row][loc.num];
  div.drawAt(coords.x, coords.y);
  div.attr("data-matrow", loc.row);
  div.attr("data-matnum", loc.num);
  div.text(loc.row + ", " + loc.num);
  if (pop === true) {
    deltaScore = 0;
    sameColorLocs = checkCluster(loc, true);
    if (sameColorLocs.length >= 3) {
      oldScore = parseInt($("#score").text());
      $("#score").text(oldScore + sameColorLocs.length);
      drop(sameColorLocs, "fade", function() {
        var b, bonuspts, bonussec, furthest, i, l, loc_i, looseguys, n, newsec, r, topsChecked, wallcluster, _i, _len, _ref;
        topsChecked = [];
        i = 0;
        _ref = bubbleMatrix[0];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          b = _ref[_i];
          topsChecked.push(i);
          i++;
        }
        wallcluster = [];
        i = 0;
        while (i < topsChecked.length && i < 1000) {
          loc_i = {
            row: 0,
            num: i
          };
          if (!isMatrixLocEmpty(loc_i)) {
            wallcluster = wallcluster.concat(checkCluster(loc_i, false));
            furthest = _.max(_.where(wallcluster, {
              row: 0
            }), function(d) {
              return d.num;
            });
            i = furthest.num + 1;
          } else {
            i++;
          }
        }
        looseguys = [];
        r = 0;
        while (r < bubbleMatrix.length) {
          n = 0;
          while (n < bubbleMatrix[r].length) {
            l = {
              row: r,
              num: n
            };
            if (!isMatrixLocEmpty(l)) {
              if (_.where(wallcluster, l).length === 0) {
                looseguys.push(l);
              }
            }
            n++;
          }
          r++;
        }
        if (looseguys.length > 1) {
          bonussec = Math.round(looseguys.length * DROP_TIME_MULTIPLER);
          newsec = addRowCounterSecs + bonussec;
          newsec = Math.min(newsec, ROW_COUNTER_INTERVAL);
          addRowCounterSecs = newsec;
          $("#addrowmeter").css("width", addRowCounterSecs / ROW_COUNTER_INTERVAL * 100 + "%");
        }
        if (looseguys.length > 0) {
          bonuspts = Math.ceil(Math.pow(looseguys.length, DROP_MULTIPLER));
          if (bonuspts > 1) {
            noticeFlash("<small>Dropped " + looseguys.length + "!</small><br />" + bonuspts + " bonus points!!");
          } else if (bonuspts === 1) {
            noticeFlash("<small>Dropped 1</small><br />" + bonuspts + " bonus point!");
          }
        } else {
          bonuspts = 0;
        }
        oldScore = parseInt($("#score").text());
        $("#score").text(oldScore + looseguys.length + bonuspts);
        drop(looseguys, "drop", function() {
          if (checkIfWon() === true) {
            return win();
          }
        });
        if (checkIfWon() === true) {
          return win();
        }
      });
    } else {
      if (loc.row > MAX_ROW_NUM) {
        gameOver();
        div = $(".point").last();
        div.css("background-color", "#DDD").css("border-color", "#BBB");
        div.putInMatrix(prevMatrixLoc);
      }
    }
  }
  shooting = false;
};

jQuery.fn.drawAt = function(x, y) {
  $(this[0]).show().css("bottom", y + "px").css("left", +x + "px");
};

jQuery.fn.shoot = function(startDeg) {
  var ctr, div, h, prevMatrixLoc, t;
  div = $(this[0]);
  clearInterval(window.shootInterval);
  prevMatrixLoc = {
    row: "",
    num: ""
  };
  h = $("#popper-container").outerHeight() - BUBBLE_RADIUS * 2 - BUBBLE_BORDER * 2;
  t = 0;
  ctr = 0;
  window.shootInterval = setInterval(function() {
    var coords, currMatrixLoc, p;
    shooting = true;
    p = getPointAtT(t, startDeg);
    if (p.y <= h) {
      currMatrixLoc = findClosestInMatrix(p.x, p.y);
      if (isMatrixLocEmpty(currMatrixLoc)) {
        if (ctr % 2 === 0) {
          div.drawAt(p.x, p.y);
        }
        prevMatrixLoc = currMatrixLoc;
        t += SPEED;
      } else {
        clearInterval(window.shootInterval);
        div.putInMatrix(prevMatrixLoc);
      }
    } else {
      clearInterval(window.shootInterval);
      coords = getPointAtY(h + BUBBLE_RADIUS, startDeg);
      currMatrixLoc = findClosestInMatrix(coords.x, coords.y);
      if (isMatrixLocEmpty(currMatrixLoc)) {
        div.putInMatrix(currMatrixLoc);
      } else {
        div.putInMatrix(prevMatrixLoc);
      }
    }
  }, 5);
  return div;
};
