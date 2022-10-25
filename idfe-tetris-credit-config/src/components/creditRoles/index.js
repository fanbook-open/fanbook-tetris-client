
import { useState, useEffect } from 'react'
import { Stepper, Input, Button, Dialog, Toast } from 'antd-mobile'
import { ForbidFill } from 'antd-mobile-icons'
import { getUuid } from '@/utils'
import './index.less'

export const CreditRoles = props => {
    const {
        roles: rolesProps, //规则配置数组
        setRoles: setRolesProps,//设置规则配置数组
        targetTitle,    //目标分数标题
        rewardsTitle,   //奖励积分标题
        deleteRoleText = '确定删除此规则?',   //删除规则文本
        hasSpSort = true, //是否特定规则
        errorRolesText = '规则错误，请重新输入',
        setHasFocus,
        hasEdit
    } = props;

    const [roles, setRoles] = useState(rolesProps ?? []); //配置规则
    const [tempValue, setTempValue] = useState(''); //临时数据
    const [tempIndex, setTempIndex] = useState(-1); //临时下标

    //监听规则变化 并回调更新
    useEffect(() => {
        setRolesProps && setRolesProps(roles)
    }, [roles, setRolesProps])

    useEffect(() => {
        //给数组添加uuid
        if (rolesProps?.length) {
            const _rolesProps = rolesProps.map(item => {
                item.uuid = getUuid(10)
                return item;
            })
            setRoles(_rolesProps)
        }
    }, [])

    useEffect(() => {
        if (hasEdit && !rolesProps?.length) {
            addRoles()
        }
    }, [hasEdit])
    
    //增加规则
    const addRoles = () => {
        const _roles = [...roles];
        const lastRole = _roles.length ? _roles[_roles.length - 1] : {};
        let targetValue = hasSpSort ?
            (
                lastRole.hasOwnProperty("target")
                    ? lastRole.target + 1 : 1
            )
            : "";

        let config = {
            target: targetValue,
            rewards: 1,
            uuid: getUuid(10)
        };

        if (hasSpSort) {
            config.begin = targetValue;
            config.end = targetValue;
        }

        _roles.push(config);
        setRoles(_roles);
    }

    //删除规则
    const deleteRoles = uuid => {
        Dialog.confirm({
            content: deleteRoleText,
            onConfirm: async () => {
                const newRoles = roles.filter(item => item.uuid !== uuid);
                setRoles(hasSpSort ? toRolesArr(newRoles) : newRoles);
                Toast.show({
                    icon: 'success',
                    content: '删除成功'
                })
            }
        })
    }

    //改变目标分数
    const changeTarget = value => {
        const newRoles = [...roles];
        if (~tempIndex) {
            newRoles[tempIndex].target = (value === 0) ? "" : value;
            setRoles(newRoles);
        }
    }

    //失焦校验目标分数
    const changeTargetOnBlur = () => {
        setHasFocus(false);//失焦
        const newRoles = [...roles];
        const findIndex = tempIndex;
        if (
            ~findIndex
            &&
            (newRoles[findIndex].target || !hasSpSort)  //无特定规则的情况下允许为空
            &&
            !(~newRoles.findIndex((find, index) =>
                index !== findIndex && newRoles[findIndex].target === find.target))  //值不能重复
        ) {
            const arr = hasSpSort ? newRoles.sort((a, b) => a.target - b.target) : newRoles;
            setRoles(hasSpSort ? toRolesArr(arr) : arr);
        } else {
            newRoles[findIndex].target = tempValue; //错误，返回上一次存储的值
            setRoles(newRoles);
            Toast.show({
                icon: 'fail',
                content: errorRolesText,
            })
        }
        setTempIndex(-1); //每次失焦清除当前项标记
    }

    //聚焦存储当前项目数据
    const changeTargetOnFocus = item => {
        setHasFocus(true);//聚焦
        if (!(~tempIndex)) {
            const newRoles = [...roles];
            //查找当前项
            const findIndex = newRoles.findIndex(find => find.uuid === item.uuid);
            //存储当前项
            ~findIndex && setTempIndex(findIndex);
            //临时存储上次保存的值
            ~findIndex && setTempValue(newRoles[findIndex].target);
        }
    }

    //改变奖励积分
    const changeRewards = (value, item) => {
        const newRoles = [...roles];
        const findIndex = newRoles.findIndex(find => find.uuid === item.uuid);
        if (~findIndex) {
            newRoles[findIndex].rewards = value;
            setRoles(newRoles);
        }
    }

    //转换特定规则
    const toRolesArr = (arr) => {
        const length = arr.length;
        const newArr = [...arr];
        for (let i = 0; i < length; i++) {
            if (i === 0) {
                newArr[i].begin = 1;
                newArr[i].end = arr[i].target > 1 ? newArr[i].target : 1;
                continue;
            }
            const pre = arr[i - 1]; //上一项
            newArr[i].begin = arr[i].target - pre.target > 1 ? pre.target + 1 : newArr[i].target;
            newArr[i].end = newArr[i].target;
        }
        return newArr;
    }

    //展示特定规则
    const showTarget = item => {
        return item.begin === item.end ? item.target :
            `${item.target}  (${item.begin} ~ ${item.end})`
    }

    return (
        <div className="credit-rules">
            <div className='credit-rules-title'>
                <div className="rules-target">{targetTitle}</div>
                <div className="rules-rewards">{rewardsTitle}</div>
            </div>
            {
                roles.map((item, index) => {
                    return (
                        <div className='credit-rules-list' key={index}>
                            <div className='rules-target'>
                                <div className='rules-target-input' style={hasEdit ? { border: '1px solid #e5e5e5' } : {}}>
                                    <Input
                                        style={{ '--text-align': 'center' }}
                                        value={(~tempIndex || !hasSpSort) ? item.target : showTarget(item)}
                                        onChange={val => {
                                            //限制输入规则，只能为正整数
                                            const value = Number(val.replace(/^([0])+|[^0-9]/g, ''));
                                            changeTarget(value);
                                        }}
                                        onBlur={changeTargetOnBlur}
                                        onFocus={() => changeTargetOnFocus(item)}
                                        disabled={!hasEdit}
                                    />
                                </div>
                            </div>
                            <div className={`rules-rewards ${hasEdit && 'rules-rewards-edit'}`}>
                                <div className='rules-rewards-scores'>
                                    {
                                        hasEdit ? <Stepper
                                            style={{ width: '2rem' }}
                                            digits={0}
                                            min={1}
                                            max={100000}
                                            value={item.rewards}
                                            onChange={value => changeRewards(value, item)}
                                            onBlur={() => {
                                                setHasFocus(false)
                                            }}
                                            onFocus={() => {
                                                setHasFocus(true)
                                            }}
                                        />
                                            : item.rewards
                                    }

                                </div>
                                {
                                    hasEdit &&
                                    <ForbidFill className='rules-rewards-delete' color='#F53C23' fontSize={22}
                                        onClick={() => deleteRoles(item.uuid)}
                                    />
                                }

                            </div>
                        </div>
                    )
                })
            }

            <div className='credit-rules-add'>
                {
                    hasEdit &&
                    <Button block color='default' size='large' onClick={addRoles} disabled={!hasEdit}>
                        增加规则
                    </Button>
                }
            </div>

        </div>
    );
}

export default CreditRoles;
