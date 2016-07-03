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
    this._context = {};
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
   * @param {console} console Console object
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
   * @param {string} input Input string
   */
  _evaluate(input) {
    this._print('echo', input);
    try {
      this._print('return', eval.call(this._context, input));
    } catch(e) {
      this._print('error', e);
    }
  }

  /**
   * Push data to output list
   * @method
   * @private
   * @param {string} logType Console method
   * @param {...*} data Data to pass to the method
   */
  _print(logType, ...data) {
    let formatted = this._format(logType, ...data);
    let listNode = document.createElement('li');
    let textNode = document.createTextNode(formatted);
    listNode.classList.add(logType);
    listNode.appendChild(textNode);
    this.elements.output.appendChild(listNode);
    this._scroll();
  }

  /**
   * Format data as a string
   * @private
   * @param {string} logType Console method
   * @param {...*} data Data to pass to the method
   */
  _format(logType, ...data) {
    if (logType === 'log' || logType === 'return') {
      data = data.map(item => {
        const type = this._type(item);
        switch (type) {
          case 'Array':
          case 'Boolean':
          case 'Number':
          case 'Object':
          case 'String':
            return JSON.stringify(item);
          case 'Class':
          case 'Function':
            return item.toString();
          case 'Undefined':
            return 'undefined'
          default:
            return `${type} {}`;
        }
      });
    }
    return data.join(', ');
  }

  /**
   * A better typeof
   * @method
   * @private
   * @param {*} thing Thing to find the type of
   */
  _type(thing) {
    const toString = Object.prototype.toString.call(thing);
    return toString.replace(/\[\w+ (\w+)\]/, '$1');
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
if ('serviceWorker' in navigator && location.hostname !== 'localhost') {
  navigator.serviceWorker.register('service-worker.js');
}
