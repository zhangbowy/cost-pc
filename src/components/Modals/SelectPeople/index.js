import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { ddComplexPicker } from '@/utils/ddApi';
import style from './index.scss';
import { choosePeople } from '../../../utils/ddApi';

class UserSelector extends PureComponent {
  static propTypes = {
    users: PropTypes.array,
    depts: PropTypes.array,
    placeholder: PropTypes.string,
    invalid: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    disabled: PropTypes.bool
  }

  openSelector = () => {
    const _this = this;
    const {
      users = [],
      depts = [],
      flag,
    } = this.props;
    if (flag === 'useApep') {
      ddComplexPicker({
        multiple: true,
        users: users.map(it => it.userId),
        departments: depts.map(it => it.deptId),
      }, (res) => {
        const arr = [];
        const dep = [];
        if (res) {
          console.log(res);
          if (res.users) {
            res.users.forEach(item => {
              arr.push({
                userId: item.emplId,
                userName: item.name,
                avatar: item.avatar,
              });
            });
          }
          if (res.departments) {
            res.departments.forEach(item => {
              dep.push({
                deptId: item.id,
                name: item.name,
                number: item.number,
              });
            });
          }

          _this.props.onSelectPeople({
            users: arr,
            depts: dep,
          });
        }
      }, {
        multiple: true,
        max: 20,
      });
    } else if (flag === 'users') {
      this.selectPeop();
    }

  }

  selectPeop = () => {
    const { users, multiple, max } = this.props;
    const _this = this;
    choosePeople(users.map(it => it.userId), (res) => {
      const arr = [];
      if (res) {
      res.forEach(item => {
        arr.push({
          userId: item.emplId,
          userName: item.name,
          avatar: item.avatar,
        });
      });
    }
      _this.props.onSelectPeople({
        users: arr,
      });
    }, {
      multiple,
      max,
    });
  }

  render () {
    const { users = [], depts = [], placeholder, invalid, disabled } = this.props;
    const usersLength = users.length;
    const deptsLength = depts.length;
    const showPlaceholder = !usersLength && !deptsLength;
    return (
      <div
        className={classnames(
                style.pmc_form_user_selector, { invalid, 'is-disabled': disabled }
              )}
        onClick={disabled ? null : this.openSelector}
      >
        {
          showPlaceholder
            ?
              <span className={style.placeholder}>{ placeholder }</span>
            :
              <>
                {
                  usersLength > 0 &&
                  <span className='user-info'>
                    { usersLength === 1
                          ? users[0].userName
                          : `${users[0].userName}等${usersLength}人`}
                    { deptsLength > 0 && ',' }
                  </span>
                }
                {
                  deptsLength > 0 &&
                  <span className='dept-info'>
                    { deptsLength === 1
                            ? depts[0].name
                            : `${depts[0].name}等${deptsLength}个部门`}
                  </span>
                }
              </>
        }
      </div>
    );
  }
}

export default UserSelector;
