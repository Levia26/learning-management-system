import { Card, Col, Row,  message } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import { getDashboardData } from '../../api/dashboard'

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null)

  const fetchDashboardData = async () => {
    try {
      const res = await getDashboardData()
      console.log('dashboard 返回数据:', res.data)
      setDashboardData(res.data.data)
    } catch (error) {
      console.error('获取 dashboard 失败:', error)
      message.error('获取工作台数据失败')
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const publishRate = useMemo(() => {
    const publishedCourses = dashboardData?.stats?.publishedCourses ?? 0
    const totalCourses = dashboardData?.stats?.totalCourses ?? 0

    if (!totalCourses) return 0
    return Number(((publishedCourses / totalCourses) * 100).toFixed(2))
  }, [dashboardData])

  const activeRate = useMemo(() => {
    const activeStudents = dashboardData?.stats?.activeStudents ?? 0
    const totalStudents = dashboardData?.stats?.totalStudents ?? 0

    if (!totalStudents) return 0
    return Number(((activeStudents / totalStudents) * 100).toFixed(2))
  }, [dashboardData])

  const enrollmentChartOption = useMemo(() => {
    const enrollment = dashboardData?.charts?.enrollment ?? []

    return {
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: enrollment.map((item: any) => item.name),
        axisLabel: {
          rotate: 30,
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '选课人数',
          type: 'bar',
          data: enrollment.map((item: any) => item.value),
        },
      ],
    }
  }, [dashboardData])

  const activityChartOption = useMemo(() => {
    const activity = dashboardData?.charts?.activity ?? []

    return {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        top: 30,
        data: ['学习人数', '学习时长'],
      },
      xAxis: {
        type: 'category',
        data: activity.map((item: any) => item.label),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '学习人数',
          type: 'line',
          data: activity.map((item: any) => item.students),
          smooth: true,
        },
        {
          name: '学习时长',
          type: 'line',
          data: activity.map((item: any) => item.duration),
          smooth: true,
        },
      ],
    }
  }, [dashboardData])

  const statusPieOption = useMemo(() => {
    const statusDist = dashboardData?.charts?.statusDist ?? []

    return {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '学生状态',
          type: 'pie',
          radius: '60%',
          data: statusDist,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.3)',
            },
          },
        },
      ],
    }
  }, [dashboardData])

  const categoryPieOption = useMemo(() => {
    const categoryDist = dashboardData?.charts?.categoryDist ?? []

    return {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '课程分类',
          type: 'pie',
          radius: '60%',
          data: categoryDist,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.3)',
            },
          },
        },
      ],
    }
  }, [dashboardData])

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2
          style={{
            margin: 0,
            fontSize: 34,
            fontWeight: 800,
            color: '#111',
          }}
        >
          工作台
        </h2>
      </div>
  
      <Row gutter={[20, 20]} wrap={false}>
        <Col flex="1">
          <Card
            style={{
              border: '3px solid #222',
              borderRadius: 16,
              boxShadow: 'none',
              minHeight: 150,
            }}
            styles={{
              body: {
                padding: 24,
                textAlign: 'center',
                minHeight: 150,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              },
            }}
          >
            <div style={{ fontSize: 18, color: '#666', fontWeight: 600 }}>
              📚 课程总数
            </div>
            <div
              style={{
                fontSize: 54,
                fontWeight: 800,
                color: '#111',
                lineHeight: 1.2,
                marginTop: 12,
                
              }}
            >
              {dashboardData?.stats?.totalCourses ?? 0}
            </div>
            <div style={{ marginTop: 8, fontSize: 18, color: '#9ca3af' }}>
              / 已发布 {dashboardData?.stats?.publishedCourses ?? 0}
            </div>
          </Card>
        </Col>
  
        <Col flex="1">
          <Card
            style={{
              border: '3px solid #222',
              borderRadius: 16,
              boxShadow: 'none',
              minHeight: 150,
            }}
            styles={{
              body: {
                padding: 24,
                textAlign: 'center',
                minHeight: 150,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              },
            }}
          >
            <div style={{ fontSize: 18, color: '#666', fontWeight: 600 }}>
              👥 学生总数
            </div>
            <div
              style={{
                fontSize: 54,
                fontWeight: 800,
                color: '#111',
                lineHeight: 1.2,
                marginTop: 12,
              }}
            >
              {dashboardData?.stats?.totalStudents ?? 0}
            </div>
            <div style={{ marginTop: 8, fontSize: 18, color: '#9ca3af' }}>
              / 活跃 {dashboardData?.stats?.activeStudents ?? 0}
            </div>
          </Card>
        </Col>
  
        <Col flex="1">
          <Card
            style={{
              border: '3px solid #222',
              borderRadius: 16,
              boxShadow: 'none',
              minHeight: 150,
            }}
            styles={{
              body: {
                padding: 24,
                textAlign: 'center',
                minHeight: 150,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              },
            }}
          >
            <div style={{ fontSize: 18, color: '#666', fontWeight: 600 }}>
              📈 课程发布率
            </div>
            <div
              style={{
                fontSize: 54,
                fontWeight: 800,
                color: '#111',
                lineHeight: 1.2,
                marginTop: 12,
                minHeight: 100,
              }}
            >
              {Math.round(publishRate)}%
            </div>
          </Card>
        </Col>
  
        <Col flex="1">
          <Card
            style={{
              border: '3px solid #222',
              borderRadius: 16,
              boxShadow: 'none',
              minHeight: 150,
            }}
            styles={{
              body: {
                padding: 24,
                textAlign: 'center',
                minHeight: 150,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              },
            }}
          >
            <div style={{ fontSize: 18, color: '#666', fontWeight: 600 }}>
              🔥 学生活跃率
            </div>
            <div
              style={{
                fontSize: 54,
                fontWeight: 800,
                color: '#111',
                lineHeight: 1.2,
                marginTop: 12,
                minHeight: 100,
              }}
            >
              {Math.round(activeRate)}%
            </div>
          </Card>
        </Col>
      </Row>
  
      <Row gutter={[20, 20] } style={{ marginTop: 20 }} >
        <Col span={12}>
          <Card
            title="课程选课人数 TOP 8"
            style={{
              border: '3px solid #222',
              borderRadius: 16,
              boxShadow: 'none',
            }}
            styles={{
              header: {
                fontSize: 20,
                fontWeight: 800,
                borderBottom: 'none',
              },
              body: { padding: 18 },
            }}
          >
            <div
              style={{
                border: '3px dashed #bfbfbf',
                borderRadius: 14,
                padding: 16,
                background:
                  'repeating-linear-gradient(135deg, #fafafa, #fafafa 12px, #f5f5f5 12px, #f5f5f5 24px)',
              }}
            >
              <ReactECharts option={enrollmentChartOption} style={{ height: 280 }} />
            </div>
          </Card>
        </Col>
  
        <Col span={12}>
          <Card
            title="近 7 天学习活跃度"
            style={{
              border: '3px solid #222',
              borderRadius: 16,
              boxShadow: 'none',
            }}
            styles={{
              header: {
                fontSize: 20,
                fontWeight: 800,
                borderBottom: 'none',
              },
              body: { padding: 18 },
            }}
          >
            <div
              style={{
                border: '3px dashed #bfbfbf',
                borderRadius: 14,
                padding: 16,
                background:
                  'repeating-linear-gradient(135deg, #fafafa, #fafafa 12px, #f5f5f5 12px, #f5f5f5 24px)',
              }}
            >
              <ReactECharts option={activityChartOption} style={{ height: 280 }} />
            </div>
          </Card>
        </Col>
      </Row>
  
      <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Card
            title="学生状态分布"
            style={{
              border: '3px solid #222',
              borderRadius: 16,
              boxShadow: 'none',
            }}
            styles={{
              header: {
                fontSize: 20,
                fontWeight: 800,
                borderBottom: 'none',
              },
              body: { padding: 18 },
            }}
          >
            <div
              style={{
                border: '3px dashed #bfbfbf',
                borderRadius: 14,
                padding: 16,
                background:
                  'repeating-linear-gradient(135deg, #fafafa, #fafafa 12px, #f5f5f5 12px, #f5f5f5 24px)',
              }}
            >
              <ReactECharts option={statusPieOption} style={{ height: 280 }} />
            </div>
          </Card>
        </Col>
  
        <Col span={12}>
          <Card
            title="课程分类分布"
            style={{
              border: '3px solid #222',
              borderRadius: 16,
              boxShadow: 'none',
            }}
            styles={{
              header: {
                fontSize: 20,
                fontWeight: 800,
                borderBottom: 'none',
              },
              body: { padding: 18 },
            }}
          >
            <div
              style={{
                border: '3px dashed #bfbfbf',
                borderRadius: 14,
                padding: 16,
                background:
                  'repeating-linear-gradient(135deg, #fafafa, #fafafa 12px, #f5f5f5 12px, #f5f5f5 24px)',
              }}
            >
              <ReactECharts option={categoryPieOption} style={{ height: 280 }} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default DashboardPage