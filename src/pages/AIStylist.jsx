import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  SUGGESTED_PROMPTS, 
  CATEGORIZED_PROMPTS, 
  QUICK_ACTIONS, 
  FASHION_STYLE_CATEGORIES, 
  OUTFIT_TYPE_CATEGORIES, 
  getAIStylistResponse 
} from '../data/aiStylistPrompts';
import { 
  Sparkles, 
  Send, 
  Heart, 
  Sliders, 
  User as UserIcon, 
  HelpCircle,
  Lightbulb,
  Compass,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const PROMPT_CATEGORY_TABS = [
  { id: 'ALL', label: 'All Prompts' },
  { id: 'OCCASIONS', label: 'Occasions' },
  { id: 'STYLE', label: 'Style & Aesthetics' },
  { id: 'OUTFIT_TYPE', label: 'Outfit Types' },
  { id: 'COLOR', label: 'Color Theory' },
  { id: 'WEATHER', label: 'Weather' },
  { id: 'TRANSFORM_MY_LOOK', label: 'Transform Look' }
];

export default function AIStylist() {
  const { setActiveWhyLook, setActiveCustomizeOutfit, saveOutfit, isOutfitSaved } = useApp();
  const [messages, setMessages] = useState([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: "Hello, gorgeous. What are we styling today? I can help you curate complete coordinated looks, explore color palettes, decode dress codes, or transform your favorite silhouettes.",
      time: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activePromptCategory, setActivePromptCategory] = useState('ALL');
  const [showAestheticsExplorer, setShowAestheticsExplorer] = useState(false);
  const [explorerTab, setExplorerTab] = useState('styles'); // 'styles' | 'outfits'
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend = null) => {
    const messageText = textToSend || inputValue.trim();
    if (!messageText) return;

    // Add user message
    const userMsgObj = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsgObj]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI Stylist thinking and responding
    setTimeout(() => {
      const responseData = getAIStylistResponse(messageText);
      const aiMsgObj = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: responseData.text,
        recommendedLook: responseData.recommendedLook,
        stylingTips: responseData.stylingTips,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsgObj]);
      setIsTyping(false);
    }, 850);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get active prompts based on category tab
  const getDisplayedPrompts = () => {
    if (activePromptCategory === 'ALL') {
      return SUGGESTED_PROMPTS;
    }
    return CATEGORIZED_PROMPTS[activePromptCategory] || [];
  };

  return (
    <div className="ai-stylist-page animate-fade-in" id="ai-stylist-page">
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div className="editorial-tag editorial-tag-gold" style={{ marginBottom: '0.35rem' }}>
          <Sparkles size={15} />
          <span>Conversational Fashion Intelligence</span>
        </div>
        <h1 className="font-serif" style={{ fontSize: '2.4rem', marginBottom: '0.35rem' }}>
          ✨ Chic Genie — AI Stylist
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.96rem' }}>
          Personalized styling advice, color harmony theory, and tailored outfit transformations.
        </p>
      </div>

      {/* Main Chat Interface Box */}
      <div className="stylist-chat-wrapper">
        {/* Chat Header Status Bar */}
        <div className="stylist-chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="chat-avatar-badge" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))' }}>
              <Sparkles size={18} color="#C7A56A" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.98rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                Chic Genie Stylist AI
              </h4>
              <span style={{ fontSize: '0.75rem', color: '#2E7D32', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4CAF50', display: 'inline-block' }}></span>
                Online & Ready to Style
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              className="btn-ghost"
              style={{
                fontSize: '0.78rem',
                padding: '0.35rem 0.8rem',
                border: '1px solid var(--color-border)',
                backgroundColor: showAestheticsExplorer ? 'var(--color-dusty-rose-light)' : '#FFFFFF'
              }}
              onClick={() => setShowAestheticsExplorer(!showAestheticsExplorer)}
              title="Explore all fashion styles and outfit types"
            >
              <Compass size={14} color="var(--color-primary)" />
              <span>Explore Categories</span>
              {showAestheticsExplorer ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
            <div className="editorial-tag" style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
              RAG Engine Ready
            </div>
          </div>
        </div>

        {/* Collapsible Fashion Categories & Outfits Explorer Drawer */}
        {showAestheticsExplorer && (
          <div 
            className="animate-fade-in"
            style={{
              backgroundColor: '#FAF5F8',
              borderBottom: '1px solid var(--color-border)',
              padding: '1.25rem 1.5rem',
              maxHeight: '260px',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <button
                className={`btn-ghost ${explorerTab === 'styles' ? 'active' : ''}`}
                style={{
                  fontSize: '0.8rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: explorerTab === 'styles' ? 'var(--color-primary)' : '#FFFFFF',
                  color: explorerTab === 'styles' ? '#FFFFFF' : 'var(--color-text-main)',
                  fontWeight: 600,
                  border: '1px solid var(--color-border)'
                }}
                onClick={() => setExplorerTab('styles')}
              >
                <Sparkles size={13} />
                <span>Fashion Styles (35+)</span>
              </button>
              <button
                className={`btn-ghost ${explorerTab === 'outfits' ? 'active' : ''}`}
                style={{
                  fontSize: '0.8rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: explorerTab === 'outfits' ? 'var(--color-primary)' : '#FFFFFF',
                  color: explorerTab === 'outfits' ? '#FFFFFF' : 'var(--color-text-main)',
                  fontWeight: 600,
                  border: '1px solid var(--color-border)'
                }}
                onClick={() => setExplorerTab('outfits')}
              >
                <Layers size={13} />
                <span>Outfit Types (30+)</span>
              </button>
            </div>

            {explorerTab === 'styles' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {FASHION_STYLE_CATEGORIES.map((cat, idx) => (
                  <div key={idx}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                      {cat.icon} {cat.category}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {cat.styles.map((style) => (
                        <button
                          key={style.id}
                          className="chat-prompt-pill"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
                          onClick={() => {
                            handleSendMessage(`Give me a ${style.label.toLowerCase()} outfit.`);
                            setShowAestheticsExplorer(false);
                          }}
                          title={style.desc}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {OUTFIT_TYPE_CATEGORIES.map((cat, idx) => (
                  <div key={idx}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-primary)', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>
                      {cat.icon} {cat.category}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {cat.items.map((item, itemIdx) => (
                        <button
                          key={itemIdx}
                          className="chat-prompt-pill"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
                          onClick={() => {
                            handleSendMessage(`Help me style a ${item.toLowerCase()}.`);
                            setShowAestheticsExplorer(false);
                          }}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Actions Area */}
        <div 
          style={{
            padding: '0.65rem 1.25rem',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            alignItems: 'center'
          }}
          aria-label="Quick Stylist Actions"
        >
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Quick Actions:
          </span>
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.id}
              className="chat-prompt-pill"
              style={{
                fontSize: '0.78rem',
                padding: '0.35rem 0.8rem',
                backgroundColor: '#FAF5F8',
                borderColor: 'rgba(50, 16, 68, 0.12)',
                color: 'var(--color-primary)',
                fontWeight: 500
              }}
              onClick={() => handleSendMessage(action.prompt)}
            >
              {action.label}
            </button>
          ))}
        </div>

        {/* Chat Messages Log */}
        <div className="stylist-chat-messages" role="log" aria-live="polite">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} className={`chat-bubble-row ${isUser ? 'user' : ''}`}>
                <div className="chat-avatar-badge" style={{ backgroundColor: isUser ? '#5C246B' : 'var(--color-primary)' }}>
                  {isUser ? <UserIcon size={16} /> : <Sparkles size={16} color="#C7A56A" />}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                  <div className={`chat-bubble ${msg.sender}`}>
                    <p>{msg.text}</p>

                    {/* Optional Recommended Look Card Embedded in AI Message */}
                    {msg.recommendedLook && (
                      <div style={{
                        marginTop: '1rem',
                        backgroundColor: '#FAF5F8',
                        borderRadius: 'var(--radius-lg)',
                        padding: '1.2rem',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-main)'
                      }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <img 
                            src={msg.recommendedLook.avatarUrl} 
                            alt={msg.recommendedLook.name}
                            style={{
                              width: '68px',
                              height: '92px',
                              objectFit: 'cover',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--color-border)'
                            }}
                          />
                          <div>
                            <span style={{ fontSize: '0.72rem', color: 'var(--color-champagne-gold)', fontWeight: 600 }}>
                              {msg.recommendedLook.preferenceMatch}% PREFERENCE MATCH
                            </span>
                            <h4 style={{ fontSize: '1.05rem', color: 'var(--color-primary)', margin: '0.15rem 0 0.35rem' }}>
                              {msg.recommendedLook.name}
                            </h4>
                            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                              {msg.recommendedLook.footwear} · {msg.recommendedLook.bag}
                            </span>
                          </div>
                        </div>

                        {/* Quick Action Buttons inside Chat */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                          <button 
                            className="btn-secondary"
                            style={{ fontSize: '0.78rem', padding: '0.45rem 0.8rem' }}
                            onClick={() => setActiveWhyLook(msg.recommendedLook)}
                          >
                            <HelpCircle size={13} />
                            <span>Why this look?</span>
                          </button>
                          
                          <button 
                            className="btn-secondary"
                            style={{ fontSize: '0.78rem', padding: '0.45rem 0.8rem' }}
                            onClick={() => setActiveCustomizeOutfit(msg.recommendedLook)}
                          >
                            <Sliders size={13} />
                            <span>Customize</span>
                          </button>

                          <button 
                            className="btn-primary"
                            style={{ fontSize: '0.78rem', padding: '0.45rem 0.8rem' }}
                            onClick={() => saveOutfit(msg.recommendedLook)}
                          >
                            <Heart size={13} fill={isOutfitSaved(msg.recommendedLook.id) ? '#FFFFFF' : 'none'} />
                            <span>{isOutfitSaved(msg.recommendedLook.id) ? 'Saved' : 'Save'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Styling Tips List */}
                    {msg.stylingTips && (
                      <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(50, 16, 68, 0.08)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
                          <Lightbulb size={14} color="var(--color-champagne-gold)" />
                          <span>Stylist's Editorial Notes:</span>
                        </div>
                        <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
                          {msg.stylingTips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-light)', alignSelf: isUser ? 'flex-end' : 'flex-start', paddingLeft: '0.5rem' }}>
                    {msg.time}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="chat-bubble-row">
              <div className="chat-avatar-badge">
                <Sparkles size={16} color="#C7A56A" />
              </div>
              <div className="chat-bubble assistant" style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>
                Chic Genie is curating personalized styling notes...
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggested Prompts Header & Category Tabs */}
        <div style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid var(--color-border)', padding: '0.5rem 1.5rem 0' }}>
          <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.4rem' }}>
            {PROMPT_CATEGORY_TABS.map((tab) => {
              const isActive = activePromptCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  className="btn-ghost"
                  style={{
                    fontSize: '0.74rem',
                    padding: '0.28rem 0.65rem',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                    color: isActive ? '#FFFFFF' : 'var(--color-text-muted)',
                    fontWeight: isActive ? 600 : 500,
                    whiteSpace: 'nowrap'
                  }}
                  onClick={() => setActivePromptCategory(tab.id)}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Suggested Prompts Carousel Tray */}
        <div className="chat-prompt-chips-tray" aria-label="Suggested questions" style={{ paddingTop: '0.35rem', borderTop: 'none' }}>
          {getDisplayedPrompts().map((prompt, idx) => (
            <button
              key={idx}
              className="chat-prompt-pill"
              onClick={() => handleSendMessage(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input Field & Send Button */}
        <div className="chat-input-row">
          <input
            type="text"
            id="stylist-chat-input"
            className="chat-input-field"
            placeholder="Ask Chic Genie about styling, color combinations, or what to wear..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Ask Chic Genie Stylist"
          />
          <button
            id="stylist-chat-send-btn"
            className="chat-send-btn"
            onClick={() => handleSendMessage()}
            aria-label="Send message to AI Stylist"
          >
            <Send size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
