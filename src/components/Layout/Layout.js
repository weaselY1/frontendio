import React, { Fragment } from 'react';

import './Layout.css';

const layout = props => (
  <Fragment>
    <header className="main-header">{props.header}</header>
    {props.mobileNav}
    // props.children คือ HTML child component ที่ element นี้ครอบอยู่นี้
    <main className="content">{props.children}</main>
  </Fragment>
);

export default layout;
