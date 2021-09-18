import { Schema } from '../schema.js';
import styles from './gems.css';
import chooseGem from '../../assets/audio/choose_gem.wav';

export class Gem extends Schema {

  constructor() {
    super();
    this.numberColors = 0;
    this.colors = [];
    this.chooseGemAudio = new Audio(chooseGem);
  }

  initComponent() {
    setTimeout(() => {
      [...this.shadowDOM.querySelectorAll('.select-color')].forEach((element, _, siblings) => {
        element.addEventListener('click', () => {
          this.classList.add('bubble');
          setTimeout(() => {
            this.classList.remove('bubble');
          }, 600);
          this.chooseGemAudio.play();
          const elementCSS = getComputedStyle(element);
          const color = elementCSS.getPropertyValue('--background-color');
          siblings.forEach(sibling =>
            sibling.parentElement && sibling.parentElement.classList.remove('active')
          );
          element.parentElement && element.parentElement.classList.add('active');
          // TODO get index of this color from array local colors and send event in store
          console.log(color);
        });
      });
    });
  }

  template() {
    const colorsIterator = Array(this.numberColors + 1).fill('');
    const colorsElements = colorsIterator.reduce((colors) => `
      ${colors}
      <div class="wrapper-select-color">
        <div class="select-color"></div>
      </div>
    `);
    return colorsElements;
  }

  templateCss() {
    let variablesColors = '';
    (this.colors || []).forEach((color, index, {length}) => {
      variablesColors += `
        :host(:hover) .wrapper-select-color:nth-child(${index + 2}) {
          transform: rotatez(${index * (360 / length)}deg);
        }
        .wrapper-select-color:nth-child(${index + 2}) > .select-color {
          --background-color: ${color};
          background-color: var(--background-color);
        }
      `;
    });

    return `
      <style>
        ${styles.toString()}
        ${variablesColors}
      </style>
    `;
  }

  mapComponentAttributes() {
    return [
      { key: 'type', value: 'load' },
    ];
  }

  actionWindowsResize () {
    return ['guiStore', ({actionType, height, width}) => {
      if (actionType === 'window-resize') {
        const minSize = Math.max(
          Math.min(width, height),
          3000 / (this.numberGeems || 4)
        );
        this.style.setProperty('--selector-colors--height', `${height}px`);
        this.style.setProperty('--selector-colors--width', `${width}px`);
        this.style.setProperty('--selector-colors--size', `${minSize}px`);
      }
    }];
  }

  actionChangeVolumeSound() {
    return ['guiStore', ({actionType, volume}) => {
      if (actionType === 'efects-volume') {
        this.chooseGemAudio.volume = volume;
      }
    }];
  }

  actionInitNumberGems() {
    return ['guiStore', ({actionType, numberColors}) => {
      if (actionType === 'number-color' && this.numberGeems !== numberColors) {
        this.style.setProperty('--selector-colors--count-geems', numberColors);
        this.numberColors = numberColors;
        this.render();
      }
    }];
  }
  actionInitSetColors() {
    return ['guiStore', ({actionType, colors}) => {
      if (actionType === 'set-colors') {
        this.colors = colors;
        this.render();
      }
    }];
  }
  
}

