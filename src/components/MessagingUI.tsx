import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Shield, ShieldCheck, Loader2, MoreVertical, Flag, Ban, HeartOff, AlertTriangle } from 'lucide-react'
import { api } from '../lib/api'
import { getSocket } from '../lib/socket'
import { toast } from 'react-hot-toast'

interface Partner {
  _id: string
  name: string
  profileImage?: string
  trustLevel?: number
  isOnline?: boolean
}

interface Message {
  _id: string
  conversationId: string
  senderId: string | { _id: string; name: string; profileImage?: string }
  content: string
  type: string
  readAt?: string
  createdAt: string
}

interface MessagingUIProps {
  conversationId: string
  partner: Partner
  currentUserId: string
  matchId?: string
  onClose: () => void
}

function TrustBadge({ level }: { level?: number }) {
  if (!level) return null
  const colors = ['', 'text-gray-400', 'text-blue-500', 'text-green-500', 'text-yellow-500']
  const labels = ['', 'Pledge', 'ID Verified', 'Vouched', 'Background Clear']
  return (
    <span className={`flex items-center gap-1 text-xs ${colors[level] || 'text-gray-400'}`}>
      <ShieldCheck className="w-3 h-3" />
      {labels[level] || ''}
    </span>
  )
}

export default function MessagingUI({ conversationId, partner, currentUserId, matchId, onClose }: MessagingUIProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isPartnerTyping, setIsPartnerTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Safety menu state
  const [showMenu, setShowMenu]               = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportType, setReportType]           = useState('')
  const [reportDesc, setReportDesc]           = useState('')

  const handleBlock = async () => {
    setShowMenu(false)
    try {
      await (api as any).blockUser(partner._id)
      toast.success(`${partner.name} has been blocked.`)
      onClose()
    } catch (err: any) {
      toast.error(err.message || 'Failed to block user')
    }
  }

  const handleUnmatch = async () => {
    setShowMenu(false)
    if (!matchId) { onClose(); return }
    try {
      await api.unmatch(matchId)
      toast('Match removed.')
      onClose()
    } catch (err: any) {
      toast.error(err.message || 'Failed to unmatch')
    }
  }

  const handleReport = async () => {
    if (!reportType) return
    try {
      await (api as any).submitReport({ reportedId: partner._id, type: reportType, description: reportDesc, conversationId })
      toast.success('Report submitted. Our team will review within 24 hours.')
      setShowReportModal(false)
      setReportType('')
      setReportDesc('')
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit report')
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const msgs = await api.getMessages(conversationId)
        setMessages(msgs)
        setIsLoading(false)
        setTimeout(scrollToBottom, 100)
      } catch {
        setIsLoading(false)
      }
    }
    loadMessages()

    const socket = getSocket()
    if (socket) {
      socket.emit('join_room', conversationId)

      socket.on('receive_message', (msg: Message) => {
        setMessages(prev => [...prev, msg])
        setTimeout(scrollToBottom, 50)
        socket.emit('message_read', { messageId: msg._id, conversationId })
      })

      socket.on('typing_start', ({ userId }: { userId: string }) => {
        if (userId !== currentUserId) setIsPartnerTyping(true)
      })

      socket.on('typing_stop', ({ userId }: { userId: string }) => {
        if (userId !== currentUserId) setIsPartnerTyping(false)
      })
    }

    return () => {
      const s = getSocket()
      if (s) {
        s.off('receive_message')
        s.off('typing_start')
        s.off('typing_stop')
        s.emit('leave_room', conversationId)
      }
    }
  }, [conversationId, currentUserId])

  const handleInputChange = useCallback((val: string) => {
    setInputText(val)
    const socket = getSocket()
    if (!socket) return
    socket.emit('typing_start', conversationId)
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing_stop', conversationId)
    }, 2000)
  }, [conversationId])

  const handleSend = async () => {
    if (!inputText.trim() || isSending) return
    const content = inputText.trim()
    setInputText('')
    setIsSending(true)

    const tempMsg: Message = {
      _id: `temp_${Date.now()}`,
      conversationId,
      senderId: currentUserId,
      content,
      type: 'text',
      createdAt: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempMsg])
    setTimeout(scrollToBottom, 50)

    try {
      const socket = getSocket()
      if (socket?.connected) {
        socket.emit('send_message', { conversationId, content, type: 'text' })
      } else {
        await api.sendMessage(conversationId, content)
      }
    } catch {
      setMessages(prev => prev.filter(m => m._id !== tempMsg._id))
      setInputText(content)
    } finally {
      setIsSending(false)
    }
  }

  const getSenderId = (msg: Message): string => {
    if (typeof msg.senderId === 'string') return msg.senderId
    return msg.senderId._id
  }

  const isOwn = (msg: Message) => getSenderId(msg) === currentUserId

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'hsl(36 30% 97%)' }}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3 shadow-lg" style={{ background: 'linear-gradient(to right, hsl(270 100% 10%), hsl(270 100% 25%))' }}>
        <div className="relative flex-shrink-0">
          {partner.profileImage ? (
            <img src={partner.profileImage} alt={partner.name} className="w-10 h-10 rounded-full object-cover border-2" style={{ borderColor: 'hsl(42 55% 55% / 0.5)' }} />
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'hsl(42 55% 55% / 0.2)' }}>
              <span className="font-serif font-bold" style={{ color: 'hsl(42 55% 55%)' }}>{partner.name[0]}</span>
            </div>
          )}
          {partner.isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2" style={{ borderColor: 'hsl(270 100% 10%)' }} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold font-serif truncate">{partner.name}</p>
          <TrustBadge level={partner.trustLevel} />
        </div>
        {/* 3-dot safety menu */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowMenu(m => !m)}
            className="text-white/70 hover:text-white transition-colors p-1 mr-1"
            aria-label="More options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-20 overflow-hidden">
              <button
                onClick={() => { setShowMenu(false); setShowReportModal(true) }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <Flag size={15} className="text-red-400" /> Report {partner.name}
              </button>
              <button
                onClick={handleBlock}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Ban size={15} className="text-gray-400" /> Block {partner.name}
              </button>
              <button
                onClick={handleUnmatch}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-50"
              >
                <HeartOff size={15} className="text-gray-400" /> Unmatch
              </button>
            </div>
          )}
        </div>
        <button onClick={onClose} className="text-white/70 hover:text-white transition-colors flex-shrink-0">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'hsl(270 100% 25%)' }} />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <Shield className="w-12 h-12 mb-3" style={{ color: 'hsl(42 55% 55%)' }} />
            <p className="font-serif font-semibold" style={{ color: 'hsl(270 100% 25%)' }}>Begin your conversation</p>
            <p className="text-sm mt-1" style={{ color: 'hsl(270 30% 45%)' }}>Say hello to {partner.name}!</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isOwn(msg) ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm"
                  style={isOwn(msg) ? {
                    background: 'hsl(270 100% 25%)',
                    color: 'white',
                    borderBottomRightRadius: '4px'
                  } : {
                    background: 'white',
                    color: 'hsl(270 100% 15%)',
                    border: '1px solid hsl(270 100% 25% / 0.1)',
                    borderBottomLeftRadius: '4px'
                  }}
                >
                  {msg.content}
                  <div className="text-xs mt-1" style={{ color: isOwn(msg) ? 'rgba(255,255,255,0.6)' : 'hsl(270 30% 45%)' }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {isOwn(msg) && msg.readAt && <span className="ml-1" style={{ color: 'hsl(42 55% 55%)' }}>✓✓</span>}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {isPartnerTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 shadow-sm" style={{ background: 'white', border: '1px solid hsl(270 100% 25% / 0.1)' }}>
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: 'hsl(270 100% 25% / 0.4)', animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Click-away to close menu */}
      {showMenu && <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="text-red-500" size={20} />
              <h3 className="font-black text-gray-900">Report {partner.name}</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Reason *</label>
                <select
                  value={reportType}
                  onChange={e => setReportType(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-300 outline-none"
                >
                  <option value="">Select a reason...</option>
                  <option value="harassment">Harassment</option>
                  <option value="fake_profile">Fake Profile</option>
                  <option value="inappropriate_content">Inappropriate Content</option>
                  <option value="underage">Appears Underage</option>
                  <option value="spam">Spam</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Additional details (optional)</label>
                <textarea
                  value={reportDesc}
                  onChange={e => setReportDesc(e.target.value)}
                  rows={3}
                  placeholder="Describe what happened..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-red-300 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => { setShowReportModal(false); setReportType(''); setReportDesc(''); }}
                className="flex-1 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                disabled={!reportType}
                className="flex-1 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 disabled:opacity-50"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 flex items-end gap-3" style={{ borderTop: '1px solid hsl(270 100% 25% / 0.1)', background: 'white' }}>
        <textarea
          value={inputText}
          onChange={e => handleInputChange(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder={`Message ${partner.name}...`}
          rows={1}
          className="flex-1 resize-none rounded-xl px-4 py-2.5 text-sm focus:outline-none"
          style={{
            background: 'hsl(36 30% 97%)',
            border: '1px solid hsl(270 100% 25% / 0.2)',
            color: 'hsl(270 100% 15%)',
            minHeight: '42px',
            maxHeight: '128px'
          }}
        />
        <button
          onClick={handleSend}
          disabled={!inputText.trim() || isSending}
          className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center transition-all shadow-md"
          style={{
            background: 'hsl(42 55% 55%)',
            opacity: !inputText.trim() || isSending ? 0.5 : 1,
            cursor: !inputText.trim() || isSending ? 'not-allowed' : 'pointer'
          }}
        >
          {isSending ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
        </button>
      </div>
    </motion.div>
  )
}
