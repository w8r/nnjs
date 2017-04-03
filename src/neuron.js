import Node from './node';
import * as utils from './utils';
import GreyscaleWindow from './greyscalewindow';
import Edge from './edge';

/**
 * Neuron
 * @param {Number} w1 Threshold
 * @param {Number} w2 Threshold
 *
 * @constructor
 * @extends {Node}
 */
export default class Neuron extends Node {

  constructor(w1, w2) {
    super();

    /**
     * @type {Number}
     */
    this.max = 0;

    /**
     * @type {Number}
     */
    this.min = 0;

    if (w1 > w2) {
      this.max = w1;
      this.min = w2;
    } else {
      this.max = w2;
      this.min = w1;
    }

    this.edgeMap = null;
  }

  /**
   * @param  {GreyscaleWindow} win
   * @return {Edge}
   */
  detect(win) {
    this.min += (this.eta() * (win.lowerGreyLevel() - this.min));
    this.max += (this.eta() * (win.upperGreyLevel() - this.max));
    Node.trainIteration++;
    return this.toMap(win);
  }

  /**
   * @return {Number}
   */
  upperThreshold() {
    return this.max;
  }

  /**
   * @return {Number}
   */
  lowerThreshold() {
    return this.min;
  }

  /**
   * @param  {GreyscaleWindow} imgWindow
   * @return {Edge}
   */
  toMap(imgWindow) {
    return new Edge(imgWindow.matrix(), this.wmin, this.wmax);
  }
};
