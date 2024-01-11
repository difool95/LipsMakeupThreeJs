$(document).ready(function () {
  $("#color_mode").on("change", function () {
    colorModePreview(this);
  })
});

function colorModePreview(ele) {
  if ($(ele).prop("checked") == true) {
    // $('body').addClass('dark-preview');
    // $('body').removeClass('white-preview');
    console.log("glossy");
    // startTexture();
  }
  else if ($(ele).prop("checked") == false) {
    // $('body').addClass('white-preview');
    // $('body').removeClass('dark-preview');
    console.log("Matte");
    // start();
  }
}
var slider = document.getElementById('slider');
var sliderItems = document.getElementById('items');
// prev = document.getElementById('prev'),
// next = document.getElementById('next');
var threshold = document.documentElement.clientWidth * 0.19; // Adjust as needed
var initialPosition = -(threshold); // You can adjust this value as needed
var link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
slide(slider, sliderItems, initialPosition);
var openLink = document.getElementById("openLink");
openLink.addEventListener("click", function () {
  window.location.href = link;
});
function slide(wrapper, items, initialPosition) {
  var posX1 = 0,
    posX2 = 0,
    posInitial,
    posFinal,
    // Calculate the initial position to show the leftmost item
    slides = items.getElementsByClassName('slide'),
    slidesLength = slides.length,
    slideSize = items.getElementsByClassName('slide')[0].offsetWidth;
  slideSize += document.documentElement.clientWidth * 0.06;
  firstSlide = slides[0],
    lastSlide = slides[slidesLength - 1],
    cloneFirst = firstSlide.cloneNode(true),
    cloneLast = lastSlide.cloneNode(true),
    index = 0,
    allowShift = true;
  items.style.left = -(document.documentElement.clientWidth * 0.13) + "px";
  // Clone first and last slide
  items.appendChild(cloneFirst);
  items.insertBefore(cloneLast, firstSlide);
  wrapper.classList.add('loaded');

  // Mouse and Touch events
  items.onmousedown = dragStart;

  // Touch events
  items.addEventListener('touchstart', dragStart);
  items.addEventListener('touchend', dragEnd);
  items.addEventListener('touchmove', dragAction);

  // Click events
  // prev.addEventListener('click', function () { shiftSlide(-1) });
  // next.addEventListener('click', function () { shiftSlide(1) });

  // Transition events
  items.addEventListener('transitionend', checkIndex);

  function dragStart(e) {
    e = e || window.event;
    // e.preventDefault();
    posInitial = items.offsetLeft;

    if (e.type == 'touchstart') {
      posX1 = e.touches[0].clientX;
    } else {
      posX1 = e.clientX;
      document.onmouseup = dragEnd;
      document.onmousemove = dragAction;
    }
  }

  function dragAction(e) {
    e = e || window.event;

    if (e.type == 'touchmove') {
      posX2 = posX1 - e.touches[0].clientX;
      posX1 = e.touches[0].clientX;
    } else {
      posX2 = posX1 - e.clientX;
      posX1 = e.clientX;
    }
    items.style.left = (items.offsetLeft - posX2) + "px";
  }

  function dragEnd(e) {
    posFinal = items.offsetLeft;
    if (posFinal - posInitial < -threshold) {
      shiftSlide(1, 'drag');
    } else if (posFinal - posInitial > threshold) {
      shiftSlide(-1, 'drag');
    } else {
      items.style.left = (posInitial) + "px";
    }

    document.onmouseup = null;
    document.onmousemove = null;
  }

  function shiftSlide(dir, action) {
    items.classList.add('shifting');

    if (allowShift) {
      if (!action) { posInitial = items.offsetLeft; }

      if (dir == 1) {
        items.style.left = (posInitial - slideSize) + "px";
        index++;
      } else if (dir == -1) {
        items.style.left = (posInitial + slideSize) + "px";
        index--;
      }
    };

    allowShift = false;
  }

  function checkIndex() {
    items.classList.remove('shifting');
    // console.log(index);
    // if (index == -1) {
    //   items.style.left = -(slidesLength * slideSize) + "px";
    //   index = slidesLength - 1;
    // }
    if (index == -2) {
      change_lipstickColor([0.6902, 0.4353, 0.6]);
      // change_lipstickTexture("makeup1.png");
      link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
      shiftSlide(1)
    }
    else if (index == -1) {
      change_lipstickColor([0.0, 0.0, 1.0]);
      // change_lipstickTexture("makeup2.png");
      link = "https://doris.tn/gloss-matte-velvet-05.html";
    }
    else if (index == 0) {
      link = "https://doris.tn/gloss-matte-velvet-05.html";
    }
    else if (index == 1) {
      // change_lipstickTexture("makeup4.png");
      change_lipstickColor([0.0, 0.0, 1.0]);
      link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
    }
    else if (index == 2) {
      // change_lipstickTexture("makeup1.png");
      change_lipstickColor([0.0, 0.0, 0.0]);
      link = "https://doris.tn/gloss-matte-velvet-05.html";
    }
    else if (index == 3) {
      // change_lipstickTexture("makeup2.png");
      change_lipstickColor([0.0, 0.0, 1.0]);
      link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
    }
    else if (index == 4) {
      // change_lipstickTexture("makeup3.png");
      change_lipstickColor([0.0, 0.0, 0.0]);
      link = "https://doris.tn/gloss-matte-velvet-05.html";
    }
    else if (index == 5) {
      // change_lipstickTexture("makeup4.png");
      change_lipstickColor([0.6902, 0.4353, 0.6]);
      link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
      shiftSlide(-1)
    }
    else if (index == slidesLength) {
      items.style.left = -(1 * slideSize) + "px";
      index = 0;
    }
    allowShift = true;
  }
}
