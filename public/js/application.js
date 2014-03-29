var BUBBLE_BORDER, BUBBLE_RADIUS, CONTAINER_BORDER, MAX_ANGLE, SPEED, bubbleMatrix, checkCluster, drop, findClosestInMatrix, gameover, getColor, getDivFromLoc, getPointAtT, getPointAtY, getSlope, isMatrixLocEmpty, lookAround, shooting, stringifyLoc;

BUBBLE_BORDER = 5;

BUBBLE_RADIUS = 25;

CONTAINER_BORDER = 5;

SPEED = 20;

MAX_ANGLE = 75;

bubbleMatrix = [];

shooting = false;

gameover = false;

$(document).ready(function() {
  var colors, currColor, currColorClass, gameoverlay, h, i, j, margin, rand, shooter, shooterbase, shootercontrol, shooteroverlay, w, x, xNum, y, yNum;
  shooter = $("<div class='popper-shooter'></div>");
  shootercontrol = $("<div id='shooter-control'></div>");
  shooterbase = $("<div id='shooter-base'></div>");
  shooteroverlay = $("<div id='shooter-control-overlay'></div>");
  gameoverlay = $("<div id='gameover'></div>");
  gameoverlay.append("<div style='color: #300; text-align: center; font-size: 60px; margin-top: 200px'><strong>Game Over <i class='fa fa-frown-o'></i></strong></div>");
  $("#popper-container").append(shootercontrol);
  $("#popper-container").append(shooterbase);
  $("#popper-container").append(shooteroverlay);
  $("#popper-container").append(gameoverlay);
  $("#popper-container").append(shooter);
  colors = ["red", "green", "yellow", "blue"];
  rand = Math.floor(Math.random() * colors.length);
  currColor = colors[rand];
  currColorClass = "popper-" + currColor;
  $(".popper-shooter").addClass(currColorClass);
  shooteroverlay.mousemove(function(e) {
    var rotatedeg;
    if (!gameover) {
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
    if (!gameover) {
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
    if (!shooting && !gameover) {
      rotatedeg = Number($(".popper-shooter").data("rotatedeg"));
      $("#shoot-at-deg").text("Shoot at: " + Math.round(rotatedeg * 10) / 10);
      $("#popper-container").createBubble().addClass(currColorClass).attr("data-color", currColor).shoot(rotatedeg);
      i = 0;
      while (i < colors.length) {
        $(".popper-shooter").removeClass("popper-" + colors[i]);
        i++;
      }
      rand = Math.floor(Math.random() * colors.length);
      currColor = colors[rand];
      currColorClass = "popper-" + currColor;
      $(".popper-shooter").addClass(currColorClass);
    }
  });
  shooteroverlay.bind("touchend", function(e) {
    var i, rotatedeg;
    if (!shooting && !gameover) {
      e.preventDefault();
      rotatedeg = Number($(".popper-shooter").data("rotatedeg"));
      $("#shoot-at-deg").text("Shoot at: " + Math.round(rotatedeg * 10) / 10);
      $("#popper-container").createBubble().addClass(currColorClass).attr("data-color", currColor).shoot(rotatedeg);
      i = 0;
      while (i < colors.length) {
        $(".popper-shooter").removeClass("popper-" + colors[i]);
        i++;
      }
      rand = Math.floor(Math.random() * colors.length);
      currColor = colors[rand];
      currColorClass = "popper-" + currColor;
      $(".popper-shooter").addClass(currColorClass);
    }
  });
  w = $("#popper-container").width();
  h = $("#popper-container").outerHeight() - BUBBLE_RADIUS * 2 - BUBBLE_BORDER * 2;
  xNum = Math.floor(w / (BUBBLE_RADIUS * 2) - 0.5);
  yNum = Math.floor(h / (BUBBLE_RADIUS * 2) - 0.5) * 1.5 - 1;
  margin = (w - (xNum + 0.5) * BUBBLE_RADIUS * 2) / 2;
  bubbleMatrix = [];
  j = 0;
  while (j < yNum) {
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
      bubbleMatrix[j][i] = {
        x: x,
        y: y
      };
      i++;
    }
    j++;
  }
});


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
  } else {
    return console.log("too many recursions");
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
  if (row % 2 === 0) {
    alt = -1;
  } else {
    alt = 0;
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
  var b, l, ldiv, target, toploc, toprow, _i, _len;
  if (locs instanceof Array) {
    locs = locs;
  } else {
    locs = [locs];
  }
  toploc = _.min(locs, function(d) {
    return d.row;
  });
  toprow = toploc.row;
  for (_i = 0, _len = locs.length; _i < _len; _i++) {
    l = locs[_i];
    bubbleMatrix[l.row][l.num].color = void 0;
    bubbleMatrix[l.row][l.num].div = void 0;
    ldiv = getDivFromLoc(l);
    b = parseInt(ldiv.css("bottom"));
    target = (b - $("#popper-container").height()) * ((l.row - toploc.row + 1) * 3 + 1);
    if (type === "drop") {
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
      ldiv.fadeOut({
        duration: 150,
        complete: function() {
          if (callback !== void 0) {
            return setTimeout((function() {
              return callback();
            }), 10);
          }
        }
      });
    }
  }
};

getDivFromLoc = function(loc) {
  var div;
  div = $(".point[data-matrow=" + loc.row + "][data-matnum=" + loc.num + "]");
  return div;
};


/* jQuery add ons, mostly relatied to shooting a bubble */

jQuery.fn.createBubble = function() {
  var div;
  div = $("<div class='point'></div>");
  div.css("width", BUBBLE_RADIUS * 2 + "px").css("height", BUBBLE_RADIUS * 2 + "px").css("border-width", BUBBLE_BORDER + "px");
  $(this[0]).append(div);
  return div;
};

jQuery.fn.putInMatrix = function(loc) {
  var coords, div, sameColorLocs;
  div = $(this[0]);
  bubbleMatrix[loc.row][loc.num].div = div;
  bubbleMatrix[loc.row][loc.num].color = div.attr("data-color");
  coords = bubbleMatrix[loc.row][loc.num];
  div.drawAt(coords.x, coords.y);
  div.attr("data-matrow", loc.row);
  div.attr("data-matnum", loc.num);
  div.text(loc.row + ", " + loc.num);
  sameColorLocs = checkCluster(loc, true);
  if (sameColorLocs.length >= 3) {
    drop(sameColorLocs, "fade", function() {
      var b, furthest, i, l, loc_i, looseguys, n, r, topsChecked, wallcluster, _i, _len, _ref;
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
      return drop(looseguys, "drop");
    });
  } else {
    if (loc.row > 10) {
      $("#gameover").show();
      gameover = true;
      div = $(".point").last();
      div.css("background-color", "#DDD").css("border-color", "#BBB");
      div.putInMatrix(prevMatrixLoc);
      shooting = false;
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
