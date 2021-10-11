import React, { PureComponent } from 'react';
import { Form, Switch } from 'antd';

class OtherRule extends PureComponent {
 render() {
   return (
     <div>
       <Form>
         <Form.Item label="双人合住标准上浮：">
           <Switch />
         </Form.Item>
       </Form>
     </div>
   );
 }
}

export default OtherRule;
