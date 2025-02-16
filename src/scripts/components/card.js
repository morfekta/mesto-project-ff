// Функция создания карточки
export function createCard(cardTemplate, cardData, deleteCard, handleImageClick, handleLike) {
  const card = cardTemplate.cloneNode(true); // Клонируем содержимое темплейта
  const cardImage = card.querySelector('.card__image');

  // Заполняем карточку данными
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  card.querySelector('.card__title').textContent = cardData.name;

  // Вешаем обработчик клика на картинку
  cardImage.addEventListener('click', () => handleImageClick(cardData));

  // Вешаем обработчик на кнопку удаления
  card.querySelector('.card__delete-button').addEventListener('click', deleteCard);

  // Вешаем обработчик на кнопку лайка
  card.querySelector('.card__like-button').addEventListener('click', handleLike);

  // Возвращаем готовую карточку
  return card;
}

// Функция удаления карточки
export function deleteCard(event) {
  event.target.closest('.card').remove();
}

// Функция лайка карточки
export function handleLike(e) {
  e.target.classList.toggle('card__like-button_is-active');
}