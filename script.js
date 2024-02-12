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
var link = "https://doris.tn/619248390598000.html";
slide(slider, sliderItems, initialPosition);
var openLink = document.getElementById("openLink");

/*openLink.addEventListener("click", function () {
  //window.open(link, '_blank');
  // window.location.href = link;
});*/

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
      change_lipstickColor([0.6352941176470588, 0.4627450980392157, 0.5058823529411764]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[0].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[0];
      link = "https://doris.tn/619248390596666.html";
      shiftSlide(1)
    }
    else if (index == -1) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[1].classList.add('controlButtonSelected');
      change_lipstickColor([0.7333333333333333, 0.5137254901960784, 0.4745098039215686]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[1].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[1];
      link = "https://doris.tn/gloss-matte-velvet-02.html";
    }
    else if (index == 0) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[2].classList.add('controlButtonSelected');
      change_lipstickColor([0.803921568627451, 0.5098039215686274, 0.596078431372549]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[2].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[2];
      link = "https://doris.tn/619248390598000.html";
    }
    else if (index == 1) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[3].classList.add('controlButtonSelected');
      change_lipstickColor([0.7647058823529411, 0.37254901960784315, 0.5137254901960784]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[3].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[3];
      link = "https://doris.tn/gloss-matte-velvet-04-6192483905997.html";
    }
    else if (index == 2) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[4].classList.add('controlButtonSelected');
      change_lipstickColor([0.7411764705882353, 0.3803921568627451, 0.396078431372549]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[4].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[4];
      link = "https://doris.tn/gloss-matte-velvet-05.html";
    }
    else if (index == 3) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[5].classList.add('controlButtonSelected');
      change_lipstickColor([0.7294117647058823, 0.3764705882352941, 0.4]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[5].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[5];
      link = "https://doris.tn/6192483906017-gloss-matte-velvet-06.html";
    }
    else if (index == 4) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[6].classList.add('controlButtonSelected');
      change_lipstickColor([0.7803921568627451, 0.3254901960784314, 0.29411764705882354]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[6].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[6];
      link = "https://doris.tn/gloss-matte-velvet-07-gloss-matte-velvet-07.html";
    }
    else if (index == 5) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.803921568627451, 0.43529411764705883, 0.5176470588235295]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[7].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[7];
      link = "https://doris.tn/6192483906031-gloss-matte-velvet-08.html";
    }
    else if (index == 6) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.6392156862745098, 0.4196078431372549, 0.5568627450980392]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[8].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[8];
      link = "https://doris.tn/6192483906048-gloss-matte-velvet-09.html";
    }
    else if (index == 7) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.7333333333333333, 0.3686274509803922, 0.403921568627451]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[9].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[9];
      link = "https://doris.tn/6192483906055-gloss-matte-velvet-10.html";
    }
    else if (index == 8) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.8431372549019608, 0.41568627450980394, 0.28627450980392155]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[10].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[10];
      link = "https://doris.tn/6192483906062-gloss-matte-velvet-11.html";
    }
    else if (index == 9) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.6039215686274509, 0.396078431372549, 0.34901960784313724]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[11].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[11];
      link = "https://doris.tn/6192483906079-gloss-matte-velvet-12.html";
    }
    else if (index == 10) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.7058823529411765, 0.20392156862745098, 0.27058823529411763]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[12].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[12];
      link = "https://doris.tn/6192483906086-gloss-matte-velvet%2013.html";
    }
    else if (index == 11) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.7137254901960784, 0.16862745098039217, 0.27058823529411763]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[13].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[13];
      link = "https://doris.tn/6192483906093-gloss-matte-velvet-144.html";
    }
    else if (index == 12) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.7686274509803922, 0.19607843137254902, 0.27058823529411763]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[14].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[14];
      link = "https://doris.tn/6192483906109-gloss%20matte%20velvet%2015.html";
    }
    else if (index == 13) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.7647058823529411, 0.2, 0.2]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[15].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[15];
      link = "https://doris.tn/6192483906116-gloss-matte-velvet-16.html";
    }
    else if (index == 14) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.5568627450980392, 0.19607843137254902, 0.1411764705882353]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[16].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[16];
      link = "https://doris.tn/6192483906123-gloss%20matte-velvet-17.html";
    }
    else if (index == 15) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.7254901960784313, 0.15294117647058825, 0.4549019607843137]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[17].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[17];
      link = "https://doris.tn/6192483906147-gloss-matte-velvet-19.html";
    }
    else if (index == 16) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.8117647058823529, 0.30980392156862746, 0.596078431372549]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[18].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[18];
      link = "https://doris.tn/6192483906154-gloss-matte-velvet-20.html";
    }
    else if (index == 17) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.9607843137254902, 0.3333333333333333, 0.3333333333333333]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[19].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[19];
      link = "https://doris.tn/6192483906185-gloss%20matte%20velvet%2023.html";
    }
    else if (index == 18) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.6431372549019608, 0.396078431372549, 0.34509803921568627]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[20].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[20];
      link = "https://doris.tn/gloss-matte-velvet-24-6192483906963.html";
    }
    else if (index == 19) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.4549019607843137, 0.3411764705882353, 0.4588235294117647]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[21].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[21];
      link = "https://doris.tn/6192483907007-gloss-matte-velvet-29.html";
    }
    else if (index == 20) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.37254901960784315, 0.21568627450980393, 0.3254901960784314]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[22].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[22];
      link = "https://doris.tn/gloss-matte-velvet-30-6192483907014.html";
    }
    else if (index == 21) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.4, 0.1803921568627451, 0.13333333333333333]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[23].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[23];
      link = "https://doris.tn/gloss-matte-velvet-31-6192483907021.html";
    }
    else if (index == 22) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.34901960784313724, 0.20784313725490197, 0.20784313725490197]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[24].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[24];
      link = "https://doris.tn/gloss-matte-velvet-32-6192483907038.html";
    }
    else if (index == 23) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.3607843137254902, 0.1607843137254902, 0.1607843137254902]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[25].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[25];
      link = "https://doris.tn/gloss-matte-velvet%2033-6192483907045.html";
    }
    else if (index == 24) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.3607843137254902, 0.11372549019607843, 0.13333333333333333]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[26].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[26];
      link = "https://doris.tn/gloss-matte-velvet%2034-6192483907052.html";
    }
    else if (index == 25) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.41568627450980394, 0.2, 0.2]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[27].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[27];
      link = "https://doris.tn/gloss-matte-velvet-35-6192483907069.html";
    }
    else if (index == 26) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.4, 0.054901960784313725, 0.2]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[28].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[28];
      link = "https://doris.tn/gloss-matte-velvet-36-6192483907076.html";
    }
    else if (index == 27) {
      // selectedDOMColorButton.classList.remove('controlButtonSelected');
      // items.children[7].classList.add('controlButtonSelected');
      change_lipstickColor([0.40784313725490196, 0.06666666666666667, 0.0784313725490196]);
      selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
      items.children[29].src = "Selected" + (index + 3) + ".png";
      selectedDOMColorButton = items.children[29];
      link = "https://doris.tn/gloss-matte-velvet-37-6192483907083.html";
    }
    // else if (index == 28) {
    //   // selectedDOMColorButton.classList.remove('controlButtonSelected');
    //   // items.children[7].classList.add('controlButtonSelected');
    //   change_lipstickColor([0.81176470588, 0.39215686275, 0.39607843137]);
    //   selectedDOMColorButton.src = "Normal" + imageIndex + ".png"
    //   items.children[30].src = "Selected" + (index + 3) + ".png";
    //   selectedDOMColorButton = items.children[30];
    //   link = "https://doris.tn/6192483906048-gloss%20matte%20velvet%2009.html";
    //   shiftSlide(-1)
    // }
    else if (index == slidesLength) {
      items.style.left = -(1 * slideSize) + "px";
      index = 0;
    }
    allowShift = true;
  }
}

function getLink() {
  return link;
}


