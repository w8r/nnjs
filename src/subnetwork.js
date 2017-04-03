import Neuron from './neuron';
import Node from './node';
import GreyscaleWindow from './greyscalewindow';

/**
 * Subnetwork
 *
 * @constructor
 * @extends {Node}
 */
export default class Subnetwork extends Node {

  /**
   * @param {Number} illuminationLevelPrototype
   * @param {Number} neuron1UpperThreshold
   * @param {Number} neuron1LowerThreshold
   * @param {Number} neuron2UpperThreshold
   * @param {Number} neuron2LowerThreshold
   */
  constructor(illuminationLevelPrototype,
    neuron1UpperThreshold, neuron1LowerThreshold,
    neuron2UpperThreshold, neuron2LowerThreshold) {

    super();

    /**
     * @type {Neuron}
     */
    this.strong = null;

    /**
     * @type {Neuron}
     */
    this.weak = null;

    /**
     * Selected illumination prototype
     * @type {Number}
     */
    this.pr = null;

    if (utils.distance(neuron1UpperThreshold, neuron1LowerThreshold) >
        utils.distance(neuron2UpperThreshold, neuron2LowerThreshold)) {
      this.strong = new Neuron(neuron1UpperThreshold, neuron1LowerThreshold);
      this.weak   = new Neuron(neuron2UpperThreshold, neuron2LowerThreshold);
    } else {
      this.strong = new Neuron(neuron2UpperThreshold, neuron2LowerThreshold);
      this.weak   = new Neuron(neuron1UpperThreshold, neuron1LowerThreshold);
    }
  }

  /**
   * @param  {Subnetwork} s
   * @return {Boolean}
   */
  equals(s) {
    return this.pr === s.pr &&
      this.weak.equals(s.weakNeuron()) &&
      this.strong.equals(s.strongNeuron());
  }

  /**
   * @param  {GreyscaleWindow} win
   * @return {Neuron}
   */
  neuronCompetition(win) {
    const { sqrt } = Math;
    const { strong, weak } = this;
    const upper   = img.upperGreyLevel();
    const lower   = img.lowerGreyLevel();
    const dWUpper = upper - weak.upperThreshold();
    const dWLower = lower - weak.lowerThreshold();
    const dSUpper = upper - strong.upperThreshold();
    const dSLower = lower - strong.lowerThreshold();

    if (sqrt(dWUpper * dWUpper + dWLower * dWLower) <
        sqrt(dSUpper * dSUpper + dSLower * dSLower)) {
      return weak;
    } else {
      return strong;
    }
  }

  /**
   * @param  {GreyscaleWindow} win
   * @return {Edge}
   */
  detect(win) {
    this.pr += (this.eta() * (win.averageGreyLevel() - this.pr));

    var winner = this.neuronCompetition(win),
      // otherwise the weak neuron won't learn
      detectionResult = winner.detect(win);

    if (this.a2(win.upperGreyLevel(), win.lowerGreyLevel())) {
      if (this.a3(detectionResult)) {
        return validate(detectionResult);
      } else {
        return Node.blankEdge;
      }
    } else {
      return Node.blankEdge;
    }
  }

  /**
   * @return {Number}
   */
  illuminationPrototype() {
    return this.pr;
  }

  /**
   * @return {Neuron}
   */
  weakNeuron() {
    return this.weak;
  }

  /**
   * @return {Neuron}
   */
  strongNeuron() {
    return this.strong;
  }

  /**
   * This rule doesn't work during the learning, since it get applied when
   * the weights of the neurons could already have been changed.
   * If we put this before neurons weight correction, weak neuron won't learn
   *
   * @param  {Number} mmax
   * @param  {Number} mmin
   * @return {Boolean}
   */
  a2(mmax, mmin) {
    return (mmax - mmin) >=
      (this.weak.upperThreshold() - this.weak.lowerThreshold());
  }

  /**
   * @param {Edge}
   * @return {Boolean}
   */
  a3(edge) {
    return !this.validate(edge).equals(Node.blankEdge);
  }
};
