import Edge from './edge';
import * as utils from './utils';

/**
 * @const
 * @type {Edge}
 */
const blankEdge = new Edge();

/**
 * @type {Array}
 */
let validEdges = [];

/**
 * @type {Number}
 */
let trainIteration = 0;

/**
 * @type {Number}
 */
let trainIterations = 0;


export default class Node {

  constructor() {}

  /**
   * @const
   * @type {Edge}
   */
  static get blankEdge() {
    return blankEdge;
  }

  /**
   * @const
   * @type {Array.<Edge>}
   */
  static get validEdges() {
    return validEdges;
  }

  /**
   * @static
   * @type {Number}
   */
  static get trainIteration() {
    return trainIteration;
  }

  static set trainIteration(i) {
    trainIteration = i;
  }

  /**
   * @static
   * @type {Number}
   */
  static get trainIterations() {
    return trainIterations;
  }
  static set trainIterations(i) {
    trainIterations = i;
  }

  /**
   * @param {Edge} edge
   * @return {Boolean}
   */
  isValid(edge) {
    for (let i = 0, len = Node.validEdges.length; i < len; i++) {
      if (edge.equals(Node.validEdges[i])) {
        return true;
      }
    }
    return false;
  }

  /**
   * @param  {Edge} edge
   * @return {Edge}
   */
  validate(edge) {
    let i, len;
    // training is in process
    if (Node.totalTrainIterations !== 0) {
      // the edge is not in set, add it
      if (!this.isValid(edge)) {
        Node.validEdges.push(edge);
      }

      // variations:
      // rotate 45 7 times and put into valid edges set
      let tmp = edge.rotate45();
      let rotations = 6;

      for (i = 0; i < rotations; i++) {
        if (!this.isValid(tmp)) {
          Node.validEdges.push(tmp);
        }
        tmp = tmp.rotate45();
      }
    }

    // return valid edge from the set
    for (i = 0, len = Node.validEdges.length; i < len; i++) {
      if (edge.equals(Node.validEdges[i])) {
        return Node.validEdges[i];
      }
    }

    // if not present in set, which could occur
    // during the search, return blank
    return Node.BlankEdge;
  }

  /**
   * @param  {Number} i
   * @param  {Number} tf
   * @return {Number}
   */
  eta(i, tf) {
    if (Node.totalTrainIterations != 0) {
      return (this.eta(0, Node.totalTrainIterations) *
        (1 - Node.trainIteration / Node.totalTrainIterations));
    } else {
      return 0;
    }
  }

  /**
   * @return {Number}
   */
  memorySize() {
    return Node.validEdges.length;
  }

  /**
   * @param  {Number} num
   * @return {Edge}
   */
  getPrototype(num) {
    return (num < Node.validEdges.size()) ?
      Node.validEdges[num] :
      Node.blankEdge;
  }
};
