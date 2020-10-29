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
				if(item.type === 4){
					const index = menusMap.get(item.parentId);
					console.log(index);
					if(index || index === 0){
						if(menus[index].children){
							menus[index].children.push(item);
						}
					}
				}
				return item;
			});
			this.setState({menus});
			console.log(111111,menus);
		});
	}

	loadmenu = (data) => {
		const that = this;
		console.log(222222,data);
		return data.map(item => {
			return (
  <div className={style.card} onClick={() => that.goMenuUrl(item)} key={item.id} >
    <div className={style.card_left}>
      {
							item.icon &&
							<div className={`${style.iconImg} ${style[item.icon]}`}  />
						}
    </div>
    <div className={style.card_right}>
      <div className={style.card_right_title}>{item.menuName}</div>
      {
							item.note &&
							<div className={style.card_right_content}>{item.note}</div>
						}
    </div>
  </div>
			);
		});
	}

	goMenuUrl(data){
		console.log(this.props);
		console.log(data);
		this.props.history.push({pathname:data.url.replace('_','/'), state: {selectUrl: this.props.location.pathname}});
	}

	render() {
		console.log(this.state.menus);
		return (
  <div style={{padding:'0 20px 40px 40px'}}>
    {
					this.state.menus.map(item => {
						return (
  <div key={item.id}>
    <h3 className={style.h3}>{item.menuName}</h3>
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
