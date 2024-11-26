import React, { useEffect, useState } from 'react'
import {
  Button,
  Form,
  Input,
  Table,
  Modal,
  Select,
  DatePicker,
  InputNumber,
  Popconfirm
} from 'antd'
import './user.css'
import { getUser, addUser, editUser, deleteUser } from '../../api'
import { useForm } from 'antd/es/form/Form'
import dayjs from 'dayjs'
import { render } from '@testing-library/react'

const User = () => {
    
    const [listData, setListData] = useState({
          name: ''
        })
    const [tableData, setTableData] = useState([])
    // 0（新增）1（编辑）
    const [modelType,setModelType] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // 创建form搜索实例
    const [searchForm] = useForm()
    // 搜索
    const handleSearch = (e) => {
      console.log(e)
      setListData({ // 这个State设置是一个异步操作 要实时监听listData变化 用useEffect见下
          name: e.keyword // 给name值传入 一个对象 跟初始格式保持一致
      })
      
      // getTableData()
  }

    useEffect(() => {
      getTableData()
      // console.log(listData)
    },[listData]) // 监听listData变化更新列表
    
    const columns = [
        {
            title:'姓名',
            dataIndex:'name',
        },
        {
            title:'年龄',
            dataIndex:'age',
        },
        {
            title:'性别',
            dataIndex:'sex',
            render:(val) =>{
                return val ? '男' : '女'
            }
        },
        {
            title:'生日',
            dataIndex:'birth',
        },
        {
            title:'地址',
            dataIndex:'addr'
        },
        { 
            title:'操作',
            render:(recordData) => {
                return (
                    <div className='flex-box'>
                        <Button style={{marginRight:'5px'}} onClick={()=>{handleClick('edit',recordData)}}>编辑</Button>
                        <Popconfirm 
                        title="提示"
                        description="此操作将删除该用户, 是否继续?"
                        okText="确认"
                        cancelText="取消"
                        onConfirm={() => handleDelete(recordData)}>
                            <Button type="primary" danger>删除</Button>
                        </Popconfirm>
                    </div>
                )
            }
        }
    ]

    // 获取表单实例 以清除已提交、删除的填写字段
    const [form] =Form.useForm()

    // 点击新增
    const handleClick = (type, recordData) => {
        setIsModalOpen(!isModalOpen)
        if (type === 'add') {
            setModelType(0)
        } else{
            
            // 对原数据做深拷贝
            const cloneData = JSON.parse(JSON.stringify(recordData))
            // 对后端返回日期格式转换 到符合前端组件的格式
            cloneData.birth = dayjs(cloneData.birth)
            setModelType(1)  // 走到编辑逻辑
            //表单数据回填
            form.setFieldsValue(cloneData)
        }
        
    }
      // 关闭弹窗
      const handleCancel = () => {
        setIsModalOpen(false)
        form.resetFields() // 清除已提交、删除的填写字段
      }
      // 点击确认的事件处理
      const handleOk = () => {
        form.validateFields().then((val) => {
          // 日期参数
          val.birth = dayjs(val.birth).format('YYYY-MM-DD')
          if (modelType) { // 编辑
            console.log(val,'val')
            editUser(val).then(() => {
              // 比新增多传一个id 因要先找到更新哪个用户 在弹窗中一起提交 添加id提交后的val会多出一个id字段供后端识别
              // 关闭弹窗
              handleCancel()
              getTableData()
            })
          } else { // 新增
            addUser(val).then(() => {
              // 关闭弹窗
              handleCancel()
              getTableData() // 更新列表数据
            })
          }
        }).catch((err) => { 
          console.log(err)
        })
      }

    

    //删除
    const handleDelete = ({id}) => {
        console.log('删掉的',id)
        deleteUser({id}).then(
          getTableData()
        )
    }
    // 请求列表
  const getTableData = () => {
    getUser(listData).then(({ data }) => {
      setTableData(data.list)
    })
  }
    // 首次加载后调用后端接口返回数据
    useEffect(() => {
        getTableData()
    },[])

    return (
        <div className='user'>
            <div className='flex-box'>
                <Button type='primary' onClick={()=>{handleClick('add')}}>*新增</Button>
                <Form 
                form = {searchForm} // 绑定表单
                layout='inline'
                onFinish={handleSearch}> 
                {/* 表单域 */}
                <Form.Item name='keyword'>
                   <Input placeholder='请输入姓名'></Input>
                </Form.Item>
                
                <Form.Item>
                   <Button htmlType='submit' type='primary'>搜索</Button>
                </Form.Item>
                
                </Form>
            </div>
            
         <Table style={{marginTop: '20px'}} columns={columns} dataSource={tableData} rowKey={"id"}></Table>
         <Modal
           open = {isModalOpen}
           title={modelType === 1 ? '编辑' : '新增'}
           onOk={handleOk}
            onCancel={handleCancel}
            okText="确定"
            cancelText="取消"
            >

            <Form 
            labelCol ={{span:6}} //文本布局宽度
            wrapperCol={{span: 18}} //输入框布局宽度
            labelAlign="left"
            form={form} layout='vertical'> 

             {modelType==1 && <Form.Item label='ID' name='id'><Input/></Form.Item>}
            
             <Form.Item label='姓名' name='name'
             rules={[
              {
                required: true,
                message: '请输入姓名',
              },
            ]}>
                <Input placeholder='请输入姓名'></Input>
             </Form.Item>

             <Form.Item label='年龄' name='age'
             rules={[
                {required:true,message:'请输入年龄'},
                {type:'number',message:'年龄必须为数字'}
                ]}
                >
                <InputNumber placeholder='请输入年龄'></InputNumber>
                </Form.Item>

                 <Form.Item
            label="性别"
            name="sex"
            rules={[
              {
                required: true,
                message: '性别是必选项',
              },
            ]}
          >
            <Select
              placeholder="请选择性别"
              options={[
                { value: 0, label: '男' },
                { value: 1, label: '女' }
              ]}
            ></Select>
          </Form.Item>
          <Form.Item
            label="出生日期"
            name="birth"
            rules={[
              {
                required: true,
                message: '请选择出生日期',
              },
            ]}
          >
            <DatePicker placeholder="请选择" format="YYYY/MM/DD" />
          </Form.Item>

          <Form.Item
            label="地址"
            name="addr"
            rules={[
              {
                required: true,
                message: '请填写地址',
              },
            ]}
          >
            <Input placeholder="请填写地址" />
          </Form.Item>
            

            </Form>

            </Modal>
        </div>
    )
}



export default User;