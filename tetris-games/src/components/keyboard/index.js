import React from 'react';
import Immutable from 'immutable';
import propTypes from 'prop-types';

import style from './index.less';
import Button from './button';
import store from '../../store';
import todo from '../../control/todo';
import { i18n, lan } from '../../unit/const';
const touchEventCatch = {}; // 对于手机操作, 触发了touchstart, 将作出记录, 不再触发后面的mouse事件

const touchEv = (e) =>{
  if (e.preventDefault) {
    e.preventDefault();
  }
}
export default class Keyboard extends React.Component {
  componentWillUnmount() {
    document.removeEventListener('touchstart', touchEv, true);

    // 解决issue: https://github.com/chvin/react-tetris/issues/24
    document.removeEventListener('touchend', touchEv, true);

    // 阻止双指放大
    document.removeEventListener('gesturestart', touchEv);

    document.removeEventListener('mousedown', touchEv, true);

    Object.keys(todo).forEach((key) => {
      this[`dom_${key}`].dom.removeEventListener('mousedown', () => {
        if (touchEventCatch[key] === true) {
          return;
        }
        todo[key].down(store);
        mouseDownEventCatch[key] = true;
      }, true);
      this[`dom_${key}`].dom.removeEventListener('mouseup', () => {
        if (touchEventCatch[key] === true) {
          touchEventCatch[key] = false;
          return;
        }
        todo[key].up(store);
        mouseDownEventCatch[key] = false;
      }, true);
      this[`dom_${key}`].dom.removeEventListener('mouseout', () => {
        if (mouseDownEventCatch[key] === true) {
          todo[key].up(store);
        }
      }, true);
      this[`dom_${key}`].dom.removeEventListener('touchstart', () => {
        touchEventCatch[key] = true;
        todo[key].down(store);
      }, true);
      this[`dom_${key}`].dom.removeEventListener('touchend', () => {
        todo[key].up(store);
      }, true);
    });
  }
  componentDidMount() {

    // 在鼠标触发mousedown时, 移除元素时可以不触发mouseup, 这里做一个兼容, 以mouseout模拟mouseup
    document.addEventListener('touchstart', touchEv, true);

    // 解决issue: https://github.com/chvin/react-tetris/issues/24
    document.addEventListener('touchend', touchEv, true);

    // 阻止双指放大
    document.addEventListener('gesturestart', touchEv);

    document.addEventListener('mousedown', touchEv, true);

    Object.keys(todo).forEach((key) => {
      this[`dom_${key}`].dom.addEventListener('mousedown', () => {
        if (touchEventCatch[key] === true) {
          return;
        }
        todo[key].down(store);
        mouseDownEventCatch[key] = true;
      }, true);
      this[`dom_${key}`].dom.addEventListener('mouseup', () => {
        if (touchEventCatch[key] === true) {
          touchEventCatch[key] = false;
          return;
        }
        todo[key].up(store);
        mouseDownEventCatch[key] = false;
      }, true);
      this[`dom_${key}`].dom.addEventListener('mouseout', () => {
        if (mouseDownEventCatch[key] === true) {
          todo[key].up(store);
        }
      }, true);
      this[`dom_${key}`].dom.addEventListener('touchstart', () => {
        touchEventCatch[key] = true;
        todo[key].down(store);
      }, true);
      this[`dom_${key}`].dom.addEventListener('touchend', () => {
        todo[key].up(store);
      }, true);
    });
  }
  shouldComponentUpdate({ keyboard, filling }) {
    return !Immutable.is(keyboard, this.props.keyboard) || filling !== this.props.filling;
  }
  render() {
    const keyboard = this.props.keyboard;
    return (
      <div
        className={style.keyboard}
        style={{
          marginTop: 20 + this.props.filling,
        }}
      >
        <Button
          color="blue"
          size="s1"
          top={0}
          left={124}
          arrow="translate(0, 63px)"
          position
          label={`${i18n.pause[lan]}(P)`}
          active={keyboard.get('pause')}
          ref={(c) => { this.dom_p = c; }}

        />

        <Button
          color="blue"
          size="s1"
          top={180}
          left={124}
          label={i18n.drop[lan]}
          arrow="translate(0,-71px) rotate(180deg)"
          // active={keyboard.get('down')}
          // ref={(c) => { this.dom_down = c; }}

          // label={`${i18n.drop[lan]} (SPACE)`}
          active={keyboard.get('drop')}
          ref={(c) => { this.dom_space = c; }}
        />
        <Button
          color="blue"
          size="s1"
          top={90}
          left={34}
          label={i18n.left[lan]}
          arrow="translate(60px, -12px) rotate(270deg)"
          active={keyboard.get('left')}
          ref={(c) => { this.dom_left = c; }}
        />
        <Button
          color="blue"
          size="s1"
          top={90}
          left={214}
          label={i18n.right[lan]}
          arrow="translate(-60px, -12px) rotate(90deg)"
          active={keyboard.get('right')}
          ref={(c) => { this.dom_right = c; }}
        />
        <Button
          color="blue"
          size="s0"
          top={100}
          left={362}
          // label={`${i18n.drop[lan]} (SPACE)`}
          // active={keyboard.get('drop')}
          // ref={(c) => { this.dom_space = c; }}

          label={i18n.rotation[lan]}
          active={keyboard.get('rotate')}
          ref={(c) => { this.dom_rotate = c; }}
        />
        {/* <Button
          color="red"
          size="s2"
          top={0}
          left={196}
          label={`${i18n.reset[lan]}(R)`}
          active={keyboard.get('reset')}
          ref={(c) => { this.dom_r = c; }}
        /> */}
        {/* <Button
          color="green"
          size="s2"
          top={0}
          left={106}
          label={`${i18n.sound[lan]}(S)`}
          active={keyboard.get('music')}
          ref={(c) => { this.dom_s = c; }}
        /> */}
        <Button
          color="green"
          size="s2"
          top={0}
          left={496}
          label={`${i18n.sound[lan]}(S)`}
          active={keyboard.get('music')}
          ref={(c) => { this.dom_s = c; }}
        />
        {/* <Button
          color="green"
          size="s2"
          top={0}
          left={16}
          label={`${i18n.pause[lan]}(P)`}
          active={keyboard.get('pause')}
          ref={(c) => { this.dom_p = c; }}
        /> */}
      </div>
    );
  }
}

Keyboard.propTypes = {
  filling: propTypes.number.isRequired,
  keyboard: propTypes.object.isRequired,
};
