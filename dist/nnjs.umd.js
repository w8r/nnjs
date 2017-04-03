(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.nnjs = factory());
}(this, (function () { 'use strict';

/**
 * @param  {Number} a
 * @param  {Number} b
 * @return {Number}
 */
function distance(a, b) {
  return ((a > b) ? (a - b) : (b - a));
}

var SIZE = 3;

/**
 * Scan window
 *
 * @param {Array.<Array.<Color>>} img
 *
 * @constructor
 */
var GreyscaleWindow = function GreyscaleWindow(img) {

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

  if (img.length=== GreyscaleWindow.SIZE &&
    img[0].length === GreyscaleWindow.SIZE) {
    this.calculateLevels();
  }
};

var prototypeAccessors = { width: {},height: {},upperGreyLevel: {},lowerGreyLevel: {},averageGreyLevel: {} };
var staticAccessors = { SIZE: {} };

/**
 * @static
 */
staticAccessors.SIZE.get = function () {
  return SIZE;
};

/**
 * @param{Array.<Array.<Color>>} img
 * @return {Array.<Array.<Color>>}
 */
GreyscaleWindow.prototype.getMatrix = function getMatrix (img) {
  var matrix = [];
  for (var i = 0; i < GreyscaleWindow.SIZE; i++) {
    var tmp = [];
    for (var j = 0; j < GreyscaleWindow.SIZE; j++) {
      tmp.push(Color.toGreyScale(img[i, j]));
    }
    matrix.push(tmp);
  }
  return matrix;
};

GreyscaleWindow.prototype.clone = function clone () {};

GreyscaleWindow.prototype.equals = function equals (g) {};

/**
 * @param{Number} x
 * @param{Number} y
 * @return {Color}
 */
GreyscaleWindow.prototype.pixel = function pixel (x, y) {
  return this._matrix[x][y];
};

/**
 * @param {Number} x
 * @param {Number} y
 * @param {Color} value
 */
GreyscaleWindow.prototype.setPixel = function setPixel (x, y, value) {
  this._matrix[x][y] = value;
};

/**
 * @return {Number}
 */
prototypeAccessors.width.get = function () {
  return this._matrix.size();
};

/**
 * @return {Number}
 */
prototypeAccessors.height.get = function () {
  return this._matrix[0].length;
};

/**
 * @return {Number}
 */
prototypeAccessors.upperGreyLevel.get = function () {
  return this.ugl;
};

/**
 * @return {Number}
 */
prototypeAccessors.lowerGreyLevel.get = function () {
  return this.lgl;
};

/**
 * @return {Number}
 */
prototypeAccessors.averageGreyLevel.get = function () {
  return this.agl;
};

/**
 * @return {Array.<Array.<Color>>}
 */
GreyscaleWindow.prototype.toImage = function toImage () {
    var this$1 = this;

  var res = [];
  for (var i = 0; i < GreyscaleWindow.SIZE; i++) {
    res[i] = [];
    for (var j = 0; j < GreyscaleWindow.SIZE; j++) {
      res[i][j] = Color.toRgb(Color.fromHsv(20, 0, this$1._matrix[i][j]));
    }
  }
  return res;
};

/**
 * @return {Array.<Array.<Color>>}
 */
GreyscaleWindow.prototype.toMonochromeImage = function toMonochromeImage () {
    var this$1 = this;

  var res = [];
  for (var i = 0; i < GreyscaleWindow.SIZE; i++) {
    res[i] = [];
    for (var j = 0; j < GreyscaleWindow.SIZE; j++) {
      res[i][j] = Color.fromHsv(20, 0, this$1._matrix[i][j]);
    }
  }
  return res;
};

/**
 * Calculates thresholds
 */
GreyscaleWindow.prototype.calculateLevels = function calculateLevels () {
    var this$1 = this;

  var sum1 = 0;
  var sum2 = 0;
  var upperCount = 0;
  var lowerCount = 0;
  var i, j, agl, lgl, ugl;

  for (i = 0; i < GreyscaleWindow.SIZE; i++) {
    for (j = 0; j < GreyscaleWindow.SIZE; j++) {
      sum1 += this$1._matrix[i][j];
    }
  }

  agl = sum1 / (GreyscaleWindow.SIZE * GreyscaleWindow.SIZE);

  sum1 = 0;

  for (i = 0; i < GreyscaleWindow.SIZE; i++) {
    for (j = 0; j < GreyscaleWindow.SIZE; j++) {
      if (this$1._matrix[i][j] < agl) {
        sum2 += this$1._matrix[i][j];
        lowerCount++;
      } else {
        sum1 += this$1._matrix[i][j];
        upperCount++;
      }
    }
  }

  ugl = (upperCount > 0) ? (sum1 / upperCount) : agl;
  lgl = (lowerCount > 0) ? (sum2 / lowerCount) : agl;

  this.ugl = ugl;
  this.lgl = lgl;
  this.agl = agl;
};

Object.defineProperties( GreyscaleWindow.prototype, prototypeAccessors );
Object.defineProperties( GreyscaleWindow, staticAccessors );

var WHITE$1 = '';

var BLACK = '';

/**
 * @param  {Number} color
 * @return {Number}
 */

var SIZE$1 = 3;

/**
 * Edge configuration
 *
 * @param {Array} matrix
 * @param {Number} mmax
 * @param {Number} mmin
 *
 * @constructor
 */
var Edge$1 = function Edge(matrix, mmax, mmin) {
  var this$1 = this;


  /**
   * @type {Array}
   */
  this.edge = [];

  if (arguments.length === 0) {
    for (var i = 0; i < Edge.SIZE; i++) {
      var row = [];
      for (var j = 0, jj = Edge.SIZE; j < jj; j++) {
        row[j] = WHITE$1;
      }
      this$1.edge.push(row);
    }
  } else {

    if (matrix.length !== Edge.SIZE || matrix[0].length !== Edge.SIZE) {
      throw new Error('Wrong matrix size');
    }

    var i$1, ii, j$1, jj$1;

    // copy
    for (i$1 = 0, ii = matrix.length; i$1 < ii; i$1++) {
      this$1.edge.push(matrix[i$1].slice());
    }

    for (i$1 = 0, ii = this.edge.length; i$1 < ii; i$1++) {
      for (j$1 = 0, jj$1 = this.edge[i$1].length; i$1 < ii; i$1++) {
        if (distance(this$1.edge[i$1][j$1], mmin) <
          distance(this$1.edge[i$1][j$1], mmax)) {
          this$1.edge[i$1][j$1] = BLACK;
        } else {
          this$1.edge[i$1][j$1] = WHITE$1;
        }
      }
    }
  }
};

var prototypeAccessors$1 = { edgemap: {} };
var staticAccessors$2 = { SIZE: {} };

/**
 * @static
 */
staticAccessors$2.SIZE.get = function () {
  return SIZE$1;
};

/**
 * @param{Edge} edge
 * @return {Boolean}
 */
Edge$1.prototype.equals = function equals (edge) {};

/**
 * @return {Edge} [description]
 */
Edge$1.prototype.clone = function clone () {
    var this$1 = this;

  var copy = new Edge$1();
  for (i = 0, ii = matrix.length; i < ii; i++) {
    copy.edge.push(this$1.edge[i].slice());
  }
  return copy;
};

/**
 * @return {Array.<Array.<Number>>}
 */
prototypeAccessors$1.edgemap.get = function () {
  return this.edge;
};

/**
 * @param {Number} x
 * @param {Number} y
 * @param {Number} value
 */
Edge$1.prototype.set = function set (x, y, value) {
  this.edge[x][y] = value;
};

/**
 * @param{Number} x
 * @param{Number} y
 * @return {Number}
 */
Edge$1.prototype.pixel = function pixel (x, y) {
  return this.edge[x][y];
};

/**
 * Lossy central rotation
 * @return {Edge}
 */
Edge$1.prototype.rotate45 = function rotate45 () {
  var copy = this.clone();
  var edge = this.edge;

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
};

/**
 * @return {Array.<Array.<Number>}
 */
Edge$1.prototype.toImage = function toImage () {
    var this$1 = this;

  var result = [];
  for (var i = 0; i < SIZE$1; i++) {
    for (var j = 0; j < SIZE$1; j++) {
      result[i][j] = this$1.edge[i][j];
    }
  }
  return result;
};

Object.defineProperties( Edge$1.prototype, prototypeAccessors$1 );
Object.defineProperties( Edge$1, staticAccessors$2 );

var blankEdge = new Edge$1();

/**
 * @type {Array}
 */
var validEdges = [];

/**
 * @type {Number}
 */
var trainIteration = 0;

/**
 * @type {Number}
 */
var trainIterations = 0;


var Node = function Node() {};

var staticAccessors$1 = { blankEdge: {},validEdges: {},trainIteration: {},trainIterations: {} };

/**
 * @const
 * @type {Edge}
 */
staticAccessors$1.blankEdge.get = function () {
  return blankEdge;
};

/**
 * @const
 * @type {Array.<Edge>}
 */
staticAccessors$1.validEdges.get = function () {
  return validEdges;
};

/**
 * @static
 * @type {Number}
 */
staticAccessors$1.trainIteration.get = function () {
  return trainIteration;
};

staticAccessors$1.trainIteration.set = function (i) {
  trainIteration = i;
};

/**
 * @static
 * @type {Number}
 */
staticAccessors$1.trainIterations.get = function () {
  return trainIterations;
};
staticAccessors$1.trainIterations.set = function (i) {
  trainIterations = i;
};

/**
 * @param {Edge} edge
 * @return {Boolean}
 */
Node.prototype.isValid = function isValid (edge) {
  for (var i = 0, len = Node.validEdges.length; i < len; i++) {
    if (edge.equals(Node.validEdges[i])) {
      return true;
    }
  }
  return false;
};

/**
 * @param{Edge} edge
 * @return {Edge}
 */
Node.prototype.validate = function validate (edge) {
    var this$1 = this;

  var i, len;
  // training is in process
  if (Node.totalTrainIterations !== 0) {
    // the edge is not in set, add it
    if (!this.isValid(edge)) {
      Node.validEdges.push(edge);
    }

    // variations:
    // rotate 45 7 times and put into valid edges set
    var tmp = edge.rotate45();
    var rotations = 6;

    for (i = 0; i < rotations; i++) {
      if (!this$1.isValid(tmp)) {
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
};

/**
 * @param{Number} i
 * @param{Number} tf
 * @return {Number}
 */
Node.prototype.eta = function eta (i, tf) {
  if (Node.totalTrainIterations != 0) {
    return (this.eta(0, Node.totalTrainIterations) *
      (1 - Node.trainIteration / Node.totalTrainIterations));
  } else {
    return 0;
  }
};

/**
 * @return {Number}
 */
Node.prototype.memorySize = function memorySize () {
  return Node.validEdges.length;
};

/**
 * @param{Number} num
 * @return {Edge}
 */
Node.prototype.getPrototype = function getPrototype (num) {
  return (num < Node.validEdges.size()) ?
    Node.validEdges[num] :
    Node.blankEdge;
};

Object.defineProperties( Node, staticAccessors$1 );

var Neuron = (function (Node$$1) {
  function Neuron(w1, w2) {
    Node$$1.call(this);

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

  if ( Node$$1 ) Neuron.__proto__ = Node$$1;
  Neuron.prototype = Object.create( Node$$1 && Node$$1.prototype );
  Neuron.prototype.constructor = Neuron;

  /**
   * @param  {GreyscaleWindow} win
   * @return {Edge}
   */
  Neuron.prototype.detect = function detect (win) {
    var eta = this.eta();
    this.min += (eta * (win.lowerGreyLevel - this.min));
    this.max += (eta * (win.upperGreyLevel - this.max));
    Node$$1.trainIteration++;
    return this.toMap(win);
  };

  /**
   * @return {Number}
   */
  Neuron.prototype.upperThreshold = function upperThreshold () {
    return this.max;
  };

  /**
   * @return {Number}
   */
  Neuron.prototype.lowerThreshold = function lowerThreshold () {
    return this.min;
  };

  /**
   * @param  {GreyscaleWindow} imgWindow
   * @return {Edge}
   */
  Neuron.prototype.toMap = function toMap (imgWindow) {
    return new Edge$1(imgWindow.matrix(), this.wmin, this.wmax);
  };

  return Neuron;
}(Node));

var Subnetwork = (function (Node$$1) {
  function Subnetwork(illuminationLevelPrototype,
    neuron1UpperThreshold, neuron1LowerThreshold,
    neuron2UpperThreshold, neuron2LowerThreshold) {

    Node$$1.call(this);

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

  if ( Node$$1 ) Subnetwork.__proto__ = Node$$1;
  Subnetwork.prototype = Object.create( Node$$1 && Node$$1.prototype );
  Subnetwork.prototype.constructor = Subnetwork;

  /**
   * @param  {Subnetwork} s
   * @return {Boolean}
   */
  Subnetwork.prototype.equals = function equals (s) {
    return this.pr === s.pr &&
      this.weak.equals(s.weakNeuron()) &&
      this.strong.equals(s.strongNeuron());
  };

  /**
   * @param  {GreyscaleWindow} win
   * @return {Neuron}
   */
  Subnetwork.prototype.neuronCompetition = function neuronCompetition (win) {
    var sqrt = Math.sqrt;
    var ref = this;
    var strong = ref.strong;
    var weak = ref.weak;
    var upper   = img.upperGreyLevel();
    var lower   = img.lowerGreyLevel();
    var dWUpper = upper - weak.upperThreshold();
    var dWLower = lower - weak.lowerThreshold();
    var dSUpper = upper - strong.upperThreshold();
    var dSLower = lower - strong.lowerThreshold();

    if (sqrt(dWUpper * dWUpper + dWLower * dWLower) <
        sqrt(dSUpper * dSUpper + dSLower * dSLower)) {
      return weak;
    } else {
      return strong;
    }
  };

  /**
   * @param  {GreyscaleWindow} win
   * @return {Edge}
   */
  Subnetwork.prototype.detect = function detect (win) {
    this.pr += (this.eta() * (win.averageGreyLevel() - this.pr));

    var winner = this.neuronCompetition(win),
      // otherwise the weak neuron won't learn
      detectionResult = winner.detect(win);

    if (this.a2(win.upperGreyLevel(), win.lowerGreyLevel())) {
      if (this.a3(detectionResult)) {
        return validate(detectionResult);
      } else {
        return Node$$1.blankEdge;
      }
    } else {
      return Node$$1.blankEdge;
    }
  };

  /**
   * @return {Number}
   */
  Subnetwork.prototype.illuminationPrototype = function illuminationPrototype () {
    return this.pr;
  };

  /**
   * @return {Neuron}
   */
  Subnetwork.prototype.weakNeuron = function weakNeuron () {
    return this.weak;
  };

  /**
   * @return {Neuron}
   */
  Subnetwork.prototype.strongNeuron = function strongNeuron () {
    return this.strong;
  };

  /**
   * This rule doesn't work during the learning, since it get applied when
   * the weights of the neurons could already have been changed.
   * If we put this before neurons weight correction, weak neuron won't learn
   *
   * @param  {Number} mmax
   * @param  {Number} mmin
   * @return {Boolean}
   */
  Subnetwork.prototype.a2 = function a2 (mmax, mmin) {
    return (mmax - mmin) >=
      (this.weak.upperThreshold() - this.weak.lowerThreshold());
  };

  /**
   * @param {Edge}
   * @return {Boolean}
   */
  Subnetwork.prototype.a3 = function a3 (edge) {
    return !this.validate(edge).equals(Node$$1.blankEdge);
  };

  return Subnetwork;
}(Node));

var DTNeuron = (function (Node$$1) {
  function DTNeuron(img) {
    Node$$1.call(this);

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

  if ( Node$$1 ) DTNeuron.__proto__ = Node$$1;
  DTNeuron.prototype = Object.create( Node$$1 && Node$$1.prototype );
  DTNeuron.prototype.constructor = DTNeuron;


  /**
   * @param  {Array.<GreyscaleWindow>} env
   * @return {Array.<Edge>}
   */
  DTNeuron.prototype.detect = function detect (env) {
    var this$1 = this;

    var edges = [];
    for (var i = 0, len = env.length; i < len; i++) {
      var tmp = new Edge$1(env[i].matrix(), this$1.upperThreshold, this$1.lowerThreshold);
      if (this$1.b1(tmp) && this$1.b2(env[i].upperGreyLevel(), env[i].lowerGreyLevel())) {
        this$1.updateIlluminationLevel(env[i].averageGreyLevel(), i, len);
        if (this$1.a2(env[i].upperGreyLevel(), env[i].lowerGreyLevel(), upperThreshold, lowerThreshold)) {
          this$1.updateThresholds(env[i].upperGreyLevel(), env[i].lowerGreyLevel(), i, len);
        }
        edges.push(tmp);
      } else {
        edges.push(Node$$1.blankEdge);
      }
    }
    return edges;
  };

  /**
   * @param  {Edge} edge
   * @return {Boolean}
   */
  DTNeuron.prototype.b1 = function b1 (edge) {
    return !this.validate(edge).equals(Node$$1.blankEdge);
  };

  /**
   * @param  {Number} mmax
   * @param  {Number} mmin
   * @return {Boolean}
   */
  DTNeuron.prototype.b2 = function b2 (mmax, mmin) {
    return (this.illuminationLevel <= mmax) && (this.illuminationLevel >= mmin);
  };

  /**
   * @param  {Number} mmax
   * @param  {Number} mmin
   * @param  {Number} wmax
   * @param  {Number} wmin
   * @return {Boolean}
   */
  DTNeuron.prototype.a2 = function a2 (mmax, mmin, wmax, wmin) {
    return (mmax - mmin) >= (wmax - wmin);
  };

  /**
   * @param  {Number} ms
   * @param  {Number} i
   * @param  {Number} tf
   */
  DTNeuron.prototype.updateIlluminationLevel = function updateIlluminationLevel (ms, i, tf) {
    this.illuminationLevel += (ms - this.illuminationLevel) * this.eta(i, tf);
  };

  /**
   * @param  {Number} mmax
   * @param  {Number} mmin
   * @param  {Number} i
   * @param  {Number} tf
   */
  DTNeuron.prototype.updateThresholds = function updateThresholds (mmax, mmin, i, tf) {
    this.upperThreshold += (this.upperThreshold - mmax) * this.eta(i, tf);
    this.lowerThreshold += (this.lowerThreshold - mmin) * this.eta(i, tf);
  };

  return DTNeuron;
}(Node));

var Network$1 = (function (Node$$1) {
  function Network(N) {
    Node$$1.call(this);
    var tmp = 0;
    var gradientWidth = 256;
    var divider  = 4;
    var quantity = N;

    var bits = gradientWidth / (N * divider);

    /**
     * @type {Array.<Subnetwork>}
     */
    this.subnetworks = [];

    for (var i = 0; i < N; i++) {
      var n1lower = tmp;
      var n2lower = tmp + bits;
      var illuminationPrototype = tmp + bits * 2;
      var n2upper = tmp + bits * 3;
      var n1upper = tmp + bits * 4;

      tmp = n1upper;
      subnetworks.push(
        new Subnetwork(illuminationPrototype,
          n1upper, n1lower, n2upper, n2lower));
    }

    /**
     * @type {Number}
     */
    this.widthIncrement = 0;

    /**
     * @type {Number}
     */
    this.heightIncrement = 0;

    /**
     * @type {Object}
     */
    this.resizedImageSize = null;

    this.edgeTableRows = null;

    this.edgeTableCols = null;

    this.dynamicNeuron = null;

    this.subnetworks = [];

    this.edgeMaps = [];

    this.greyscaleWindows = [];

    this.primaryEdgePoints = [];

  }

  if ( Node$$1 ) Network.__proto__ = Node$$1;
  Network.prototype = Object.create( Node$$1 && Node$$1.prototype );
  Network.prototype.constructor = Network;

  var prototypeAccessors = { subnetworksCount: {} };

  /**
   * @param  {GreyscaleWindow} win
   * @return {Subnetwork}
   */
  Network.prototype.subnetworkCompetition = function subnetworkCompetition (win) {
    var this$1 = this;

    var dist = 256;
    var lgl = win.lowerGreyLevel;
    var ugl = win.upperGreyLevel;
    var agl = win.averageGreyLevel;
    var tempDist, subnetwork, res, illuminationPrototype;

    for (var i = 0, len = this.subnetworks.length; i < len; i++) {
      illuminationPrototype = this$1.subnetworks[i].illuminationPrototype();
      if (illuminationPrototype >= lgl &&
        illuminationPrototype <= ugl) {

        tempDist = distance(illuminationPrototype, agl);
        if (tempDist < dist) {
          dist = tempDist;
          res = subnetworks[i];
        }
      }
    }

    return res;
  };

  /**
   * @param  {GreyscaleWindow} img
   * @return {GreyscaleWindow}
   */
  Network.prototype.detect = function detect (img) {
    // resize to fit the grid
    var resizedImage = this.resize(img);
    var N = GreyscaleWindow.SIZE;

    this.resizedImageSize = {
      x: resizedImage.width(),
      y: resizedImage.height()
    };

    this.edgeTableRows = resizedImageSize.height() / N;
    this.edgeTableCols = resizedImageSize.width() / N;

    // primary edge points by subnetworks
    this.detectPrimaryEdgePoints(resizedImage);
    // secondary - by dynamic neuron
    this.detectSecondaryEdgePoints();
    this.drawEdges(resizedImage);

    this.resizedImage = crop(resizedImage);

    // free mem
    this.edgeMaps = null;
    this.greyscaleWindows = null;
    this.primaryEdgePoints = null;

    // return monochrome
    return resizedImage;
  };

  /**
   *
   * @param  {Array.<GreyscaleImage>} imgs
   * @return {Array.<GreyscaleImage>}
   */
  Network.prototype.train = function train (imgs) {
    var this$1 = this;

    var res = [];
    var N = GreyscaleWindow.SIZE;

    // learning
    for (var i$1 = 0, len = imgs.length; i$1 < len; i$1++) {
      // Count all learining iterations.  It consists of all patches of
      // all images in the training set. Otherwise learining process would
      // flush the result of the previous iteration. The result depend not
      // only on the learning set contents but on the order of images in it
      // as well
      var tmpw = 0;
      var tmph = 0;
      var img = imgs[i$1];
      var ref = [img.width(), img.height()];
      var w = ref[0];
      var h = ref[1];

      while ((tmpw * N) < w) {
        tmpw++;
      }
      while ((tmph * N) < h) {
        tmph++;
      }
      Node$$1.totalTrainIterations += (tmpw * tmph);
    }
    Node$$1.trainIteration = 0;

    for (var i = 0; i < imgs.length; i++) {
      res.push(this$1.detect(imgs[i]));
    }
    Node$$1.totalTrainIterations = 0;
    return res;
  };

  /**
   * @return {Number}
   */
  prototypeAccessors.subnetworksCount.get = function () {
    return this.subnetworks.length;
  };

  /**
   * @param  {GreyscaleWindow} img
   * @return {GreyscaleWindow}
   */
  Network.prototype.resize = function resize (img) {
    var this$1 = this;

    this.widthIncrement = 0;
    this.heightIncrement = 0;

    var i, j;
    var N = GreyscaleWindow.SIZE;
    var matrix = img.matrix();

    while (((matrix.length + this.heightIncrement) % N) != 0) {
      this$1.heightIncrement++;
    }

    while (((matrix[0].length + this.widthIncrement) % N) != 0) {
      this$1.widthIncrement++;
    }

    var data = img.matrix();
    for (i = 0; i < data.length; i++) {
      for (j = 0; j < this.widthIncrement; j++) {
        data[i].push(WHITE);
      }
    }

    for (i = 0; i < heightIncrement; i++) {
      var tmp = [];
      for (j = 0; j < N + this.widthIncrement; j++) {
        tmp.push(Color.BLACK);
      }
      data.push(tmp);
    }
    return new GreyscaleWindow(data);
  };

  /**
   * @param  {GreyscaleWindow} img
   * @return {GreyscaleWindow}
   */
  Network.prototype.crop = function crop (img) {
    var this$1 = this;

    var data = img.matrix();
    while (this.heightIncrement--) {
      data.pop();
    }

    for (var i = 0, len = data.length; i < len; i++) {
      data[i] = data[i].slice(0, data[i].length - this$1.widthIncrement);
    }
    this.widthIncrement = 0;
    return data;
  };

  /**
   * @param  {GreyscaleWindow} img
   */
  Network.prototype.detectPrimaryEdgePoints = function detectPrimaryEdgePoints (img) {
    var this$1 = this;

    var N = GreyscaleWindow.SIZE;
    var i, ii, j, jj, k;

    // illumination matrix rows
    for (i = 0, ii = img.height(); i < ii; i += N) {

      // illumination matrix cols
      for (j = 0, jj = img.width(); j < jj; j += N) {
        var data = [];
        // get image patches
        for (k = 0; k < N; k++) {
          data.push(img._matrix[i + k].slice(j, N));
        }

        // to greyscale windows
        var currentWindow = new GreyscaleWindow(data);
        // store
        this$1.greyscaleWindows.push(currentWindow);

        // subnetworks compete for the patch
        var winner = this$1.subnetworkCompetition(currentWindow);

        // get a primary edge point, extracted by the winner
        if (winner) {
          this$1.edgeMaps.push(winner.detect(currentWindow));
        } else {
          Node$$1.trainIteration++;
          this$1.edgeMaps.push(new Edge());
        }
      }
    }
  };

  /**
   * Detects secondary options
   */
  Network.prototype.detectSecondaryEdgePoints = function detectSecondaryEdgePoints () {
    var this$1 = this;

    var ref = [0, 0];
    var x = ref[0];
    var y = ref[1];
    var N = GreyscaleWindow.SIZE;

    for (var i = 0, len = this.edgeMaps.length; i < len; i++) {
      if (x == (this$1.resizedImageSize.width() / N)) {
        x = 0;
        y++;
      }

      // primary edge found
      if (!this$1.edgeMaps[i].equals(Node$$1.blankEdge)) {
        // environment stack: get existing env patches coords
        var env = this$1.getPrimaryPointEnvironment(i);
        // init a dynamic neuron from primary patch
        this$1.dynamicNeuron = new DTNeuron(this$1.greyscaleWindows[i]);
        // store the results of dynamic neuron detection
        this$1.setPrimaryPointEnvironment(i, dynamicNeuron.detect(env));

        this$1.dynamicNeuron = null;
      }
      x++;
    }
  };

  /**
   * @param  {Number} number
   * @return {Array.<GreyscaleWindow}
   */
  Network.prototype.getPrimaryPointEnvironment = function getPrimaryPointEnvironment (number) {
    var this$1 = this;

    var env = [];
    var numbers = [-1, -1, -1, -1, -1, -1, -1, -1];

    // get surrounding coords
    numbers = this.setEnvironmentPointsNumbers(number, numbers);
    for (var i = 0, len = numbers.length; i < len; i++) {
      // exists
      if ((numbers[i] !== -1)) {
        env.push(this$1.greyscaleWindows[numbers[i]]);
      }
    }
    return env;
  };

  /**
   * @param {Number} number
   * @param {Array.<Edge>} env
   */
  Network.prototype.setPrimaryPointEnvironment = function setPrimaryPointEnvironment (number, env) {
    var this$1 = this;

    var numbers = [-1, -1, -1, -1, -1, -1, -1, -1];
    var i = 0;

    // get env coords
    numbers = setEnvironmentPointsNumbers(number, numbers);
    for (var j = 0, len = numbers.length; j < len; j++) {
      // it's already has been here
      if (numbers[j] !== -1) {
        // get edge map for it and store into the global
        if (this$1.edgeMaps[numbers[j]].equals(Node$$1.blankEdge)) {
          this$1.edgeMaps[numbers[j]] = env[i];
        }
        i++;
      }
    }
  };

  /**
   * 1 2 3
   * 0 x 4
   * 7 6 5
   * Patch coord
   *
   * @param {Number} number
   * @param {Array.<Number>} numbers
   * @return {Array.<Number>} numbers
   */
  Network.prototype.setEnvironmentPointsNumbers = function setEnvironmentPointsNumbers (number, nums) {
    var this$1 = this;

    var col = number;
    var row = 0;

    while (col > (this.edgeTableCols - 1)) {
      col -= this$1.edgeTableCols;
      row++;
    }

    // by default - no patches in env

    // left neighbour
    if (col > 0) {
      nums[0] = number - 1;

      // left above
      if (row > 0) {
        nums[1] = (number - 1 - this.edgeTableCols);
      }

      // left below
      if (row < (this.edgeTableRows - 1)) {
        nums[7] = (number - 1 + this.edgeTableCols);
      }
    }

    // right neighbours
    if (col < (this.edgeTableCols - 1)) {
      nums[4] = number + 1;
      // right above
      if (row > 0) {
        nums[3] = (number + 1 - edgeTableCols);
      }

      // right below
      if (row < (edgeTableRows - 1)) {
        nums[5] = (number + 1 + edgeTableCols);
      }
    }

    // below
    if (row < (this.edgeTableRows - 1)) {
      nums[6] = number + this.edgeTableCols;
    }
    // above
    if (row > 0) {
      nums[2] = number - this.edgeTableCols;
    }

    return nums;
  };

  /**
   * @param  {GreyscaleWindow} img
   */
  Network.prototype.drawEdges = function drawEdges (img) {
    var ref = [0, 0];
    var row = ref[0];
    var col = ref[1];
    var N = GreyscaleWindow.SIZE;

    while (row < this.edgeTableRows) {
      while (col < this.edgeTableCols) {
        for (var i = 0; i < N; i++) {
          for (var j = 0; j < N; j++) {
            img.setPixel(row * N + i,
              col * N + j,
              edgeMaps[row * edgeTableCols + col].pixel(i, j)
            );
          }
        }
        col++;
      }
      col = 0;
      row++;
    }
  };

  Object.defineProperties( Network.prototype, prototypeAccessors );

  return Network;
}(Node));

return Network$1;

})));
//# sourceMappingURL=nnjs.umd.js.map
