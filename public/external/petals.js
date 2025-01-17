document.addEventListener("DOMContentLoaded", function () {
  TweenLite.set("#petals", { perspective: 600 });

  var petalCount = 20;
  var petalCount2 = 10;
  (w = window.innerWidth), (h = window.innerHeight);

  for (i = 0; i < petalCount; i++) {
    var petal = document.createElement("div");
    TweenLite.set(petal, {
      attr: {
        class: "petal",
      },
      x: R(0, w),
      y: R(-200, -150),
      z: R(-200, 200),
    });
    document.getElementById("petals").appendChild(petal);
    movePetal(petal);
  }

  for (i = 0; i < petalCount2; i++) {
    var petal = document.createElement("div");
    TweenLite.set(petal, {
      attr: {
        class: "petal",
      },
      x: R(0, w),
      y: R(-200, -150),
      z: R(-200, 200),
    });
    document.getElementById("petals2").appendChild(petal);
    movePetal(petal);
  }

  function movePetal(elm) {
    TweenMax.to(elm, R(7, 15), {
      y: h + 200,
      ease: Linear.easeNone,
      repeat: -1,
      delay: -15,
    });
    TweenMax.to(elm, R(4, 8), {
      x: "+=100",
      rotationZ: R(0, 180),
      repeat: -1,
      yoyo: true,
      ease: Sine.easeInOut,
    });
    TweenMax.to(elm, R(2, 8), {
      rotationX: R(0, 360),
      rotationY: R(0, 360),
      repeat: -1,
      yoyo: true,
      ease: Sine.easeInOut,
      delay: -5,
    });
  }

  function R(min, max) {
    return min + Math.random() * (max - min);
  }
});

/*
    Modified version of "Autumn falling leaves ( GSAP )" by Diaco M Lotfolahi.
    Copyright (c) 2024 by Diaco M Lotfolahi (https://codepen.io/MAW/pen/KdmwMb)

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
