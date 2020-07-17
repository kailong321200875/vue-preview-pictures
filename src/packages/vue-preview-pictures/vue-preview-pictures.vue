<template>
  <transition name="viewer-fade">
    <div v-show="show" tabindex="-1" ref="image-viewer__wrapper" class="image-viewer__wrapper" :style="{ 'z-index': zIndex }">
      <div class="image-viewer__mask"></div>
      <!-- CLOSE -->
      <span class="image-viewer__btn image-viewer__close" @click="hide">
        <i class="iconfont icon-guanbi"></i>
      </span>
      <!-- ARROW -->
      <template v-if="!isSingle">
        <span
          class="image-viewer__btn image-viewer__prev"
          :class="{ 'is-disabled': !infinite && isFirst }"
          @click="prev">
          <i class="iconfont icon-arrow-lift"/>
        </span>
        <span
          class="image-viewer__btn image-viewer__next"
          :class="{ 'is-disabled': !infinite && isLast }"
          @click="next">
          <i class="iconfont icon-arrow-right"/>
        </span>
      </template>
      <!-- ACTIONS -->
      <div class="image-viewer__btn image-viewer__actions">
        <div class="image-viewer__actions__inner">
          <i class="iconfont icon-sousuobianxiao" @click="handleActions('zoomOut')"></i>
          <i class="iconfont icon-sousuofangda" @click="handleActions('zoomIn')"></i>
          <i class="image-viewer__actions__divider"></i>
          <i :class="mode.icon" @click="toggleMode"></i>
          <i class="image-viewer__actions__divider"></i>
          <i class="iconfont icon-RectangleCopy" @click="handleActions('anticlocelise')"></i>
          <i class="iconfont icon-RectangleCopy1" @click="handleActions('clocelise')"></i>
        </div>
      </div>
      <!-- CANVAS -->
      <div class="image-viewer__canvas">
        <img
          v-for="(url, i) in list"
          v-if="i === index"
          ref="img"
          class="image-viewer__img"
          :key="url"
          :src="currentImg"
          :style="imgStyle"
          @load="handleImgLoad"
          @error="handleImgError"
          @mousedown="handleMouseDown"
          @click="select">
      </div>
    </div>
  </transition>
</template>

<script>
import { on, off } from '@/utils/dom';
import { rafThrottle, isFirefox } from '@/utils/util';
import '@/assets/iconfont/iconfont.css'

const Mode = {
  CONTAIN: {
    name: 'contain',
    icon: 'iconfont icon-quanping'
  },
  ORIGINAL: {
    name: 'original',
    icon: 'iconfont icon-bi'
  }
};

const mousewheelEventName = isFirefox() ? 'DOMMouseScroll' : 'mousewheel';

export default {
  name: 'PreviewPic',

  data() {
    return {
      index: 0,
      show: false,
      list: [],
      zIndex: 2000,
      infinite: true,
      loading: false,
      onClose: null,
      onSelect: null,
      mode: Mode.CONTAIN,
      transform: {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      }
    };
  },
  computed: {
    isSingle() {
      return this.list.length <= 1;
    },
    isFirst() {
      return this.index === 0;
    },
    isLast() {
      return this.index === this.list.length - 1;
    },
    currentImg() {
      return this.list[this.index];
    },
    imgStyle() {
      const { scale, deg, offsetX, offsetY, enableTransition } = this.transform;
      const style = {
        transform: `scale(${scale}) rotate(${deg}deg)`,
        transition: enableTransition ? 'transform .3s' : '',
        'margin-left': `${offsetX}px`,
        'margin-top': `${offsetY}px`
      };
      if (this.mode === Mode.CONTAIN) {
        style.maxWidth = style.maxHeight = '100%';
      }
      return style;
    }
  },
  watch: {
    index: {
      handler: function(val) {
        this.reset();
      }
    },
    currentImg(val) {
      this.$nextTick(_ => {
        const $img = this.$refs.img[0];
        if (!$img.complete) {
          this.loading = true;
        }
      });
    },
    show: {
      handler: function(val) {
        if (val) {
          this.$nextTick(() => {
            this.$refs['image-viewer__wrapper'].focus();
            document.body.style.overflow = 'hidden';
            this.deviceSupportInstall();
          })
        } else {
          this.$nextTick(() => {
            document.body.style.overflow = 'auto';
            this.deviceSupportUninstall();
          })
        }
      }
    }
  },
  methods: {
    hide() {
      this.show = false
      if (typeof this.onClose === 'function') {
        this.onClose(this.index);
      }
    },
    select() {
      if (typeof this.onSelect === 'function') {
        this.onSelect(this.index);
      }
    },
    deviceSupportInstall() {
      this._keyDownHandler = rafThrottle(e => {
        const keyCode = e.keyCode;
        switch (keyCode) {
          // ESC
          case 27:
            this.hide();
            break;
          // SPACE
          case 32:
            this.toggleMode();
            break;
          // LEFT_ARROW
          case 37:
            this.prev();
            break;
          // UP_ARROW
          case 38:
            this.handleActions('zoomIn');
            break;
          // RIGHT_ARROW
          case 39:
            this.next();
            break;
          // DOWN_ARROW
          case 40:
            this.handleActions('zoomOut');
            break;
        }
      });
      this._mouseWheelHandler = rafThrottle(e => {
        const delta = e.wheelDelta ? e.wheelDelta : -e.detail;
        if (delta > 0) {
          this.handleActions('zoomIn', {
            zoomRate: 0.015,
            enableTransition: false
          });
        } else {
          this.handleActions('zoomOut', {
            zoomRate: 0.015,
            enableTransition: false
          });
        }
      });
      on(document, 'keydown', this._keyDownHandler);
      on(document, mousewheelEventName, this._mouseWheelHandler);
    },
    deviceSupportUninstall() {
      off(document, 'keydown', this._keyDownHandler);
      off(document, mousewheelEventName, this._mouseWheelHandler);
      this._keyDownHandler = null;
      this._mouseWheelHandler = null;
    },
    handleImgLoad(e) {
      this.loading = false;
    },
    handleImgError(e) {
      this.loading = false;
      e.target.alt = '加载失败';
    },
    handleMouseDown(e) {
      if (this.loading || e.button !== 0) return;

      const { offsetX, offsetY } = this.transform;
      const startX = e.pageX;
      const startY = e.pageY;
      this._dragHandler = rafThrottle(ev => {
        this.transform.offsetX = offsetX + ev.pageX - startX;
        this.transform.offsetY = offsetY + ev.pageY - startY;
      });
      on(document, 'mousemove', this._dragHandler);
      on(document, 'mouseup', ev => {
        off(document, 'mousemove', this._dragHandler);
      });

      e.preventDefault();
    },
    reset() {
      this.transform = {
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      };
    },
    toggleMode() {
      if (this.loading) return;
      const modeNames = Object.keys(Mode);
      // const modeValues = Object.values(Mode);
      const modeValues = Object.keys(Mode).map(e => {
        return Mode[e]
      });

      const index = modeValues.indexOf(this.mode);
      const nextIndex = (index + 1) % modeNames.length;
      this.mode = Mode[modeNames[nextIndex]];
      this.reset();
    },
    prev() {
      if (this.isFirst && !this.infinite) return;
      const len = this.list.length;
      this.index = (this.index - 1 + len) % len;
    },
    next() {
      if (this.isLast && !this.infinite) return;
      const len = this.list.length;
      this.index = (this.index + 1) % len;
    },
    handleActions(action, options = {}) {
      if (this.loading) return;
      const { zoomRate, rotateDeg, enableTransition } = {
        zoomRate: 0.2,
        rotateDeg: 90,
        enableTransition: true,
        ...options
      };
      const { transform } = this;
      switch (action) {
        case 'zoomOut':
          if (transform.scale > 0.2) {
            transform.scale = parseFloat((transform.scale - zoomRate).toFixed(3));
          }
          break;
        case 'zoomIn':
          transform.scale = parseFloat((transform.scale + zoomRate).toFixed(3));
          break;
        case 'clocelise':
          transform.deg += rotateDeg;
          break;
        case 'anticlocelise':
          transform.deg -= rotateDeg;
          break;
      }
      transform.enableTransition = enableTransition;
    }
  }
};
</script>

<style lang="scss" scoped>
  .iconfont {
    font-size: 20px;
  }
  .icon-RectangleCopy,
  .icon-RectangleCopy1 {
    font-size: 24px;
  }
  .icon-guanbi {
    font-size: 40px;
    color: #fff;
  }
  .image-viewer__wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  .image-viewer__btn {
    position: absolute;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    opacity: .8;
    cursor: pointer;
    box-sizing: border-box;
    user-select: none;
  }

  .image-viewer__close {
    top: 40px;
    right: 40px;
    width: 40px;
    height: 40px;
    font-size: 40px;
  }

  .image-viewer__canvas {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

 .image-viewer__actions {
    left: 50%;
    bottom: 30px;
    transform: translateX(-50%);
    width: 282px;
    height: 44px;
    padding: 0 23px;
    background-color: #606266;
    border-color: #fff;
    border-radius: 22px;

    .image-viewer__actions__inner {
      width: 100%;
      height: 100%;
      text-align: justify;
      cursor: default;
      font-size: 23px;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
  }

  .image-viewer__prev {
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    font-size: 24px;
    color: #fff;
    background-color: #606266;
    border-color: #fff;
    left: 40px;
  }

  .image-viewer__next {
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    font-size: 24px;
    color: #fff;
    background-color: #606266;
    border-color: #fff;
    right: 40px;
    text-indent: 2px;
  }

  .image-viewer__mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: .5;
    background: #000;
  }


.viewer-fade-enter-active {
  animation: viewer-fade-in .3s;
}

.viewer-fade-leave-active {
  animation: viewer-fade-out .3s;
}

@keyframes viewer-fade-in {
  0% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes viewer-fade-out {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
}

</style>
