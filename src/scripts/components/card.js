// Функция создания карточки
export function createCard(
  cardTemplate,
  cardData,
  handleImageClick,
  userId,
  handleDeleteCard,
  likeCard
) {
  const card = cardTemplate.cloneNode(true); // Клонируем содержимое темплейта
  const cardImage = card.querySelector(".card__image");
  const deleteButton = card.querySelector(".card__delete-button");
  const likeButton = card.querySelector(".card__like-button");
  const likeCounter = card.querySelector(".card__like-counter");

  // Заполняем карточку данными
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  card.querySelector(".card__title").textContent = cardData.name;
  likeCounter.textContent = cardData.likes.length;

  // Проверяем есть уже лайк от пользователя
  if (cardData.likes.some((like) => like._id === userId)) {
    likeButton.classList.add("card__like-button_is-active");
  }

  // Вешаем обработчик клика на картинку
  cardImage.addEventListener("click", () => handleImageClick(cardData));

  // Убираем кнопку удаления, если карточка не принадлежит пользователю
  if (cardData.owner._id !== userId) {
    card.querySelector(".card__delete-button").remove();
  } else {
    // Иначе вешаем обработчик на кнопку удаления на открытие попапа
    deleteButton.addEventListener("click", () => {
      handleDeleteCard(deleteButton.closest(".card"), cardData._id);
    });
  }

  // Вешаем обработчик на кнопку лайка
  card
    .querySelector(".card__like-button")
    .addEventListener("click", (e) =>
      handleLike(e, cardData._id, likeCard, likeCounter)
    );

  // Возвращаем готовую карточку
  return card;
}

// Функция лайка карточки
function handleLike(e, cardId, likeCard, likeCounter) {
  const isLiked = e.target.classList.contains("card__like-button_is-active");

  likeCard(cardId, isLiked)
    .then((updatedCard) => {
      e.target.classList.toggle("card__like-button_is-active");
      likeCounter.textContent = updatedCard.likes.length;
    })
    .catch((err) => {
      console.log(err);
    });
}
