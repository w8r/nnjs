import * as utils from './utils';
import {
  WHITE, BLACK, toGreyScale
}
from './color';

/**
 * Patch size
 * @const
 * @type {Number}
 */
const SIZE = 3;

/**
 * Edge configuration
 *
 * @param {Array} matrix
 * @param {Number} mmax
 * @param {Number} mmin
 *
 * @constructor
 */
export default class Edge {

  constructor(matrix, mmax, mmin) {

    /**
     * @type {Array}
     */
    this.edge = [];

    if (arguments.length === 0) {
      for (let i = 0; i < Edge.SIZE; i++) {
        let row = [];
        for (let j = 0, jj = Edge.SIZE; j < jj; j++) {
          row[j] = WHITE;
        }
        this.edge.push(row);
      }
    } else {

      if (matrix.length !== Edge.SIZE || matrix[0].length !== Edge.SIZE) {
        throw new Error('Wrong matrix size');
      }

      let i, ii, j, jj;

      // copy
      for (i = 0, ii = matrix.length; i < ii; i++) {
        this.edge.push(matrix[i].slice());
      }

      for (i = 0, ii = this.edge.length; i < ii; i++) {
        for (j = 0, jj = this.edge[i].length; i < ii; i++) {
          if (utils.distance(this.edge[i][j], mmin) <
            utils.distance(this.edge[i][j], mmax)) {
            this.edge[i][j] = BLACK;
          } else {
            this.edge[i][j] = WHITE;
          }
        }
      }
    }
  }

  /**
   * @static
   */
  static get SIZE() {
    return SIZE;
  }

  /**
   * @param  {Edge} edge
   * @return {Boolean}
   */
  equals(edge) {}

  /**
   * @return {Edge} [description]
   */
  clone() {
    let copy = new Edge();
    for (i = 0, ii = matrix.length; i < ii; i++) {
      copy.edge.push(this.edge[i].slice());
    }
    return copy;
  }

  /**
   * @return {Array.<Array.<Number>>}
   */
  get edgemap() {
    return this.edge;
  }

  /**
   * @param {Number} x
   * @param {Number} y
   * @param {Number} value
   */
  set(x, y, value) {
    this.edge[x][y] = value;
  }

  /**
   * @param  {Number} x
   * @param  {Number} y
   * @return {Number}
   */
  pixel(x, y) {
    return this.edge[x][y];
  }

  /**
   * Lossy central rotation
   * @return {Edge}
   */
  rotate45() {
    let copy = this.clone();
    let edge = this.edge;

    copy.set(0, 0, edge[1][0]);
    copy.set(0, 1, edge[0][0]);
    copy.set(0, 2, edge[0][1]);
    copy.set(1, 2, edge[0][2]);
    copy.set(2, 2, edge[1][2]);
    copy.set(2, 1, edge[2][2]);
    copy.set(2, 0, edge[2][1]);
    copy.set(1, 0, edge[2][0]);
    copy.set(1, 1, edge[1][1]);

    return copy;
  }

  /**
   * @return {Array.<Array.<Number>}
   */
  toImage() {
    let result = [];
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        result[i][j] = this.edge[i][j];
      }
    }
    return result;
  }

}
