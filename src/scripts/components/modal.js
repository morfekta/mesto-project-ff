// Обработчик закрытия попапа по нажатию на Esc
const handleEscKey = (e) => {
  if (e.key === "Escape") {
    const popup = document.querySelector('.popup_is-opened');
    closeModal(popup);
  }
};

// Устанавливаем класс для плавной анимации сразу при загрузке
document.querySelectorAll('.popup').forEach((modal) => {
  modal.classList.add('popup_is-animated');
});

// Функция открытия попапа
export const openModal = (modal) => {
  modal.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscKey);
};

// Функция закрытия попапа
export const closeModal = (modal) => {
  modal.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscKey);
}

// Функция установки обработчиков закрытия попапов (крестик + клик вне формы)
export const setPopupEventListener = (el) => {
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
