import React from 'react';
import { Tooltip } from 'antd';

const DisabledTooltip = ({ name, title }) => {
 return (
   <Tooltip title={title}>
     <span className="c-black-25" style={{ cursor: 'pointer' }}>{name}</span>
   </Tooltip>
 );
};

export default DisabledTooltip;
