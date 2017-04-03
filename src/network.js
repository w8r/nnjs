import GreyscaleWindow from './greyscalewindow';
import Node            from './node';
import Subnetwork      from './subnetwork';
import Neuron          from './neuron';
import DTNeuron        from './dtneuron';
import * as utils      from './utils';


/**
 * @constructor
 * @extends {Node}
 */
export default class Network extends Node {

  /**
   * @param {Number} N subnetworks count
   */
  constructor(N) {
    super();
    let tmp = 0;
    let gradientWidth = 256;
    let divider  = 4;
    let quantity = N;

    const bits = gradientWidth / (N * divider);

    /**
     * @type {Array.<Subnetwork>}
     */
    this.subnetworks = [];

    for (let i = 0; i < N; i++) {
      let n1lower = tmp;
      let n2lower = tmp + bits;
      let illuminationPrototype = tmp + bits * 2;
      let n2upper = tmp + bits * 3;
      let n1upper = tmp + bits * 4;

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

  /**
   * @param  {GreyscaleWindow} win
   * @return {Subnetwork}
   */
  subnetworkCompetition(win) {
    let dist = 256;
    let lgl = win.lowerGreyLevel;
    let ugl = win.upperGreyLevel;
    let agl = win.averageGreyLevel;
    let tempDist, subnetwork, res, illuminationPrototype;

    for (let i = 0, len = this.subnetworks.length; i < len; i++) {
      illuminationPrototype = this.subnetworks[i].illuminationPrototype();
      if (illuminationPrototype >= lgl &&
        illuminationPrototype <= ugl) {

        tempDist = utils.distance(illuminationPrototype, agl);
        if (tempDist < dist) {
          dist = tempDist;
          res = subnetworks[i];
        }
      }
    }

    return res;
  }

  /**
   * @param  {GreyscaleWindow} img
   * @return {GreyscaleWindow}
   */
  detect(img) {
    // resize to fit the grid
    let resizedImage = this.resize(img);
    const N = GreyscaleWindow.SIZE;

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
  }

  /**
   *
   * @param  {Array.<GreyscaleImage>} imgs
   * @return {Array.<GreyscaleImage>}
   */
  train(imgs) {
    let res = [];
    const N = GreyscaleWindow.SIZE;

    // learning
    for (let i = 0, len = imgs.length; i < len; i++) {
      // Count all learining iterations.  It consists of all patches of
      // all images in the training set. Otherwise learining process would
      // flush the result of the previous iteration. The result depend not
      // only on the learning set contents but on the order of images in it
      // as well
      let tmpw = 0;
      let tmph = 0;
      let img = imgs[i];
      let [w, h] = [img.width(), img.height()];

      while ((tmpw * N) < w) {
        tmpw++;
      }
      while ((tmph * N) < h) {
        tmph++;
      }
      Node.totalTrainIterations += (tmpw * tmph);
    }
    Node.trainIteration = 0;

    for (var i = 0; i < imgs.length; i++) {
      res.push(this.detect(imgs[i]));
    }
    Node.totalTrainIterations = 0;
    return res;
  }

  /**
   * @return {Number}
   */
  get subnetworksCount() {
    return this.subnetworks.length;
  }

  /**
   * @param  {GreyscaleWindow} img
   * @return {GreyscaleWindow}
   */
  resize(img) {
    this.widthIncrement = 0;
    this.heightIncrement = 0;

    let i, j;
    const N = GreyscaleWindow.SIZE;
    let matrix = img.matrix();

    while (((matrix.length + this.heightIncrement) % N) != 0) {
      this.heightIncrement++;
    }

    while (((matrix[0].length + this.widthIncrement) % N) != 0) {
      this.widthIncrement++;
    }

    let data = img.matrix();
    for (i = 0; i < data.length; i++) {
      for (j = 0; j < this.widthIncrement; j++) {
        data[i].push(WHITE);
      }
    }

    for (i = 0; i < heightIncrement; i++) {
      let tmp = [];
      for (j = 0; j < N + this.widthIncrement; j++) {
        tmp.push(Color.BLACK);
      }
      data.push(tmp);
    }
    return new GreyscaleWindow(data);
  }

  /**
   * @param  {GreyscaleWindow} img
   * @return {GreyscaleWindow}
   */
  crop(img) {
    let data = img.matrix();
    while (this.heightIncrement--) {
      data.pop();
    }

    for (let i = 0, len = data.length; i < len; i++) {
      data[i] = data[i].slice(0, data[i].length - this.widthIncrement);
    }
    this.widthIncrement = 0;
    return data;
  }

  /**
   * @param  {GreyscaleWindow} img
   */
  detectPrimaryEdgePoints(img) {
    const N = GreyscaleWindow.SIZE;
    let i, ii, j, jj, k;

    // illumination matrix rows
    for (i = 0, ii = img.height(); i < ii; i += N) {

      // illumination matrix cols
      for (j = 0, jj = img.width(); j < jj; j += N) {
        let data = [];
        // get image patches
        for (k = 0; k < N; k++) {
          data.push(img._matrix[i + k].slice(j, N));
        }

        // to greyscale windows
        let currentWindow = new GreyscaleWindow(data);
        // store
        this.greyscaleWindows.push(currentWindow);

        // subnetworks compete for the patch
        let winner = this.subnetworkCompetition(currentWindow);

        // get a primary edge point, extracted by the winner
        if (winner) {
          this.edgeMaps.push(winner.detect(currentWindow));
        } else {
          Node.trainIteration++;
          this.edgeMaps.push(new Edge());
        }
      }
    }
  }

  /**
   * Detects secondary options
   */
  detectSecondaryEdgePoints() {
    let [x, y] = [0, 0];
    const N = GreyscaleWindow.SIZE;

    for (let i = 0, len = this.edgeMaps.length; i < len; i++) {
      if (x == (this.resizedImageSize.width() / N)) {
        x = 0;
        y++;
      }

      // primary edge found
      if (!this.edgeMaps[i].equals(Node.blankEdge)) {
        // environment stack: get existing env patches coords
        let env = this.getPrimaryPointEnvironment(i);
        // init a dynamic neuron from primary patch
        this.dynamicNeuron = new DTNeuron(this.greyscaleWindows[i]);
        // store the results of dynamic neuron detection
        this.setPrimaryPointEnvironment(i, dynamicNeuron.detect(env));

        this.dynamicNeuron = null;
      }
      x++;
    }
  }

  /**
   * @param  {Number} number
   * @return {Array.<GreyscaleWindow}
   */
  getPrimaryPointEnvironment(number) {
    let env = [];
    let numbers = [-1, -1, -1, -1, -1, -1, -1, -1];

    // get surrounding coords
    numbers = this.setEnvironmentPointsNumbers(number, numbers);
    for (var i = 0, len = numbers.length; i < len; i++) {
      // exists
      if ((numbers[i] !== -1)) {
        env.push(this.greyscaleWindows[numbers[i]]);
      }
    }
    return env;
  }

  /**
   * @param {Number} number
   * @param {Array.<Edge>} env
   */
  setPrimaryPointEnvironment(number, env) {
    let numbers = [-1, -1, -1, -1, -1, -1, -1, -1];
    let i = 0;

    // get env coords
    numbers = setEnvironmentPointsNumbers(number, numbers);
    for (let j = 0, len = numbers.length; j < len; j++) {
      // it's already has been here
      if (numbers[j] !== -1) {
        // get edge map for it and store into the global
        if (this.edgeMaps[numbers[j]].equals(Node.blankEdge)) {
          this.edgeMaps[numbers[j]] = env[i];
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
  setEnvironmentPointsNumbers(number, nums) {
    let col = number;
    let row = 0;

    while (col > (this.edgeTableCols - 1)) {
      col -= this.edgeTableCols;
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
  drawEdges(img) {
    let [row, col] = [0, 0];
    const N = GreyscaleWindow.SIZE;

    while (row < this.edgeTableRows) {
      while (col < this.edgeTableCols) {
        for (let i = 0; i < N; i++) {
          for (let j = 0; j < N; j++) {
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
  }
};
