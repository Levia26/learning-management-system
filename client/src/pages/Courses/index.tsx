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
  InputNumber,
  Popconfirm,
} from 'antd'
//import { getCourseList, createCourse ,updateCourse} from '../../api/courses'
import {
  getCourseList,
  createCourse,
  updateCourse,
  deleteCourse,
  toggleCourseStatus,
} from '../../api/courses'

type SearchParams = {
  keyword: string
  status: string
  category: string
  sortField?: string
  sortOrder?: string
}
const categoryOptions = [
  { label: '前端开发', value: '前端开发' },
  { label: '后端开发', value: '后端开发' },
  { label: '数据库', value: '数据库' },
  { label: '工具', value: '工具' },
  { label: '数据科学', value: '数据科学' },
]
function CoursesPage() {
  const [list, setList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })

  // const [searchParams, setSearchParams] = useState({
  //   keyword: '',
  //   status: '',
  //   category: '',
  // })

  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: '',
    status: '',
    category: '',
  })

  const [open, setOpen] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm()

  const fetchCourseList = async (
    page = 1,
    pageSize = 10,
    extraParams = searchParams
  ) => {
    try {
      setLoading(true)
      const res = await getCourseList({
        page,
        pageSize,
        ...extraParams,
      })
      console.log('课程列表返回数据:', res.data)

      const data = res.data.data

      setList(data.list || [])
      setPagination({
        current: data.page,
        pageSize: data.pageSize,
        total: data.total,
      })
    } catch (error) {
      console.error('获取课程列表失败:', error)
      message.error('获取课程列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourseList()
  }, [])

  const handleTableChange = (
    pageInfo: TablePaginationConfig,
    _filters: any,
    sorter: any
  ) => {
    fetchCourseList(
      pageInfo.current,
      pageInfo.pageSize,
      {
        ...searchParams,
        sortField: sorter.field,
        sortOrder: sorter.order,
      }
    )
  }
  const handleSearch = () => {
    fetchCourseList(1, pagination.pageSize, searchParams)
  }

  const handleReset = () => {
    const resetParams = {
      keyword: '',
      status: '',
      category: '',
    }

    setSearchParams(resetParams)
    fetchCourseList(1, pagination.pageSize, resetParams)
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
  
      setSubmitLoading(true)
  
      if (editingRecord) {
        await updateCourse(editingRecord.id, values)
        message.success('编辑课程成功')
      } else {
        await createCourse(values)
        message.success('新增课程成功')
      }
  
      setOpen(false)
      form.resetFields()
      setEditingRecord(null)
  
      fetchCourseList(1, pagination.pageSize, searchParams)
    } catch (error) {
      console.error('提交课程失败:', error)
    } finally {
      setSubmitLoading(false)
    }
  }
  const handleDelete = async (id: number) => {
    try {
      await deleteCourse(id)
      message.success('删除课程成功')
  
      fetchCourseList(pagination.current, pagination.pageSize, searchParams)
    } catch (error) {
      console.error('删除课程失败:', error)
      message.error('删除课程失败')
    }
  }
  
  const handleToggleStatus = async (id: number) => {
    try {
      await toggleCourseStatus(id)
      message.success('状态更新成功')
  
      fetchCourseList(pagination.current, pagination.pageSize, searchParams)
    } catch (error) {
      console.error('更新课程状态失败:', error)
      message.error('更新课程状态失败')
    }
  }
  const columns = [
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: any) => {
        return (
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#111' }}>
              {record.name}
            </div>
            <div
              style={{
                marginTop: 4,
                color: '#9ca3af',
                fontSize: 14,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 220,
              }}
              title={record.description}
            >
              {record.description || '-'}
            </div>
          </div>
        )
      },
    },
    {
      title: '讲师',
      dataIndex: 'instructor',
      key: 'instructor',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (value: string) => (
        <Tag
          style={{
            border: '2px solid #60a5fa',
            borderRadius: 6,
            background: '#eff6ff',
            color: '#2563eb',
            fontWeight: 600,
            padding: '2px 10px',
          }}
        >
          {value}
        </Tag>
      ),
    },
    {
      title: '课时数',
      dataIndex: 'lesson_count',
      key: 'lesson_count',
    },
    {
      title: '选课人数',
      dataIndex: 'student_count',
      key: 'student_count',
      sorter: true, // ⭐关键
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (value: string) => {
        return value === 'published' ? (
          <Tag
            style={{
              border: '2px solid #52c41a',
              borderRadius: 6,
              fontWeight: 600,
              background: '#f6ffed',
            }}
            color="success"
          >
            已发布
          </Tag>
        ) : (
          <Tag
            style={{
              border: '2px solid #bfbfbf',
              borderRadius: 6,
              fontWeight: 600,
              background: '#fafafa',
            }}
            color="default"
          >
            草稿
          </Tag>
        )
      },
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
          title={
            record.status === 'published' 
              ? '确定要下架该课程吗？' 
              : '确定要发布该课程吗？'
          }
          onConfirm={() => handleToggleStatus(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button
            type="link"
            style={{ padding: 0, color: '#6b7280', fontWeight: 600 }}
          >
            {record.status === 'published' ? '下架' : '发布'}
          </Button>
        </Popconfirm>
      
            <Popconfirm
              title="确定删除这门课程吗？"
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
    }
  ]
  const [editingRecord, setEditingRecord] = useState<any>(null)

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
          <h2 style={{ margin: 0,fontSize: 28,fontWeight: 700 }}>课程管理</h2>
          <div style={{ color: '#999', marginTop: 6 ,fontSize: 14}}>
            查看课程列表并进行课程维护
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
  ＋ 新增课程
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
        placeholder="请输入课程名称或讲师名称"
        value={searchParams.keyword}
        onChange={(e) =>
          setSearchParams({ ...searchParams, keyword: e.target.value })
        }
        style={{ width: 300, height: 44 }}
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
          { label: '已发布', value: 'published' },
          { label: '草稿', value: 'draft' },
        ]}
      />

      <Select
        placeholder="请选择分类"
        value={searchParams.category || undefined}
        onChange={(value) =>
          setSearchParams({ ...searchParams, category: value || '' })
        }
        style={{ width: 170, height: 44 }}
        allowClear
        options={categoryOptions}
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
    className="course-table"
    rowKey="id"
    columns={columns}
    dataSource={list}
    loading={loading}
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
      {editingRecord ? '编辑课程' : '新增课程'}
    </div>
  }
  open={open}
  onCancel={() => {
    setOpen(false)
    form.resetFields()
    setEditingRecord(null)
  }}
  onOk={handleSubmit}
  confirmLoading={submitLoading}
  destroyOnClose
  width={620}
  styles={{
    body: {
      border: '2px solid #222',
      borderRadius: 12,
      boxShadow: 'none',
      padding: 20,
    },
  }}
>
        <Form form={form} layout="vertical">
  <Form.Item
    label="课程名称"
    name="name"
    rules={[{ required: true, message: '请输入课程名称' }]}
  >
    <Input placeholder="请输入课程名称" />
  </Form.Item>

  <Form.Item label="课程描述" name="description">
    <Input.TextArea placeholder="请输入课程描述" rows={3} />
  </Form.Item>

  <div style={{ display: 'flex', gap: 16 }}>
    <Form.Item label="讲师" name="instructor" style={{ flex: 1 }}>
      <Input placeholder="请输入讲师名称" />
    </Form.Item>

    <Form.Item label="分类" name="category" style={{ flex: 1 }}>
      <Select placeholder="请选择分类" options={categoryOptions} />
    </Form.Item>
  </div>

  <div style={{ display: 'flex', gap: 16 }}>
    <Form.Item
      label="课时数"
      name="lesson_count"
      initialValue={0}
      style={{ flex: 1 }}
    >
      <InputNumber min={0} style={{ width: '100%' }} />
    </Form.Item>

    <Form.Item
      label="状态"
      name="status"
      initialValue="draft"
      style={{ flex: 1 }}
    >
      <Select
        options={[
          { label: '草稿', value: 'draft' },
          { label: '已发布', value: 'published' },
        ]}
      />
    </Form.Item>
  </div>
</Form>
      </Modal>
    </div>
  )
}

export default CoursesPage