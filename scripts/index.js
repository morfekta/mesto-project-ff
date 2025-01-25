// Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// DOM узел для списка карточек
const cardsList = document.querySelector('.places__list');

// Функция создания карточки
function createCard(cardData, deleteCard) {
  const card = cardTemplate.cloneNode(true); // Клонируем содержимое темплейта

  // Заполняем карточку данными
  card.querySelector('.card__image').src = cardData.link;
  card.querySelector('.card__image').alt = cardData.name;
  card.querySelector('.card__title').textContent = cardData.name;

  // Вешаем обработчик на кнопку удаления
  card.querySelector('.card__delete-button').addEventListener('click', deleteCard);

  // Возвращаем готовую карточку
  return card;
}

// Функция удаления карточки
function deleteCard(event) {
  event.target.closest('.card').remove();
}

// Выводим карточки на страницу
initialCards.forEach(cardData => {
  const card = createCard(cardData, deleteCard);
  cardsList.append(card);
});
