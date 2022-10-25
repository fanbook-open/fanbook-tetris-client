import { useState } from 'react';
import CreditRoles from '@/components/creditRoles'
import { addConfig, isOpenConfig } from '@/api'
import { Switch, Button, Dialog, Toast } from 'antd-mobile'
import { isIOS } from '@/utils';
import '../common.less';

export const DailyChallenges = props => {
    const {
        guildId,
        getConfig,
        config: _config,
    } = props;

    const config = _config?.find(item => {
        return item.type === 1
    })

    const [roles, setRoles] = useState(JSON.parse(config?.dataJson ?? '[]'))
    const [configSwitch, setConfigSwitch] = useState(!!(config?.status))
    const [hasFocus, setHasFocus] = useState(false); //是否聚焦
    const [hasEdit, setHasEdit] = useState(false); //是否编辑

    //提交配置
    const handelOnSubmit = () => {
        Dialog.confirm({
            content: '确定提交配置?',
            onConfirm: () => {
                if (roles.some(item => !item.target)) {
                    Toast.show({
                        icon: 'fail',
                        content: '目标分数不能为空！'
                    })
                    return;
                }
                const conf = [guildId, 1, JSON.stringify(roles)];

                //有id则为修改配置
                if (config?.id) {
                    conf.push(config.id)
                }

                addConfig(...conf).then(res => {
                    setHasEdit(false)
                    res && Toast.show({
                        icon: 'success',
                        content: '提交成功'
                    })
                    getConfig && getConfig(guildId)
                }).catch(err => {
                    Toast.show({
                        icon: 'fail',
                        content: '提交失败'
                    })
                    console.log('--------err---------', JSON.stringify(err));
                })

            }
        })
    }

    //配置开关
    const handleOnSwitch = check => {
        const hasCheck = check ? '开启' : '关闭';
        Dialog.confirm({
            content: `确认${hasCheck}该功能`,
            onConfirm: () => {
                //有id时调接口禁用
                if (config?.id) {
                    isOpenConfig(guildId, check ? 1 : 0, config.id).then(res => {
                        console.log('禁用,', JSON.stringify(res));
                        setConfigSwitch(check);
                        Toast.show({
                            icon: 'success',
                            content: `${hasCheck}成功`
                        })
                        setHasEdit(false)
                    }).catch(err => {
                        Toast.show({
                            icon: 'success',
                            content: `${hasCheck}失败`
                        })
                        console.log('--------err---------', JSON.stringify(err));
                    })
                } else {
                    setConfigSwitch(check);
                    Toast.show({
                        icon: 'success',
                        content: `${hasCheck}成功`
                    })
                }
            }
        })
    }

    //编辑
    const handelOnEdit = () => {
        setHasEdit(!hasEdit)
    }
    return (
        <div className="credit-config">
            <div className='config-switch'>
                <span className='config-switch-title'>每日挑战活动开关</span>
                <Switch
                    className='config-switch-antd'
                    style={{ '--checked-color': '#60D65A' }}
                    checked={configSwitch}
                    beforeChange={handleOnSwitch}
                />
            </div>
            {
                configSwitch &&
                <div className='config-roles'>
                    <CreditRoles
                        targetTitle="目标分数"
                        rewardsTitle="奖励积分"
                        roles={roles}
                        setRoles={setRoles}
                        hasSpSort={false}
                        setHasFocus={setHasFocus}
                        hasEdit={hasEdit}
                        errorRolesText="规则错误，重复的目标分数"
                    />
                    <div className={`config-detail ${hasFocus && !isIOS() && 'config-detail-blank'}`}>
                        <div className='config-detail-title'>
                            活动说明：
                        </div>
                        <div className='config-detail-content'>
                            每日游戏达到指定的分数，可以获得相应的积分奖励。每个目标得分只能拥有一次奖励机会。活动每日凌晨零点重置；
                        </div>
                    </div>
                </div>}

            <div className='config-submit'>
                <Button color='primary' size='large' onClick={handelOnEdit} disabled={!configSwitch} className='config-submit-btn'>
                    {hasEdit ? '取消编辑' : '编辑'}
                </Button>
                <Button size='large' onClick={handelOnSubmit} disabled={!configSwitch ||!roles?.length} className='config-submit-btn'>
                    提交配置
                </Button>
            </div>
        </div>
    );
}

export default DailyChallenges;
