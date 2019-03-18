import '../css/special.styl';

import BaseSpecial from './base';
import Data from './data';
import Svg from './svg';
import { makeElement, removeChildren } from './lib/dom';
import { shuffle } from './lib/array';
import { animate } from './lib/animate';
import makeSwipeable from './lib/swipe';
import * as Analytics from './lib/analytics';
import * as Share from './lib/share';

const CSS = {
  main: 'sibur',
};

const EL = {};
const IMAGES = {};

class Special extends BaseSpecial {
  constructor(params = {}) {
    super();

    Object.assign(this.params, params);
    this.saveParams();

    if (Data && params.data) {
      Object.assign(Data, params.data);
    }

    this.keyUpHandler = this.keyUpHandler.bind(this);

    if (this.params.css) {
      this.loadStyles(this.params.css).then(() => this.init());
    } else {
      this.init();
    }
  }

  createElements() {
    EL.q = makeElement('div', `${CSS.main}__question`);
    EL.pages = makeElement('div', `${CSS.main}__pages`);

    EL.controls = makeElement('div', `${CSS.main}__controls`);
    EL.optionL = makeElement('div', `${CSS.main}__option`, {
      innerHTML: `<button class="${CSS.main}__btn">Фантастика</button>`,
      data: {
        type: 'left',
      },
    });
    EL.optionR = makeElement('div', `${CSS.main}__option`, {
      innerHTML: `<button class="${CSS.main}__btn">Реальность</button>`,
      data: {
        type: 'right',
      },
    });

    EL.nextBtn = makeElement('button', `${CSS.main}__btn`, {
      textContent: 'Далее',
      data: {
        click: 'continue',
      },
    });

    EL.optionL.addEventListener('click', () => { this.answer('left'); });
    EL.optionR.addEventListener('click', () => { this.answer('right'); });

    EL.cards = makeElement('div', `${CSS.main}__cards`);
    EL.nextCards = makeElement('div', `${CSS.main}__next-cards`);

    EL.cardWrapper = makeElement('div', `${CSS.main}__card-wrapper`);
    EL.cardInner = makeElement('div', `${CSS.main}__card-inner`);

    EL.card = makeElement('div', `${CSS.main}-card`);
    EL.cHead = makeElement('div', `${CSS.main}-card__head`);
    EL.cBottom = makeElement('div', `${CSS.main}-card__bottom`);
    EL.cImg = makeElement('img', `${CSS.main}-card__img`);
    EL.cText = makeElement('div', `${CSS.main}-card__text`);

    EL.cHead.appendChild(EL.cImg);
    EL.cBottom.appendChild(EL.cText);

    EL.card.appendChild(EL.cHead);
    EL.card.appendChild(EL.cBottom);

    EL.backCard = makeElement('div', [`${CSS.main}-card`, `${CSS.main}-card--back`]);
    EL.bcHead = makeElement('div', `${CSS.main}-card__head`);
    EL.bcBottom = makeElement('div', `${CSS.main}-card__bottom`);
    EL.bcAnswer = makeElement('div', `${CSS.main}-card__answer`);
    EL.bcAnswerTitle = makeElement('div', `${CSS.main}-card__answer-title`);
    EL.bcAnswerText = makeElement('div', `${CSS.main}-card__answer-text`);
    EL.bcAnswerImg = makeElement('img', `${CSS.main}-card__img`);

    EL.bcAnswer.appendChild(EL.bcAnswerTitle);
    EL.bcAnswer.appendChild(EL.bcAnswerText);

    EL.bcHead.appendChild(EL.bcAnswerImg);
    EL.bcBottom.appendChild(EL.bcAnswer);

    EL.backCard.appendChild(EL.bcHead);
    EL.backCard.appendChild(EL.bcBottom);

    EL.cardInner.appendChild(EL.card);
    EL.cardInner.appendChild(EL.backCard);

    EL.cardWrapper.appendChild(EL.cardInner);

    EL.cards.appendChild(EL.nextCards);
    EL.cards.appendChild(EL.cardWrapper);

    if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent) || /firefox/i.test(navigator.userAgent)) {
      EL.card.style.webkitBackfaceVisibility = 'hidden';
      EL.backCard.style.webkitBackfaceVisibility = 'hidden';
    }

    EL.q.appendChild(EL.pages);
    EL.q.appendChild(EL.cards);
    EL.q.appendChild(EL.controls);

    makeSwipeable(EL.cardWrapper, (t) => {
      this.answer(t, 'Swipe');
    });

    EL.result = makeElement('div', `${CSS.main}-result`);
    EL.rHead = makeElement('div', `${CSS.main}-result__head`);
    EL.rHeadInner = makeElement('div', `${CSS.main}-result__head-inner`);
    EL.rBottom = makeElement('div', `${CSS.main}-result__bottom`);
    EL.rImg = makeElement('img', `${CSS.main}-result__img`);
    EL.rResult = makeElement('div', `${CSS.main}-result__result`);
    EL.rTitle = makeElement('div', `${CSS.main}-result__title`);
    EL.rShare = makeElement('div', `${CSS.main}-result__share`);
    EL.rRestartBtn = makeElement('div', `${CSS.main}-result__restart-btn`, {
      innerHTML: `<span>Пройти еще раз</span>${Svg.refresh}`,
      data: {
        click: 'restart',
      },
    });
    EL.rText = makeElement('div', `${CSS.main}-result__text`, {
      innerHTML: Data.result.text,
    });
    EL.rTextImg = makeElement('a', `${CSS.main}-result__text-img`, {
      href: 'https://www.open.ru/cards/opencard?&utm_source=tj_test_ag2_image&utm_medium=fix&utm_content=card&utm_campaign=itogi_goda_komitet_ag2_image',
      target: '_blank',
      innerHTML: `<img src="${Data.result.img}" srcset="${Data.result.img2x} 2x">`,
    });
    EL.rTextBtn = makeElement('a', `${CSS.main}-result__text-btn`, {
      textContent: 'Уточнить',
      href: 'https://www.open.ru/cards/opencard?&utm_source=tj_test_ag2_image&utm_medium=fix&utm_content=card&utm_campaign=itogi_goda_komitet_ag2_image',
      target: '_blank',
    });

    EL.rHeadInner.appendChild(EL.rResult);
    // EL.rHeadInner.appendChild(EL.rTitle);
    EL.rHeadInner.appendChild(EL.rShare);
    EL.rHeadInner.appendChild(EL.rRestartBtn);

    // EL.rHead.appendChild(EL.rImg);
    EL.rHead.appendChild(EL.rHeadInner);
    // EL.rBottom.appendChild(EL.rTextImg);
    // EL.rBottom.appendChild(EL.rText);
    // EL.rBottom.appendChild(EL.rTextBtn);

    EL.result.appendChild(EL.rHead);
    // EL.result.appendChild(EL.rBottom);

    EL.help = makeElement('div', `${CSS.main}-help`);
    EL.hInner = makeElement('div', `${CSS.main}-help__inner`);
    EL.hIcon = makeElement('div', `${CSS.main}-help__icon`, {
      innerHTML: Svg.swipe,
    });
    EL.hText = makeElement('div', `${CSS.main}-help__text`, {
      innerHTML: '<p>Свайпайте карточку вправо, если считаете, что правильный ответ «да».</p><p>Влево — если «нет».</p>',
    });
    EL.hBtn = makeElement('button', `${CSS.main}-help__btn`, {
      textContent: 'Понятно',
      data: {
        click: 'hideHelp',
      },
    });

    EL.hInner.appendChild(EL.hIcon);
    EL.hInner.appendChild(EL.hText);
    EL.hInner.appendChild(EL.hBtn);

    EL.help.appendChild(EL.hInner);

    EL.nextCard = makeElement('div', [`${CSS.main}-card`, `${CSS.main}-card--next`]);
    EL.ncHead = makeElement('div', `${CSS.main}-card__head`);
    EL.ncBottom = makeElement('div', `${CSS.main}-card__bottom`);
    EL.ncText = makeElement('div', `${CSS.main}-card__text`);
    EL.ncImg = makeElement('img', `${CSS.main}-card__img`);

    EL.ncHead.appendChild(EL.ncImg);
    EL.ncBottom.appendChild(EL.ncText);
    EL.nextCard.appendChild(EL.ncHead);
    EL.nextCard.appendChild(EL.ncBottom);
  }

  hideHelp() {
    animate(EL.help, 'fadeOut', '200ms').then(() => {
      this.container.removeChild(EL.help);
    });
  }

  static makeNextCard(index) {
    const q = Data.questions[index];

    EL.ncText.innerHTML = q.text;
    EL.ncImg.src = q.images.main['1x'];
    EL.ncImg.srcset = `${q.images.main['2x']} 2x`;

    return EL.nextCard;
  }

  static changeCardImages(index) {
    const q = Data.questions[index];

    EL.cImg.src = q.images.main['1x'];
    EL.cImg.srcset = `${q.images.main['2x']} 2x`;
  }

  showCount() {
    const index = this.activeIndex + 1;
    removeChildren(EL.nextCards);

    if (index === Data.questions.length) {
      return;
    }

    const nextCard = Special.makeNextCard(index);

    if (index === Data.questions.length - 1) {
      EL.nextCards.innerHTML = '<div></div>';
      EL.nextCards.firstChild.appendChild(nextCard);
    } else if (index > Data.questions.length / 2) {
      EL.nextCards.innerHTML = '<div></div><div></div>';
      EL.nextCards.firstChild.appendChild(nextCard);
    } else if (index > Data.questions.length / 4) {
      EL.nextCards.innerHTML = '<div></div><div></div><div></div>';
      EL.nextCards.firstChild.appendChild(nextCard);
    } else {
      EL.nextCards.innerHTML = '<div></div><div></div><div></div><div></div>';
      EL.nextCards.firstChild.appendChild(nextCard);
    }
  }

  static getResult() {
    const index = Math.floor(Math.random() * Data.results.length);
    const result = Data.results[index];

    return { result, index };
  }

  onOptionHover(e) {
    if (this.isAnswered || this.activeIndex > 0) return;

    const el = e.currentTarget;
    const t = el.dataset.type;
    const hint = makeElement('div', [`${CSS.main}__option-hint`, `${CSS.main}__option-hint--${t}`], {
      innerHTML: t === 'left' ? `<div>Или свайпни карточку влево</div>${Svg.swipeL}` : `${Svg.swipeR}<div>Или свайпни карточку вправо</div>`,
    });

    el.appendChild(hint);

    const onOptionLeave = () => {
      el.removeEventListener('mouseout', onOptionLeave);
      el.removeEventListener('click', onOptionLeave);
      el.removeChild(hint);
    };
    el.addEventListener('mouseout', onOptionLeave);
    el.addEventListener('click', onOptionLeave);
  }

  start() {
    Data.questions.forEach((q, i) => {
      Data.questions[i].id = i;
    });
    shuffle(Data.questions);

    this.makeNextQuestion();

    if (/Mobi|Android/i.test(navigator.userAgent) || window.innerWidth <= 768) {
      this.container.appendChild(EL.help);
      animate(EL.help, 'fadeIn', '200ms', '400ms');
    } else {
      EL.optionL.addEventListener('mouseover', this.onOptionHover.bind(this));
      EL.optionR.addEventListener('mouseover', this.onOptionHover.bind(this));
    }

    Special.changeCardImages(this.activeIndex);

    this.initCardEvents();

    Analytics.sendEvent('Start', 'Show');
  }

  restart() {
    shuffle(Data.questions);

    this.container.classList.remove('is-result');
    this.container.removeChild(EL.result);
    this.container.appendChild(EL.q);

    EL.nextBtn.textContent = 'Далее';
    EL.nextBtn.dataset.click = 'continue';

    this.setInitialParams();
    this.initCardEvents();

    Special.changeCardImages(this.activeIndex);

    this.makeNextQuestion();
  }

  continue() {
    this.activeIndex += 1;

    const animationClassName = this.lastAnsweredType === 'left' ? 'fadeOutLeft' : 'fadeOutRight';

    animate(EL.cardWrapper, animationClassName).then(() => {
      this.container.classList.remove('is-answered');

      EL.cards.removeChild(EL.cardWrapper);
      EL.cardInner.style.transform = '';

      EL.backCard.classList.remove('is-correct');
      EL.backCard.classList.remove('is-incorrect');
      EL.bcAnswerImg.src = '';
      EL.bcAnswerImg.srcset = '';

      this.makeNextQuestion();
    });

    Analytics.sendEvent('Next');
  }

  makeNextQuestion() {
    const question = Data.questions[this.activeIndex];

    this.isAnswered = false;

    removeChildren(EL.controls);
    EL.controls.appendChild(EL.optionL);
    EL.controls.appendChild(EL.optionR);

    EL.pages.innerHTML = `${this.activeIndex + 1}/${Data.questions.length}`;

    EL.cText.innerHTML = question.text;
    // EL.cTextTo.innerHTML = `На <b>${question.to.text}?</b>`;

    this.showCount();

    EL.cards.appendChild(EL.cardWrapper);
    animate(EL.cardWrapper, 'cardZoomIn', '300ms');
  }

  answer(t, trigger = 'Click') {
    if (this.isAnswered) { return; }
    this.isAnswered = true;

    const question = Data.questions[this.activeIndex];

    this.lastAnsweredType = t;

    this.makeAnswer(question, t);

    Analytics.sendEvent(`Option - ${t}`, trigger);
  }

  makeAnswer(question, type) {
    this.container.classList.add('is-answered');

    EL.cardInner.style.transform = 'translate3d(0,0,0) rotateY(-180deg)';

    removeChildren(EL.controls);
    EL.controls.appendChild(EL.nextBtn);

    if (question.correct === type) {
      this.correctAnswers += 1;
      EL.backCard.classList.add('is-correct');
      EL.bcAnswerImg.src = question.images.correct['1x'];
      EL.bcAnswerImg.srcset = `${question.images.correct['2x']} 2x`;
      EL.bcAnswerTitle.textContent = 'Да';
    } else {
      EL.backCard.classList.add('is-incorrect');
      EL.bcAnswerImg.src = question.images.incorrect['1x'];
      EL.bcAnswerImg.srcset = `${question.images.incorrect['2x']} 2x`;
      EL.bcAnswerTitle.textContent = 'Нет';
    }

    EL.bcAnswerText.innerHTML = question.answer;

    if (this.activeIndex < Data.questions.length - 1) {
      this.timer = setTimeout(() => {
        Special.changeCardImages(this.activeIndex + 1);
      }, 400);
    }

    if (this.activeIndex === Data.questions.length - 1) {
      EL.nextBtn.innerHTML = 'Результат';
      EL.nextBtn.dataset.click = 'result';
    }
  }

  result() {
    const { result, index } = Special.getResult(this.correctAnswers);

    EL.cards.removeChild(EL.cardWrapper);
    EL.cardInner.style.transform = '';

    EL.backCard.classList.remove('is-correct');
    EL.backCard.classList.remove('is-incorrect');
    EL.bcAnswerImg.src = '';
    EL.bcAnswerImg.srcset = '';

    this.container.classList.remove('is-answered');
    this.container.classList.add('is-result');
    this.container.removeChild(EL.q);
    this.container.appendChild(EL.result);

    EL.rResult.innerHTML = `${this.correctAnswers} из ${Data.questions.length} правильных ответов`;
    EL.rTitle.innerHTML = result.title;
    EL.rImg.dataset.id = index + 1;
    EL.rImg.src = result.img;
    EL.rImg.srcset = `${result.img2x} 2x`;

    removeChildren(EL.rShare);
    Share.make(EL.rShare, {
      url: `${this.params.share.url}/${index}`,
      title: `${this.correctAnswers} из ${Data.questions.length} правильных ответов`,
      twitter: `${this.correctAnswers} из ${Data.questions.length} правильных ответов`,
    });

    this.destroyCardEvents();

    Analytics.sendEvent('Result');
  }

  setInitialParams() {
    this.activeIndex = 0;
    this.correctAnswers = 0;
  }

  keyUpHandler(e) {
    if (e.keyCode === 37 || e.keyCode === 39) {
      this.answer(e.keyCode === 37 ? 'left' : 'right', 'KeyUp');
    }
  }

  initCardEvents() {
    document.addEventListener('keyup', this.keyUpHandler);
  }

  destroyCardEvents() {
    document.removeEventListener('keyup', this.keyUpHandler);
  }

  static loadImages() {
    Data.questions.forEach((q, i) => {
      IMAGES[i] = makeElement('img', null, {
        src: q.answer.img,
        srcset: `${q.answer.img} 2x`,
      });
    });
  }

  init() {
    this.setInitialParams();
    this.createElements();
    removeChildren(this.container);
    this.container.appendChild(EL.q);

    this.params.isFeed ? this.container.classList.add('is-feed') : '';

    Special.loadImages();

    this.start();
  }
}

export default Special;
