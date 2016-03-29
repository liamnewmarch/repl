'use strict';

/**
 * REPL (read-evaluate-print loop)
 */
class REPL {

  /**
   * @constructor
   */
  constructor({input, output, console}) {
    this.elements = {input, output};
    this._hijack(console);
    window.addEventListener('resize', this._scroll.bind(this), false);
  }

  /**
   * @method
   */
  run() {
    this._read();
  }

  /**
   * @method
   * @private
   */
  _hijack(console) {
    const keys = ['log', 'error', 'warn'];
    keys.forEach(key => {
      console[key] = (...args) => this._print(key, ...args);
    });
  }

  /**
   * @method
   * @private
   */
  _read() {
    let input = this.elements.input.value;
    this.elements.input.value = '';
    this._evaluate(input);
  }

  /**
   * @method
   * @private
   */
  _evaluate(input) {
    this._print('echo', input);
    try {
      this._print('return', eval.call(this, input));
    } catch(e) {
      this._print('error', e);
    }
  }

  /**
   * Push data to output list
   * @method
   * @private
   */
  _print(type, ...data) {
    let formatted = this._format(type, ...data);
    let listNode = document.createElement('li');
    let textNode = document.createTextNode(formatted);
    listNode.classList.add(type);
    listNode.appendChild(textNode);
    this.elements.output.appendChild(listNode);
    this._scroll();
  }

  /**
   * Format data as a string
   * @private
   */
  _format(type, ...data) {
    if (type === 'log' || type === 'return') {
      data = data.map(item => {
        if (typeof item !== 'undefined') {
          return JSON.stringify(item);
        }
        return 'undefined';
      })
    }
    return data.join(', ');
  }

  /**
   * Scroll output to the bottom
   * @method
   * @private
   */
  _scroll() {
    this.elements.output.scrollTop = this.elements.output.scrollHeight;
  }
}


/**
 * Expose repl instance to the global scope
 */
window.repl = new REPL({
  input: document.querySelector('textarea'),
  output: document.querySelector('ul'),
  console: window.console
});


/**
 * Register service worker
 */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}
