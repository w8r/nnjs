import * as utils from './utils';

/**
 * @const
 * @type {Number}
 */
const SIZE = 3;

/**
 * Scan window
 *
 * @param {Array.<Array.<Color>>} img
 *
 * @constructor
 */
export default class GreyscaleWindow {

  constructor(img) {

    /**
     * @type {Array.<Array.<Number>>}
     */
    this._matrix = GreyscaleWindow.getMatrix(img);

    /**
     * Upper grey level
     * @type {Number}
     */
    this.ugl = 0;

    /**
     * Lower grey level
     * @type {Number}
     */
    this.lgl = 0;

    /**
     * Average grey level
     * @type {Number}
     */
    this.agl = 0;

    if (img.length  === GreyscaleWindow.SIZE &&
      img[0].length === GreyscaleWindow.SIZE) {
      this.calculateLevels();
    }
  }

  /**
   * @static
   */
  static get SIZE() {
    return SIZE;
  }

  /**
   * @param  {Array.<Array.<Color>>} img
   * @return {Array.<Array.<Color>>}
   */
  getMatrix(img) {
    let matrix = [];
    for (let i = 0; i < GreyscaleWindow.SIZE; i++) {
      let tmp = [];
      for (let j = 0; j < GreyscaleWindow.SIZE; j++) {
        tmp.push(Color.toGreyScale(img[i, j]));
      }
      matrix.push(tmp);
    }
    return matrix;
  }

  clone() {}

  equals(g) {}

  /**
   * @param  {Number} x
   * @param  {Number} y
   * @return {Color}
   */
  pixel(x, y) {
    return this._matrix[x][y];
  }

  /**
   * @param {Number} x
   * @param {Number} y
   * @param {Color} value
   */
  setPixel(x, y, value) {
    this._matrix[x][y] = value;
  }

  /**
   * @return {Number}
   */
  get width() {
    return this._matrix.size();
  }

  /**
   * @return {Number}
   */
  get height() {
    return this._matrix[0].length;
  }

  /**
   * @return {Number}
   */
  get upperGreyLevel() {
    return this.ugl;
  }

  /**
   * @return {Number}
   */
  get lowerGreyLevel() {
    return this.lgl;
  }

  /**
   * @return {Number}
   */
  get averageGreyLevel() {
    return this.agl;
  }

  /**
   * @return {Array.<Array.<Color>>}
   */
  toImage() {
    let res = [];
    for (let i = 0; i < GreyscaleWindow.SIZE; i++) {
      res[i] = [];
      for (let j = 0; j < GreyscaleWindow.SIZE; j++) {
        res[i][j] = Color.toRgb(Color.fromHsv(20, 0, this._matrix[i][j]));
      }
    }
    return res;
  }

  /**
   * @return {Array.<Array.<Color>>}
   */
  toMonochromeImage() {
    let res = [];
    for (let i = 0; i < GreyscaleWindow.SIZE; i++) {
      res[i] = [];
      for (let j = 0; j < GreyscaleWindow.SIZE; j++) {
        res[i][j] = Color.fromHsv(20, 0, this._matrix[i][j]);
      }
    }
    return res;
  }

  /**
   * Calculates thresholds
   */
  calculateLevels() {
    let sum1 = 0;
    let sum2 = 0;
    let upperCount = 0;
    let lowerCount = 0;
    let i, j, agl, lgl, ugl;

    for (i = 0; i < GreyscaleWindow.SIZE; i++) {
      for (j = 0; j < GreyscaleWindow.SIZE; j++) {
        sum1 += this._matrix[i][j];
      }
    }

    agl = sum1 / (GreyscaleWindow.SIZE * GreyscaleWindow.SIZE);

    sum1 = 0;

    for (i = 0; i < GreyscaleWindow.SIZE; i++) {
      for (j = 0; j < GreyscaleWindow.SIZE; j++) {
        if (this._matrix[i][j] < agl) {
          sum2 += this._matrix[i][j];
          lowerCount++;
        } else {
          sum1 += this._matrix[i][j];
          upperCount++;
        }
      }
    }

    ugl = (upperCount > 0) ? (sum1 / upperCount) : agl;
    lgl = (lowerCount > 0) ? (sum2 / lowerCount) : agl;

    this.ugl = ugl;
    this.lgl = lgl;
    this.agl = agl;
  }

}
