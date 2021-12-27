function arrayFill(length, fill = 0) {
  return Array(length).fill(fill);
}

class VUMeter {
  static SCALE = 'vu-scale';
  static SCALE_LABEL = 'vu-scale-label';
  static SCALE_MARKER = 'vu-scale-marker';
  static BAR_CONTAINER = 'vu-bar-container';
  static BAR = 'vu-bar';

  constructor(options) {
    this.gradientStart = options.gradientStart || '#75b831';
    this.gradientMiddle = options.gradientMiddle || '#f2921b';
    this.gradientEnd = options.gradientEnd || '#c11e0f';
    this.barSpeed = options.barSpeed || 2;
    this.tickerSpeed = options.tickerSpeed || 1;
    this.tickerHeight = options.tickerHeight || 2;
    this.tickerColor = options.tickerColor || 'black';
    this.refreshRate = options.refreshRate || 60;

    this.barIds = [];
    this.volumes = [];
    this.currentVolumes = [];
    this.currentTickers = [];

    this.rendered = false;
  }

  _getCanvas(id) {
    return document.getElementById(id);
  }

  _preDraw(context) {
    context.save();
    const { width, height } = context.canvas;
    context.clearRect(0, 0, width, height);
  }

  _postDraw(context) {
    context.restore();
  }

  _draw() {
    this.barIds.forEach((id, i) => {
      const volume = this.volumes[i] || 0;
      const currentVolume = this.currentVolumes[i] || 0;
      const currentTicker = this.currentTickers[i] || 0;
      const canvas = this._getCanvas(id);
      const context = canvas.getContext('2d');
      this._preDraw(context, canvas);
      const gradient = context.createLinearGradient(
        0,
        context.canvas.height,
        0,
        0,
      );
      gradient.addColorStop(0, this.gradientStart);
      gradient.addColorStop(0.5, this.gradientStart);
      gradient.addColorStop(0.75, this.gradientMiddle);
      gradient.addColorStop(0.875, this.gradientMiddle);
      gradient.addColorStop(1, this.gradientEnd);
      context.fillStyle = gradient;
      const diff = volume - currentVolume;
      const target = currentVolume + diff / (20 / this.barSpeed);
      const targetY = (1 - target) * canvas.height;
      context.fillRect(
        0,
        targetY,
        context.canvas.width,
        context.canvas.height - targetY,
      );
      let ticker = currentTicker;
      if (target > ticker) {
        ticker = target;
      }
      if (target < ticker) {
        ticker -= (this.tickerSpeed * 0.001);
      }
      const targetTicker = (1 - ticker) * canvas.height - this.tickerHeight;
      context.fillStyle = this.tickerColor;
      context.fillRect(0, targetTicker, context.canvas.width, this.tickerHeight);
      this.currentVolumes[i] = target;
      this.currentTickers[i] = ticker;
      this._postDraw(context);
    });
  }

  _renderScales() {
    const scales = Array.from(document.getElementsByClassName(VUMeter.SCALE));
    const labels = [
      '0 dB',
      '-10 dB',
      '-20 dB',
      '-30 dB',
      '-40 dB',
      '-50 dB',
      '-60 dB',
      '-70 dB',
    ].map(label => {
      const div = document.createElement('div');
      const content = document.createTextNode(label);
      div.appendChild(content);
      div.className = VUMeter.SCALE_LABEL;
      return div;
    });
    scales.forEach(scale => {
      labels.forEach(label => {
        scale.appendChild(label.cloneNode(true));
      });
    })
  }

  _renderBars() {
    const marker = document.createElement('div');
    marker.className = VUMeter.SCALE_MARKER;

    const canvas = document.createElement('canvas');
    canvas.className = VUMeter.BAR;

    const containers = Array.from(document.getElementsByClassName(VUMeter.BAR_CONTAINER));
    containers.forEach((container, i) => {
      const id = `${VUMeter.BAR}-${i+1}`;
      this.barIds.push(id);
      container.removeAttribute('id');
      canvas.setAttribute('id', id);
      container.appendChild(canvas.cloneNode(true));
      arrayFill(6).forEach(() => container.appendChild(marker.cloneNode(true)));
    });
    this.volumes = arrayFill(this.barIds.length);
    this.currentVolumes = arrayFill(this.barIds.length);
    this.currentTickers = arrayFill(this.barIds.length);
  }

  _render() {
    setTimeout(() => {
      this._renderScales();
      this._renderBars();
      this._draw();
      this.render = true;
    });
  }

  start() {
    if (!this.rendered) {
      this._render();
    }
    setInterval(() => {
      this._draw();
    }, 1000 / this.refreshRate);
  }
}
