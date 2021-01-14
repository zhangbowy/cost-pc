import React, { Component } from 'react';
import { connect } from 'dva';
import withRouter from 'umi/withRouter';
import style from './index.scss';

@withRouter
@connect(({ session, loading }) => ({
	loading: loading.models.session,
	BasicSettingMenus: session.BasicSettingMenus
}))
class basicSetting extends Component {
	constructor(props) {
		super(props);
		this.state = {
			menus: []
		};
	}

	componentDidMount(){
		console.log(1111,this.props);
		this.props.dispatch({
			type: 'session/getBasicSettingMenus',
			payload:{
				id:'470539741596127233'
			},
		}).then(() => {
			console.log(111111,this.props.BasicSettingMenus);
			const menus = [];
			const menusMap = new Map();
			this.props.BasicSettingMenus.map((item) => {
				if(item.type === 3){
					menusMap.set(item.id,menus.length);
					const obj = {...item};
					obj.children = [];
					menus.push(obj);
				}
				return item;
			});
			console.log(menus);
			this.props.BasicSettingMenus.map((item) => {
				const obj = {...item};
				// if(item.menuName === '数据初始化'){
				// 	obj.url = 'basicSetting_Initialization';
				// }
				// if(item.menuName === "角色管理"){
				// 	obj.url = 'basicSetting_Initialization'
				// }
				if(item.type === 4){
					const index = menusMap.get(item.parentId);
					console.log(index);
					if(index || index === 0){
						if(menus[index].children){
							menus[index].children.push(obj);
						}
					}
				}
				return item;
			});
			console.log(111111,menus);
			this.setState({menus});
		});
	}

	loadmenu = (data) => {
		const that = this;
		return data.map(item => (
  <div
    className={style.card}
    onClick={() => that.goMenuUrl(item)}
    key={item.id}
  >
    <div className={style.card_left}>
      {
        item.icon &&
        <div className={`${style.iconImg} ${style[item.icon]}`}  />
      }
    </div>
    <div className={style.card_right} style={item.note?{}:{justifyContent:'center'}} >
      <div className={style.card_right_title}>{item.menuName}</div>
      {
        item.note &&
        <div className={style.card_right_content}>{item.note}</div>
      }
    </div>
  </div>
    ));
	}

	goMenuUrl(data){
		this.props.history.push({pathname:data.url.replace('_','/'), params: {selectUrl: this.props.location.pathname}});
	}

	render() {
		return (
  <div style={{padding:'0 20px 40px 24px',marginTop:'-16px'}}>
    {
      this.state.menus.map(item => {
        return (
          <div key={item.id}>
            <p className={style.h3}>{item.menuName}</p>
            { this.loadmenu(item.children) }
          </div>
        );
      })
    }
  </div>
		);
	}
}
export default basicSetting;
