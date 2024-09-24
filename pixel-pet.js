// Create the Snorlax pet element and add it to the page
const petIcon = document.createElement('div');
petIcon.id = 'pet-icon';

const snorlax = document.createElement('img');
snorlax.id = 'snorlax';
snorlax.src = chrome.runtime.getURL('pets/snorlax_rock.png');

petIcon.appendChild(snorlax);
document.body.appendChild(petIcon);

// Snorlax interaction logic
const hoverImage = chrome.runtime.getURL('pets/snorlax_sleep.png');
const defaultImage = chrome.runtime.getURL('pets/snorlax_rock.png');
const parkedImage = chrome.runtime.getURL('pets/snorlax_sit.png');
let isBouncing = false;
let isParked = false;
let clickTimer = null;

// Double-click event listener
snorlax.addEventListener('dblclick', function () {
  clearTimeout(clickTimer);

  if (!isParked) {
    snorlax.style.animationPlayState = 'paused';
    snorlax.src = parkedImage;
  } else {
    snorlax.style.animationPlayState = 'running';
    snorlax.src = defaultImage;
  }
  isParked = !isParked;
});

// Single-click event listener
snorlax.addEventListener('click', function () {
  clickTimer = setTimeout(() => {
    if (isBouncing || isParked) return;

    let posY = 0;
    let direction = 1;
    const speedY = 0.7;
    const maxY = petIcon.offsetHeight / 4;
    snorlax.style.animationPlayState = 'paused';

    let bounceInterval = setInterval(function () {
      isBouncing = true;
      snorlax.src = hoverImage;
      posY += speedY * direction;
      if (posY >= maxY) {
        direction *= -1;
      } else if (posY <= 0) {
        clearInterval(bounceInterval);
        direction = 1;
        snorlax.src = defaultImage;
        isBouncing = false;
        snorlax.style.animationPlayState = 'running';
      }
      petIcon.style.bottom = posY + 'px';
    }, 16);
  }, 200);
});


let posX = 0;
const speedX = 0.2;
let directionX = 1;
function movePet() {
  if (!isBouncing && !isParked) {
    posX += speedX * directionX;
    if (posX > window.innerWidth - petIcon.offsetWidth || posX <= 0) {
      directionX *= -1;
      petIcon.style.transform = `scaleX(${directionX})`;
    }
    petIcon.style.left = posX + 'px';
  }
  requestAnimationFrame(movePet);
}
movePet();