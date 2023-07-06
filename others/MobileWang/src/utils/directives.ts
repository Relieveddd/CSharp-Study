import type { DirectiveBinding, App } from "vue";

import { $random } from "../utils";

const fn = (el: HTMLElement, binding: DirectiveBinding) => {
  setTimeout(() => {
    const { color = "#cfb45c", size = 10, num = 35, down = false, enable = true } = binding.value || {};

    const clear = (el: HTMLElement) => {
      const list = el.querySelectorAll(".particle-item");
      Array.from(list).forEach((item) => {
        item.remove();
      });
    };
    if (enable) {
      clear(el);
      const box = el;
      const box_width = box.offsetWidth;
      const box_height = box.offsetHeight;

      if (down) {
        document.styleSheets[0].insertRule(
          `
      @keyframes particle-rise-${box_height} {
        0% {
          transform: translateY(-${box_height}px) translateZ(0);
          opacity: 0;
        }
        50% {
          transform: translateY(${box_height / 2}px) translateZ(0);
          opacity: 1;
        }
        100% {
          transform: translateY(${box_height}px) translateZ(0);
          opacity: 0;
        }
      }
      `,
          document.styleSheets[0].cssRules.length
        );
      } else {
        document.styleSheets[0].insertRule(
          `
        @keyframes particle-rise-${box_height} {
          0% {
            transform: translateY(0px) translateZ(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-${box_height / 2}px) translateZ(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-${box_height}px) translateZ(0);
            opacity: 0;
          }
        }
        `,
          document.styleSheets[0].cssRules.length
        );
      }
      for (let i = 0; i < num; i++) {
        const p = document.createElement("span");
        p.classList.add("particle-item");

        const style = `
      position: absolute;
      background-color: ${color};
      pointer-events: none;
      width: ${size}px;
      height: ${size}px;
      bottom: 0;
      opacity: 0;
      box-shadow: 0 0 10px 0 ${color};
      filter: brightness(200%);
      `;
        const left = $random(0, box_width - size);
        const scale = $random(0.25, 0.75, 1);
        const time = $random(1, 3, 1);
        const delay = $random(0, 5, 1);
        p.style.cssText = style;
        p.style.left = `${left}px`;
        p.style.scale = scale.toString();
        p.style.animation = `particle-rise-${box_height} ${time}s linear infinite`;
        p.style.animationDelay = delay + "s";

        box.appendChild(p);
      }
    } else {
      clear(el);
    }
  }, 500);
};
const particle = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    fn(el, binding);
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    if (binding.value.lock) return;
    fn(el, binding);
  },
};

/* 底部渐变 */
const maskGradient = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { color = "rgba(0, 0, 0, 0.75)", rotate = "0deg", num1 = "0%", num2 = "50%" } = binding.value || {};
    const mask = document.createElement("div");
    mask.style.cssText = `
    position: absolute;
    inset:0;
    background-image: linear-gradient(${rotate}, ${color} ${num1}, transparent ${num2});
    pointer-events: none;
    `;
    el.appendChild(mask);
  },
};

/* 卡片扫光 */
const sweepLight = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    setTimeout(() => {
      const auto = binding.value !== false;
      const light = document.createElement("div");
      el.style.position = "relative";
      light.style.cssText = `
      position: absolute;
      top: 0px;
      left: 0px;
      width: ${el.offsetWidth / 3}px;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.5);
      transform: skewX(45deg) translateX(${el.offsetWidth * 1.75}px);
      transition: all var(--time-2000);
      filter: blur(5px)
    `;
      el.appendChild(light);
      if (auto) {
        light.style.transitionDelay = ` ${binding.value}s`;
        light.style.transform = `skewX(45deg) translateX(${-el.offsetWidth * 1.25}px)`;
        setTimeout(() => {
          el.removeChild(light);
        }, 2000);
      } else {
        el.addEventListener("mouseenter", () => {
          light.style.transform = `skewX(45deg) translateX(${-el.offsetWidth * 1.5}px)`;
        });

        el.addEventListener("mouseleave", () => {
          light.style.transform = `skewX(45deg) translateX(${el.offsetWidth * 1.75}px)`;
        });
      }
    });
  },
};

/* 单行打字机 */
const typewriterSingle = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const lyb = el;
    const say = lyb.innerHTML;
    lyb.innerHTML = "";
    function again() {
      let timer: Interval = 0;
      let num = 0; //用于累加遍历字符串
      let text = ""; //用于输出在屏幕上
      lyb.innerHTML = "";
      timer = setInterval(() => {
        if (num >= say.length) {
          //如果文字输出完毕
          clearInterval(timer); //清除用于输出文字的计时器
          binding.value && binding.value();
          return;
        }
        text += say[num]; //遍历输出的文字
        lyb.innerHTML = text; //输出在屏幕上
        num++;
      }, 150);
    }
    setTimeout(() => {
      again();
    }, 750);
  },
};

/* 多行打字机 */
const typewriterMultiple = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const say = el.innerHTML;
    el.innerHTML = "";
    setTimeout(() => {
      let timer: Interval;
      let num = 0, //用于累加遍历字符串
        text = ""; //用于输出在屏幕上
      fn();
      function fn() {
        timer = setInterval(() => {
          if (num >= say.length) {
            //如果文字输出完毕
            clearInterval(timer); //清除用于输出文字的计时器
            binding.value && binding.value();
            return;
          }
          text += say[num]; //遍历输出的文字
          el.innerHTML = text; //输出在屏幕上
          num++;
        }, 50);
      }
    }, 750);
  },
};

/* 文字悬浮变色 */
const textHoverColor = {
  mounted(el: HTMLElement, { value = "black" }) {
    //需要给父盒子加相对定位或绝对定位
    const mask = document.createElement("div");
    const line = document.createElement("div");
    mask.innerHTML = el.innerHTML;
    mask.style.cssText = `
      z-index: 9;
      position: absolute;
      top: 0;
      left: 0;
      color: #fff;
      background-color: ${value};
      transition: all 0.35s;
      text-shadow: initial;
      -webkit-background-clip: text;
      clip-path: circle(75% at 50% 50%);
    `;
    const line_height = el.offsetHeight / 8;
    line.style.cssText = `
      z-index: 9;
      position: absolute;
      width: 0%;
      height: ${line_height}px;
      bottom: 0;
      color: transparent;
      background-color: #2980b9;
      transition: all 0.35s;
      left: 50%;
      transform: translate(-50%,5px);
      border-radius: ${line_height}px;
    `;
    window.addEventListener("resize", () => {
      const line_height = el.offsetHeight / 20;
      line.style.height = line_height + "px";
      line.style.borderRadius = line_height + "px";
    });

    el.appendChild(mask);
    el.appendChild(line);
    el.addEventListener("mouseenter", () => {
      mask.style.clipPath = "circle(0% at 50% 50%)";
      line.style.width = "100%";
    });
    el.addEventListener("mouseleave", () => {
      mask.style.clipPath = "circle(75% at 50% 50%)";
      line.style.width = "0%";
    });
  },
};

/* 元素支持拖动 */
const drag = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    el.style.userSelect = "none";
    el.style.position = "absolute";
    let x = 0;
    let y = 0;
    let startX = 0;
    let startY = 0;
    let moveX = 0;
    let moveY = 0;

    /* PC端 */
    el.addEventListener("mousedown", (e) => {
      x = e.pageX;
      y = e.pageY;
      startX = el.offsetLeft;
      startY = el.offsetTop;
      function fn(e: MouseEvent) {
        moveX = e.pageX - x;
        moveY = e.pageY - y;
        el.style.left = `${moveX + startX}px`;
        el.style.top = `${moveY + startY}px`;
        binding.value.fn(
          el,
          {
            x: el.getBoundingClientRect().left + el.offsetWidth / 2,
            y: el.getBoundingClientRect().top + el.offsetHeight / 2,
          },
          binding.value.index
        );
      }
      window.addEventListener("mousemove", fn);

      function up() {
        binding.value.fn(el, false, binding.value.index);
        window.removeEventListener("mousemove", fn);
        setTimeout(() => {
          window.removeEventListener("mouseup", up);
        });
      }
      window.addEventListener("mouseup", up);
    });

    /* 兼容移动端 */
    el.addEventListener("touchstart", (e) => {
      x = e.changedTouches[0].pageX;
      y = e.changedTouches[0].pageY;
      startX = el.offsetLeft;
      startY = el.offsetTop;
      function fn(e: TouchEvent) {
        moveX = e.changedTouches[0].pageX - x;
        moveY = e.changedTouches[0].pageY - y;
        el.style.left = `${moveX + startX}px`;
        el.style.top = `${moveY + startY}px`;
        binding.value.fn(
          el,
          {
            x: el.getBoundingClientRect().left + el.offsetWidth / 2,
            y: el.getBoundingClientRect().top + el.offsetHeight / 2,
          },
          binding.value.index
        );
      }
      window.addEventListener("touchmove", fn);

      function up(e: TouchEvent) {
        e.stopPropagation();
        binding.value.fn(el, false, binding.value.index);
        window.removeEventListener("touchmove", fn);
        setTimeout(() => {
          window.removeEventListener("touchend", up);
        });
      }
      window.addEventListener("touchend", up);
    });
  },
};

/* 自动获取焦点 */
const focus = {
  mounted(el: HTMLElement) {
    setTimeout(() => {
      el.focus();
    });
  },
};

interface Directives {
  [propName: string]: any;
}
const directives: Directives = {
  particle,
  maskGradient,
  sweepLight,
  textHoverColor,
  drag,
  typewriterSingle,
  typewriterMultiple,
  focus,
};

export default {
  install(app: App) {
    Object.keys(directives).forEach((key) => {
      app.directive(key, directives[key]);
    });
  },
};
