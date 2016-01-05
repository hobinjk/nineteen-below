var Utils = {
  /**
   * Return a random integer in [0,max)
   *
   * @param {number} max
   * @return {number}
   */
  randInt: function(max) {
    return Math.floor(Math.random() * max);
  },

  /**
   * Return a random element of array
   *
   * @param {Array<T>} array
   * @return {T}
   */
  randElement: function(array) {
    return array[Utils.randInt(array.length)];
  }
};
