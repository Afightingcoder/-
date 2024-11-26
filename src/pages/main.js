import React,{useState} from "react";
import {Outlet} from "react-router-dom";
import { Button, Layout, Menu, theme } from 'antd';
import CommonAside from "../components/commonAside";
import CommonHeader from "../components/commonHeader";
import CommonTag from "../components/CommonTag";
import { RouterAuth } from "../router/routerAuth";
import {useSelector } from 'react-redux'

const { Header, Sider, Content } = Layout;
const Main = () => {
    // const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    //在Layout用钩子useSelector函数获取store 展开收起的状态 再父子组件传参 传进Aside和Header
    const collapsed = useSelector((state) => state.tab.isCollapse)

    return (
        <RouterAuth>
        <Layout className="main-container ">
        {/* <Sider trigger={null} collapsible collapsed={collapsed}>
        <h3 className= "app-name">通用后台管理系统</h3> 
            <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['1']}
            items={[
                {
                key: '1',
                icon: <UserOutlined />,
                label: 'nav 1',
                },
                {
                key: '2',
                icon: <VideoCameraOutlined />,
                label: 'nav 2',
                },
                {
                key: '3',
                icon: <UploadOutlined />,
                label: 'nav 3',
                },
            ]}
            style={{
                height: '100%'
            }}
            />
        </Sider> */}

        <CommonAside collapsed={collapsed}/>
        <Layout>
            <CommonHeader collapsed={collapsed}/>
             <CommonTag/>

            <Content
            style={{
                margin: '24px 16px',
                padding: 24, 
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
            }}
            >
            {/* 占位符组件 类似窗口 用于展示组件 */}
            <Outlet/>

            </Content>
        </Layout>
        </Layout>
        </RouterAuth>
    )
}

export default Main;