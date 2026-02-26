import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Shield, ShieldCheck, Upload, Mail, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { api } from '../lib/api'

interface VerificationFlowProps {
  onClose: () => void
  currentLevel: number
  isPremium: boolean
  onLevelUp?: (newLevel: number) => void
}

const STEPS = [
  { id: 1, title: 'Covenant Pledge', subtitle: 'Sacred commitment', icon: Shield },
  { id: 2, title: 'ID Verified', subtitle: 'Government ID', icon: ShieldCheck },
  { id: 3, title: 'Community Vouched', subtitle: 'Character reference', icon: Mail },
  { id: 4, title: 'Background Clear', subtitle: 'Full background check', icon: Lock },
]

export default function VerificationFlow({ onClose, currentLevel, isPremium, onLevelUp }: VerificationFlowProps) {
  const [activeStep, setActiveStep] = useState(Math.max(1, currentLevel))
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [pledgeChecked, setPledgeChecked] = useState(false)
  const [referenceEmail, setReferenceEmail] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [submittedSteps, setSubmittedSteps] = useState<Set<number>>(new Set())

  const clearFeedback = () => { setSuccess(''); setError(''); }

  const handlePledge = async () => {
    if (!pledgeChecked) { setError('Please check the pledge box to continue.'); return; }
    setIsLoading(true); clearFeedback();
    try {
      await api.signPledge();
      setSuccess('Covenant pledge signed! Level 1 badge granted.');
      setSubmittedSteps(prev => new Set([...prev, 1]));
      onLevelUp?.(1);
    } catch (e: any) { setError(e.message || 'Failed to sign pledge'); }
    setIsLoading(false);
  }

  const handleIdUpload = async () => {
    if (!selectedFile) { setError('Please select a document to upload.'); return; }
    setIsLoading(true); clearFeedback();
    try {
      await api.uploadIdDocument(selectedFile);
      setSuccess('Document submitted! Under review within 1-2 business days.');
      setSubmittedSteps(prev => new Set([...prev, 2]));
    } catch (e: any) { setError(e.message || 'Upload failed'); }
    setIsLoading(false);
  }

  const handleReference = async () => {
    if (!referenceEmail || !referenceEmail.includes('@')) { setError('Please enter a valid email address.'); return; }
    setIsLoading(true); clearFeedback();
    try {
      await api.requestReference(referenceEmail);
      setSuccess(`Reference request sent to ${referenceEmail}. Awaiting their confirmation.`);
      setSubmittedSteps(prev => new Set([...prev, 3]));
    } catch (e: any) { setError(e.message || 'Failed to send reference request'); }
    setIsLoading(false);
  }

  const handleBackgroundCheck = async () => {
    setIsLoading(true); clearFeedback();
    try {
      await api.initiateBackgroundCheck();
      setSuccess('Background check initiated. Results in 3-5 business days.');
      setSubmittedSteps(prev => new Set([...prev, 4]));
    } catch (e: any) { setError(e.message || 'Failed to initiate background check'); }
    setIsLoading(false);
  }

  const purple = 'hsl(270 100% 25%)'
  const gold = 'hsl(42 55% 55%)'
  const dark = 'hsl(270 100% 10%)'
  const cream = 'hsl(36 30% 97%)'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{ background: cream, border: '1px solid hsl(270 100% 25% / 0.2)', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="p-6 rounded-t-2xl flex items-center justify-between" style={{ background: `linear-gradient(to right, ${dark}, ${purple})` }}>
          <div>
            <h2 className="text-white font-serif text-xl font-bold">Trust Verification</h2>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Build trust. Find your covenant match.</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Stepper */}
        <div className="px-6 py-4" style={{ borderBottom: '1px solid hsl(270 100% 25% / 0.1)' }}>
          <div className="flex items-center justify-between">
            {STEPS.map((step, i) => {
              const isDone = submittedSteps.has(step.id) || step.id <= currentLevel;
              const isActive = step.id === activeStep;
              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => { setActiveStep(step.id); clearFeedback(); }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                      style={{
                        background: isDone ? gold : isActive ? purple : 'white',
                        color: isDone || isActive ? 'white' : 'hsl(270 100% 25% / 0.4)',
                        border: !isDone && !isActive ? '1px solid hsl(270 100% 25% / 0.2)' : 'none',
                        boxShadow: isActive ? `0 0 0 3px hsl(270 100% 25% / 0.2)` : 'none'
                      }}
                    >
                      {isDone ? <CheckCircle className="w-4 h-4" /> : step.id}
                    </div>
                    <span className="text-xs hidden sm:block" style={{ color: isActive ? purple : 'hsl(270 30% 45%)', fontWeight: isActive ? 600 : 400 }}>
                      {step.title.split(' ')[0]}
                    </span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <div className="h-0.5 w-6 sm:w-8 mx-1 transition-all" style={{ background: isDone ? gold : 'hsl(270 100% 25% / 0.15)' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="p-6 space-y-4"
          >
            {/* Feedback */}
            {success && (
              <div className="flex items-center gap-2 text-sm rounded-lg p-3" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a' }}>
                <CheckCircle className="w-4 h-4 flex-shrink-0" />{success}
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 text-sm rounded-lg p-3" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
              </div>
            )}

            {/* STEP 1: Pledge */}
            {activeStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 flex-shrink-0" style={{ color: purple }} />
                  <div>
                    <h3 className="font-serif font-bold text-lg" style={{ color: dark }}>Covenant Pledge</h3>
                    <p className="text-sm" style={{ color: 'hsl(270 30% 45%)' }}>Your sacred commitment</p>
                  </div>
                </div>
                <div className="rounded-xl p-4 text-sm leading-relaxed" style={{ background: 'white', border: '1px solid hsl(270 100% 25% / 0.15)', color: 'hsl(270 100% 15%)' }}>
                  <p className="font-semibold mb-2" style={{ color: purple }}>I solemnly pledge that:</p>
                  <ul className="space-y-2">
                    <li className="flex gap-2"><span style={{ color: gold }}>✦</span> I am committed to saving intimacy for marriage.</li>
                    <li className="flex gap-2"><span style={{ color: gold }}>✦</span> I will treat every member with dignity and respect.</li>
                    <li className="flex gap-2"><span style={{ color: gold }}>✦</span> I am genuinely seeking a covenant relationship.</li>
                    <li className="flex gap-2"><span style={{ color: gold }}>✦</span> My profile information is truthful and accurate.</li>
                  </ul>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pledgeChecked}
                    onChange={e => setPledgeChecked(e.target.checked)}
                    className="mt-1 w-4 h-4"
                    style={{ accentColor: purple }}
                  />
                  <span className="text-sm" style={{ color: 'hsl(270 100% 15%)' }}>
                    I affirm this covenant pledge and understand it represents my commitment to this community.
                  </span>
                </label>
                {submittedSteps.has(1) || currentLevel >= 1 ? (
                  <div className="flex items-center gap-2 font-semibold" style={{ color: gold }}>
                    <CheckCircle className="w-5 h-5" /> Pledge Signed — Level 1 Active
                  </div>
                ) : (
                  <button
                    onClick={handlePledge}
                    disabled={isLoading || !pledgeChecked}
                    className="w-full rounded-xl py-3 font-semibold transition-all flex items-center justify-center gap-2"
                    style={{ background: purple, color: 'white', opacity: isLoading || !pledgeChecked ? 0.5 : 1, cursor: isLoading || !pledgeChecked ? 'not-allowed' : 'pointer' }}
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                    Sign Covenant Pledge
                  </button>
                )}
              </div>
            )}

            {/* STEP 2: ID Upload */}
            {activeStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 flex-shrink-0 text-blue-500" />
                  <div>
                    <h3 className="font-serif font-bold text-lg" style={{ color: dark }}>Identity Verification</h3>
                    <p className="text-sm" style={{ color: 'hsl(270 30% 45%)' }}>Upload a government-issued ID</p>
                  </div>
                </div>
                <p className="text-sm" style={{ color: 'hsl(270 30% 45%)' }}>
                  Accepted: Passport, Driver's License, National ID. Your document is reviewed by our team and never stored publicly.
                </p>
                <label
                  className="flex flex-col items-center justify-center w-full h-36 rounded-xl cursor-pointer transition-all"
                  style={{
                    border: `2px dashed ${selectedFile ? gold : 'hsl(270 100% 25% / 0.3)'}`,
                    background: selectedFile ? 'hsl(42 55% 55% / 0.05)' : 'white'
                  }}
                >
                  <input type="file" accept="image/*,.pdf" className="hidden" onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
                  <Upload className="w-8 h-8 mb-2" style={{ color: selectedFile ? gold : 'hsl(270 100% 25% / 0.4)' }} />
                  <p className="text-sm text-center px-4" style={{ color: 'hsl(270 30% 45%)' }}>
                    {selectedFile ? <span style={{ color: gold, fontWeight: 500 }}>{selectedFile.name}</span> : 'Click to upload ID document'}
                  </p>
                </label>
                {submittedSteps.has(2) ? (
                  <div className="flex items-center gap-2 font-semibold text-blue-500">
                    <CheckCircle className="w-5 h-5" /> Document Submitted — Under Review
                  </div>
                ) : (
                  <button
                    onClick={handleIdUpload}
                    disabled={isLoading || !selectedFile}
                    className="w-full rounded-xl py-3 font-semibold transition-all flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
                    style={{ opacity: isLoading || !selectedFile ? 0.5 : 1, cursor: isLoading || !selectedFile ? 'not-allowed' : 'pointer' }}
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    Submit for Review
                  </button>
                )}
              </div>
            )}

            {/* STEP 3: Reference */}
            {activeStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-8 h-8 flex-shrink-0 text-green-500" />
                  <div>
                    <h3 className="font-serif font-bold text-lg" style={{ color: dark }}>Character Reference</h3>
                    <p className="text-sm" style={{ color: 'hsl(270 30% 45%)' }}>Community vouched verification</p>
                  </div>
                </div>
                <p className="text-sm" style={{ color: 'hsl(270 30% 45%)' }}>
                  Ask a pastor, mentor, or family member to confirm your character. We'll email them a short confirmation form.
                </p>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'hsl(270 100% 15%)' }}>Reference's Email Address</label>
                  <input
                    type="email"
                    value={referenceEmail}
                    onChange={e => setReferenceEmail(e.target.value)}
                    placeholder="pastor@church.org"
                    className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
                    style={{ border: '1px solid hsl(270 100% 25% / 0.2)', background: 'white', color: 'hsl(270 100% 15%)' }}
                  />
                </div>
                {submittedSteps.has(3) ? (
                  <div className="flex items-center gap-2 font-semibold text-green-500">
                    <CheckCircle className="w-5 h-5" /> Reference Request Sent — Awaiting Response
                  </div>
                ) : (
                  <button
                    onClick={handleReference}
                    disabled={isLoading || !referenceEmail}
                    className="w-full rounded-xl py-3 font-semibold transition-all flex items-center justify-center gap-2 bg-green-600 text-white hover:bg-green-700"
                    style={{ opacity: isLoading || !referenceEmail ? 0.5 : 1, cursor: isLoading || !referenceEmail ? 'not-allowed' : 'pointer' }}
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                    Send Reference Request
                  </button>
                )}
              </div>
            )}

            {/* STEP 4: Background Check */}
            {activeStep === 4 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Lock className="w-8 h-8 flex-shrink-0" style={{ color: gold }} />
                  <div>
                    <h3 className="font-serif font-bold text-lg" style={{ color: dark }}>Background Check</h3>
                    <p className="text-sm" style={{ color: 'hsl(270 30% 45%)' }}>Platinum Trust Badge</p>
                  </div>
                </div>
                {!isPremium ? (
                  <div className="rounded-xl p-5 text-center" style={{ background: `linear-gradient(135deg, ${dark}, ${purple})` }}>
                    <Lock className="w-10 h-10 mx-auto mb-3" style={{ color: gold }} />
                    <p className="text-white font-serif font-bold mb-2">Ultimate Membership Required</p>
                    <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>The Background Check badge is exclusive to Ultimate members.</p>
                    <button className="px-6 py-2 rounded-lg font-semibold text-sm transition-all" style={{ background: gold, color: dark }}>
                      Upgrade to Ultimate
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm" style={{ color: 'hsl(270 30% 45%)' }}>
                      A comprehensive background check including criminal record and sex offender registry verification. Results in 3-5 business days.
                    </p>
                    <div className="rounded-xl p-4 text-sm" style={{ background: 'hsl(42 55% 55% / 0.1)', border: '1px solid hsl(42 55% 55% / 0.3)', color: 'hsl(270 100% 15%)' }}>
                      <p className="font-semibold mb-1" style={{ color: gold }}>What's checked:</p>
                      <ul className="space-y-1">
                        <li>✦ Criminal record check</li>
                        <li>✦ Sex offender registry</li>
                        <li>✦ Identity validation</li>
                      </ul>
                    </div>
                    {submittedSteps.has(4) ? (
                      <div className="flex items-center gap-2 font-semibold" style={{ color: gold }}>
                        <CheckCircle className="w-5 h-5" /> Background Check Initiated
                      </div>
                    ) : (
                      <button
                        onClick={handleBackgroundCheck}
                        disabled={isLoading}
                        className="w-full rounded-xl py-3 font-semibold transition-all flex items-center justify-center gap-2"
                        style={{ background: `linear-gradient(to right, ${dark}, ${purple})`, color: 'white', opacity: isLoading ? 0.5 : 1 }}
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                        Initiate Background Check
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
