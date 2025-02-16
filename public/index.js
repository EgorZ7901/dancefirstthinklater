const checkDiv = document.querySelector('.submit-button');
const emailInput = document.querySelector('input.email');
const nameInput = document.querySelector('input.name');
const dateInput = document.querySelector('input.date');
const songInput = document.querySelector('input.song');
const messageInput = document.querySelector('textarea.message');
const errorFill = document.querySelector('.error.fill');
const errorEmail = document.querySelector('.error.email');
const errorFail = document.querySelector('.error.fail');
const successMessage = document.querySelector('.success');
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
let currentImage = 0;
const imagesFrame = document.querySelector('.js-image-opener');
const images = document.querySelectorAll('.portfolio .image');
let removeListeners = null;

window.addEventListener('scroll', function() {
  const parallax = document.querySelector('.parallax-background');
  const scrollPosition = window.scrollY;
  parallax.style.transform = `translateY(${scrollPosition * 0.5}px)`;
});

const scrollToTopBtn = document.querySelector('.js-back-button');

window.onscroll = function() {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    scrollToTopBtn.style.opacity = '1';
  } else {
    scrollToTopBtn.style.opacity = '0';
  }
};

scrollToTopBtn.onclick = function() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

checkDiv.addEventListener('click', function() {
  const emailValue = emailInput.value.trim();
  const nameValue = nameInput.value.trim();
  errorFill.style.display = 'none';
  errorEmail.style.display = 'none';
  errorFail.style.display = 'none';
  successMessage.style.display = 'none';

  if (emailValue === '' || nameValue === '') {
    errorFill.style.display = 'block';
    return;
  }

  if (!emailRegex.test(emailValue)) {
    errorEmail.style.display = 'block';
    return;
  }

  successMessage.style.display = 'block';
  sendData();
});

images.forEach((elem, index) => {
  elem.addEventListener('click', () => {
    imagesFrame.classList.add('visible');
    imagesFrame.querySelector('img').src = elem.querySelector('img').src;
    currentImage = index;
    addArrowKeyListeners();
  })
});

function addArrowKeyListeners() {
  const onArrowLeft = (event) => {
    if (event.key === "ArrowLeft") {
      selectImage(currentImage - 1)
    }
  };

  const onArrowRight = (event) => {
    if (event.key === "ArrowRight") {
      selectImage(currentImage + 1)
    }
  };

  const onEscKey = (event) => {
    if (event.key === "Escape") {
      closeModalFunction();
    }
  };

  document.addEventListener("keydown", onArrowLeft);
  document.addEventListener("keydown", onArrowRight);
  document.addEventListener("keydown", onEscKey);

  return () => {
    document.removeEventListener("keydown", onArrowLeft);
    document.removeEventListener("keydown", onArrowRight);
    document.removeEventListener("keydown", onEscKey);
  };
}

imagesFrame.querySelectorAll('.arrow')
  .forEach(elem => elem.addEventListener('click', () => {
    elem.classList.contains('next') ? selectImage(currentImage + 1) : selectImage(currentImage - 1);
  })
)

function selectImage(index) {
  const image = imagesFrame.querySelector('img');
  let newIndex = index;
  if (index === -1) {
    newIndex = 11;
  } else if (index === 12) {
    newIndex = 0;
  }
  image.classList.add('reload');
  imagesFrame.querySelector('img').src =
    document.querySelector(`.portfolio .index${newIndex} img`).src;
  image.classList.remove('reload');
  currentImage = newIndex;
}

imagesFrame.querySelector('.closer').addEventListener('click', () => {
  imagesFrame.classList.remove('visible');
  removeListeners();
  removeListeners = null;
})

function closeModalFunction() {
  imagesFrame.classList.remove('visible');
  removeListeners();
  removeListeners = null;
}

async function sendData() {
  const message = {
    emailValue: emailInput.value.trim(),
    nameValue: nameInput.value.trim(),
    dateValue: dateInput.value.trim(),
    songValue: songInput.value.trim(),
    messageValue: messageInput.value.trim(),
  }


  try {
    const response = await fetch('/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const result = await response.json();

    if (result.success) {
      console.log('Your message has been sent!');
    } else {
      errorFail.style.display = 'block'
      console.log('Failed to send message. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    errorFail.style.display = 'block'
    console.log('An error occurred while sending your message.');
  }
}
