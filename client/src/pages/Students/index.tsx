import type { TablePaginationConfig } from 'antd'
import { useEffect, useState } from 'react'
import {
  Card,
  Table,
  Tag,
  message,
  Input,
  Select,
  Button,
  Space,
  Modal,
  Form,
  Popconfirm,
  Checkbox,
} from 'antd'
import {
  getStudentList,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../../api/students'
import { getCourseList } from '../../api/courses'



const classOptions = [
  { label: '前端2401班', value: '前端2401班' },
  { label: '前端2402班', value: '前端2402班' },
  { label: '后端2401班', value: '后端2401班' },
  { label: '后端2402班', value: '后端2402班' },
  { label: '全栈2401班', value: '全栈2401班' },
  { label: '全栈2402班', value: '全栈2402班' },
]

function StudentsPage() {
  const [courseMap, setCourseMap] = useState<any>({})
  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  const [searchParams, setSearchParams] = useState({
    keyword: '',
    className: '',
    status: '',
  })

  const [open, setOpen] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [editingRecord, setEditingRecord] = useState<any>(null)
  const [form] = Form.useForm()

  const [courseOptions, setCourseOptions] = useState<any[]>([])

  const fetchStudentList = async (
    page = 1,
    pageSize = 10,
    extraParams = searchParams
  ) => {
    try {
      setLoading(true)
      const res = await getStudentList({
        page,
        pageSize,
        ...extraParams,
      })
      console.log('学生列表返回数据:', res.data)
      console.log('第一条学生数据:', res.data.data.list?.[0])
console.log('第一条学生的所有键名:', Object.keys(res.data.data.list?.[0] || {}))

      const data = res.data.data

      setList(data.list || [])
      setPagination({
        current: data.page,
        pageSize: data.pageSize,
        total: data.total,
      })
    } catch (error) {
      console.error('获取学生列表失败:', error)
      message.error('获取学生列表失败')
    } finally {
      setLoading(false)
    }
  }
  const fetchCourseOptions = async () => {
    try {
      const res = await getCourseList({ page: 1, pageSize: 100 })
  
      const list = res.data.data.list || []
  
      const options = list.map((item: any) => ({
        label: item.name,
        value: item.id,
      }))
  
      const map: any = {}
      list.forEach((item: any) => {
        map[item.id] = item.name
      })
  
      setCourseOptions(options)
      setCourseMap(map)
    } catch (error) {
      console.error('获取课程选项失败:', error)
    }
  }

  useEffect(() => {
    fetchStudentList()
    fetchCourseOptions()
  }, [])

  const handleTableChange = (pageInfo: TablePaginationConfig) => {
    fetchStudentList(pageInfo.current, pageInfo.pageSize, searchParams)
  }

  const handleSearch = () => {
    fetchStudentList(1, pagination.pageSize, searchParams)
  }

  const handleReset = () => {
    const resetParams = {
      keyword: '',
      className: '',
      status: '',
    }

    setSearchParams(resetParams)
    fetchStudentList(1, pagination.pageSize, resetParams)
  }

  const handleSubmit = async (values: any) => {
    try {
      setSubmitLoading(true)
  
      if (editingRecord) {
        await updateStudent(editingRecord.id, values)
        message.success('编辑学生成功')
      } else {
        await createStudent(values)
        message.success('新增学生成功')
      }
  
      setOpen(false)
      form.resetFields()
      setEditingRecord(null)
  
      fetchStudentList(1, pagination.pageSize, searchParams)
    } catch (error) {
      console.error('提交学生失败:', error)
      message.error('提交学生失败')
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteStudent(id)
      message.success('删除学生成功')

      fetchStudentList(pagination.current, pagination.pageSize, searchParams)
    } catch (error) {
      console.error('删除学生失败:', error)
      message.error('删除学生失败')
    }
  }

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: any) => {
        return (
          <div>
            {/* 👇 下面这一整段全是【内容样式】 */}
            <div style={{ fontWeight: 700, fontSize: 16, color: '#111' }}>
              {record.name}
            </div>
            
          </div>
        )
      },
    },
    {
      title: '学号',
      dataIndex: 'student_no',
      key: 'student_no',
    },
    {
      title: '班级',
      dataIndex: 'class_name',
      key: 'className',
       // 改成示例图的紫色圆角标签
       render: (value: string) => (
        <Tag
  style={{
    border: '2px solid #a855f7',
    borderRadius: 6,
    background: '#f5f3ff',
    color: '#7c3aed',
    fontWeight: 600,
    padding: '2px 10px',
  }}
>
  {value}
</Tag>
      ),
      
    },
    {
      title: '联系方式',
      key: 'contact',
      render: (_: any, record: any) => {
        return (
          <div>
            <div>
  <div style={{ fontSize: 15, color: '#111' }}>{record.phone || '-'}</div>
  <div style={{ color: '#9ca3af', marginTop: 4, fontSize: 14 }}>
    {record.email || '-'}
  </div>
</div>
          </div>
        )
      },
    },
    {
      title: '已选课程',
      dataIndex: 'course_ids',
      key: 'course_ids',
      render: (ids: number[]) => {
        if (!ids?.length) return '-'
        const text = ids
          .map((id) => courseMap[id])
          .filter(Boolean)
          .join('，')
    
        return (
          <div
            style={{
              maxWidth: 240,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: '#111',
              fontSize: 15,
            }}
            title={text}
          >
            {text}
          </div>
        )
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (value: string) => {
        return value === 'active' ? (
          <Tag
            style={{
              border: '2px solid #52c41a',
              borderRadius: 6,
              fontWeight: 600,
              background: '#f6ffed',
            }}
            color="success"
          >
            活跃
          </Tag>
        ) : (
          <Tag
            style={{
              border: '2px solid #bfbfbf',
              borderRadius: 6,
              fontWeight: 600,
              background: '#fafafa',
              color: '#666',
            }}
          >
            非活跃
          </Tag>
        )
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => {
        return (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Button
              type="link"
              style={{ padding: 0, color: '#3b82f6', fontWeight: 600 }}
              onClick={() => {
                setEditingRecord(record)
                form.setFieldsValue(record)
                setOpen(true)
              }}
            >
              编辑
            </Button>
      
            <Popconfirm
              title="确定删除这名学生吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="link"
                danger
                style={{ padding: 0, fontWeight: 600 }}
              >
                删除
              </Button>
            </Popconfirm>
          </div>
        )
      },
    },
  ]

  return (
    <div>
      <div
        style={{
          marginBottom: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>学生管理</h2>
          <div style={{ color: '#999', marginTop: 6, fontSize: 14 }}>
            查看学生列表并进行学生维护
          </div>
        </div>

        <Button
  type="primary"
  onClick={() => {
    setEditingRecord(null)
    form.resetFields()
    setOpen(true)
  }}
  style={{
    background: '#dbeafe',
    color: '#111',
    border: '3px solid #222',
    borderRadius: 12,
    boxShadow: 'none',
    fontWeight: 700,
    height: 54,
    padding: '0 24px',
    fontSize: 18,
  }}
>
  ＋ 新增学生
</Button>
      </div>

      <Card
        style={{
          marginBottom: 16,
    border: '3px solid #222',
    borderRadius: 16,
    boxShadow: 'none',
        }}
        bodyStyle={{ padding: 18 }}
      >
        <div style={{ marginBottom: 18 }}>
          <Space wrap size={14}>
            <Input
              placeholder="请输入姓名或学号"
              value={searchParams.keyword}
              onChange={(e) =>
                setSearchParams({ ...searchParams, keyword: e.target.value })
              }
              style={{ width: 300,height: 44 }}
            />

            <Select
              placeholder="请选择班级"
              value={searchParams.className || undefined}
              onChange={(value) =>
                setSearchParams({ ...searchParams, className: value || '' })
              }
              style={{ width: 170,height:44 }}
              allowClear
              options={classOptions}
            />

            <Select
              placeholder="请选择状态"
              value={searchParams.status || undefined}
              onChange={(value) =>
                setSearchParams({ ...searchParams, status: value || '' })
              }
              style={{ width: 170,height:44 }}
              allowClear
              options={[
                { label: '活跃', value: 'active' },
                { label: '非活跃', value: 'inactive' },
              ]}
            />

<Button
        onClick={handleSearch}
        style={{
          border: '3px solid #222',
          borderRadius: 16,
          background: '#fff',
          color: '#111',
          fontWeight: 700,
          
    boxShadow: 'none',
        }}
      >
        🔍 搜索
      </Button>

      <Button
        onClick={handleReset}
        style={{
          border: '3px solid #222',
          borderRadius: 10,
          color: '#111',
          fontWeight: 600,
          height: 30,
          padding: '0 18px',
          fontSize: 16,
        }}
      >
        重置
      </Button>
          </Space>
        </div>

        <Table
          className="student-table"
          rowKey="id"
          columns={columns}
          dataSource={list}
          loading={loading}
          scroll={{ x: 'max-content' }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          onChange={handleTableChange}
        />
      </Card>

      <Modal
  title={
    <div
      style={{
        fontSize: 18,
        fontWeight: 700,
        paddingBottom: 8,
        borderBottom: '2px solid #222',
      }}
    >
      {editingRecord ? '编辑学生' : '新增学生'}
    </div>
  }
  open={open}
  onCancel={() => {
    setOpen(false)
    form.resetFields()
    setEditingRecord(null)
  }}
  footer={null}
  destroyOnClose
  width={640}
  styles={{
    body: {
      border: '2px solid #222',
      borderRadius: 12,
      boxShadow: 'none',
      padding: 20,
    },
  }}
>
  <Form form={form} layout="vertical" onFinish={handleSubmit}>
    {/* 第一行 */}
    <div style={{ display: 'flex', gap: 16 }}>
      <Form.Item
        label="姓名"
        name="name"
        rules={[{ required: true, message: '请输入姓名' }]}
        style={{ flex: 1 }}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="学号"
        name="student_no"
        rules={[{ required: true, message: '请输入学号' }]}
        style={{ flex: 1 }}
      >
        <Input />
      </Form.Item>
    </div>

    {/* 第二行 */}
    <div style={{ display: 'flex', gap: 16 }}>
      <Form.Item label="班级" name="class_name" style={{ flex: 1 }}>
        <Select options={classOptions} />
      </Form.Item>

      <Form.Item
        label="状态"
        name="status"
        initialValue="active"
        style={{ flex: 1 }}
      >
        <Select
          options={[
            { label: '活跃', value: 'active' },
            { label: '非活跃', value: 'inactive' },
          ]}
        />
      </Form.Item>
    </div>

    {/* 第三行 */}
    <div style={{ display: 'flex', gap: 16 }}>
      <Form.Item label="手机号" name="phone" style={{ flex: 1 }}>
        <Input />
      </Form.Item>

      <Form.Item label="邮箱" name="email" style={{ flex: 1 }}>
        <Input />
      </Form.Item>
    </div>

    {/* 课程 */}
    <Form.Item label="课程" name="course_ids">
      <Checkbox.Group style={{ width: '100%' }}>
        <div
          style={{
            border: '2px dashed #aaa',
            borderRadius: 8,
            padding: 12,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10,
          }}
        >
          {courseOptions.map((item) => (
            <Checkbox key={item.value} value={item.value}>
              {item.label}
            </Checkbox>
          ))}
        </div>
      </Checkbox.Group>
    </Form.Item>

    {/* 底部按钮 */}
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 8,
      }}
    >
      <Button
        onClick={() => {
          setOpen(false)
          form.resetFields()
          setEditingRecord(null)
        }}
        style={{
          border: '2px solid #222',
          borderRadius: 8,
          boxShadow: 'none',
        }}
      >
        取消
      </Button>

      <Button
        type="primary"
        htmlType="submit"
        loading={submitLoading}
        style={{
          background: '#dbeafe',
          color: '#111',
          border: '2px solid #222',
          borderRadius: 8,
          boxShadow: 'none',
          fontWeight: 600,
        }}
      >
        保存
      </Button>
    </div>
  </Form>
</Modal>
    </div>
  )
}

export default StudentsPage