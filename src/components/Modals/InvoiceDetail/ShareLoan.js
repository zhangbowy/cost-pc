import React, { PureComponent } from 'react';
import { Modal, Popover, TreeSelect, Tree } from 'antd';
import { connect } from 'dva';
import addAvatars from '@/assets/img/addAvatar.png';
import dept from '@/assets/img/dept.png';
import style from './index.scss';
import Avatar from '../../AntdComp/Avatar';

const { TreeNode } = Tree;
const { SHOW_PARENT } = TreeSelect;
@connect(({ costGlobal, session }) => ({
  deptTree: costGlobal.deptTree,
  userInfo: session.userInfo
}))
class ShareLoan extends PureComponent {

  constructor(props){
    super(props);
    this.state = {
      visible: true,
      list: [],
      popVisible: false,
      selectRows: [],
      selectKey: []
    };
  }

  componentDidMount(){
    this.props.dispatch({
      type: 'costGlobal/deptTree',
      payload: {},
    });
  }

  onCancel = () => {
    this.setState({
      visible: false,
    });
  }

  onShow = () => {
    this.setState({
      visible: true,
    });
  }

   // 循环渲染树结构
   loop = data => data.map(item => {
    const { userInfo } = this.props;
    if (item.children && item.children.length) {
      return (
        <TreeNode
          key={item.type ? item.key : item.value}
          label={item.title}
          value={item.type ? item.key : item.value}
          dataRef={item}
          disabled={userInfo.dingUserId === item.value}
          title={(
            <div>
              {
                item.type ?
                  <Avatar avatar={item.avatar} name={item.title} size={24} />
                  :
                  null
              }
              <span>{item.title}</span>
            </div>
          )}
        >
          {this.loop(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode
      key={item.type ? item.key : item.value}
      label={item.title}
      value={item.type ? item.key : item.value}
      dataRef={item}
      disabled={userInfo.dingUserId === item.value}
      title={(
        <div className="icons">
          {
            item.type !== 0 &&
            <Avatar avatar={item.avatar} name={item.title} size={24} />
          }
          <span className="m-l-8" style={{verticalAlign: 'middle'}}>{item.title}</span>
        </div>
      )}
    />;
  });

  onChangeNode = (value) => {
  console.log('ShareLoan -> onChangeNode -> value', value);
    this.setState({
      selectKey: value,
    });
  }

  confirm = () => {
    const { selectKey, selectRows } = this.state;
    const newArr = [];
    selectRows.forEach(it => {
      if (selectKey.includes(it.key) || selectKey.includes(it.value)) {
        const obj = {
          key: it.key,
          deptId: it.deptId || it.value,
          deptName: it.deptName || it.title
        };
        if (it.type) {
          Object.assign(obj, {
            userId: it.value,
            userName: it.title,
            avatar: it.avatar
          });
        }
        newArr.push(obj);
      }
    });
    console.log('走了没', newArr);
    this.setState({
      list: newArr,
      popVisible: false,
    });
  }

  onSelect = (value, info) => {
    console.log('选中de', info);
    console.log('选中de', value);
    const { props: { dataRef } } = info;
    const { selectRows } = this.state;
    console.log('ShareLoan -> onSelect -> selectRows', selectRows);
    this.setState({
      selectRows: [...selectRows, dataRef],
    });
  }

  onDel = (key, e) => {
    e.stopPropagation();
    const { selectKey, selectRows, list } = this.state;
    this.setState({
      selectKey: selectKey.filter(it => it.key !== key),
      selectRows: selectRows.filter(it => it.key !== key),
      list: list.filter(it => it.key !== key),
    });
  }

  onOk = () => {
    this.props.dispatch({
      type: 'costGlobal/shareLoan',
      payload: {},
    });
  }

  render() {
    const { children, deptTree } = this.props;
    const { visible, list, popVisible } = this.state;
    return (
      <span>
        <span onClick={() => this.onShow()}>{children}</span>
        <Modal
          visible={visible}
          title="添加共享人"
          onCancel={() => this.onCancel()}
          width="580px"
          bodyStyle={{
            height: '292px',
            padding: '16px 24px',
            overflow: 'scroll'
          }}
          onOk={() => this.onOk()}
        >
          <p className="fs-14 c-black-65">共享是将该借款单共享给其他人，共享后其他人也可核销该借款或手动还款。适用于部门备用金申请等情况</p>
          <div className={style.shareAdd}>
            <div className={style.addBtn}>
              <Popover
                trigger="click"
                overlayClassName={style.popStyle}
                icon={false}
                placement="bottomLeft"
                content={(
                  <div style={{height: '360px', width: '100%', position: 'relative'}}>
                    <div className="m-l-12 m-r-12">
                      <TreeSelect
                        autoClearSearchValue
                        treeNodeFilterProp="label"
                        placeholder='请选择'
                        style={{width: '100%'}}
                        dropdownStyle={{height: '250px'}}
                        treeCheckable
                        getPopupContainer={triggerNode => triggerNode.parentNode}
                        showSearch
                        onChange={this.onChangeNode}
                        onSelect={this.onSelect}
                        treeNodeLabelProp="label"
                        treeDefaultExpandedKeys={deptTree.length ?  [deptTree[0].key] : []}
                        showCheckedStrategy={SHOW_PARENT}
                      >
                        { this.loop(deptTree) }
                      </TreeSelect>
                    </div>
                    <div className={style.footers}>
                      <div className={style.footCont}>
                        <div style={{display: 'flex'}}>
                          <div
                            className={style.footerBtns}
                            onClick={() => this.setState({popVisible: false})}
                            style={{background: '#fff', color: 'rgba(0, 0, 0, 0.65)', border: '1px solid #D9D9D9', marginRight: '8px'}}
                          >
                            取消
                          </div>
                          <div onClick={this.confirm} className={style.footerBtns}>确定</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                title={null}
                visible={popVisible}
              >
                <img src={addAvatars} alt="添加" onClick={() => this.setState({ popVisible: true })} />
              </Popover>
            </div>
            {
              list.map(it => (
                <div className={style.peoples} key={it.key}>
                  {
                    it.userName ?
                      <Avatar name={it.userName} size={40} avatar={it.avatar} />
                      :
                      <img src={dept} alt="部门" style={{ width: '40px', height: '40px' }} />
                  }
                  <span className={style.names}>{it.userName || it.deptName}</span>
                  <i className="iconfont icondelete_fill" onClick={e => this.onDel(it.key, e)} />
                </div>
              ))
            }
          </div>
        </Modal>
      </span>
    );
  }
}

export default ShareLoan;
