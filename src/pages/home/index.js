import React,{useEffect,useState} from "react";
import {Row,Col,Card,Table} from "antd";
import * as Icon from "@ant-design/icons";
import * as echarts from "echarts";
import MyEcharts from "../../components/echarts";
import "./home.css";
import {getData} from "../../api";

const columns = [
    {
      title: '课程',
      dataIndex: 'name'
    },
    {
      title: '今日购买',
      dataIndex: 'todayBuy'
    },
    {
      title: '本月购买',
      dataIndex: 'monthBuy'
    },
    {
      title: '总购买',
      dataIndex: 'totalBuy'
    }
  ]
  const countData = [
    {
      "name": "今日支付订单",
      "value": 1234,
      "icon": "CheckCircleOutlined",
      "color": "#2ec7c9"
    },
    {
      "name": "今日收藏订单",
      "value": 3421,
      "icon": "ClockCircleOutlined",
      "color": "#ffb980"
    },
    {
      "name": "今日未支付订单",
      "value": 1234,
      "icon": "CloseCircleOutlined",
      "color": "#5ab1ef"
    },
    {
      "name": "本月支付订单",
      "value": 1234,
      "icon": "CheckCircleOutlined",
      "color": "#2ec7c9"
    },
    {
      "name": "本月收藏订单",
      "value": 3421,
      "icon": "ClockCircleOutlined",
      "color": "#ffb980"
    },
    {
      "name": "本月未支付订单",
      "value": 1234,
      "icon": "CloseCircleOutlined",
      "color": "#5ab1ef"
    }
  ]
// 将icon转换为react元素
const iconToElement = (name) => React.createElement(Icon[name]);


const Home = () => {

    // 组件间传递series 创建echart响应式数据
    const [echartData,setEchartData] = useState({})
    //定义table数组
    const [tableData,setTableData] = useState([])

    useEffect(() => { //页面加载完成后才调用接口
        getData().then(res => {
            // console.log('1',res.data.data)
            const { tableData,orderData,userData,videoData } = res.data.data
            console.log(tableData,orderData,userData,videoData)
            setTableData(tableData)

            // 给echarts传入数据前 进行数据组装
            const order = orderData
            // x轴数据
            const xData = order.date
            const keyArray = Object.keys(orderData.data[0]) // 获取对象中的key 转为数组
            // series数据
            const series = []
            keyArray.forEach(key => {
                series.push({
                    name: key,
                    type: 'line',
                    data: order.data.map(item => item[key])
                })
            }) 

            // 数据组装完成后进行更新
            setEchartData({
              order:{
                xData,
                series
              },
              user:{
                xData:userData.map(item => item.date),
                series: [
                  {
                    name:'新增用户',
                    data:userData.map(item => item.new),
                    type:'bar'
                  },
                  {
                    name:'活跃用户',
                    data:userData.map(item => item.active),
                    type:'bar'
                  }
                ]
              },
              video: {
                series:[
                  {
                    data:videoData,
                    type:'pie'
                  }
                ]
              }
            })
        })
        
      },[])

    const userImg = require("../../assets/images/avatar.jpg")

    

    return (
        <Row className="home">
      <Col span={9}> 
        <Card hoverable>
          <div className="user">
            <img src={userImg} />
            <div className="userinfo">
              <p className="name">Admin</p>
              <p className="access">超级管理员</p>
            </div>
          </div>
          <div className="login-info">
            <p>上次登录时间：<span>2021-7-19</span></p>
            <p>上次登录地点：<span>武汉</span></p>
          </div>
        </Card>
        <Card style={{ marginTop: '20px' }} hoverable>
          <Table rowKey={"name"} columns={columns} dataSource={tableData} pagination={false} />
        </Card>
      </Col>
      <Col style={{ marginTop: '20px' }} span={15}>
        <div className="num">
          {
            countData.map((item,index)=>{
              return (
                <Card key={index}>
                  <div className="icon-box" style={{ backgroundColor: item.color}}>
                    {iconToElement(item.icon)}
                  </div>
                  <div className="detail">
                    <p className="num">￥{item.value}</p>
                    <p className="txt">{item.name}</p>
                  </div>
                </Card>
              )
            })
          }
        </div>
      
        {/* echarts渲染发生在DOM渲染之后，所以需要使用useEffect */}
        {echartData.order && <MyEcharts chartData={echartData.order} style={{height:'280px',width:'100%'}}/>}
        <div className="graph">
          {echartData.user && <MyEcharts chartData={echartData.user} style={{height:'250px',width:'50%'}}/>}
          {echartData.video && <MyEcharts chartData={echartData.video} style={{ width:'50%', height: '260px' }}/> }
        </div>
      </Col>
    </Row>
    )
}

export default Home;