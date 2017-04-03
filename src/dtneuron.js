import GreyscaleWindow from './greyscalewindow';
import Node from './node';
import Edge from './edge';

/**
 * @param {GreyscaleWindow} img
 *
 * @constructor
 * @extends {Node}
 */
export default class DTNeuron extends Node {

  constructor(img) {
    super();

    /**
     * @type {Number}
     */
    this.illuminationLevel = img.averageGreyLevel();

    /**
     * @type {Number}
     */
    this.upperThreshold = img.upperGreyLevel();

    /**
     * @type {Number}
     */
    this.lowerThreshold = img.lowerGreyLevel();
  }


  /**
   * @param  {Array.<GreyscaleWindow>} env
   * @return {Array.<Edge>}
   */
  detect(env) {
    let edges = [];
    for (let i = 0, len = env.length; i < len; i++) {
      let tmp = new Edge(env[i].matrix(), this.upperThreshold, this.lowerThreshold);
      if (this.b1(tmp) && this.b2(env[i].upperGreyLevel(), env[i].lowerGreyLevel())) {
        this.updateIlluminationLevel(env[i].averageGreyLevel(), i, len);
        if (this.a2(env[i].upperGreyLevel(), env[i].lowerGreyLevel(), upperThreshold, lowerThreshold)) {
          this.updateThresholds(env[i].upperGreyLevel(), env[i].lowerGreyLevel(), i, len);
        }
        edges.push(tmp);
      } else {
        edges.push(Node.blankEdge);
      }
    }
    return edges;
  };

  /**
   * @param  {Edge} edge
   * @return {Boolean}
   */
  b1(edge) {
    return !this.validate(edge).equals(Node.blankEdge);
  }

  /**
   * @param  {Number} mmax
   * @param  {Number} mmin
   * @return {Boolean}
   */
  b2(mmax, mmin) {
    return (this.illuminationLevel <= mmax) && (this.illuminationLevel >= mmin);
  }

  /**
   * @param  {Number} mmax
   * @param  {Number} mmin
   * @param  {Number} wmax
   * @param  {Number} wmin
   * @return {Boolean}
   */
  a2(mmax, mmin, wmax, wmin) {
    return (mmax - mmin) >= (wmax - wmin);
  }

  /**
   * @param  {Number} ms
   * @param  {Number} i
   * @param  {Number} tf
   */
  updateIlluminationLevel(ms, i, tf) {
    this.illuminationLevel += (ms - this.illuminationLevel) * this.eta(i, tf);
  }

  /**
   * @param  {Number} mmax
   * @param  {Number} mmin
   * @param  {Number} i
   * @param  {Number} tf
   */
  updateThresholds(mmax, mmin, i, tf) {
    this.upperThreshold += (this.upperThreshold - mmax) * this.eta(i, tf);
    this.lowerThreshold += (this.lowerThreshold - mmin) * this.eta(i, tf);
  }
}
