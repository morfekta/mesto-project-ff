const config = {
  baseUrl: "https://nomoreparties.co/v1/wff-cohort-33",
  headers: {
    authorization: "5559c84b-395c-4b80-b72a-74baa50cd13f",
    "Content-Type": "application/json",
  },
};

// Запрос карточек с сервера
export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    headers: config.headers,
  }).then(handleResponse);
};

// Запрос данных пользователя с сервера
export const getUserInfo = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers,
  }).then(handleResponse);
};

// Проверка ответа сервера
const handleResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
};

// Обновление данных пользователя на сервере
export const updateUserInfo = (data) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify(data),
  }).then(handleResponse);
};

// Добавление новой карточки на сервер
export const addCard = (data) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify(data),
  }).then(handleResponse);
};

// Удаление карточки с сервера
export const deleteCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  }).then(handleResponse);
};

// Лайк или удаление лайка карточки
export const likeCard = (cardId, isLiked) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: isLiked ? "DELETE" : "PUT",
    headers: config.headers,
  }).then(handleResponse);
};

// Обновление аватара пользователя
export const updateAvatar = (data) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify(data),
  }).then(handleResponse);
}

// Проверка ссылки на изображение
export const checkImageUrl = (url) => {
  return fetch(url, { method: 'HEAD' })
    .then((res) => {
      if (!res.ok) {
        // Если статус не 200-299, выбрасываем ошибку
        return Promise.reject('Изображение не найдено или недоступно');
      }
      // Получаем заголовок content-type
      const contentType = res.headers.get('Content-Type');
      // Проверяем, что content-type начинается со слова "image"
      if (!contentType || !contentType.toLowerCase().startsWith('image')) {
        return Promise.reject('Ссылка не указывает на изображение');
      }
      return true; // Возвращаем true, если всё в порядке
    });
}
