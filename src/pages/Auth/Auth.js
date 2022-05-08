import React from 'react';
import { Button } from 'antd';

import './Auth.css';

const auth = props => {
  return (
    <section className="auth-form">
      <Button type="primary">Button</Button>
      {props.children}
    </section>
  )
}

export default auth;
