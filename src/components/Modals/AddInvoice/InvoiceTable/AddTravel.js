import React, { PureComponent } from 'react';
import { Divider, Form, Row, Button } from 'antd';
import cs from 'classnames';
import fields from '@/utils/fields';
import moment from 'moment';
import style from '../index.scss';
import AddTravelForm from './AddTravelForm';
import EasyForm from '../../FormScame.js';
import { getParams } from '../../../../utils/common';

const { aliTraffic } = fields;
@Form.create()
class AddTravel extends PureComponent {

  state = {
    subTrip: [],
  }

  componentDidMount(){
    this.props.onGetFunc(this.onSubmit);
  }

  onGetTrip = (list) => {
    this.setState({
      subTrip: list,
    });
  }

  onSubmit = async() => {
    const resQ = this.easyForm.exportSubmit;
    const { aliCostAndI: { costArr, invoiceArr } } = this.props;
    const { subTrip } = this.state;
    let params = {};
    const res = await resQ();
    const alitripCostCenterJson = costArr.filter(it => it.value === res.alitripCostCenterId);
    const alitripInvoiceTitleJson = invoiceArr.filter(it => it.value === res.alitripInvoiceTitleId);
    console.log('AddTravel -> onSubmit -> res', res);
    params = {
      ...res,
      subTrip,
      alitripCostCenterJson: JSON.stringify(alitripCostCenterJson),
      alitripInvoiceTitleJson: JSON.stringify(alitripInvoiceTitleJson)
    };
    console.log(res);
    console.log('子行程', subTrip);
    return new Promise(resolve => {
      resolve(params);
    });
    // this.onOk();
  }

  onDel = (e, key) => {
    e.stopPropagation();
    const { subTrip } = this.state;
    this.setState({
      subTrip: subTrip.filter(it => it.key !== key),
    });
  }

  render () {
    const { aliTripFields } = this.props;
    console.log('阿里商旅', aliTripFields);
    const { subTrip } = this.state;
    return (
      <div>
        <Divider type="horizontal" />
        <div style={{paddingTop: '24px'}}>
          <div className={style.header}>
            <div className={style.line} />
            <span>行程</span>
          </div>
        </div>
        {
          subTrip.length === 0 ?
            <div style={{textAlign: 'center'}} className={style.addbtn}>
              <AddTravelForm onOk={this.onGetTrip}>
                <Button
                  icon="plus"
                  style={{ width: '231px', marginBottom: '16px' }}
                  key="handle"
                >
                  添加行程
                </Button>
              </AddTravelForm>
            </div>
            :
            <div className={style.travelDetail}>
              <div className={style.singleBtn}>
                <AddTravelForm onOk={this.onGetTrip} list={subTrip}>
                  <span className="fs-14 c-black-65">+ 编辑行程</span>
                </AddTravelForm>
              </div>
              <>
                {
                  subTrip.map(item => (
                    <div className={style.singleContent} key={item.startDate}>
                      <div className={style.iconImg}>
                        <img
                          src={getParams({res: item.traffic, list: aliTraffic, key: 'label', resultKey: 'icon'})}
                          alt="模式"
                        />
                      </div>
                      <div className="m-t-16">
                        <p className="c-black-85 fs-16 fw-500 m-b-6">{item.startCity} - {item.endCity}</p>
                        <p className="c-black-65 fs-14">
                          {moment(Number(item.startDate)).format('YYYY-MM-DD')} - {moment(Number(item.endDate)).format('YYYY-MM-DD')}
                        </p>
                      </div>
                      <i className={cs(style.singleDel, 'iconfont', 'icona-shanchu3x')} onClick={e => this.onDel(e, e.key)} />
                    </div>
                  ))
                }
              </>
            </div>
        }
        <Row>
          <EasyForm
            isModal={false}
            fields={aliTripFields}
            ref={ref => { this.easyForm = ref; }}
            mode="plain"
            separate
          />
        </Row>
      </div>
    );
  }
}

export default AddTravel;
