'use strict';

var multiItemSlider = function () {
  function _isElementVisible(element) {
    var rect = element.getBoundingClientRect(),
        vWidth = window.innerWidth || doc.documentElement.clientWidth,
        vHeight = window.innerHeight || doc.documentElement.clientHeight,
        elemFromPoint = function elemFromPoint(x, y) {
      return document.elementFromPoint(x, y);
    };

    if (rect.right < 0 || rect.bottom < 0 || rect.left > vWidth || rect.top > vHeight) return false;
    return element.contains(elemFromPoint(rect.left, rect.top)) || element.contains(elemFromPoint(rect.right, rect.top)) || element.contains(elemFromPoint(rect.right, rect.bottom)) || element.contains(elemFromPoint(rect.left, rect.bottom));
  }

  return function (selector, config) {
    var _mainElement = document.querySelector(selector),
        _sliderWrapper = _mainElement.querySelector('.slider__wrapper-1'),
        _sliderItems = _mainElement.querySelectorAll('.slider__item-1'),
        _sliderControls = _mainElement.querySelectorAll('.slider__control-1'),
        _sliderControlLeft = _mainElement.querySelector('.slider__control_left-1'),
        _sliderControlRight = _mainElement.querySelector('.slider__control_right-1'),
        _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width),
        _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width),
        _html = _mainElement.innerHTML,
        _positionLeftItem = 0,
        _transform = 0,
        _step = _itemWidth / _wrapperWidth * 100,
        _items = [],
        _interval = 0,
        _states = [{
      active: false,
      minWidth: 0,
      count: 1
    }, {
      active: false,
      minWidth: 576,
      count: 2
    }, {
      active: false,
      minWidth: 992,
      count: 3
    }, {
      active: false,
      minWidth: 1200,
      count: 4
    }],
        _config = {
      isCycling: false,
      direction: 'right',
      interval: 3000,
      pause: true
    };

    for (var key in config) {
      if (key in _config) {
        _config[key] = config[key];
      }
    }

    _sliderItems.forEach(function (item, index) {
      _items.push({
        item: item,
        position: index,
        transform: 0
      });
    });

    var _setActive = function _setActive() {
      var _index = 0;
      var width = parseFloat(document.body.clientWidth);

      _states.forEach(function (item, index, arr) {
        _states[index].active = false;
        if (width >= _states[index].minWidth) _index = index;
      });

      _states[_index].active = true;
    };

    var _getActive = function _getActive() {
      var _index;

      _states.forEach(function (item, index, arr) {
        if (_states[index].active) {
          _index = index;
        }
      });

      return _index;
    };

    var position = {
      getItemMin: function getItemMin() {
        var indexItem = 0;

        _items.forEach(function (item, index) {
          if (item.position < _items[indexItem].position) {
            indexItem = index;
          }
        });

        return indexItem;
      },
      getItemMax: function getItemMax() {
        var indexItem = 0;

        _items.forEach(function (item, index) {
          if (item.position > _items[indexItem].position) {
            indexItem = index;
          }
        });

        return indexItem;
      },
      getMin: function getMin() {
        return _items[position.getItemMin()].position;
      },
      getMax: function getMax() {
        return _items[position.getItemMax()].position;
      }
    };

    var _transformItem = function _transformItem(direction) {
      var nextItem;

      if (!_isElementVisible(_mainElement)) {
        return;
      }

      if (direction === 'right') {
        _positionLeftItem++;

        if (_positionLeftItem + _wrapperWidth / _itemWidth - 1 > position.getMax()) {
          nextItem = position.getItemMin();
          _items[nextItem].position = position.getMax() + 1;
          _items[nextItem].transform += _items.length * 100;
          _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
        }

        _transform -= _step;
      }

      if (direction === 'left') {
        _positionLeftItem--;

        if (_positionLeftItem < position.getMin()) {
          nextItem = position.getItemMax();
          _items[nextItem].position = position.getMin() - 1;
          _items[nextItem].transform -= _items.length * 100;
          _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
        }

        _transform += _step;
      }

      _sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
    };

    var _cycle = function _cycle(direction) {
      if (!_config.isCycling) {
        return;
      }

      _interval = setInterval(function () {
        _transformItem(direction);
      }, _config.interval);
    };

    var _controlClick = function _controlClick(e) {
      if (e.target.classList.contains('slider__control-1')) {
        var direction = e.target.classList.contains('slider__control_right-1') ? 'right' : 'left';

        _transformItem(direction);

        clearInterval(_interval);

        _cycle(_config.direction);
      }
    };

    var _handleVisibilityChange = function _handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        clearInterval(_interval);
      } else {
        clearInterval(_interval);

        _cycle(_config.direction);
      }
    };

    var _refresh = function _refresh() {
      clearInterval(_interval);
      _mainElement.innerHTML = _html;
      _sliderWrapper = _mainElement.querySelector('.slider__wrapper-1');
      _sliderItems = _mainElement.querySelectorAll('.slider__item-1');
      _sliderControls = _mainElement.querySelectorAll('.slider__control-1');
      _sliderControlLeft = _mainElement.querySelector('.slider__control_left-1');
      _sliderControlRight = _mainElement.querySelector('.slider__control_right-1');
      _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width);
      _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width);
      _positionLeftItem = 0;
      _transform = 0;
      _step = _itemWidth / _wrapperWidth * 100;
      _items = [];

      _sliderItems.forEach(function (item, index) {
        _items.push({
          item: item,
          position: index,
          transform: 0
        });
      });
    };

    var _setUpListeners = function _setUpListeners() {
      _mainElement.addEventListener('click', _controlClick);

      if (_config.pause && _config.isCycling) {
        _mainElement.addEventListener('mouseenter', function () {
          clearInterval(_interval);
        });

        _mainElement.addEventListener('mouseleave', function () {
          clearInterval(_interval);

          _cycle(_config.direction);
        });
      }

      document.addEventListener('visibilitychange', _handleVisibilityChange, false);
      window.addEventListener('resize', function () {
        var _index = 0,
            width = parseFloat(document.body.clientWidth);

        _states.forEach(function (item, index, arr) {
          if (width >= _states[index].minWidth) _index = index;
        });

        if (_index !== _getActive()) {
          _setActive();

          _refresh();
        }
      });
    }; // инициализация


    _setUpListeners();

    if (document.visibilityState === "visible") {
      _cycle(_config.direction);
    }

    _setActive();

    return {
      right: function right() {
        _transformItem('right');
      },
      left: function left() {
        _transformItem('left');
      },
      stop: function stop() {
        _config.isCycling = false;
        clearInterval(_interval);
      },
      cycle: function cycle() {
        _config.isCycling = true;
        clearInterval(_interval);

        _cycle();
      }
    };
  };
}();

var slider = multiItemSlider('.slider-1', {
  isCycling: true
});
'use strict';

var multiItemSlider = function () {
  function _isElementVisible(element) {
    var rect = element.getBoundingClientRect(),
        vWidth = window.innerWidth || doc.documentElement.clientWidth,
        vHeight = window.innerHeight || doc.documentElement.clientHeight,
        elemFromPoint = function elemFromPoint(x, y) {
      return document.elementFromPoint(x, y);
    };

    if (rect.right < 0 || rect.bottom < 0 || rect.left > vWidth || rect.top > vHeight) return false;
    return element.contains(elemFromPoint(rect.left, rect.top)) || element.contains(elemFromPoint(rect.right, rect.top)) || element.contains(elemFromPoint(rect.right, rect.bottom)) || element.contains(elemFromPoint(rect.left, rect.bottom));
  }

  return function (selector, config) {
    var _mainElement = document.querySelector(selector),
        _sliderWrapper = _mainElement.querySelector('.slider__wrapper-2'),
        _sliderItems = _mainElement.querySelectorAll('.slider__item-2'),
        _sliderControls = _mainElement.querySelectorAll('.slider__control-2'),
        _sliderControlLeft = _mainElement.querySelector('.slider__control_left-2'),
        _sliderControlRight = _mainElement.querySelector('.slider__control_right-2'),
        _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width),
        _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width),
        _html = _mainElement.innerHTML,
        _positionLeftItem = 0,
        _transform = 0,
        _step = _itemWidth / _wrapperWidth * 100,
        _items = [],
        _interval = 0,
        _states = [{
      active: false,
      minWidth: 0,
      count: 1
    }, {
      active: false,
      minWidth: 576,
      count: 2
    }, {
      active: false,
      minWidth: 992,
      count: 3
    }, {
      active: false,
      minWidth: 1200,
      count: 4
    }],
        _config = {
      isCycling: false,
      direction: 'right',
      interval: 5000,
      pause: true
    };

    for (var key in config) {
      if (key in _config) {
        _config[key] = config[key];
      }
    }

    _sliderItems.forEach(function (item, index) {
      _items.push({
        item: item,
        position: index,
        transform: 0
      });
    });

    var _setActive = function _setActive() {
      var _index = 0;
      var width = parseFloat(document.body.clientWidth);

      _states.forEach(function (item, index, arr) {
        _states[index].active = false;
        if (width >= _states[index].minWidth) _index = index;
      });

      _states[_index].active = true;
    };

    var _getActive = function _getActive() {
      var _index;

      _states.forEach(function (item, index, arr) {
        if (_states[index].active) {
          _index = index;
        }
      });

      return _index;
    };

    var position = {
      getItemMin: function getItemMin() {
        var indexItem = 0;

        _items.forEach(function (item, index) {
          if (item.position < _items[indexItem].position) {
            indexItem = index;
          }
        });

        return indexItem;
      },
      getItemMax: function getItemMax() {
        var indexItem = 0;

        _items.forEach(function (item, index) {
          if (item.position > _items[indexItem].position) {
            indexItem = index;
          }
        });

        return indexItem;
      },
      getMin: function getMin() {
        return _items[position.getItemMin()].position;
      },
      getMax: function getMax() {
        return _items[position.getItemMax()].position;
      }
    };

    var _transformItem = function _transformItem(direction) {
      var nextItem;

      if (!_isElementVisible(_mainElement)) {
        return;
      }

      if (direction === 'right') {
        _positionLeftItem++;

        if (_positionLeftItem + _wrapperWidth / _itemWidth - 1 > position.getMax()) {
          nextItem = position.getItemMin();
          _items[nextItem].position = position.getMax() + 1;
          _items[nextItem].transform += _items.length * 100;
          _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
        }

        _transform -= _step;
      }

      if (direction === 'left') {
        _positionLeftItem--;

        if (_positionLeftItem < position.getMin()) {
          nextItem = position.getItemMax();
          _items[nextItem].position = position.getMin() - 1;
          _items[nextItem].transform -= _items.length * 100;
          _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
        }

        _transform += _step;
      }

      _sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
    };

    var _cycle = function _cycle(direction) {
      if (!_config.isCycling) {
        return;
      }

      _interval = setInterval(function () {
        _transformItem(direction);
      }, _config.interval);
    };

    var _controlClick = function _controlClick(e) {
      if (e.target.classList.contains('slider__control-2')) {
        var direction = e.target.classList.contains('slider__control_right-2') ? 'right' : 'left';

        _transformItem(direction);

        clearInterval(_interval);

        _cycle(_config.direction);
      }
    };

    var _handleVisibilityChange = function _handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        clearInterval(_interval);
      } else {
        clearInterval(_interval);

        _cycle(_config.direction);
      }
    };

    var _refresh = function _refresh() {
      clearInterval(_interval);
      _mainElement.innerHTML = _html;
      _sliderWrapper = _mainElement.querySelector('.slider__wrapper-2');
      _sliderItems = _mainElement.querySelectorAll('.slider__item-2');
      _sliderControls = _mainElement.querySelectorAll('.slider__control-2');
      _sliderControlLeft = _mainElement.querySelector('.slider__control_left-2');
      _sliderControlRight = _mainElement.querySelector('.slider__control_right-2');
      _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width);
      _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width);
      _positionLeftItem = 0;
      _transform = 0;
      _step = _itemWidth / _wrapperWidth * 100;
      _items = [];

      _sliderItems.forEach(function (item, index) {
        _items.push({
          item: item,
          position: index,
          transform: 0
        });
      });
    };

    var _setUpListeners = function _setUpListeners() {
      _mainElement.addEventListener('click', _controlClick);

      if (_config.pause && _config.isCycling) {
        _mainElement.addEventListener('mouseenter', function () {
          clearInterval(_interval);
        });

        _mainElement.addEventListener('mouseleave', function () {
          clearInterval(_interval);

          _cycle(_config.direction);
        });
      }

      document.addEventListener('visibilitychange', _handleVisibilityChange, false);
      window.addEventListener('resize', function () {
        var _index = 0,
            width = parseFloat(document.body.clientWidth);

        _states.forEach(function (item, index, arr) {
          if (width >= _states[index].minWidth) _index = index;
        });

        if (_index !== _getActive()) {
          _setActive();

          _refresh();
        }
      });
    }; // инициализация


    _setUpListeners();

    if (document.visibilityState === "visible") {
      _cycle(_config.direction);
    }

    _setActive();

    return {
      right: function right() {
        _transformItem('right');
      },
      left: function left() {
        _transformItem('left');
      },
      stop: function stop() {
        _config.isCycling = false;
        clearInterval(_interval);
      },
      cycle: function cycle() {
        _config.isCycling = true;
        clearInterval(_interval);

        _cycle();
      }
    };
  };
}();

var slider = multiItemSlider('.slider-2', {
  isCycling: true
});
'use strict';

var multiItemSlider = function () {
  return function (selector, config) {
    var _mainElement = document.querySelector(selector),
        // основный элемент блока
    _sliderWrapper = _mainElement.querySelector('.slider__wrapper'),
        // обертка для .slider-item
    _sliderItems = _mainElement.querySelectorAll('.slider__item'),
        // элементы (.slider-item)
    _sliderControls = _mainElement.querySelectorAll('.slider__control'),
        // элементы управления
    _sliderControlLeft = _mainElement.querySelector('.slider__control_left'),
        // кнопка "LEFT"
    _sliderControlRight = _mainElement.querySelector('.slider__control_right'),
        // кнопка "RIGHT"
    _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width),
        // ширина обёртки
    _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width),
        // ширина одного элемента    
    _positionLeftItem = 0,
        // позиция левого активного элемента
    _transform = 0,
        // значение транфсофрмации .slider_wrapper
    _step = _itemWidth / _wrapperWidth * 100,
        // величина шага (для трансформации)
    _items = []; // массив элементов  
    // наполнение массива _items


    _sliderItems.forEach(function (item, index) {
      _items.push({
        item: item,
        position: index,
        transform: 0
      });
    });

    var position = {
      getMin: 0,
      getMax: _items.length - 1
    };

    var _transformItem = function _transformItem(direction) {
      if (direction === 'right') {
        if (_positionLeftItem + _wrapperWidth / _itemWidth - 1 >= position.getMax) {
          return;
        }

        if (!_sliderControlLeft.classList.contains('slider__control_show')) {
          _sliderControlLeft.classList.add('slider__control_show');
        }

        if (_sliderControlRight.classList.contains('slider__control_show') && _positionLeftItem + _wrapperWidth / _itemWidth >= position.getMax) {
          _sliderControlRight.classList.remove('slider__control_show');
        }

        _positionLeftItem++;
        _transform -= _step;
      }

      if (direction === 'left') {
        if (_positionLeftItem <= position.getMin) {
          return;
        }

        if (!_sliderControlRight.classList.contains('slider__control_show')) {
          _sliderControlRight.classList.add('slider__control_show');
        }

        if (_sliderControlLeft.classList.contains('slider__control_show') && _positionLeftItem - 1 <= position.getMin) {
          _sliderControlLeft.classList.remove('slider__control_show');
        }

        _positionLeftItem--;
        _transform += _step;
      }

      _sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
    }; // обработчик события click для кнопок "назад" и "вперед"


    var _controlClick = function _controlClick() {
      var direction = this.classList.contains('slider__control_right') ? 'right' : 'left';

      _transformItem(direction);
    };

    var _setUpListeners = function _setUpListeners() {
      // добавление к кнопкам "назад" и "вперед" обрботчика _controlClick для событя click
      _sliderControls.forEach(function (item) {
        item.addEventListener('click', _controlClick);
      });
    }; // инициализация


    _setUpListeners();

    return {
      right: function right() {
        // метод right
        _transformItem('right');
      },
      left: function left() {
        // метод left
        _transformItem('left');
      }
    };
  };
}();

var slider = multiItemSlider('.slider');