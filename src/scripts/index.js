import '../pages/index.css';
import { initialCards } from './cards.js';
import { openModal, closeModal } from './components/modal.js';
import { createCard, deleteCard, handleLike } from './components/card.js';

// Получаем темплейт карточки и DOM-узел для списка карточек
const cardTemplate = document.querySelector('#card-template').content;
const cardsList = document.querySelector('.places__list');

// Кнопки попапов
const profileEditButton = document.querySelector('.profile__edit-button');
const newCardAddButton = document.querySelector('.profile__add-button');

// Попапы
const popupProfile = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');

// Элементы попапа картинки
const img = popupImage.querySelector('.popup__image');
const caption = popupImage.querySelector('.popup__caption');

// Функция установки обработчиков закрытия попапов (крестик + клик вне формы)
const setPopupEventListener = (el) => {
  const closeButton = el.querySelector('.popup__close');

  if (closeButton) {
    closeButton.addEventListener('click', () => closeModal(el));
  }

  el.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('popup')) {
      closeModal(el);
    }
  });
};

// Навесим обработчики закрытия попапов
setPopupEventListener(popupProfile);
setPopupEventListener(popupNewCard);
setPopupEventListener(popupImage);

// Функция открытия попапа картинки (передаётся в `createCard`)
function handleImageClick(cardData) {
  img.src = cardData.link;
  img.alt = cardData.name;
  caption.textContent = cardData.name;
  openModal(popupImage);
}

// Инициализация карточек (отрисовываем на странице)
initialCards.forEach(cardData => {
  const card = createCard(cardTemplate, cardData, deleteCard, handleImageClick, handleLike);
  cardsList.append(card);
});

// Настроим форму редактирования профиля
const profileFormElement = popupProfile.querySelector('.popup__form');
const nameInput = profileFormElement.elements.name;
const jobInput = profileFormElement.elements.description;
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

// Заполним поля формы текущими значениями при открытии
nameInput.value = profileName.textContent;
jobInput.value = profileDescription.textContent;

// Обработчик отправки формы редактирования профиля
function handleProfileFormSubmit(e) {
    e.preventDefault(); // Отменяем стандартную отправку формы.

    profileName.textContent = nameInput.value;
    profileDescription.textContent = jobInput.value;
    closeModal(popupProfile);
}

profileFormElement.addEventListener('submit', handleProfileFormSubmit);

// Настроим форму добавления новой карточки
const newCardFormElement = popupNewCard.querySelector('.popup__form');
const cardNameInput = newCardFormElement.querySelector('.popup__input_type_card-name');
const linkInput = newCardFormElement.elements.link;

// Обработчик отправки формы добавления карточки
function handleNewCardFormSubmit(e) {
    e.preventDefault();

    const cardData = {
        name: cardNameInput.value,
        link: linkInput.value
    };

    const card = createCard(cardTemplate, cardData, deleteCard, handleImageClick, handleLike);
    cardsList.prepend(card);
    closeModal(popupNewCard);
    cardNameInput.value = '';
    linkInput.value = '';
}

newCardFormElement.addEventListener('submit', handleNewCardFormSubmit);

// Обработчики открытия попапов
profileEditButton.addEventListener('click', (e) => openModal(popupProfile));
newCardAddButton.addEventListener('click', (e) => openModal(popupNewCard));