import React from 'react';
import ReactDOM from 'react-dom';

import './Backdrop.css';

const backdrop = props =>
  ReactDOM.createPortal(
    <div
      // ใช้ ternary operator; "? :" เช็คถ้า true className จะเป็น 'backdrop open'
      // ถ้า false จะเป็น 'backdrop ' แต่ในตัวอย่างที่นี้เป็น undefine
      className={['backdrop', props.open ? 'open' : ''].join(' ')}
      onClick={props.onClick}
    />,
    document.getElementById('backdrop-root')
  );

export default backdrop;
