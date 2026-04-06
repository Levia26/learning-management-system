import { Card, message, Button } from 'antd'
import { useEffect, useState} from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { getSummary } from '../../api/summary'

function SummaryPage() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchSummary = async () => {
    try {
      setLoading(true)
      const res = await getSummary()
      console.log('学习总结返回数据:', res.data)
      setContent(res.data.data.content || '')
    } catch (error) {
      console.error('获取学习总结失败:', error)
      message.error('获取学习总结失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSummary()
  }, [])

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      message.success('代码已复制')
    } catch (error) {
      console.error('复制失败:', error)
      message.error('复制失败')
    }
  }
  // const headings = useMemo(() => {
  //   const lines = content.split('\n')
  //   const result: { level: number; text: string; id: string }[] = []
  
  //   lines.forEach((line) => {
  //     const match = /^(#{2,3})\s+(.*)/.exec(line.trim())
  //     if (match) {
  //       const level = match[1].length
  //       const text = match[2].trim()
  //       const id = text
  //         .toLowerCase()
  //         .replace(/\s+/g, '-')
  //         .replace(/[^\w\u4e00-\u9fa5-]/g, '')
  
  //       result.push({ level, text, id })
  //     }
  //   })
  
  //   return result
  // }, [content])

  
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>学习总结</h2>
      </div>

      <Card
        loading={loading}
        style={{
          border: '2px solid #222',
          borderRadius: 12,
        }}
        styles={{ body: { padding: 24 } }}
      >
        <div className="summary-markdown">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children }) => {
                const text = String(children)
                const id = text
                  .toLowerCase()
                  .replace(/\s+/g, '-')
                  .replace(/[^\w\u4e00-\u9fa5-]/g, '')
              
                return <h2 id={id}>{children}</h2>
              },
              h3: ({ children }) => {
                const text = String(children)
                const id = text
                  .toLowerCase()
                  .replace(/\s+/g, '-')
                  .replace(/[^\w\u4e00-\u9fa5-]/g, '')
              
                return <h3 id={id}>{children}</h3>
              },
              img: ({ src = '', alt = '' }) => {
                const imageSrc = src.startsWith('http')
                  ? src
                  : `/api/static/${src}`
                return <img src={imageSrc} alt={alt} />
              },
              code(props) {
                const { children, className, ...rest } = props
                const match = /language-(\w+)/.exec(className || '')
                const codeText = String(children).replace(/\n$/, '')

                if (!match) {
                  return (
                    <code className={className} {...rest}>
                      {children}
                    </code>
                  )
                }

        return (
               <div style={{ position: 'relative', margin: '16px 0' }}>
                  <Button
                    size="small"
                      onClick={() => handleCopy(codeText)}
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        zIndex: 1,
                        borderRadius: 8,
                      }}
                    >
                      复制
                    </Button>

                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{
                        margin: 0,
                        borderRadius: 12,
                        paddingTop: 48,
                      }}
                    >
                      {codeText}
                    </SyntaxHighlighter>
                  </div>
                )
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </Card>
    </div>
  )
}

export default SummaryPage