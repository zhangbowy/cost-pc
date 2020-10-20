/* eslint-disable no-shadow */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-use-before-define */
// import Common from './common';

const wave = {
  init() {
    // 组件配置
    const colors = [
      'rgba(0,199,193,0.05)',
      'rgba(0,199,193,0.12)',
      'rgba(0,199,160,0.24)'
    ];
    const componentWidth = '100%'; // 组件宽度，int or 100%(相当于父元素的宽度)
    const componentHeight = '100%'; // 组件高度，int or 100%
    // 波浪配置
    const width = 1200; // 宽度
    const height = 180; // 高度
    const deepth = 150; // 深度
    const speed = 0.5; // 速度
    const speedOffset = 1;
    const focus = 0.5; // 波峰集中程度 [-1, 1]
    const offset = -width * 0.8; // 不同波浪的差
    let waveCount = 0; // 波浪数
    const x = [0, offset, offset * 2];
    let cacheData = ['', '', ''];
    const svgWave = document.querySelector('#svg-area');
    const paths = svgWave.querySelectorAll('path');
    const path1 = paths[0];
    const path2 = paths[1];
    const path3 = paths[2];

    // if (Common.Browser.IsMobile() && Common.Screen.IsXS()) {
    //   width /= 2;
    // }

    // 配置
    config();
    const oldFunc = window.onresize;
    window.onresize = function() {
      oldFunc && oldFunc();
      config(true);
    };
    // 启动
    requestAnimationFrame(wave);

    function config(resize) {
      cacheData = ['', '', ''];
      svgWave.setAttribute('width', componentWidth);
      svgWave.setAttribute('height', componentHeight);
      const pxWidth =
        componentWidth === '100%'
          ? svgWave.parentNode.clientWidth
          : componentWidth;
      waveCount = Math.ceil(pxWidth / width / 2) + 3; // + 1是考虑到第二个波浪向左移，需要预留宽度
      if (resize === true) return;
      path1.setAttribute('fill', colors[0]);
      path2.setAttribute('fill', colors[1]);
      path3.setAttribute('fill', colors[2]);
    }

    function wave() {
      path1.setAttribute('d', generateData(0));
      path2.setAttribute('d', generateData(1));
      path3.setAttribute('d', generateData(2));
      x[0] -= speed / 2;
      x[1] -= (speed + speedOffset) / 2;
      x[2] -= (speed + speedOffset * 2) / 2;
      requestAnimationFrame(wave);
    }

    // 动态生成path.d
    function generateData(index) {
      // 起点
      // 重置起点形成循环
      if (x[index] % (width * 2) === 0) {
        x[index] = 0;
      }
      const startX = x[index];
      const startY = height;
      const start = [startX, startY].join(',');
      if (cacheData[index] === '') {
        // 波浪 = 贝塞尔曲线组合（正 + 倒）
        const C_X1 = (width / 4) * (focus + 1);
        let C_Y1 = -height / 2;
        let C_Y2 = -height / 2;
        const C_X2 = width - C_X1;
        const C_X = width;
        const C_Y = 0;
        const CURVETOUP = [C_X1, C_Y1, C_X2, C_Y2, C_X, C_Y].join(' ');
        // eslint-disable-next-line no-multi-assign
        C_Y1 = C_Y2 = height / 2;
        const curvetoDown = [C_X1, C_Y1, C_X2, C_Y2, C_X, C_Y].join(' ');
        let curvetoData = '';
        for (let i = 0; i < waveCount; i++) {
          curvetoData = `${curvetoData  }c${  CURVETOUP  }c${  curvetoDown}`;
        }
        // 闭合
        const end = `l0,${  deepth  } l-${  waveCount * width * 2  },0Z`;
        cacheData[index] = [curvetoData, end].join('');
      }
      return ['M', start, cacheData[index]].join('');
    }
  }
};

export default wave;
