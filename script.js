$(document).ready(function () {
  $("#color_mode").on("change", function () {
    colorModePreview(this);
  })
});


function colorModePreview(ele) {
  if ($(ele).prop("checked") == true) {
    // $('body').addClass('dark-preview');
    // $('body').removeClass('white-preview');
    // startTexture();
  }
  else if ($(ele).prop("checked") == false) {
    // $('body').addClass('white-preview');
    // $('body').removeClass('dark-preview');
    // start();
  }
}
var slider = document.getElementById('slider');
var sliderItems = document.getElementById('items');
var lastIndex = 0;
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

var selectedDOMColorButton = document.getElementById('color2');
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
  cloneFirst.src = "Normal1.png";
  cloneLast.src = "Normal31.png";
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
      lastIndex = index;

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
        //((19 / 100) * window.innerWidth)
        items.style.left = (posInitial - ((19 / 100) * window.innerWidth)) + "px";
        index++;
      } else if (dir == -1) {
        items.style.left = (posInitial + ((19 / 100) * window.innerWidth)) + "px";
        index--;
      }
    };

    allowShift = false;
  }
  function checkIndex() {
    items.classList.remove('shifting');
    var imageIndex = lastIndex + 3;
    if (index == -2) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[0].classList.add('controlButtonSelected');
      change_lipstickColor([0.82352941176, 0.36862745098, 0.38431372549]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[0].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[0];
      link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
      shiftSlide(1)
    }
    else if (index == -1) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[1].classList.add('controlButtonSelected');
      change_lipstickColor([0.75294117647, 0.37254901961, 0.45098039216]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[1].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[1];
      link = "https://doris.tn/gloss-matte-velvet-05.html";
    }
    else if (index == 0) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[2].classList.add('controlButtonSelected');
      change_lipstickColor([0.77254901961, 0.36470588235, 0.41960784314]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[2].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[2];
      link = "https://doris.tn/gloss-matte-velvet-05.html";
    }
    else if (index == 1) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[3].classList.add('controlButtonSelected');
      change_lipstickColor([0.76862745098, 0.41176470588, 0.45490196078]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[3].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[3];
      link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
    }
    else if (index == 2) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[4].classList.add('controlButtonSelected');
      change_lipstickColor([0.76470588235, 0.41960784314, 0.50196078431]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[4].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[4];
      link = "https://doris.tn/gloss-matte-velvet-05.html";
    }
    else if (index == 3) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[5].classList.add('controlButtonSelected');
      change_lipstickColor([0.9568627451, 0.34901960784, 0.42745098039]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[5].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[5];
      link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
    }
    else if (index == 4) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[6].classList.add('controlButtonSelected');
      change_lipstickColor([0.8862745098, 0.27843137255, 0.34901960784]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[6].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[6];
      link = "https://doris.tn/gloss-matte-velvet-05.html";
    }
    else if (index == 5) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.86666666667, 0.32156862745, 0.37254901961]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[7].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[7];
      link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
    }
    else if (index == 6) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.80784313725, 0.18823529412, 0.20392156863]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[8].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[8];
      link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
    }
    else if (index == 7) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.78039215686, 0.18039215686, 0.20392156863]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[9].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[9];
      link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
    }
    else if (index == 8) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.87450980392, 0.29411764706, 0.27058823529]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[10].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[10];
      link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
    }
    else if (index == 9) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.8, 0.29019607843, 0.26666666667]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[11].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[11];
      link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
    }
    else if (index == 10) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.78431372549, 0.39215686275, 0.69803921569]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[12].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[12];
      link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
    }
    else if (index == 11) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.98431372549, 0.32941176471, 0.32941176471]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[13].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[13];
      link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
    }
    else if (index == 12) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.96862745098, 0.41176470588, 0.36470588235]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[14].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[14];
      link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
    }
    else if (index == 13) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.73333333333, 0.39607843137, 0.51764705882]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[15].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[15];
      link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
    }
    else if (index == 14) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.69019607843, 0.43137254902, 0.42745098039]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[16].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[16];
      link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
    }
    else if (index == 15) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.7137254902, 0.42352941176, 0.40392156863]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[17].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[17];
      link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
    }
    else if (index == 16) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.83529411765, 0.54117647059, 0.45098039216]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[18].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[18];
      link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
    }
    else if (index == 17) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.6862745098, 0.38039215686, 0.32549019608]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[19].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[19];
      link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
    }
    else if (index == 18) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.61568627451, 0.28235294118, 0.21568627451]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[20].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[20];
      link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
    }
    else if (index == 19) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.63921568627, 0.21568627451, 0.21568627451]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[21].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[21];
      link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
    }
    else if (index == 20) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.68235294118, 0.29411764706, 0.26274509804]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[22].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[22];
      link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
    }
    else if (index == 21) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.62745098039, 0.22745098039, 0.34117647059]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[23].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[23];
      link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
    }
    else if (index == 22) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.60784313725, 0.25490196078, 0.36078431373]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[24].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[24];
      link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
    }
    else if (index == 23) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.82745098039, 0.4862745098, 0.52156862745]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[25].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[25];
      link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
    }
    else if (index == 24) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.74509803922, 0.36470588235, 0.52549019608]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[26].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[26];
      link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
    }
    else if (index == 25) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.84705882353, 0.32941176471, 0.41568627451]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[27].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[27];
      link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
    }
    else if (index == 26) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.85490196078, 0.32549019608, 0.45490196078]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[28].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[28];
      link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
    }
    else if (index == 27) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.78431372549, 0.36078431373, 0.63137254902]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[29].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[29];
      link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
    }
    else if (index == 28) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.81176470588, 0.39215686275, 0.39607843137]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[30].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[30];
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
