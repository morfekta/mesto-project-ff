import "../pages/index.css";
import {
  openModal,
  closeModal,
  setPopupEventListener,
} from "./components/modal.js";
import { createCard } from "./components/card.js";
import { enableValidation, clearValidation } from "./validation.js";
import {
  getInitialCards,
  getUserInfo,
  updateUserInfo,
  addCard,
  deleteCard,
  likeCard,
  updateAvatar,
  checkImageUrl
} from "./api.js";

// Получаем темплейт карточки и DOM-узел для списка карточек
const cardTemplate = document.querySelector("#card-template").content;
const cardsList = document.querySelector(".places__list");

// Попапы
const popupProfile = document.querySelector(".popup_type_edit");
const popupNewCard = document.querySelector(".popup_type_new-card");
const popupImage = document.querySelector(".popup_type_image");
const popupDelete = document.querySelector(".popup_type_delete");
const popupAvatar = document.querySelector(".popup_type_edit-avatar");

// Кнопки открытия попапов
const profileEditButton = document.querySelector(".profile__edit-button");
const newCardAddButton = document.querySelector(".profile__add-button");
const deleteButton = popupDelete.querySelector(".popup__button");
const avatarEditButton = document.querySelector(".profile__image-edit-button");

// Элементы попапа картинки
const img = popupImage.querySelector(".popup__image");
const caption = popupImage.querySelector(".popup__caption");

// Навесим обработчики закрытия попапов
setPopupEventListener(popupProfile);
setPopupEventListener(popupNewCard);
setPopupEventListener(popupImage);
setPopupEventListener(popupDelete);
setPopupEventListener(popupAvatar);

// Функция открытия попапа картинки (передаётся в `createCard`)
function handleImageClick(cardData) {
  img.src = cardData.link;
  img.alt = cardData.name;
  caption.textContent = cardData.name;
  openModal(popupImage);
}

// Переменные для удаления карточки
let cardToDelete = null;
let cardIdDelete = null;

// Функция открытия попапа удаления карточки (передаётся в `createCard`)
function handleDeleteCard(cardElement, cardId) {
  cardToDelete = cardElement;
  cardIdDelete = cardId;
  openModal(popupDelete);
}

// Устанавливаем класс для плавной анимации сразу при загрузке
document.querySelectorAll(".popup").forEach((modal) => {
  modal.classList.add("popup_is-animated");
});

// Получаем информацию о пользователе и карточках параллельно
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userInfo, initialCards]) => {
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    profileAvatar.src = userInfo.avatar;

    initialCards.forEach((cardData) => {
      const card = createCard(
        cardTemplate,
        cardData,
        handleImageClick,
        userInfo._id,
        handleDeleteCard,
        likeCard
      );
      cardsList.append(card);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// Настроим форму редактирования профиля
const profileFormElement = document.forms["edit-profile"];
const nameInput = profileFormElement.elements.name;
const jobInput = profileFormElement.elements.description;
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");
const profileAvatarForm = document.forms["edit-avatar"];
const avatarInput = profileAvatarForm.elements.avatar;


// Обработчик отправки формы обновления аватара
function handleAvatarFormSubmit(e) {
  e.preventDefault();
  const avatarUrl = avatarInput.value;
  const submitButton = profileAvatarForm.querySelector('.popup__button');
  const initialText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';
  submitButton.disabled = true;

  checkImageUrl(avatarUrl)
    .then(() => {
      return updateAvatar({ avatar: avatarUrl });
    })
    .then((userInfo) => {
      profileAvatar.src = userInfo.avatar;
      closeModal(popupAvatar);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      submitButton.textContent = initialText;
      submitButton.disabled = false;
    });
}

profileAvatarForm.addEventListener("submit", handleAvatarFormSubmit);

// Обработчик отправки формы редактирования профиля
function handleProfileFormSubmit(e) {
  e.preventDefault(); // Отменяем стандартную отправку формы.

  // Определяем переменные для показа загрузки
  const submitButton = profileFormElement.querySelector('.popup__button');
  const initialText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';
  submitButton.disabled = true;

  updateUserInfo({
    name: nameInput.value,
    about: jobInput.value,
  })
  .then((updatedUserInfo) => {
    profileName.textContent = updatedUserInfo.name;
    profileDescription.textContent = updatedUserInfo.about;
    closeModal(popupProfile);
  })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => {
    submitButton.textContent = initialText; // Возвращаем текст кнопки, когда всё загрузилось
    submitButton.disabled = false;
  });
}

profileFormElement.addEventListener("submit", handleProfileFormSubmit);

// Настроим форму добавления новой карточки
const newCardFormElement = document.forms["new-place"];
const cardNameInput = newCardFormElement.elements["place-name"];
const linkInput = newCardFormElement.elements.link;

// Обработчик отправки формы добавления карточки
function handleNewCardFormSubmit(e) {
  e.preventDefault();

  const cardData = {
    name: cardNameInput.value,
    link: linkInput.value,
  };

  const submitButton = newCardFormElement.querySelector('.popup__button');
  const initialText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';
  submitButton.disabled = true;

  addCard(cardData)
    .then((newCard) => {
      const card = createCard(
        cardTemplate,
        newCard,
        handleImageClick,
        newCard.owner._id,
        handleDeleteCard,
        likeCard
      );
      cardsList.prepend(card);
      closeModal(popupNewCard);
      e.target.reset();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      submitButton.textContent = initialText;
      submitButton.disabled = false;
    });
}

newCardFormElement.addEventListener("submit", handleNewCardFormSubmit);

// Обработчик на кнопку подтверждения удаления в попапе
deleteButton.addEventListener("click", () => {
  deleteCard(cardIdDelete)
    .then(() => {
      cardToDelete.remove(); // Удаляем карточку из DOM
      closeModal(popupDelete); // Закрываем попап
    })
    .catch((err) => {
      console.log(err);
    });
});

// Настройки валидации
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__input-error_visible",
};

// Обработчики открытия попапов
profileEditButton.addEventListener("click", () => {
  // Заполним поля формы текущими значениями при открытии
  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;

  clearValidation(profileFormElement, validationConfig);

  openModal(popupProfile);
});

newCardAddButton.addEventListener("click", () => {
  newCardFormElement.reset();
  clearValidation(newCardFormElement, validationConfig);

  openModal(popupNewCard);
});

avatarEditButton.addEventListener('click', () => {
  profileAvatarForm.reset();
  clearValidation(profileAvatarForm, validationConfig);
  openModal(popupAvatar);
});

// Включение валидации
enableValidation(validationConfig);
