import { useState } from 'react';
import CreditRoles from '@/components/creditRoles'
import { addConfig, isOpenConfig, testConfig } from '@/api'
import { Switch, Button, Dialog, Toast } from 'antd-mobile'
import { CONFIG, isIOS } from '@/utils';
import '../common.less';

export const DailyList = props => {
    const {
        guildId,
        getConfig,
        config: _config
    } = props;

    const config = _config?.find(item => {
        return item.type === 2
    })

    const [configSwitch, setConfigSwitch] = useState(!!(config?.status))
    const [roles, setRoles] = useState(JSON.parse(config?.dataJson ?? '[]'));
    const [hasFocus, setHasFocus] = useState(false); //是否聚焦
    const [hasEdit, setHasEdit] = useState(false); //是否编辑

    //提交配置
    const handelOnSubmit = () => {  
        Dialog.confirm({
            content: '确定提交配置?',
            onConfirm: async () => {
                const conf = [guildId, 2, JSON.stringify(roles)];
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
                <span className='config-switch-title'>每日排行榜活动开关</span>
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
                        targetTitle="排行榜名次"
                        rewardsTitle="奖励积分"
                        roles={roles}
                        setRoles={setRoles}
                        setHasFocus={setHasFocus}
                        hasEdit={hasEdit}
                    />
                    <div className={`config-detail ${hasFocus && !isIOS() && 'config-detail-blank'}`}>
                        <div className='config-detail-title'>
                            活动说明：
                        </div>
                        <div className='config-detail-content'>
                            活动根据每日游戏排行榜名次，发放相应的积分奖励；排行榜统计时间为凌晨零点；统计完成后，奖励逐步发放。
                        </div>
                        <div className='config-detail-content' style={{
                            paddingTop: ".4rem"
                        }}>
                            {`奖励配置规则:需要按照从低到高排序，如：1>10，5>5，7>2，是指第一名获得10个积分，2-5名获得5个积分，6-7名获得2个积分。`}
                        </div>
                    </div>

                    {
                        CONFIG.env === 'development' &&
                        <div className='config-submit-test'>
                            <Button block color='primary' onClick={() => {
                                console.log('点击了触发规则');
                                testConfig().then(res => {
                                    Toast.show({
                                        icon: 'success',
                                        content: `已触发，接口返回:${JSON.stringify(res)}`
                                    })
                                }).catch(e => {
                                    Toast.show({
                                        icon: 'success',
                                        content: `触发失败`
                                    })
                                })
                            }} >
                                触发规则
                            </Button>
                        </div>}
                </div>}

            <div className='config-submit'>
                <Button color='primary' size='large' onClick={handelOnEdit} disabled={!configSwitch} className='config-submit-btn'>
                    {hasEdit ? '取消编辑' : '编辑'}
                </Button>
                <Button size='large' onClick={handelOnSubmit} disabled={!configSwitch || !roles?.length} className='config-submit-btn'>
                    提交配置
                </Button>
            </div>
        </div>
    );
}

export default DailyList;
