export default {
  name: 'Sibur', // уникальное имя спецпроекта. Оно же — название главного класса. Используется на странице, куда интегрируется спецпроект
  analyticsCategory: 'Sibur',
  sendPageView: false, // отключаем, если спецпроект не на отдельной странице
  listenedEvents: ['click'], // слушаем события (click, input, change, etc.). Обычно нужен только click
};
